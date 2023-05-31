import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion"

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

  let tempImage = (
    <motion.img
      width={400}
      height={400}
      sizes="(max-height: 400px) 100vw"
      src={url !== undefined ? url : ""}
      alt="img-modal"
      className="fixed z-[1] max-h-screen inset-x-0 inset-y-[10vh] m-auto"
    />
  );

  setModalBoolean !== undefined ? setModalBoolean(true) : ""
  setModalImage !== undefined ? setModalImage(tempImage) : ""
  return { tempBoolean, tempImage };
}
