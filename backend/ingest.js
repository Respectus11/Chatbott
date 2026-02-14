// backend/ingest.js
console.log("Starting ingestion...");

require("dotenv").config({ path: __dirname + '/.env' });
const fs = require("fs");
const { Pinecone } = require("@pinecone-database/pinecone");
const { pipeline } = require("@xenova/transformers");

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// Check if index exists, create if needed
async function getOrCreateIndex() {
  try {
    const indexesResponse = await pinecone.listIndexes();
    console.log("Existing indexes:", indexesResponse);
    
    // Extract index names from the response
    const indexNames = indexesResponse.indexes.map(index => index.name);
    
    // Find the existing index to get its dimension
    const existingIndex = indexesResponse.indexes.find(index => index.name === process.env.PINECONE_INDEX_NAME);
    
    const newIndexName = process.env.PINECONE_INDEX_NAME + "_v2";
    
    if (!existingIndex) {
      console.log(`Creating index: ${newIndexName}`);
      await pinecone.createIndex({
        name: newIndexName,
        dimension: 384, // dimension for all-MiniLM-L6-v2
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log("✅ Index created successfully");
    } else {
      console.log(`Found existing index: ${process.env.PINECONE_INDEX_NAME} (dimension: ${existingIndex.dimension})`);
      console.log(`Deleting existing index and creating new one: ${newIndexName}`);
      await pinecone.deleteIndex(process.env.PINECONE_INDEX_NAME);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for deletion
      await pinecone.createIndex({
        name: newIndexName,
        dimension: 384,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log("✅ New index created with correct dimension");
    }
    
    return pinecone.index(newIndexName);
  } catch (err) {
    console.error("❌ Error with index:", err);
    throw err;
  }
}

// Main ingestion function
async function main() {
  try {
    // Get or create index
    const index = await getOrCreateIndex();
    
    // Load embedding model
    console.log("✅ Embedding model loaded");
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    // Load dataset
    const data = JSON.parse(fs.readFileSync(__dirname + "/tikur_anbessa_chunk.json", "utf8"));

    // Convert the structured data to text chunks for embedding
    const textChunks = [];
    
    console.log("Data loaded, processing...");
    console.log("Hospital info exists:", !!data.hospital_info);
    console.log("Departments exist:", !!data.departments_and_services);
    console.log("Doctors exist:", !!data.doctors_and_staff);
    
    // Extract hospital info
    if (data.hospital_info) {
      const text = `Hospital: ${data.hospital_info.name}\nLocation: ${data.hospital_info.location}\nType: ${data.hospital_info.type}\nCapacity: ${data.hospital_info.capacity}\nContact: ${data.hospital_info.contact_numbers.join(', ')}\nAddress: ${data.hospital_info.address}`;
      console.log("Hospital text:", text.substring(0, 100));
      textChunks.push({
        id: "hospital_info",
        text: text
      });
    }

    // Extract departments
    if (data.departments_and_services) {
      data.departments_and_services.forEach((dept, index) => {
        textChunks.push({
          id: `dept-${index}`,
          text: `Department: ${dept.department}\nServices: ${dept.services ? dept.services.join(', ') : 'N/A'}\nSpecialties: ${dept.specialties ? dept.specialties.join(', ') : 'N/A'}\nLocation: ${dept.location || 'N/A'}\nContact: ${dept.contact_number || dept.contact_extension || 'N/A'}`
        });
      });
    }

    // Extract doctors
    if (data.doctors_and_staff) {
      data.doctors_and_staff.forEach((doctor, index) => {
        textChunks.push({
          id: `doctor-${index}`,
          text: `Doctor: ${doctor.name}\nDepartment: ${doctor.department}\nExpertise: ${doctor.expertise}\nConsultation: ${doctor.consultation_days.join(', ')}`
        });
      });
    }

    // Extract other information
    if (data.working_hours) {
      textChunks.push({
        id: "working_hours",
        text: `Working Hours: ${JSON.stringify(data.working_hours)}`
      });
    }

    if (data.appointments) {
      textChunks.push({
        id: "appointments",
        text: `Appointments: ${JSON.stringify(data.appointments)}`
      });
    }

    if (data.pre_visit_instructions) {
      textChunks.push({
        id: "pre_visit_instructions",
        text: `Pre-visit Instructions: ${JSON.stringify(data.pre_visit_instructions)}`
      });
    }

    if (data.pharmacy_information) {
      textChunks.push({
        id: "pharmacy",
        text: `Pharmacy: ${JSON.stringify(data.pharmacy_information)}`
      });
    }

    if (data.emergency_and_support) {
      textChunks.push({
        id: "emergency",
        text: `Emergency: ${JSON.stringify(data.emergency_and_support)}`
      });
    }

    console.log("Total text chunks found:", textChunks.length);
    textChunks.forEach((chunk, index) => {
      console.log(`Chunk ${index}: ${chunk.id} - Text length: ${chunk.text.length}`);
    });

    // Process each text chunk
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const text = chunk.text;
      
      if (!text) {
        console.log(`Skipping chunk ${i} - no text`);
        continue;
      }

      // Get embedding
      const output = await embedder(text);
      const embeddings = output.tolist()[0]; // token embeddings

      // Average pooling → single vector
      const meanVector = new Array(embeddings[0].length).fill(0);
      embeddings.forEach(tokenVec => {
        tokenVec.forEach((val, j) => {
          meanVector[j] += val;
        });
      });
      const vector = meanVector.map(val => val / embeddings.length);

      console.log(`Chunk ${i}: ${chunk.id} - Vector length: ${vector.length}, First 5 values: [${vector.slice(0, 5).join(', ')}]`);

      // Upsert into Pinecone
      await index.upsert({
        upsertRequest: {
          vectors: [
            {
              id: chunk.id,
              values: vector,
              metadata: { text }
            }
          ]
        }
      });

      console.log(`✅ Ingested: ${chunk.id} (${i + 1}/${textChunks.length})`);
    }

    console.log("🎉 All chunks ingested into Pinecone!");
  } catch (err) {
    console.error("❌ Error during ingestion:", err);
  }
}

// Run the main function
main();
