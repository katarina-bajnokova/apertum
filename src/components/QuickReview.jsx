import { useState, useEffect } from "react";
import {
  getNextReviewItem,
  getAllItemsForChoices,
} from "../storage/quickReview";
import "./QuickReview.scss";

export default function QuickReview({ onComplete, onManageSets }) {
  const [item, setItem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadItem();
  }, []);

  function generateChoices(correctItem) {
    const allItems = getAllItemsForChoices();
    const correctAnswer = correctItem.back;

    // Get 3 random wrong answers
    const wrongAnswers = allItems
      .filter((i) => i.id !== correctItem.id && i.back !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((i) => i.back);

    // Combine and shuffle
    const allChoices = [correctAnswer, ...wrongAnswers].sort(
      () => Math.random() - 0.5
    );

    return allChoices;
  }

  function loadItem() {
    const nextItem = getNextReviewItem();
    if (nextItem) {
      setItem(nextItem);
      setChoices(generateChoices(nextItem));
    } else {
      setItem(null);
      setChoices([]);
    }
    setShowResult(false);
    setIsCorrect(false);
  }

  function handleSelectAnswer(answer) {
    if (showResult) return;

    const correct = answer === item.back;
    setIsCorrect(correct);
    setShowResult(true);

    // If correct, close immediately
    if (correct) {
      onComplete();
    }
  }

  if (!item) {
    return (
      <div className="quick-review">
        <div className="quick-review__empty">
          <h2 className="quick-review__empty-title">No learning items yet</h2>
          <p className="quick-review__empty-text">
            Create your first collection to start learning.
          </p>
          <button
            className="quick-review__btn quick-review__btn--primary"
            onClick={onManageSets}
          >
            Create Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-review">
      <div className="quick-review__card">
        <div className="quick-review__set-label">{item.setName}</div>

        <div className="quick-review__prompt">{item.front}</div>

        {!showResult ? (
          <div className="quick-review__choices">
            {choices.map((choice, index) => (
              <button
                key={index}
                className="quick-review__choice"
                onClick={() => handleSelectAnswer(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <div className="quick-review__result">
            <div
              className={`quick-review__feedback ${
                isCorrect ? "correct" : "incorrect"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Not quite"}
            </div>

            {!isCorrect && (
              <div className="quick-review__answer">
                <span className="quick-review__answer-label">
                  Correct answer:
                </span>
                <span className="quick-review__answer-text">{item.back}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button className="quick-review__manage" onClick={onManageSets}>
        Manage Collections
      </button>
    </div>
  );
}
