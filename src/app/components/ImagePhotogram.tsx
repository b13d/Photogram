import ConfigFirebase from "@/firebase/ConfigFirebase";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { listAll, getDownloadURL, ref } from "firebase/storage";
import Modal from "./Modal";
import { motion } from "framer-motion";

export interface ImageProps {
  currentFile: string;
  setModalBoolean?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number[] | undefined>>;
  imagesApi: string[];
}

export default function ImagePhoto({
  currentFile,
  setModalBoolean,
  setCurrentIndex,
  imagesApi,
}: ImageProps) {
  const { storage } = ConfigFirebase();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (imagesApi !== undefined) setImages(imagesApi);
  }, [imagesApi, currentFile]);

  const handleWatchImage = (index: number) => {
    Context();

    let tempIndex: number[] = [];

    if (setCurrentIndex !== undefined && setModalBoolean !== undefined) {
      if (images.length > 1) {
        if (index === 0) {
          tempIndex = [imagesApi.length - 1, index, index + 1];
        } else if (index === imagesApi.length - 1) {
          tempIndex = [index - 1, index, 0];
        } else {
          tempIndex = [index - 1, index, index + 1];
        }
      }
      setCurrentIndex(tempIndex);
      setModalBoolean(true);
    }
  };

  function Context() {
    // window.oncontextmenu = function (event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false;
    // };
  }

  const variants = {
    initial: {
      transition: { duration: 1 },
      opacity: 1,
      filter: "brightness(1)",
    },
  };

  return (
    <div className="grid min-[400px]:auto-cols-auto min-[800px]:grid-cols-3 gap-8">
      <img src="" className="test-img" hidden alt="" />
      {images.map((value, index) => {
        return (
          <motion.img
            layout
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            whileInView="initial"
            variants={variants}
            whileHover={{ filter: "brightness(1.25)" }}
            onClick={(e) => handleWatchImage(index)}
            style={{ height: 300 }}
            className="rounded-md shadow-md cursor-pointer z-[0] object-cover"
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
