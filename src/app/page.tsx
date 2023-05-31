"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImagePhoto from "./components/ImagePhotogram";
import { useStorage } from "@/hooks/useStorage";
import { useFirestore } from "@/hooks/useFirestore";

export default function Main() {
  const [currentFile, setCurrentFile] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [modalBoolean, setModalBoolean] = useState(false);
  const [modalImage, setModalImage] = useState<React.JSX.Element | undefined>(
    undefined
  );
  const types = ["image/png", "image/jpeg"];
  const linkStorage = useStorage;
  const linkUseFirestore = useFirestore;

  const [imagesApi, setImages] = useState<string[]>([]);

  const changeHangle = (element: React.FormEvent<HTMLInputElement>) => {
    debugger;
    if (
      element.currentTarget.files &&
      types.includes(element.currentTarget.files[0].type)
    ) {
      linkStorage(setCurrentFile, setProgress, element);
      linkUseFirestore(setImages);
    }
  };

  useEffect(() => {
    linkUseFirestore(setImages);
  }, [currentFile, linkUseFirestore]);

  useEffect(() => {
    console.log("Изменения прошли");
    console.log(modalImage);
  }, [modalBoolean, modalImage]);

  const handleCloseModal = () => {
    setModalBoolean(false);
    setModalImage(undefined);
  };

  return (
    <div className="max-w-[1170px] m-auto pt-[30px]">
      {modalBoolean && (
        <>
          <div
            onClick={handleCloseModal}
            className="bg-[#2727279c] fixed h-full w-full inset-x-0 inset-y-0"
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
          value={currentFile}
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
        <div
          style={{ width: progress !== undefined ? progress / 2 + "%" : "" }}
          className="h-1  bg-orange-100"
        ></div>
        <ImagePhoto
          currentFile={currentFile}
          setModalBoolean={setModalBoolean}
          setModalImage={setModalImage}
        />
      </div>
    </div>
  );
}

export function ApiImages() {
  
}