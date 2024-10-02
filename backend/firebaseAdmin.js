// Using require() for CommonJS
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Adjust the path as necessary

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore for Admin

module.exports = { db }; // Exporting the db
