import React, { useState, useEffect } from 'react';
import './CardGallery.css';

// База данных карточек для каждого класса (минимум 10 на класс)
const CARDS_DATABASE = {
  spruce: [
    { id: 1, name: "Ель обыкновенная (Picea abies)", description: "Классическая ёлка с густой кроной", image: null },
    { id: 2, name: "Ель колючая голубая (Picea pungens)", description: "Голубоватая хвоя, очень декоративная", image: null },
    { id: 3, name: "Ель сербская (Picea omorika)", description: "Узкая крона, двухцветная хвоя", image: null },
    { id: 4, name: "Ель канадская (Picea glauca)", description: "Сизо-зелёная хвоя, коническая форма", image: null },
    { id: 5, name: "Ель корейская (Picea koraiensis)", description: "Крупные шишки, мягкая хвоя", image: null },
    { id: 6, name: "Ель восточная (Picea orientalis)", description: "Короткая блестящая хвоя", image: null },
    { id: 7, name: "Ель ситхинская (Picea sitchensis)", description: "Самая высокая ель, сизая хвоя", image: null },
    { id: 8, name: "Ель красная (Picea rubens)", description: "Красноватая кора и шишки", image: null },
    { id: 9, name: "Ель чёрная (Picea mariana)", description: "Тёмная хвоя, болотистые места", image: null },
    { id: 10, name: "Ель Энгельмана (Picea engelmannii)", description: "Гибкие ветви, голубоватый оттенок", image: null },
  ],
  pine: [
    { id: 1, name: "Сосна обыкновенная (Pinus sylvestris)", description: "Оранжевая кора, длинная хвоя", image: null },
    { id: 2, name: "Сосна кедровая сибирская (Pinus sibirica)", description: "Кедровые орешки, густая крона", image: null },
    { id: 3, name: "Сосна чёрная (Pinus nigra)", description: "Тёмная кора, жёсткая хвоя", image: null },
    { id: 4, name: "Сосна веймутова (Pinus strobus)", description: "Мягкая голубовато-зелёная хвоя", image: null },
    { id: 5, name: "Сосна горная (Pinus mugo)", description: "Стелющаяся форма, небольшая высота", image: null },
    { id: 6, name: "Сосна балканская (Pinus peuce)", description: "Плотная тёмно-зелёная крона", image: null },
    { id: 7, name: "Сосна жёлтая (Pinus ponderosa)", description: "Жёлто-коричневая кора, длинная хвоя", image: null },
    { id: 8, name: "Сосна алеппская (Pinus halepensis)", description: "Светло-зелёная хвоя, засухоустойчивая", image: null },
    { id: 9, name: "Сосна Банкса (Pinus banksiana)", description: "Искривлённая хвоя, небольшие шишки", image: null },
    { id: 10, name: "Сосна густоцветная (Pinus densiflora)", description: "Мягкая хвоя, красноватая кора", image: null },
  ],
  fir: [
    { id: 1, name: "Пихта белая (Abies alba)", description: "Мягкая тёмно-зелёная хвоя", image: null },
    { id: 2, name: "Пихта корейская (Abies koreana)", description: "Фиолетовые шишки, серебристая изнанка хвои", image: null },
    { id: 3, name: "Пихта бальзамическая (Abies balsamea)", description: "Ароматная смола, густая крона", image: null },
    { id: 4, name: "Пихта одноцветная (Abies concolor)", description: "Сизо-голубая хвоя, засухоустойчивая", image: null },
    { id: 5, name: "Пихта великая (Abies grandis)", description: "Очень высокая, плоская хвоя", image: null },
    { id: 6, name: "Пихта Нордманна (Abies nordmanniana)", description: "Тёмно-зелёная блестящая хвоя", image: null },
    { id: 7, name: "Пихта сибирская (Abies sibirica)", description: "Мягкая ароматная хвоя", image: null },
    { id: 8, name: "Пихта Фразера (Abies fraseri)", description: "Приподнятые ветви, небольшие шишки", image: null },
    { id: 9, name: "Пихта испанская (Abies pinsapo)", description: "Короткая жёсткая хвоя", image: null },
    { id: 10, name: "Пихта китайская (Abies fargesii)", description: "Пурпурные шишки, декоративная", image: null },
  ],
};

