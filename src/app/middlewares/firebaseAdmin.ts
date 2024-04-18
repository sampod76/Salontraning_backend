import firebaseAdmin from 'firebase-admin';
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    './app-service-69072-firebase-adminsdk-4fxmd-45859ef483.json'
  ),
});

export default firebaseAdmin;
