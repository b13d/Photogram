"use client";

export interface IAPI {
  imagesApi: string[];
}

import Image from "next/image";
import React, { useEffect, useState, createContext } from "react";
import ImagePhoto from "./components/ImagePhotogram";
import { useStorage } from "@/hooks/useStorage";
import { useFirestore as UseFirestore } from "@/hooks/useFirestore";
import { motion } from "framer-motion";
import Footer from "./components/Footer";
import Head from "next/head";

// export const ApiContext: React.Context<string[]> = createContext<string[]>([]);

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
  const [currentIndex, setCurrentIndex] = useState<number[]>();

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

  useEffect(() => {
    if (modalBoolean) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "visible";

    }

  }, [modalBoolean]);
  // console.log(imagesApi);

  const handleBackImage = (index: number) => {
    if (index === 0) {
      setCurrentIndex([imagesApi.length - 2, imagesApi.length - 1, index]);
    } else if (index === imagesApi.length - 1) {
      setCurrentIndex([imagesApi.length - 3, imagesApi.length - 2, index]);
    } else {
      setCurrentIndex([index - 2, index - 1, index]);
    }
  };

  const handleNextImage = (index: number) => {
    if (index === imagesApi.length - 1) {
      setCurrentIndex([index, 0, index + 1]);
    } else {
      setCurrentIndex([index, index + 1, index + 2]);
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <div className="max-w-[1170px] min-h-[100vh] m-auto pt-[30px] mb-10">
        {modalBoolean && (
          <>
            <div
              onClick={() => handleCloseModal()}
              className="bg-[#272727ec] z-[1] fixed h-full w-full inset-x-0 inset-y-0"
            ></div>
            <div className="fixed justify-center sm:w-[1300px] items-center z-50 left-0 right-0  m-auto max-sm:top-[50%] top-[30%]">
              <div className="flex items-center m-auto justify-between">
                {currentIndex !== undefined ? (
                  <span
                    onClick={() => handleBackImage(currentIndex[1])}
                    className="cursor-pointer   text-[#ffd392]  text-[70px]"
                  >
                    &#60;
                  </span>
                ) : (
                  ""
                )}

                {currentIndex?.map((value, index) => {
                  let styleImage = "";

                  if (index === 1) {
                    styleImage =
                      "z-10 max-sm:w-[200px] max-sm:scale-125  max-sm:max-h-[300px] max-w-[700px] sm:h-[300px]";
                  } else
                    styleImage =
                      "max-sm:hidden max-w-[300px] h-[150px] brightness-50";

                  if (index === 1) {
                    return (
                      <motion.img
                        whileTap={{ scale: 1.5 }}
                        whileHover={{ scale: 2 }}
                        className={styleImage}
                        key={index}
                        src={imagesApi[value]}
                        alt="show-image"
                      />
                    );
                  } else {
                    return (
                      <motion.img
                        className={styleImage}
                        key={index}
                        src={imagesApi[value]}
                        alt="show-image"
                      />
                    );
                  }
                })}
                {currentIndex !== undefined ? (
                  <span
                    onClick={() => handleNextImage(currentIndex[1])}
                    className="cursor-pointer text-[#ffd392]  text-[70px]"
                  >
                    &#62;
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
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
          <ImagePhoto
            currentFile={currentFile}
            setModalBoolean={setModalBoolean}
            setCurrentIndex={setCurrentIndex}
            imagesApi={imagesApi}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
