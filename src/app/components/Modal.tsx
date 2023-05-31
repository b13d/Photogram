import React, { useEffect, useState } from "react";
import Image from "next/image";

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
    <Image
      width={500}
      height={500}
      src={url !== undefined ? url : ""}
      alt="img-modal"
      className="fixed inset-x-0 inset-y-[10vh] ml-auto mr-auto"
    />
  );

  setModalBoolean !== undefined ? setModalBoolean(true) : ""
  setModalImage !== undefined ? setModalImage(tempImage) : ""
  // console.log(tempBoolean);
  return { tempBoolean, tempImage };
}
