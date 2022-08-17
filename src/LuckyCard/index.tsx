import React, { useEffect, useRef } from "react";
import { loadImg } from "./utils";
import useMouse from "./useMouse";
import "./index.scss";

const baseImgUrl = new URL("./baby.png", import.meta.url).href;
const brushImgUrl = new URL("./brush.png", import.meta.url).href;

const dpr = window.devicePixelRatio || 2;
function LuckyCard() {
  const canvasRef = useRef(null);
  const brushRef = useRef(null);
  const underRef = useRef(null);
  const { registerMouse, isDone } = useMouse({
    canvasRef,
    brushRef,
    dpr,
  });
  useEffect(() => {
    async function run() {
      // draw base image
      const canvas = canvasRef.current as unknown as HTMLCanvasElement;
      const ctx = (canvas as unknown as HTMLCanvasElement).getContext("2d");

      if (!canvas || !ctx) return;
      // load base img
      const img = (await loadImg(baseImgUrl)) as HTMLImageElement;
      const [width, height] = [img.naturalWidth, img.naturalHeight];
      // draw base img
      canvas.style.width = `${~~(width / dpr)}px`;
      canvas.style.height = `${~~(height / dpr)}px`;
      underRef.current.style.width = canvas.style.width;

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // load brush img
      brushRef.current = (await loadImg(brushImgUrl)) as HTMLImageElement;
      console.log("brushRef.current", brushRef.current);

      registerMouse(ctx);
    }

    run();
  }, []);

  useEffect(() => {
    if (isDone && underRef.current) {
      const $under = underRef.current;
      if ($under) {
        $under.classList.add("animated");
      }
    }
  }, [isDone]);

  return (
    <div className="content">
      <canvas ref={canvasRef} />
      <div className="under" ref={underRef}>
        <p>
          &nbsp;Life is like a box of{" "}
          <span className="hightlight">chocolates</span>.
        </p>
        <p>You never know what you're gonna get.</p>
      </div>
    </div>
  );
}

export default LuckyCard;
