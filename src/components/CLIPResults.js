import React, { useState } from 'react';
import './CLIPResults.css';

const CLIPResults = ({ matches, isLoading, onClose }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  if (isLoading) {
    return (
      <div className="clip-results-container">
        <div className="clip-header">
          <h3>🔍 Анализ изображения</h3>
          <button className="clip-close" onClick={onClose}>✕</button>
        </div>
        <div className="clip-loading">
          <div className="clip-spinner"></div>
          <p>Анализ найденных деревьев...</p>
        </div>
      </div>
    );
  }
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  return (
    <div className="clip-results-container">
      <div className="clip-header">
        <h3>🌲 Результаты анализа</h3>
        <p className="clip-subtitle">Найденные деревья и похожие виды из коллекции</p>
        <button className="clip-close" onClick={onClose}>✕</button>
      </div>
      
      <div className="clip-matches-list">
        {matches.map((match, idx) => (
          <div key={idx} className="clip-match-group">
            <div className="match-group-header">
              <span className="match-icon">🌲</span>
              <span className="match-label">
                Найденное дерево #{idx + 1}: 
                <strong style={{ color: match.classColor }}>
                  {match.classNameRu}
                </strong>
              </span>
            </div>
            
            <div className="similar-cards">
              {match.topMatches.map((card, cardIdx) => (
                <div 
                  key={cardIdx}
                  className="similar-card"
                  onClick={() => setSelectedMatch(card)}
                >
                  <div className="similar-card-image">
                    {card.image ? (
                      <img src={card.image} alt={card.name} />
                    ) : (
                      <div className="no-image">🌲</div>
                    )}
                    <div className="similarity-badge">
                      {(card.similarity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="similar-card-info">
                    <div className="similar-card-name">{card.name || 'Дерево'}</div>
                    <div className="similar-card-desc">{card.description || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {selectedMatch && (
        <div className="clip-modal" onClick={() => setSelectedMatch(null)}>
          <div className="clip-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="clip-modal-close" onClick={() => setSelectedMatch(null)}>✕</button>
            {selectedMatch.image ? (
              <img src={selectedMatch.image} alt={selectedMatch.name} />
            ) : (
              <div className="no-image-large">🌲</div>
            )}
            <div className="clip-modal-info">
              <h4>{selectedMatch.name || 'Дерево'}</h4>
              <p>{selectedMatch.description || ''}</p>
              <div className="clip-modal-similarity">
                Сходство: {(selectedMatch.similarity * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CLIPResults;