import React, { useState, useRef } from "react";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
import { detectImage } from "./utils/detect";
import "./style/App.css";

// Цвета и названия классов для хвойных деревьев
const CLASS_INFO = [
  { name: "spruce",      color: "#2E7D32", label: "Ель" },
  { name: "pine",        color: "#4CAF50", label: "Сосна" },
  { name: "fir",         color: "#66BB6A", label: "Пихта" },
];

const App = () => {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState({ text: "Загрузка OpenCV.js..." });
  const [image, setImage]       = useState(null);
  const inputImage              = useRef(null);
  const imageRef                = useRef(null);
  const canvasRef               = useRef(null);

  const modelName       = "model.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk            = 100;
  const iouThreshold    = 0.45;
  const scoreThreshold  = 0.25;

  cv["onRuntimeInitialized"] = async () => {
    setLoading({ text: "Загрузка модели..." });
    const yolov8 = await InferenceSession.create("./model.onnx");

    setLoading({ text: "Загрузка NMS..." });
    const nms = await InferenceSession.create("./nms-yolov8.onnx");

    setLoading({ text: "Загрузка маски..." });
    const mask = await InferenceSession.create("./mask-yolov8-seg.onnx");

    setLoading({ text: "Прогрев модели..." });
    const tensor = new Tensor(
      "float32",
      new Float32Array(modelInputShape.reduce((a, b) => a * b)),
      modelInputShape
    );
    await yolov8.run({ images: tensor });

    setSession({ net: yolov8, nms, mask });
    setLoading(null);
  };

  return (
    <div className="App">
      {loading && (
        <Loader>
          {loading.progress ? `${loading.text} — ${loading.progress}%` : loading.text}
        </Loader>
      )}

      <div className="header">
        <h1>🌲 Сегментация хвойных деревьев</h1>
        <p>
          YOLOv8-segment &nbsp;|&nbsp; <code className="code">{modelName}</code>
        </p>
      </div>

      {/* Легенда классов хвойных деревьев */}
      <div className="legend">
        {CLASS_INFO.map((cls) => (
          <div className="legend-item" key={cls.name}>
            <span className="legend-dot" style={{ backgroundColor: cls.color }} />
            <span>{cls.label} ({cls.name})</span>
          </div>
        ))}
      </div>

      <div className="content">
        <img
          ref={imageRef}
          src="#"
          alt=""
          style={{ display: image ? "block" : "none" }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            );
          }}
        />
        <canvas
          id="canvas"
          width={modelInputShape[2]}
          height={modelInputShape[3]}
          ref={canvasRef}
        />
      </div>

      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
          }
          const url = URL.createObjectURL(e.target.files[0]);
          imageRef.current.src = url;
          setImage(url);
        }}
      />

      <div className="btn-container">
        <button onClick={() => inputImage.current.click()}>
          📂 Открыть изображение
        </button>
        {image && (
          <button
            onClick={() => {
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
            }}
          >
            ✕ Закрыть
          </button>
        )}
      </div>
    </div>
  );
};

export default App;