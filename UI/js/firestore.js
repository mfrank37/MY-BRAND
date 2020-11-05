// firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB54YEbCzjV8GtJTbOkJDEzLd2nkkQeya8",
  authDomain: "my-brand-d4579.firebaseapp.com",
  databaseURL: "https://my-brand-d4579.firebaseio.com",
  projectId: "my-brand-d4579",
  storageBucket: "my-brand-d4579.appspot.com",
  messagingSenderId: "201692937524",
  appId: "1:201692937524:web:e3407b40b845695591f961",
  measurementId: "G-2XGHC91K5V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const FIRESTORE = firebase.firestore();
const STORAGE = firebase.storage();
FIRESTORE.settings({
  timestampsInSnapshots: true
});