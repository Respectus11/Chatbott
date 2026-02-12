console.log("Script started");
require("dotenv").config();
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const data = require("./tikur_anbessa_chunk.json");
const { Pinecone } = require("@pinecone-database/pinecone");
// i will fix the api key 
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
async function testConnection() {
    try {
      const stats = await index.describeIndexStats();
      console.log("Connected to Pinecone. Index stats:", stats);
    } catch (error) {
      console.error("Error connecting to Pinecone:", error);
    }
  }
  
  testConnection();
  

async function generateEmbeddings() {
  // 1. Hospital Info
  const hospitalInfoText = `
    Name: ${data.hospital_info.name}
    Location: ${data.hospital_info.location}
    Affiliation: ${data.hospital_info.affiliation}
    Type: ${data.hospital_info.type}
    Capacity: ${data.hospital_info.capacity}
    Languages: ${data.hospital_info.languages.join(", ")}
    Contact: ${data.hospital_info.contact_numbers.join(", ")}
    Address: ${data.hospital_info.address}
  `;
  const hospitalEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: hospitalInfoText,
  });
  console.log("Hospital Info embedding length:", hospitalEmbedding.data[0].embedding.length);

  // 2. Departments
  for (const dept of data.departments_and_services) {
    const deptText = `
      Department: ${dept.department}
      Specialties/Services: ${(dept.specialties || dept.services).join(", ")}
      Location: ${dept.location || ""}
      Contact: ${dept.contact_extension || dept.contact_number || ""}
    `;
    const deptEmbedding = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: deptText,
    });
    console.log("Department:", dept.department, "Embedding length:", deptEmbedding.data[0].embedding.length);
  }

  // 3. Doctors
  for (const doc of data.doctors_and_staff) {
    const docText = `
      Name: ${doc.name}
      Department: ${doc.department}
      Expertise: ${doc.expertise}
      Consultation days: ${doc.consultation_days.join(", ")}
    `;
    const docEmbedding = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: docText,
    });
    console.log("Doctor:", doc.name, "Embedding length:", docEmbedding.data[0].embedding.length);
  }

  // 4. Working Hours
  const workingHoursText = `
    Outpatient Departments: ${data.working_hours.outpatient_departments}
    Emergency Department: ${data.working_hours.emergency_department}
  `;
  const workingHoursEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: workingHoursText,
  });
  console.log("Working Hours embedding length:", workingHoursEmbedding.data[0].embedding.length);

  // 5. Appointments
  const appointmentsText = `
    Booking Process: ${data.appointments.booking_process}
    Required Documents: ${data.appointments.required_documents.join(", ")}
    Cancellation Policy: ${data.appointments.cancellation_policy}
  `;
  const appointmentsEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: appointmentsText,
  });
  console.log("Appointments embedding length:", appointmentsEmbedding.data[0].embedding.length);

  // 6. Pre-Visit Instructions
  const preVisitText = Object.entries(data.pre_visit_instructions)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  const preVisitEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: preVisitText,
  });
  console.log("Pre-Visit embedding length:", preVisitEmbedding.data[0].embedding.length);

  // 7. Pharmacy Information
  const pharmacyText = `
    Location: ${data.pharmacy_information.location}
    Operating Hours: ${data.pharmacy_information.operating_hours}
    Emergency Pharmacy: ${data.pharmacy_information.emergency_pharmacy}
    Services: ${data.pharmacy_information.services.join(", ")}
    Note: ${data.pharmacy_information.note}
  `;
  const pharmacyEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: pharmacyText,
  });
  console.log("Pharmacy embedding length:", pharmacyEmbedding.data[0].embedding.length);

  // 8. Emergency and Support
  const emergencyText = `
    Emergency Room Phone: ${data.emergency_and_support.emergency_room_phone}
    Ambulance Service: ${data.emergency_and_support.ambulance_service.short_code}, ${data.emergency_and_support.ambulance_service.direct_number}
    On-call Medical Officer: ${data.emergency_and_support.on_call_medical_officer}
    Patient Support Desk: ${data.emergency_and_support.patient_support_desk.phone}, ext ${data.emergency_and_support.patient_support_desk.extension}
    Services: ${data.emergency_and_support.patient_support_desk.services}
    Security and Lost & Found: ${data.emergency_and_support.security_and_lost_found}
  `;
  const emergencyEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: emergencyText,
  });
  console.log("Emergency embedding length:", emergencyEmbedding.data[0].embedding.length);

  // 9. Additional Notes
  const notesText = Object.entries(data.additional_notes)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  const notesEmbedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: notesText,
  });
  console.log("Notes embedding length:", notesEmbedding.data[0].embedding.length);
}

generateEmbeddings();
