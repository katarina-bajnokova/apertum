import { useState } from "react";
import { markOnboardingComplete } from "../storage/onboarding";
import "./Onboarding.scss";

export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(1);

  function handleContinue() {
    if (screen === 1) {
      setScreen(2);
    } else {
      markOnboardingComplete();
      onComplete();
    }
  }

  return (
    <main className="onboarding">
      <div className="onboarding__container">
        {screen === 1 ? (
          <>
            <h1 className="onboarding__headline">
              A brief interruption, once per day
            </h1>
            <p className="onboarding__text">
              Apertum will claim your attention for about five seconds before
              you continue browsing.
              <br />
              You don't need to remember — it happens automatically.
            </p>
            <button
              className="onboarding__btn onboarding__btn--primary"
              onClick={handleContinue}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <h1 className="onboarding__headline">Before you continue</h1>
            <p className="onboarding__text">
              Once per day, you'll complete a short learning check-in.
              <br />
              After that, Apertum disappears until tomorrow.
            </p>
            <p className="onboarding__subtext">
              You're always in control — but finishing is easier than avoiding.
            </p>
            <button
              className="onboarding__btn onboarding__btn--primary"
              onClick={handleContinue}
            >
              Get started
            </button>
          </>
        )}
      </div>

      <div className="onboarding__progress">
        <span
          className={`onboarding__dot ${screen === 1 ? "active" : ""}`}
        ></span>
        <span
          className={`onboarding__dot ${screen === 2 ? "active" : ""}`}
        ></span>
      </div>
    </main>
  );
}
