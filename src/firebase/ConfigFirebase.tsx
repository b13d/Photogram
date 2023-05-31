import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default function ConfigFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDXb8y_MMiAVhVj_dktkcs4S3F4opot3bA",
    authDomain: "photogram-1578f.firebaseapp.com",
    projectId: "photogram-1578f",
    storageBucket: "photogram-1578f.appspot.com",
    messagingSenderId: "970563829618",
    appId: "1:970563829618:web:f630304f083ce47786e7eb",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, db, storage };
}