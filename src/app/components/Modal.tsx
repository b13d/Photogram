import React, { Ref, useEffect, useState } from "react";
// import Image from "next/image";
import { motion } from "framer-motion";
import ConfigFirebase from "@/firebase/ConfigFirebase";
import { ref, getMetadata } from "firebase/storage";
import { metadata } from "../layout";
import { getDoc, doc } from "firebase/firestore";

export interface ModalProps {
  url?: string;
  setModalBoolean?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalImage?: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
  >;
}

export default function Modal({
  url,
  setModalBoolean,
  setModalImage,
}: ModalProps) {
  let tempBoolean = url !== undefined ? true : false;
  const { db, storage } = ConfigFirebase();

  const imagesRef = ref(storage, url);

  debugger

  const img = new Image();
  img.src = url !== undefined ? url : "";

  let widthImg: number = 0;
  let heightImg: number = 0;

  if (Math.abs(img.width) - Math.abs(img.height) > 200) {
    widthImg = img.width;
    heightImg = img.height;

    switch (true) {
      case widthImg < 1024:
        widthImg = img.width * 1.2;
        heightImg = img.height * 1.2;
        break;
      case widthImg > 1024:
        widthImg = img.width / 2;
        heightImg = img.height / 2;
        break;
      default:
        widthImg = img.width;
        heightImg = img.height;
        break;
    }
  }

  if (Math.abs(img.height) - Math.abs(img.width) > 200) {
    widthImg = img.width;
    heightImg = img.height;

    switch (true) {
      case heightImg < 1024:
        widthImg = img.width * 1.2;
        heightImg = img.height * 1.2;
        break;
      case heightImg > 1024:
        widthImg = img.width / 2;
        heightImg = img.height / 2;
        break;
      default:
        widthImg = img.width;
        heightImg = img.height;
        break;
    }
  }

  let tempImage = (
    <motion.img
      width={widthImg !== 0 ? widthImg : img.width <= 300 ? img.width * 2 : 300}
      height={heightImg !== 0 ? heightImg : img.height <= 300 ? img.height * 2 : 300}
      // sizes="(max-height: 400px) 100vw"
      src={url !== undefined ? url : ""}
      alt="img-modal"
      style={{
        height: heightImg !== 0 ? heightImg + "px" : img.height <= 300 ? img.height * 2+"px" : 300+"px",
      }}
      className={`fixed z-[1] max-h-screen inset-x-0 inset-y-[10vh] m-auto`}
    />
  );

  // GetData(db);

  setModalBoolean !== undefined ? setModalBoolean(true) : "";
  setModalImage !== undefined ? setModalImage(tempImage) : "";
  return { tempBoolean, tempImage };
}

export const GetData = async () => {
  return;
};
