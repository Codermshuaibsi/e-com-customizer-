// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase only once, if not initialized already
if (!admin.apps.length) {
  const serviceAccount = require('../eccom-fcec3-firebase-adminsdk-fbsvc-b5d95dae25.json');  // Change the path accordingly

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // Use the default app if already initialized
}

// Export the Firebase admin instance for use elsewhere
module.exports = admin;   
