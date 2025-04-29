import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCe-aGYk-F6pxa21Rzl7DLBQSPQE_eVm5U",
  authDomain: "furiosa-chat.firebaseapp.com",
  projectId: "furiosa-chat",
  storageBucket: "furiosa-chat.firebasestorage.app",
  messagingSenderId: "712516514562",
  appId: "1:712516514562:web:61fa2eccf055879890081b",
  measurementId: "G-ZE77YLHWED"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
