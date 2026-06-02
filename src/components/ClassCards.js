import React, { useState } from 'react';
import './ClassCards.css';

// Импортируйте ваши реальные изображения
// ПУТИ НУЖНО ЗАМЕНИТЬ НА ВАШИ РЕАЛЬНЫЕ ФАЙЛЫ
// СОСНА (spruce)
import spruceImg1 from '../assets/spruce1.jpg';
import spruceImg2 from '../assets/spruce2.jpg';
import spruceImg3 from '../assets/spruce3.jpg';
import spruceImg4 from '../assets/spruce4.jpg';
import spruceImg5 from '../assets/spruce5.jpg';
import spruceImg6 from '../assets/spruce6.jpg';
import spruceImg7 from '../assets/spruce7.jpg';
import spruceImg8 from '../assets/spruce8.jpg';
import spruceImg9 from '../assets/spruce9.jpg';
import spruceImg10 from '../assets/spruce10.jpg';

// ПИХТА (pine)
import pineImg1 from '../assets/pine1.jpg';
import pineImg2 from '../assets/pine2.jpg';
import pineImg3 from '../assets/pine3.jpg';
import pineImg4 from '../assets/pine4.jpg';
import pineImg5 from '../assets/pine5.jpg';
import pineImg6 from '../assets/pine6.jpg';
import pineImg7 from '../assets/pine7.jpg';
import pineImg8 from '../assets/pine8.jpg';
import pineImg9 from '../assets/pine9.jpg';
import pineImg10 from '../assets/pine10.jpg';

// ЕЛЬ (fir)
import firImg1 from '../assets/fir1.jpg';
import firImg2 from '../assets/fir2.jpg';
import firImg3 from '../assets/fir3.jpg';
import firImg4 from '../assets/fir4.jpg';
import firImg5 from '../assets/fir5.jpg';
import firImg6 from '../assets/fir6.jpg';
import firImg7 from '../assets/fir7.jpg';
import firImg8 from '../assets/fir8.jpg';
import firImg9 from '../assets/fir9.jpg';
import firImg10 from '../assets/fir10.jpg';

