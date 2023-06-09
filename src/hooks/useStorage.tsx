import { collection, addDoc, Timestamp } from "firebase/firestore";
import ConfigFirebase from "@/firebase/ConfigFirebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export function useStorage(
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  element: File,
  setLastID: React.Dispatch<React.SetStateAction<string>>
) {
  const { db, storage } = ConfigFirebase();

  const storageRef = ref(storage, `images/${uuidv4()}`);

  if (element) {
    const file = element;
    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progress);

        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setCurrentFile(downloadURL);
          try {
            const docRef = await addDoc(collection(db, "images"), {
              createdAt: Timestamp.now(),
              url: downloadURL,
            });

            setLastID(docRef.id);
            // console.log(docRef.id);
          } catch (error) {
            console.log(error);
          }

          // setCurrentFile("");
          setProgress(0);
        });
      }
    );
  }
}
