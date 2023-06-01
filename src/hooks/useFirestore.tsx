import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ConfigFirebase from "@/firebase/ConfigFirebase";
// import {Api} from "@/app/components/ImagePhotogram";
import { useContext } from "react";

export function useFirestore(currentFile: string, setImages: React.Dispatch<React.SetStateAction<string[]>>) {
  fetchData(currentFile, setImages);
}

async function fetchData(currentFile: string, setImages: React.Dispatch<React.SetStateAction<string[]>>) {
  // console.log(currentFile)
  const { db } = ConfigFirebase();

  const querySnapshot = collection(db, "images");

  const q = query(querySnapshot, orderBy("createdAt"));

  const tempQuery = await getDocs(q);

  let listQuery: string[] = [];

  tempQuery.forEach((doc) => {
    listQuery.push(doc.data().url);
  });

  let imagesApi = listQuery.reverse()
 
  setImages(imagesApi)
}

