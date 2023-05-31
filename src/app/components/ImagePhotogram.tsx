import ConfigFirebase from "@/firebase/ConfigFirebase";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { listAll, getDownloadURL, ref } from "firebase/storage";
import Modal from "./Modal";
import { ApiContext } from "../page";
import { motion } from "framer-motion";

export interface ImageProps {
  currentFile: string;
  setModalBoolean?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalImage?: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
  >;
}

export default function ImagePhoto({
  currentFile,
  setModalBoolean,
  setModalImage,
}: ImageProps) {
  const { storage } = ConfigFirebase();
  const [images, setImages] = useState<string[]>([]);

  const imagesApi = useContext(ApiContext);

  // console.log(imagesApi)

  useEffect(() => {
    setImages(imagesApi !== undefined ? imagesApi : []);
  }, [imagesApi, currentFile]);

  const handleWatchImage = (
    element: React.MouseEvent<HTMLImageElement, MouseEvent>,
    index: number
  ) => {
    Modal({
      url: imagesApi !== undefined ? imagesApi[index] : "",
      setModalBoolean: setModalBoolean,
      setModalImage: setModalImage,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {images.map((value, index) => {
        return (
          <motion.img
            layout
            whileHover={{ opacity: 1 }}
            onClick={(e) => handleWatchImage(e, index)}
            style={{ height: 300, opacity: 0.8 }}
            className="z-[0] object-cover"
            key={index}
            width={300}
            height={300}
            alt="picture"
            src={value}
          />
        );
      })}
    </div>
  );
}
