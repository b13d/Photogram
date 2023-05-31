"use client";

import Image from "next/image";
import React, { useEffect, useState, createContext } from "react";
import ImagePhoto from "./components/ImagePhotogram";
import { useStorage } from "@/hooks/useStorage";
import { useFirestore as UseFirestore } from "@/hooks/useFirestore";
import { motion } from "framer-motion";

export const ApiContext = createContext<string[]>([]);
export const SetImagesContext = createContext<
  React.Dispatch<React.SetStateAction<string[]>> | undefined
>(undefined);

export default function Main() {
  const [currentFile, setCurrentFile] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [modalBoolean, setModalBoolean] = useState(false);
  const [modalImage, setModalImage] = useState<React.JSX.Element | undefined>(
    undefined
  );
  const types = ["image/png", "image/jpeg"];
  const linkStorage = useStorage;
  const linkUseFirestore = UseFirestore;
  const [imagesApi, setImages] = useState<string[]>([]);

  const changeHangle = (element: React.FormEvent<HTMLInputElement>) => {
    if (
      element.currentTarget.files &&
      element.currentTarget.files[0] !== undefined &&
      types.includes(element.currentTarget.files[0].type)
    ) {
      // console.log(element)

      linkStorage(setCurrentFile, setProgress, element);
      linkUseFirestore(currentFile, setImages);
    }
  };

  useEffect(() => {
    linkUseFirestore(currentFile, setImages);
  }, [currentFile, linkUseFirestore]);

  const handleCloseModal = () => {
    setModalBoolean(false);
    setModalImage(undefined);
  };

  const variants = {
    visible: {
      width: progress + "%",
    },
    initial: {
      width: 0 + "%",
    },
  };

  return (
    <div className="max-w-[1170px] m-auto pt-[30px]">
      {modalBoolean && (
        <>
          <div
            onClick={handleCloseModal}
            className="bg-[#272727d1] z-[1] fixed h-full w-full inset-x-0 inset-y-0"
          ></div>
          {modalImage}
        </>
      )}
      <h1 className="text-2xl text-[#ffc66e] pb-[10px]">Photogram</h1>
      <div className="flex flex-col items-center align-middle h-min justify-center gap-2 ">
        <p className="text-5xl text-[#7d7d7d] font-medium">Your pictures: </p>
        <h1 className="text-1xl">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <input
          hidden
          type="file"
          name="image-download"
          id="image-download"
          onChange={(e) => changeHangle(e)}
          // value={currentFile}
        />
        <label htmlFor="image-download">
          <Image
            src="/images/icon-add.png"
            width={45}
            height={45}
            alt="add image"
            className="icon-add"
          />
        </label>
        <motion.div
          initial="initial"
          animate="visible"
          variants={variants}
          className="h-1 bg-orange-300 self-start flex"
        ></motion.div>
        <ApiContext.Provider value={imagesApi}>
          <ImagePhoto
            currentFile={currentFile}
            setModalBoolean={setModalBoolean}
            setModalImage={setModalImage}
          />
        </ApiContext.Provider>
      </div>
    </div>
  );
}
