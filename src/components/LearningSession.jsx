import { useState } from "react";
import { recordItemResponse } from "../storage/learning";
import "./LearningSession.scss";

export default function LearningSession({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;
  const progress = ((currentIndex + 1) / items.length) * 100;

  function handleReveal() {
    setShowAnswer(true);
  }

  function handleResponse(knew) {
    recordItemResponse(currentItem.setId, currentItem.id, knew);

    if (isLastItem) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  }

  if (!currentItem) {
    return (
      <main className="learning-session">
        <div className="learning-session__empty">
          <h2>No items to review</h2>
          <p>Add some learning items to your sets first.</p>
          <button
            className="learning-session__btn learning-session__btn--primary"
            onClick={onComplete}
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="learning-session">
      <div className="learning-session__progress">
        <div
          className="learning-session__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="learning-session__counter">
        {currentIndex + 1} of {items.length}
      </div>

      <div className="learning-session__card">
        <div className="learning-session__set-label">{currentItem.setName}</div>

        <div className="learning-session__content">
          <div className="learning-session__prompt">{currentItem.front}</div>

          {showAnswer && (
            <div className="learning-session__answer">{currentItem.back}</div>
          )}
        </div>

        {!showAnswer ? (
          <button
            className="learning-session__btn learning-session__btn--primary"
            onClick={handleReveal}
          >
            Reveal answer
          </button>
        ) : (
          <div className="learning-session__actions">
            <button
              className="learning-session__btn learning-session__btn--secondary"
              onClick={() => handleResponse(false)}
            >
              Didn't know
            </button>
            <button
              className="learning-session__btn learning-session__btn--primary"
              onClick={() => handleResponse(true)}
            >
              I knew this
            </button>
          </div>
        )}
      </div>

      <p className="learning-session__hint">
        {showAnswer
          ? "Be honest — it helps you learn better."
          : "Try to recall the answer before revealing."}
      </p>
    </main>
  );
}
