import React, { useState, useRef } from "react";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
import ClassCards from "./components/ClassCards";
import CLIPResults from "./components/CLIPResults";
import { detectImage } from "./utils/detect";
import { loadCLIPModel, matchWithCards } from "./utils/clipMatcher";
import "./style/App.css";

const CLASS_INFO = [
  { name: "spruce", color: "#2E7D32", label: "Сосна" },
  { name: "pine",   color: "#4CAF50", label: "Пихта" },
  { name: "fir",    color: "#66BB6A", label: "Ель" },
];

// Импортируем CLASS_CARDS из ClassCards
let CLASS_CARDS = {};

// Динамический импорт, чтобы избежать ошибок циклической зависимости
const loadClassCards = async () => {
  const module = await import("./components/ClassCards");
  CLASS_CARDS = module.CLASS_CARDS;
};
loadClassCards();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({ text: "Загрузка OpenCV.js..." });
  const [image, setImage] = useState(null);
  const [clipMatches, setClipMatches] = useState([]);
  const [isClipAnalyzing, setIsClipAnalyzing] = useState(false);
  const [showClipResults, setShowClipResults] = useState(false);
  const [clipModel, setClipModel] = useState(null);
  
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const modelName = "model.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk = 100;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.25;

  // Загрузка CLIP модели (заглушка)
  React.useEffect(() => {
    const initCLIP = async () => {
      try {
        const model = await loadCLIPModel();
        setClipModel(model);
        console.log("Анализатор готов");
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };
    initCLIP();
  }, []);

  // Обработка найденных сегментов
  const handleSegmentsExtracted = async (segments) => {
    console.log("Найдены сегменты:", segments);
    
    if (!segments || segments.length === 0) return;
    
    setIsClipAnalyzing(true);
    setShowClipResults(true);
    
    try {
      const allMatches = [];
      
      for (const segment of segments) {
        const className = segment.className; // spruce/pine/fir
        const cards = CLASS_CARDS[className]?.cards || [];
        
        console.log(`Поиск для класса ${className}, найдено ${cards.length} карточек`);
        
        if (cards.length > 0) {
          // Передаём заглушку вместо реального croppedImageData
          const matches = await matchWithCards(
            null,  // пока не используем реальное изображение
            cards, 
            clipModel
          );
          
          allMatches.push({
            className: segment.className,
            classNameRu: segment.classNameRu,
            classColor: segment.classColor,
            topMatches: matches
          });
        }
      }
      
      setClipMatches(allMatches);
    } catch (error) {
      console.error("Ошибка анализа:", error);
    } finally {
      setIsClipAnalyzing(false);
    }
  };

  cv["onRuntimeInitialized"] = async () => {
    setLoading({ text: "Загрузка модели YOLO..." });
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
          <span className="clip-badge"> 🔍 Анализ сходства активен</span>
        </p>
      </div>

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
              modelInputShape,
              handleSegmentsExtracted
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
          setShowClipResults(false);
          setClipMatches([]);
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
              setShowClipResults(false);
              setClipMatches([]);
            }}
          >
            ✕ Закрыть
          </button>
        )}
      </div>

      {showClipResults && (
        <CLIPResults 
          matches={clipMatches}
          isLoading={isClipAnalyzing}
          onClose={() => setShowClipResults(false)}
        />
      )}

      <ClassCards />
    </div>
  );
};

export default App;