// Данные карточек с реальными картинками для каждого класса
// ВАЖНО: classKey соответствует тому, что приходит из модели
const CLASS_CARDS = {
  spruce: {  // СОСНА
    title: "🌲 Сосна (Pinus)",
    color: "#2E7D32",
    cards: [
      { id: 1, name: "Сосна обыкновенная в бору", image: spruceImg1, description: "Оранжевая кора, длинная хвоя" },
      { id: 2, name: "Сосна кедровая сибирская в тайге", image: spruceImg2, description: "Кедровые орешки, густая крона" },
      { id: 3, name: "Сосна чёрная в парке", image: spruceImg3, description: "Тёмная кора, жёсткая хвоя" },
      { id: 4, name: "Сосна веймутова на опушке", image: spruceImg4, description: "Мягкая голубовато-зелёная хвоя" },
      { id: 5, name: "Сосна горная в Альпах", image: spruceImg5, description: "Стелющаяся форма, небольшая высота" },
      { id: 6, name: "Сосна балканская в горах", image: spruceImg6, description: "Плотная тёмно-зелёная крона" },
      { id: 7, name: "Сосна жёлтая в прерии", image: spruceImg7, description: "Жёлто-коричневая кора, длинная хвоя" },
      { id: 8, name: "Сосна алеппская в Средиземноморье", image: spruceImg8, description: "Светло-зелёная хвоя, засухоустойчивая" },
      { id: 9, name: "Сосна Банкса в Канаде", image: spruceImg9, description: "Искривлённая хвоя, небольшие шишки" },
      { id: 10, name: "Сосна густоцветная в Японии", image: spruceImg10, description: "Мягкая хвоя, красноватая кора" },
    ]
  },
  pine: {    // ПИХТА
    title: "🌲 Пихта (Abies)",
    color: "#4CAF50",
    cards: [
      { id: 1, name: "Пихта белая в Карпатах", image: pineImg1, description: "Мягкая тёмно-зелёная хвоя" },
      { id: 2, name: "Пихта корейская в саду", image: pineImg2, description: "Фиолетовые шишки, серебристая изнанка" },
      { id: 3, name: "Пихта бальзамическая в лесу", image: pineImg3, description: "Ароматная смола, густая крона" },
      { id: 4, name: "Пихта одноцветная в парке", image: pineImg4, description: "Сизо-голубая хвоя, засухоустойчивая" },
      { id: 5, name: "Пихта великая в лесу", image: pineImg5, description: "Очень высокая, плоская хвоя" },
      { id: 6, name: "Пихта Нордманна на Кавказе", image: pineImg6, description: "Тёмно-зелёная блестящая хвоя" },
      { id: 7, name: "Пихта сибирская в тайге", image: pineImg7, description: "Мягкая ароматная хвоя" },
      { id: 8, name: "Пихта Фразера в горах", image: pineImg8, description: "Приподнятые ветви, небольшие шишки" },
      { id: 9, name: "Пихта испанская в Андалусии", image: pineImg9, description: "Короткая жёсткая хвоя" },
      { id: 10, name: "Пихта китайская в Гималаях", image: pineImg10, description: "Пурпурные шишки, декоративная" },
    ]
  },
  fir: {     // ЕЛЬ
    title: "🌲 Ель (Picea)",
    color: "#66BB6A",
    cards: [
      { id: 1, name: "Ель обыкновенная на опушке леса", image: firImg1, description: "Классическая ёлка с густой кроной" },
      { id: 2, name: "Ель колючая голубая в парке", image: firImg2, description: "Голубоватая хвоя, очень декоративная" },
      { id: 3, name: "Ель сербская в горной местности", image: firImg3, description: "Узкая крона, двухцветная хвоя" },
      { id: 4, name: "Ель канадская в городском саду", image: firImg4, description: "Сизо-зелёная хвоя, коническая форма" },
      { id: 5, name: "Ель корейская в ботаническом саду", image: firImg5, description: "Крупные шишки, мягкая хвоя" },
      { id: 6, name: "Ель восточная в лесу", image: firImg6, description: "Короткая блестящая хвоя" },
      { id: 7, name: "Ель ситхинская у ручья", image: firImg7, description: "Самая высокая ель, сизая хвоя" },
      { id: 8, name: "Ель красная в заповеднике", image: firImg8, description: "Красноватая кора и шишки" },
      { id: 9, name: "Ель чёрная на болоте", image: firImg9, description: "Тёмная хвоя, болотистые места" },
      { id: 10, name: "Ель Энгельмана в горах", image: firImg10, description: "Гибкие ветви, голубоватый оттенок" },
    ]
  }
};

const ClassCards = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);

  const toggleClass = (className) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <div className="class-cards-container">
      <h2 className="cards-title">🌲 Каталог хвойных деревьев</h2>
      <p className="cards-subtitle">Коллекция изображений для каждого вида (по 10 карточек)</p>
      
      {Object.entries(CLASS_CARDS).map(([className, classData]) => (
        <div key={className} className="class-section">
          <div 
            className="class-header"
            style={{ borderLeftColor: classData.color }}
            onClick={() => toggleClass(className)}
          >
            <div className="class-header-left">
              <span className="class-dot" style={{ backgroundColor: classData.color }}></span>
              <h3 className="class-title">{classData.title}</h3>
              <span className="card-count">({classData.cards.length} карточек)</span>
            </div>
            <span className={`expand-icon ${expandedClass === className ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          
          <div className={`cards-grid ${expandedClass === className ? 'expanded' : ''}`}>
            {expandedClass === className && classData.cards.map((card) => (
              <div 
                key={card.id} 
                className="card-item"
                onClick={() => setSelectedImage(card)}
              >
                <div className="card-image-wrapper">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <span>🔍</span>
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-name">{card.name}</div>
                  <div className="card-description">{card.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Модальное окно для увеличенного изображения */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.image} alt={selectedImage.name} />
            <div className="modal-info">
              <h4>{selectedImage.name}</h4>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// В конце файла ClassCards.js, перед export default
export { CLASS_CARDS };
export default ClassCards;