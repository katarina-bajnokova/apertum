import { getAllSets } from "./sets";

const SESSION_SIZE = 5; // Number of items per daily session

// Get random items from all sets for daily session
export function getDailySessionItems() {
  const sets = getAllSets();
  const allItems = [];

  // Collect all items with their set information
  sets.forEach((set) => {
    set.items.forEach((item) => {
      allItems.push({
        ...item,
        setId: set.id,
        setName: set.name,
      });
    });
  });

  // If no items, return empty array
  if (allItems.length === 0) return [];

  // Shuffle and take SESSION_SIZE items (or all if fewer)
  const shuffled = allItems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));
}

// Check if user has any items to review
export function hasItemsToReview() {
  const sets = getAllSets();
  const totalItems = sets.reduce((sum, set) => sum + set.items.length, 0);
  return totalItems > 0;
}

// Simple spaced repetition logic (for future enhancement)
// For MVP, we just rotate through items randomly
export function recordItemResponse(setId, itemId, knew) {
  // For MVP, we don't track responses yet
  // In the future, this could update last_reviewed, difficulty, etc.
  console.log(
    `Item ${itemId} from set ${setId}: ${knew ? "knew" : "didn't know"}`
  );
}
