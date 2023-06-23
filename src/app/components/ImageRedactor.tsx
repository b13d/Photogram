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

interface IProps {
  imageUrl: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>;
  fileUpload: (url: string) => void;
  setShowRedactor: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageRedactor(props: IProps) {
  const [currentImg, setCurrentImg] = useState<HTMLImageElement>();
  const [sizeImg, setSizeImg] = useState<ISizeImg>();
  const [areaImg, setAreaImg] = useState<IAreaImg>({
    height: 200,
    width: 200,
    top: 0,
    left: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [newUrlImg, setNewUrlImg] = useState<string>("");

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

    // image.crossOrigin = "anonymous";

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
          canvas.clientWidth,
          canvas.clientHeight
        );

        console.log(areaImg)

        // canvas.width = canvas.clientWidth;
        // canvas.height = canvas.clientHeight;

        // console.log(areaImg);
        // console.log(canvas);

        var dataURL = canvas.toDataURL("image/png");

          console.log(dataURL)

        setShowResult(true);
        setNewUrlImg(dataURL);

        // console.log(dataURL);
      };
      // image.src = "/images/Тишка.jpg";
      console.log(props.imageUrl)
      image.src = props.imageUrl;
    }
  }

  useEffect(() => {
    const image = new Image();
    const url: string = props.imageUrl;

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
      // top: areaImg.top,
      // left: areaImg.left,
    };

    if (refCurrentImg.current !== null) {
      let tempImg = refCurrentImg.current as HTMLImageElement;

      // console.log(Number(element.target.value));

      if (Number(element.target.value) <= 1024) {
        switch (index) {
          case 0:
            if (tempImg.height >= Number(element.target.value)) {
              height.set(Number(element.target.value));

              if (sizeImg !== undefined) {
                areaImg.top + Number(element.target.value) > sizeImg?.height
                  ? y.set(0)
                  : y;
              }

              let tempAreaImg: IAreaImg = {
                height: Number(element.target.value),
                width: width.getPrevious(),
                top: areaImg.top,
                left: areaImg.left,
              };

              return setAreaImg(tempAreaImg);
            }
            break;
          case 1:
            if (tempImg.width >= Number(element.target.value)) {
              width.set(Number(element.target.value));

              if (sizeImg !== undefined) {
                areaImg.left + Number(element.target.value) > sizeImg?.width
                  ? x.set(0)
                  : x;
              }

              let tempAreaImg: IAreaImg = {
                height: height.getPrevious(),
                width: Number(element.target.value),
                top: areaImg.top,
                left: areaImg.left,
              };

              return setAreaImg(tempAreaImg);
            }
            break;
          default:
            console.log("Ошибка");
            break;
        }

        // console.log(tempArea);

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

    // console.log("Отпустил");

    // console.log("x: " + x.getPrevious() + " y:" + y.getPrevious());

    // console.log(
    //   "height: " + height.getPrevious() + " width: " + width.getPrevious()
    // );

    setAreaImg(tempArea);
  };

  // console.log("render")

  const handleCutImage = () => {
    // console.log("cut image");

    ChangeSizeImage();
  };

  const handleCloseModal = (
    eDiv: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
    eButton: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    let temp;

    // console.log(eDiv);
    // console.log(eButton);

    if (eDiv !== undefined) {
      temp = eDiv.target as HTMLDivElement;
    } else if (eButton !== undefined) {
      temp = eButton.target as HTMLDivElement;
    }

    if (
      temp !== undefined &&
      temp.classList.contains("background") &&
      setCurrentImg !== undefined
    ) {
      setShowResult(false);

      // props.setShowRedactor(false);

      // props.setCurrentFile("");

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;

      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSaveImg = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.fileUpload(newUrlImg);

    setShowResult(false);
    setNewUrlImg("");

    // props.setCurrentFile("");

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);

    props.setShowRedactor(false);
  };

  return (
    <>
      <div
        onMouseDown={(e) => handleCloseModal(e, undefined)}
        className="background z-10 flex m-auto relative items-start justify-around"
      >
        {showResult && (
          <>
            {/* <div
              onClick={() => handleCloseModal()}
              className="w-full h-full top-0 left-0 fixed bg-[#2b2b2bc9] z-[100]"
            ></div> */}
            <motion.div
              // style={{ width, height }}
              className="rounded-lg mt-10 z-[150] m-auto  fixed"
            >
              <motion.img
                style={{
                  width:
                    areaImg.width > 300 ? areaImg.width / 2 : areaImg.width,
                  height:
                    areaImg.height > 300 ? areaImg.height / 2 : areaImg.height,
                }}
                className="rounded-md m-auto"
                src={newUrlImg}
                alt=""
              />
              <div className="items-center text-center mt-10 p-5 flex flex-col gap-4 justify-center h-[150px] rounded-b-md z-[150] bg-[#2b2b2bbe]">
                <h1 className="text-white">
                  Желаете ли вы сохранить данное изображение?
                </h1>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => handleSaveImg(e)}
                    className="bg-[#2f5239] font-semibold py-1 px-3 hover:bg-[#3e9256] duration-200"
                  >
                    Yes
                  </button>
                  <button
                    onMouseDown={(e) => handleCloseModal(undefined, e)}
                    className="background bg-[#52362f] font-semibold py-1 px-3 hover:bg-[#833927] duration-200"
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
        {/* <canvas id="canvas" className=""></canvas> */}
        <motion.div
          ref={constraintsRef}
          className={` bg-[#000000b5] relative `}
        >
          {/* <motion.div style={{ width, height, x, y }} className="absolute">
            <motion.div
              onMouseDownCapture={(e) => handleMove(e)}
              style={{ height, width: "2px" }}
              className=" absolute cursor-pointer left-[-5px] border-2  border-red-600"
              onClick={() => handleResizeCanvas("left")}
            ></motion.div>
            <motion.div
              className="absolute cursor-pointer  right-[-5px] border-2 border-red-600"
              style={{ height, width: "2px" }}
              onClick={() => handleResizeCanvas("right")}
            ></motion.div>
            <motion.div
              style={{ width, height: "2px" }}
              className="absolute cursor-pointer top-[-5px] border-2 border-red-600"
              onClick={() => handleResizeCanvas("top")}
            ></motion.div>
            <motion.div
              style={{ width, height: "2px" }}
              className="absolute cursor-pointer bottom-[-5px] border-2 border-red-600"
              onClick={() => handleResizeCanvas("bottom")}
            ></motion.div>
          </motion.div> */}

          <motion.canvas
            width={areaImg.width}
            height={areaImg.height}
            id="canvas"
            drag
            onTap={(e) => handleChangeDiv()}
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
            src={props.imageUrl}
            alt=""
          />
        </motion.div>
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
              value={areaImg.height.toString().replace(/^0+/, "")}
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
              value={areaImg.width.toString().replace(/^0+/, "")}
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
