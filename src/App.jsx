import { useEffect, useMemo, useState } from "react";
import "./App.scss";
import {
  getDailyState,
  markDoneForToday,
  resetForToday,
} from "./storage/dailyState";
import { isOnboardingComplete } from "./storage/onboarding";
import { getAllSpaces, getSpace, getSet, getAllSets } from "./storage/spaces";
import { getDailySessionItems, hasItemsToReview } from "./storage/learning";
import Onboarding from "./components/Onboarding";
import SpaceList from "./components/SpaceList";
import SetList from "./components/SetList";
import SetEditor from "./components/SetEditor";
import LearningSession from "./components/LearningSession";
import QuickReview from "./components/QuickReview";

export default function App() {
  const [state, setState] = useState({ status: "pending", dateKey: "" });
  const [showOnboarding, setShowOnboarding] = useState(!isOnboardingComplete());
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [inSession, setInSession] = useState(false);
  const [sessionItems, setSessionItems] = useState([]);

  useEffect(() => {
    setState(getDailyState());
    setSpaces(getAllSpaces());
  }, []);

  const isDone = useMemo(() => state.status === "done", [state.status]);
  const selectedSpace = selectedSpaceId ? getSpace(selectedSpaceId) : null;
  const selectedSet =
    selectedSpaceId && selectedSetId
      ? getSet(selectedSpaceId, selectedSetId)
      : null;

  function handleStartSession() {
    if (!hasItemsToReview()) {
      // No items to review - just mark done and show spaces
      markDoneForToday();
      setState(getDailyState());
      return;
    }

    const items = getDailySessionItems();
    setSessionItems(items);
    setInSession(true);
  }

  function handleSessionComplete() {
    markDoneForToday();
    setState(getDailyState());
    setInSession(false);
    setSessionItems([]);
  }

  function handleReset() {
    resetForToday();
    setState(getDailyState());
  }

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  function refreshSpaces() {
    setSpaces(getAllSpaces());
  }

  function handleSelectSpace(spaceId) {
    setSelectedSpaceId(spaceId);
  }

  function handleSelectSet(setId) {
    setSelectedSetId(setId);
  }

  function handleBackToSpaces() {
    setSelectedSpaceId(null);
    setSelectedSetId(null);
    refreshSpaces();
  }

  function handleBackToSets() {
    setSelectedSetId(null);
    refreshSpaces();
  }

  // Show onboarding first if not completed
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show learning session if in progress
  if (inSession) {
    return (
      <LearningSession
        items={sessionItems}
        onComplete={handleSessionComplete}
      />
    );
  }

  // Show set editor if a set is selected
  if (selectedSet && selectedSpaceId) {
    return (
      <SetEditor
        spaceId={selectedSpaceId}
        set={selectedSet}
        onBack={handleBackToSets}
        onItemsChange={refreshSpaces}
      />
    );
  }

  // Show set list if a space is selected
  if (selectedSpace) {
    return (
      <main className="apertum">
        <SetList
          space={selectedSpace}
          onSelectSet={handleSelectSet}
          onSetsChange={refreshSpaces}
          onBack={handleBackToSpaces}
        />
      </main>
    );
  }

  // Show space list with optional quick review modal
  return (
    <main className="apertum">
      <div className="apertum__logo" aria-hidden="true">
        <span className="apertum__wordmark">apertum</span>
      </div>

      <SpaceList
        spaces={spaces}
        onSelectSpace={handleSelectSpace}
        onSpacesChange={refreshSpaces}
      />

      <button className="apertum__reset" onClick={handleReset}>
        Reset daily (dev)
      </button>
    </main>
  );
}