const CardGallery = ({ detectedObjects, onClose }) => {
  const [similarCards, setSimilarCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Функция для поиска похожих карточек через CLIP
  const findSimilarCards = async (croppedImageData, className) => {
    try {
      // Импортируем CLIP модель
      const { pipeline, env } = await import('@xenova/transformers');
      
      // Настройка для работы в браузере
      env.localModelPath = 'https://huggingface.co/models/';
      
      // Загружаем модель CLIP (один раз, кешируется)
      const extractor = await pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32');
      
      // Конвертируем ImageData в тензор
      const imageFeatures = await extractor(croppedImageData, { pooling: 'mean' });
      
      // Получаем текстовые описания карточек для данного класса
      const cardDescriptions = CARDS_DATABASE[className] || [];
      
      // Вычисляем сходство с каждой карточкой
      const similarities = [];
      for (const card of cardDescriptions) {
        // Эмбеддинг текста
        const textFeatures = await extractor(card.name, { pooling: 'mean' });
        
        // Косинусное сходство
        const similarity = cosineSimilarity(imageFeatures.data, textFeatures.data);
        similarities.push({ ...card, similarity });
      }
      
      // Сортируем по убыванию сходства
      similarities.sort((a, b) => b.similarity - a.similarity);
      return similarities.slice(0, 5); // Топ-5 похожих
      
    } catch (error) {
      console.error('CLIP error:', error);
      // Fallback: возвращаем первые карточки без AI
      return (CARDS_DATABASE[className] || []).slice(0, 5);
    }
  };
  
  const cosineSimilarity = (vecA, vecB) => {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  };
  
  // При изменении detectedObjects, обрабатываем их
  useEffect(() => {
    if (!detectedObjects || detectedObjects.length === 0) return;
    
    const processObjects = async () => {
      setIsProcessing(true);
      const allMatches = [];
      
      for (const obj of detectedObjects) {
        if (obj.croppedImageData) {
          const matches = await findSimilarCards(obj.croppedImageData, obj.label);
          allMatches.push({
            className: obj.label,
            classNameRu: getClassNameRu(obj.label),
            matches: matches,
          });
        }
      }
      
      setSimilarCards(allMatches);
      setIsProcessing(false);
    };
    
    processObjects();
  }, [detectedObjects]);
  
  const getClassNameRu = (className) => {
    const map = { spruce: 'Ель', pine: 'Сосна', fir: 'Пихта' };
    return map[className] || className;
  };
  
  return (
    <div className="card-gallery-overlay">
      <div className="card-gallery">
        <div className="card-gallery-header">
          <h3>🌲 Похожие виды деревьев</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        {isProcessing && (
          <div className="processing">
            <div className="spinner-small"></div>
            <p>Анализ с помощью CLIP...</p>
          </div>
        )}
        
        {!isProcessing && similarCards.length === 0 && detectedObjects?.length > 0 && (
          <div className="no-results">
            <p>😕 Не удалось найти похожие виды. Попробуйте другое изображение.</p>
          </div>
        )}
        
        {!isProcessing && similarCards.map((group, idx) => (
          <div key={idx} className="card-group">
            <h4 className="group-title">
              <span className="group-dot" style={{ backgroundColor: getClassColor(group.className) }}></span>
              {group.classNameRu}
            </h4>
            <div className="cards-container">
              {group.matches.map((card) => (
                <div 
                  key={card.id} 
                  className="species-card"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="card-icon">🌲</div>
                  <div className="card-content">
                    <div className="card-name">{card.name}</div>
                    <div className="card-desc">{card.description}</div>
                    {card.similarity && (
                      <div className="card-similarity">
                        Сходство: {(card.similarity * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Модальное окно с подробной информацией */}
        {selectedCard && (
          <div className="card-modal" onClick={() => setSelectedCard(null)}>
            <div className="card-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">🌲</div>
              <h3>{selectedCard.name}</h3>
              <p>{selectedCard.description}</p>
              <button onClick={() => setSelectedCard(null)}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getClassColor = (className) => {
  const colors = { spruce: '#2E7D32', pine: '#4CAF50', fir: '#66BB6A' };
  return colors[className] || '#2E7D32';
};

export default CardGallery;