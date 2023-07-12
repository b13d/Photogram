import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll } from "framer-motion";
import Cropper from "cropperjs";

interface ISizeImg {
  height: number;
  width: number;
}

interface IAreaImg {
  height: number;
  width: number;
  top: number;
  left: number;
}

interface IProps {
  imageUrl: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>;
  fileUpload: (url: string) => void;
  setShowRedactor: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageRedactor(props: IProps) {
  const [showImg, setShowImg] = useState<boolean>(false);
  const [newUrlImg, setNewUrlImg] = useState<string>();

  useEffect(() => {
    var image = document.getElementById("image") as HTMLImageElement;
    var buttonCrop = document.getElementById(
      "button-crop"
    ) as HTMLButtonElement;
    var buttonReset = document.getElementById(
      "button-reset"
    ) as HTMLButtonElement;
    var result = document.getElementById("result") as HTMLDivElement;
    var buttons = document.getElementById("buttons") as HTMLDivElement;
    var croppable = false;
    var cropper = new Cropper(image, {
      aspectRatio: 1,
      minCropBoxHeight: 300,
      minCropBoxWidth: 300,
      viewMode: 1,
      ready: function () {
        croppable = true;
      },
    });

    buttonCrop.onclick = function () {
      var croppedCanvas;
      var roundedCanvas;
      var roundedImage;
      var valuesImage;

      if (!croppable) {
        return;
      }

      // Crop
      croppedCanvas = cropper.getCroppedCanvas();

      // Round
      roundedCanvas = getRoundedCanvas(croppedCanvas);

      if (roundedCanvas === undefined) {
        return;
      }

      if (roundedCanvas.width < 300 || roundedCanvas.height < 300) {
        alert("Image is too small");
        return;
      }

      setShowImg((value) => (value === true ? false : true));

      setNewUrlImg(roundedCanvas.toDataURL());

      // Show
      roundedImage = document.createElement("img");
      valuesImage = document.createElement("p");
      roundedImage.src = roundedCanvas.toDataURL();
      roundedImage.classList.add("m-auto");
      result.innerHTML = "";
      valuesImage.style.color = "gray";
      valuesImage.classList.add("text-center");
      valuesImage.innerHTML = `${
        "width: " + roundedCanvas.width + " height: " + roundedCanvas.height
      }`;
      roundedImage.clientWidth;
      result.appendChild(roundedImage);
      result.appendChild(valuesImage);
      buttons.classList.remove("hidden");
      result.appendChild(buttons);
      result.classList.remove("hidden");
    };

    buttonReset.onclick = function () {
      cropper.reset();
    };

    document.body.style.overflow = "hidden";
  }, []);

  function getRoundedCanvas(sourceCanvas: HTMLCanvasElement) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;

    if (context !== null) {
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.fill();
      return canvas;
    }
  }

  console.log(showImg);

  const handleCloseModal = () => {
    var result = document.getElementById("result") as HTMLDivElement;
    var buttons = document.getElementById("buttons") as HTMLDivElement;

    result.classList.add("hidden");
    buttons.classList.add("hidden");

    setShowImg(false);
  };

  const handleSaveImg = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    var result = document.getElementById("result") as HTMLDivElement;
    var buttons = document.getElementById("buttons") as HTMLDivElement;

    result.classList.add("hidden");
    buttons.classList.add("hidden");

    setShowImg(false);

    if (newUrlImg === undefined) {
      return;
    }

    props.setShowRedactor(false);
    props.fileUpload(newUrlImg);
  };

  const handleBack = () => {
    var result = document.getElementById("result") as HTMLDivElement;
    var buttons = document.getElementById("buttons") as HTMLDivElement;

    result.classList.add("hidden");
    buttons.classList.add("hidden");

    setShowImg(false);

    props.setShowRedactor(false);
  };

  return (
    <div className="container m-auto ">
      <div className="relative mt-20 min-[400px]:w-[400px] min-[400px]:h-[400px] m-auto">
        <img
          className="brightness-50  block max-w-full"
          id="image"
          src={`${props.imageUrl}`}
          alt="Picture"
        />
      </div>
      {showImg && (
        <div className="z-[100] bg-[#000000d2] w-full backdrop-blur-xl h-full fixed top-0 left-0"></div>
      )}
      <div
        className="m-auto max-sm:py-4 z-[150] max-[500px]:w-[300px]  min-[500px]:w-[500px] min-[500px]:h-[500px] hidden fixed top-0 bottom-0 left-0 right-0"
        id="result"
      ></div>

      <div
        id="buttons"
        className="right-0 m-auto max-sm:w-fit left-0 mt-5 z-[150] fixed hidden text-center"
      >
        <button
          onClick={(e) => handleSaveImg(e)}
          className="text-[#e6e6e6] bg-[green] sm:hover:bg-[#13ac13] px-4 py-2 mr-5"
        >
          Save
        </button>
        <button
          onClick={() => handleCloseModal()}
          className="text-[#e6e6e6] bg-[#991d1d] sm:hover:bg-[#bd1f1f] px-4 py-2"
        >
          No save
        </button>
      </div>
      <div>
        <button
          className="text-white absolute top-0 right-0 max-sm:w-[50px] sm:w-[80px] max-sm:text-[12px] max-sm:px-2 max-sm:py-1 border-2 mt-2 bg-[#0000007a] border-red-500 px-4 py-2"
          type="button"
          id="button-crop"
        >
          Crop
        </button>
        <button
          className="text-white absolute max-sm:top-8 max-sm:w-[50px] sm:w-[80px]  sm:top-[50px] max-sm:text-[12px] max-sm:px-2 max-sm:py-1 right-0 bg-[#0000007a] border-2 mt-2 border-[green] px-4 py-2"
          type="button"
          id="button-reset"
        >
          Reset
        </button>
        <button
          onClick={() => handleBack()}
          className="text-white absolute max-sm:top-0 max-sm:w-[50px] sm:w-[80px] text-[22px]  sm:top-[0] max-sm:text-[12px] max-sm:px-2 max-sm:py-1 left-0 bg-[#0000007a]  mt-2  px-2 py-1"
          type="button"
        >
          &larr;
        </button>
      </div>
    </div>
  );
}
