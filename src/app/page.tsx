"use client";

export interface IAPI {
  imagesApi: string[];
}

// import Image from "next/image";
import React, { useEffect, useState, createContext, useRef } from "react";
import ImagePhoto from "./components/ImagePhotogram";
import { useStorage } from "@/hooks/useStorage";
import { useFirestore as UseFirestore } from "@/hooks/useFirestore";
import { motion } from "framer-motion";
import Footer from "./components/Footer";
import Head from "next/head";
import { doc, deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import ConfigFirebase from "@/firebase/ConfigFirebase";
import { deleteObject, ref } from "firebase/storage";
import ImageRedactor from "./components/ImageRedactor";

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
  const [inZoom, setInZoom] = useState<boolean>(false);
  const [currentScale, setCurrentScale] = useState<number>(1);
  const [lastID, setLastID] = useState<string>("");
  const [showRedactor, setShowRedactor] = useState<boolean>(false);

  let refInput = useRef<HTMLInputElement>(null);

  const { db, storage } = ConfigFirebase();

  const changeHangle = (element: React.ChangeEvent<HTMLInputElement>) => {
    if (
      element.currentTarget.files &&
      element.currentTarget.files[0] !== undefined &&
      types.includes(element.currentTarget.files[0].type)
    ) {
      // debugger;

      // console.log(refInput);
      // console.log(refInput.current);

      let url: string = "";
      let name = element.currentTarget.files[0].name;

      var fileReader = new FileReader();
      fileReader.onload = function () {
        url = fileReader.result !== null ? fileReader.result.toString() : "";

        CheckImage(url);
      };

      let temp: HTMLInputElement | undefined = undefined;
      if (refInput.current !== null) {
        temp = refInput.current;
      }

      // console.log(element.currentTarget.files[0]);
      fileReader.readAsDataURL(element.currentTarget.files[0]);

      // linkStorage(setCurrentFile, setProgress, element, setLastID);
      // linkUseFirestore(currentFile, setImages);

      // очищаю input
      temp !== undefined ? (temp.value = "") : "";
    }
  };

  function fileUpload(url: string) {
    // debugger;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "random-name.png", blob);
        // console.log(file);

        let element = file;

        linkStorage(setCurrentFile, setProgress, element, setLastID);
        linkUseFirestore(url, setImages);
      });
  }

  // useEffect(() => {
  // проверка изображения на размеры

  function CheckImage(url: string) {
    // debugger;
    // const imagesRef = doc(db, "images", "url");
    // console.log(url);

    let image = new Image();

    image.onload = function () {
      if (
        image.width < 300 ||
        image.height < 300 ||
        image.width > 1280 ||
        image.height > 1280
      ) {
        alert("Изображение не подходит");
        return false;
      } else {
        setShowRedactor(true);
        setCurrentFile(url);
      }
    };

    image.src = url;

    // const desertRef = ref(storage, currentFile);

    // setCurrentFile("");
    // setLastID("");
  }

  useEffect(() => {
    linkUseFirestore(currentFile, setImages);
  }, [currentFile, linkUseFirestore]);

  const handleCloseModal = () => {
    setCurrentScale(1);
    setInZoom(false);

    window.oncontextmenu = function (event) {
      return true;
    };

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
    // if (index === 0) {
    //   setCurrentIndex([imagesApi.length - 2, imagesApi.length - 1, index]);
    // } else if (index === imagesApi.length - 1) {
    //   setCurrentIndex([imagesApi.length - 3, imagesApi.length - 2, index]);
    // } else {
    //   setCurrentIndex([index - 2, index - 1, index]);
    // }

    if (index === 0) {
      setCurrentIndex([imagesApi.length - 2, imagesApi.length - 1, index]);
    } else {
      setCurrentIndex([
        index - 2 < 0 ? imagesApi.length - 1 : index - 2,
        index - 1,
        index,
      ]);
    }
  };

  const handleNextImage = (index: number) => {
    if (index === imagesApi.length - 1) {
      setCurrentIndex([index, 0, 1]);
    } else {
      setCurrentIndex([
        index,
        index + 1,
        index + 2 < imagesApi.length ? index + 2 : 0,
      ]);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let temp = e.target as HTMLElement;

    if (temp.tagName === "DIV") {
      handleCloseModal();
    }
  };

  const handleTap = () => {
    // console.log("Tap");
    if (inZoom) {
      setCurrentScale(1);
      setInZoom(false);
    } else {
      setCurrentScale(1.5);
      setInZoom(true);
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="stylesheet" href="croppie.css" />
      </Head>
      {showRedactor && (
        <>

          <ImageRedactor
            imageUrl={currentFile}
            setCurrentFile={setCurrentFile}
            fileUpload={fileUpload}
            setShowRedactor={setShowRedactor}
          />
        </>
      )}
      {!showRedactor && (
        <div className="max-w-[1170px] max-sm:mb-2 max-sm:mx-2  bg-[#f9f4d6] shadow-2xl pb-10 rounded-md min-h-[100vh] m-auto pt-[30px] sm:my-10">
          {modalBoolean && (
            <>
              <div
                onClick={() => handleCloseModal()}
                className="backdrop-blur-sm bg-[#272727ec] z-[1] fixed h-full w-full inset-x-0 inset-y-0"
              ></div>
              <div className="fixed justify-center sm:w-auto items-center z-50 left-0 right-0  m-auto max-sm:top-[200px] bottom-0 top-[30%]">
                <div
                  onClick={(e) => handleClick(e)}
                  className="modal-grid justify-center gap-4 sm:grid items-center m-auto "
                >
                  {currentIndex?.map((value, index) => {
                    let styleImage = "";

                    if (index === 1) {
                      styleImage =
                        "z-10 max-sm:w-[200px] max-sm:scale-125 sm: max-sm:max-h-[300px] max-w-[700px] sm:h-[300px]";
                    } else
                      styleImage =
                        "max-sm:hidden max-w-[300px] h-[150px] brightness-50";

                    if (index === 1) {
                      return (
                        <motion.img
                          onTap={handleTap}
                          className={styleImage}
                          key={index}
                          variants={variants}
                          src={imagesApi[value]}
                          alt="show-image"
                          style={{
                            transitionDuration: "300ms",
                            scale: currentScale,
                            justifySelf: "center",
                            margin: "auto",
                            zIndex: 10,
                            position: "relative",
                          }}
                        />
                      );
                    } else {
                      return (
                        <motion.img
                          className={styleImage}
                          key={index}
                          src={imagesApi[value]}
                          alt="show-image"
                          style={{ justifySelf: "center", zIndex: -1 }}
                        />
                      );
                    }
                  })}
                </div>
                {currentIndex !== undefined ? (
                  <span
                    onClick={() => handleBackImage(currentIndex[1])}
                    className="cursor-pointer absolute left-0 sm:left-[100px]  top-0 z-20  sm:top-[80px]   text-[#ffd392] max-sm:text-[50px]  text-[70px]"
                  >
                    &#60;
                  </span>
                ) : (
                  ""
                )}
                {currentIndex !== undefined ? (
                  <span
                    onClick={() => handleNextImage(currentIndex[1])}
                    className="absolute top-0 sm:top-[80px] right-0 sm:right-[100px] z-20   cursor-pointer text-[#ffd392] max-sm:text-[50px] text-[70px]"
                  >
                    &#62;
                  </span>
                ) : (
                  ""
                )}
              </div>
            </>
          )}
          <h1 className="text-[30px] text-[#ffc66e] pb-[10px] text-center">
            Photogram
          </h1>
          <div className="flex flex-col items-center align-middle h-min justify-center gap-2 ">
            <p className="text-5xl text-[#7d7d7d] font-medium">
              Your pictures:{" "}
            </p>
            <h1 className="text-1xl">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </h1>
            <input
              accept=".jpg, .png, .jpeg"
              ref={refInput}
              hidden
              type="file"
              name="image-download"
              id="image-download"
              onChange={(e) => changeHangle(e)}
              // value={currentFile}
            />
            <label htmlFor="image-download">
              <img
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
      )}
      {!showRedactor && <Footer />}
    </>
  );
}
