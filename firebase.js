// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push, update, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAVhYY98VWy46KwuZACO84HwWMb430L-U4",
  authDomain: "herdmate-c5042.firebaseapp.com",
  databaseURL: "https://herdmate-c5042-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "herdmate-c5042",
  storageBucket: "herdmate-c5042.firebasestorage.app",
  messagingSenderId: "390657666928",
  appId: "1:390657666928:web:2f197758e00b4d0b64a9b5"
};

// Initialise Firebase + DB
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child, push, update, remove };
