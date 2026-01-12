const SETS_KEY = "apertum.sets";

// Get all sets
export function getAllSets() {
  const raw = localStorage.getItem(SETS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save all sets
function saveSets(sets) {
  localStorage.setItem(SETS_KEY, JSON.stringify(sets));
}

// Create a new set
export function createSet(name) {
  const sets = getAllSets();
  const newSet = {
    id: Date.now().toString(),
    name: name.trim(),
    items: [],
    createdAt: new Date().toISOString(),
  };

  sets.push(newSet);
  saveSets(sets);
  return newSet;
}

// Update set name
export function renameSet(setId, newName) {
  const sets = getAllSets();
  const set = sets.find((s) => s.id === setId);

  if (set) {
    set.name = newName.trim();
    saveSets(sets);
  }
}

// Delete a set
export function deleteSet(setId) {
  const sets = getAllSets();
  const filtered = sets.filter((s) => s.id !== setId);
  saveSets(filtered);
}

// Get a specific set
export function getSet(setId) {
  const sets = getAllSets();
  return sets.find((s) => s.id === setId);
}

// Add item to set
export function addItem(setId, front, back) {
  const sets = getAllSets();
  const set = sets.find((s) => s.id === setId);

  if (set) {
    const newItem = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      createdAt: new Date().toISOString(),
    };

    set.items.push(newItem);
    saveSets(sets);
    return newItem;
  }
}

// Update an item
export function updateItem(setId, itemId, front, back) {
  const sets = getAllSets();
  const set = sets.find((s) => s.id === setId);

  if (set) {
    const item = set.items.find((i) => i.id === itemId);
    if (item) {
      item.front = front.trim();
      item.back = back.trim();
      saveSets(sets);
    }
  }
}

// Delete an item
export function deleteItem(setId, itemId) {
  const sets = getAllSets();
  const set = sets.find((s) => s.id === setId);

  if (set) {
    set.items = set.items.filter((i) => i.id !== itemId);
    saveSets(sets);
  }
}

// Get total item count across all sets
export function getTotalItemCount() {
  const sets = getAllSets();
  return sets.reduce((total, set) => total + set.items.length, 0);
}
