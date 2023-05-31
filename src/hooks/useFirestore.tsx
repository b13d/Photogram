import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import ConfigFirebase from "@/firebase/ConfigFirebase";

export function useFirestore(
  setImages: React.Dispatch<React.SetStateAction<string[]>>
) {
  fetchData(setImages);
}

async function fetchData(
  setImages: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { db } = ConfigFirebase();

  const querySnapshot = collection(db, "images");

  const q = query(querySnapshot, orderBy("createdAt"));

  const tempQuery = await getDocs(q);

  let listQuery: string[] = [];

  tempQuery.forEach((doc) => {
    listQuery.push(doc.data().url);
  });

  console.log(listQuery)
  
  setImages(listQuery.reverse());
}
