import { getAllSpaces } from "./spaces";

// Get all items from all spaces for generating choices
export function getAllItemsForChoices() {
  const spaces = getAllSpaces();
  const allItems = [];

  spaces.forEach((space) => {
    space.sets.forEach((set) => {
      set.items.forEach((item) => {
        allItems.push({
          ...item,
          setId: set.id,
          setName: set.name,
          spaceName: space.name,
        });
      });
    });
  });

  return allItems;
}

// Get a random item for review
export function getNextReviewItem() {
  const allItems = getAllItemsForChoices();

  if (allItems.length === 0) return null;

  // Return random item
  const randomIndex = Math.floor(Math.random() * allItems.length);
  return allItems[randomIndex];
}
