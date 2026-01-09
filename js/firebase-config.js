// Firebase Configuration for almohandes-pos-pro
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Your Firebase configuration (Replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services for use in other modules
window.firebase = {
  app,
  database,
  auth,
  storage
};

console.log('Firebase initialized successfully');

// Helper functions for database operations
window.dbHelpers = {
  ref: (path) => window.firebase.database.ref(path),
  set: (path, data) => window.firebase.database.ref(path).set(data),
  update: (path, data) => window.firebase.database.ref(path).update(data),
  remove: (path) => window.firebase.database.ref(path).remove(),
  get: async (path) => {
    const snapshot = await window.firebase.database.ref(path).get();
    return snapshot.val();
  }
};

window.authHelpers = {
  currentUser: () => window.firebase.auth.currentUser,
  signOut: () => window.firebase.auth.signOut(),
  onAuthStateChanged: (callback) => window.firebase.auth.onAuthStateChanged(callback)
};
