import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll } from "framer-motion";

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

export default function ImageRedactor() {
  const [currentImg, setCurrentImg] = useState<HTMLImageElement>();
  const [sizeImg, setSizeImg] = useState<ISizeImg>();
  const [areaImg, setAreaImg] = useState<IAreaImg>({
    height: 200,
    width: 200,
    top: 0,
    left: 0,
  });

  const { scrollY } = useScroll();

  // скорее всего ошибка, ибо я меняю

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  let width = useMotionValue(200);
  let height = useMotionValue(200);

  const constraintsRef = useRef(null);
  const refCurrentImg = useRef(null);

  function ChangeSizeImage() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source") as HTMLImageElement;

    if (image !== null) {
      image.onload = function () {
        ctx?.drawImage(
          image,
          areaImg.left,
          areaImg.top,
          areaImg.width,
          areaImg.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        var dataURL = canvas.toDataURL("image/png");

        console.log(dataURL);
      };
      image.src = "/images/Тишка.jpg";
    }
  }

  useEffect(() => {
    const image = new Image();
    const url: string = "/images/Тишка.jpg";

    image.onload = () => {
      setCurrentImg(image);

      let tempSize: ISizeImg = {
        height: image.height,
        width: image.width,
      };

      setSizeImg(tempSize);
    };

    image.src = url;
  }, []);

  const handleChange = (
    index: number,
    element: React.ChangeEvent<HTMLInputElement>
  ) => {
    let tempArea: IAreaImg = {
      height: areaImg.height,
      width: areaImg.width,
      top: areaImg.top,
      left: areaImg.left,
    };

    if (refCurrentImg.current !== null) {
      let tempImg = refCurrentImg.current as HTMLImageElement;

      console.log(Number(element.target.value));

      if (Number(element.target.value) <= 1024) {
        switch (index) {
          case 0:
            if (tempImg.height >= Number(element.target.value)) {
              height.set(Number(element.target.value));

              let tempAreaImg: IAreaImg = {
                height: Number(element.target.value),
                width: width.getPrevious(),
                top: areaImg.height,
                left: areaImg.height,
              };

              return setAreaImg(tempAreaImg);
            }
            break;
          case 1:
            console.log("Зашел в кейс width");

            if (tempImg.width >= Number(element.target.value)) {
              width.set(Number(element.target.value));

              let tempAreaImg: IAreaImg = {
                height: height.getPrevious(),
                width: Number(element.target.value),
                top: areaImg.height,
                left: areaImg.height,
              };

              return setAreaImg(tempAreaImg);
            }
            break;
          // case 2:
          //   top = Number(element.target.value);
          //   break;
          // case 3:
          //   left = Number(element.target.value);
          //   break;
          default:
            console.log("Ошибка");
            break;
        }

        console.log(tempArea);

        setAreaImg(tempArea);
      }
    }
  };

  const handleChangeDiv = () => {
    let tempArea: IAreaImg = {
      height: height.getPrevious(),
      width: width.getPrevious(),
      top: y.getPrevious(),
      left: x.getPrevious(),
    };

    console.log("Отпустил");

    console.log("x: " + x.getPrevious() + " y:" + y.getPrevious());

    console.log(
      "height: " + height.getPrevious() + " width: " + width.getPrevious()
    );

    setAreaImg(tempArea);
  };

  // console.log("render")

  const handleCutImage = () => {
    console.log("cut image");

    ChangeSizeImage();
  };

  return (
    <>
      <div className="flex m-auto relative items-start justify-around">
        {/* <canvas id="canvas" className=""></canvas> */}
        <div ref={constraintsRef} className={` bg-[#000000b5] relative `}>
          <motion.canvas
          width={width.getPrevious()}
          height={height.getPrevious()}
            id="canvas"
            // onChange={(e) => handleChangeDiv(e)}
            drag
            onTap={(e) => handleChangeDiv()}
            // onTapStart={(e) => handleChangeDiv(e)}
            onTapCancel={(e) => handleChangeDiv()}
            dragMomentum={false}
            dragSnapToOrigin={false}
            dragElastic={0}
            dragConstraints={constraintsRef}
            style={{
              x,
              y,
              width,
              height,
            }}
            className="backdrop-brightness-[4] bg-[#00000000] opacity-50  z-10 absolute"
          ></motion.canvas>
          <img
            ref={refCurrentImg}
            id="source"
            className="z-[-1] relative"
            src="/images/Тишка.jpg"
            alt=""
          />
        </div>
        <motion.div
          style={{
            y: scrollY,
          }}
          className="flex mt-5 bg-[#ffce74] rounded-md rounded-e-3xl rounded-bl-3xl p-5 flex-col gap-4 items-center"
        >
          <div className="flex items-center gap-5">
            <label className="w-[50px]" htmlFor="height-input">
              Height
            </label>
            <input
              max={1024}
              id="height-input"
              className="border-2 px-4 py-2 shadow-md border-none rounded-md"
              type="number"
              // value={height.getPrevious()}
              value={areaImg.height}
              onChange={(e) => handleChange(0, e)}
            />
          </div>

          <div className="flex items-center gap-5">
            <label className="w-[50px]" htmlFor="width-input">
              Width
            </label>
            <input
              max={1024}
              id="width-input"
              className="border-2 px-4 py-2 border-none shadow-md rounded-md"
              type="number"
              // value={width.getPrevious()}
              value={areaImg.width}
              onChange={(e) => handleChange(1, e)}
            />
          </div>
          <div className="flex items-center gap-5">
            <label className="w-[50px]" htmlFor="top-input">
              Top
            </label>
            <input
              id="top-input"
              className="border-2 bg-white px-4 py-2 border-none shadow-md rounded-md"
              type="number"
              value={areaImg?.top}
              disabled
              onChange={(e) => handleChange(2, e)}
            />
          </div>
          <div className="flex items-center gap-5">
            <label className="w-[50px]" htmlFor="left-input">
              Left
            </label>
            <input
              id="left-input"
              className="border-2 bg-white px-4 py-2 border-none shadow-md rounded-md"
              type="number"
              disabled
              value={areaImg?.left}
              onChange={(e) => handleChange(3, e)}
            />
          </div>
          <div className="">
            <button
              onClick={(e) => handleCutImage()}
              className="border rounded-sm py-2 px-6 border-black hover:bg-black hover:text-white duration-300 ease-in-out"
            >
              Cut image
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
