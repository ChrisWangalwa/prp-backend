// backend/assignRole.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setCustomUserClaims() {
  const userEmail = "admin@example.com"; // ✅ Your actual Firebase user email

  try {
    const user = await admin.auth().getUserByEmail(userEmail);
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
    console.log(`✅ Role 'admin' set for ${userEmail}`);
  } catch (error) {
    console.error("❌ Error assigning role:", error.message);
  }
}

setCustomUserClaims();
