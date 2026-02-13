console.log("Script started");
require("dotenv").config();

const { Pinecone } = require("@pinecone-database/pinecone");
const data = require("./tikur_anbessa_chunk.json");

// Initialize Pinecone
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

// Helper: generate embedding via REST API using built-in fetch
async function getEmbedding(text) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

// Helper: embed and upsert into Pinecone
async function embedAndUpsert(id, text) {
  const embedding = await getEmbedding(text);
  if (!embedding) return;

  await index.upsert([
    {
      id,
      values: embedding,
      metadata: { text },
    },
  ]);

  console.log(`Upserted ${id} with embedding length: ${embedding.length}`);
}

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
  await embedAndUpsert("hospital_info", hospitalInfoText);

  // 2. Departments
  for (const dept of data.departments_and_services) {
    const deptText = `
      Department: ${dept.department}
      Specialties/Services: ${(dept.specialties || dept.services).join(", ")}
      Location: ${dept.location || ""}
      Contact: ${dept.contact_extension || dept.contact_number || ""}
    `;
    await embedAndUpsert(`department_${dept.department}`, deptText);
  }

  // 3. Doctors
  for (const doc of data.doctors_and_staff) {
    const docText = `
      Name: ${doc.name}
      Department: ${doc.department}
      Expertise: ${doc.expertise}
      Consultation days: ${doc.consultation_days.join(", ")}
    `;
    await embedAndUpsert(`doctor_${doc.name}`, docText);
  }

  // 4. Working Hours
  const workingHoursText = `
    Outpatient Departments: ${data.working_hours.outpatient_departments}
    Emergency Department: ${data.working_hours.emergency_department}
  `;
  await embedAndUpsert("working_hours", workingHoursText);

  // 5. Appointments
  const appointmentsText = `
    Booking Process: ${data.appointments.booking_process}
    Required Documents: ${data.appointments.required_documents.join(", ")}
    Cancellation Policy: ${data.appointments.cancellation_policy}
  `;
  await embedAndUpsert("appointments", appointmentsText);

  // 6. Pre-Visit Instructions
  const preVisitText = Object.entries(data.pre_visit_instructions)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  await embedAndUpsert("pre_visit_instructions", preVisitText);

  // 7. Pharmacy Information
  const pharmacyText = `
    Location: ${data.pharmacy_information.location}
    Operating Hours: ${data.pharmacy_information.operating_hours}
    Emergency Pharmacy: ${data.pharmacy_information.emergency_pharmacy}
    Services: ${data.pharmacy_information.services.join(", ")}
    Note: ${data.pharmacy_information.note}
  `;
  await embedAndUpsert("pharmacy_information", pharmacyText);

  // 8. Emergency and Support
  const emergencyText = `
    Emergency Room Phone: ${data.emergency_and_support.emergency_room_phone}
    Ambulance Service: ${data.emergency_and_support.ambulance_service.short_code}, ${data.emergency_and_support.ambulance_service.direct_number}
    On-call Medical Officer: ${data.emergency_and_support.on_call_medical_officer}
    Patient Support Desk: ${data.emergency_and_support.patient_support_desk.phone}, ext ${data.emergency_and_support.patient_support_desk.extension}
    Services: ${data.emergency_and_support.patient_support_desk.services}
    Security and Lost & Found: ${data.emergency_and_support.security_and_lost_found}
  `;
  await embedAndUpsert("emergency_and_support", emergencyText);

  // 9. Additional Notes
  const notesText = Object.entries(data.additional_notes)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  await embedAndUpsert("additional_notes", notesText);
}

generateEmbeddings();
