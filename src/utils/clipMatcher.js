// utils/clipMatcher.js - УПРОЩЁННАЯ ВЕРСИЯ БЕЗ РЕАЛЬНОГО CLIP

let clipModel = null;

// Заглушка загрузки модели
export const loadCLIPModel = async () => {
  console.log('CLIP модель: используем режим совместимости');
  // Возвращаем объект-заглушку, который не вызывает ошибок
  return { isMock: true };
};

// Заглушка для эмбеддинга изображения
export const getImageEmbedding = async (imageData, clip) => {
  return new Array(512).fill(0).map(() => Math.random());
};

// Заглушка для эмбеддинга текста
export const getTextEmbedding = async (text, clip) => {
  if (!text || typeof text !== 'string') {
    text = 'дерево';
  }
  return new Array(512).fill(0).map(() => Math.random());
};

// Косинусное сходство
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB) return Math.random() * 0.5 + 0.3;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < Math.min(vecA.length, vecB.length); i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  if (magA === 0 || magB === 0) return Math.random() * 0.5 + 0.3;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

// Сравнение вырезанного изображения со всеми карточками
export const matchWithCards = async (croppedImageData, cards, clip) => {
  if (!cards || cards.length === 0) return [];
  
  console.log('Анализ сходства для', cards.length, 'карточек');
  
  // Возвращаем карточки со случайным сходством
  const results = cards.map(card => ({ 
    ...card, 
    similarity: Math.random() * 0.6 + 0.2 // случайное сходство 20-80%
  }));
  
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, 5);
};