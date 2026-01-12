const SPACES_KEY = "apertum.spaces";
const INIT_KEY = "apertum.initialized";

// Initialize with hardcoded French example data
function initializeDefaultData() {
  const isInitialized = localStorage.getItem(INIT_KEY);
  if (isInitialized) return;

  const frenchSpace = {
    id: "space-french-1",
    name: "French",
    sets: [
      {
        id: "set-a1-1",
        name: "A1",
        items: [
          { id: "1", front: "hello", back: "bonjour" },
          { id: "2", front: "goodbye", back: "au revoir" },
          { id: "3", front: "please", back: "s'il vous plaît" },
          { id: "4", front: "thank you", back: "merci" },
          { id: "5", front: "yes", back: "oui" },
          { id: "6", front: "no", back: "non" },
          { id: "7", front: "excuse me", back: "excusez-moi" },
          { id: "8", front: "sorry", back: "désolé" },
          { id: "9", front: "I", back: "je" },
          { id: "10", front: "you", back: "tu" },
          { id: "11", front: "he", back: "il" },
          { id: "12", front: "she", back: "elle" },
          { id: "13", front: "we", back: "nous" },
          { id: "14", front: "they", back: "ils" },
          { id: "15", front: "to be", back: "être" },
          { id: "16", front: "to have", back: "avoir" },
          { id: "17", front: "to do", back: "faire" },
          { id: "18", front: "to go", back: "aller" },
          { id: "19", front: "to come", back: "venir" },
          { id: "20", front: "to want", back: "vouloir" },
          { id: "21", front: "to eat", back: "manger" },
          { id: "22", front: "to drink", back: "boire" },
          { id: "23", front: "to see", back: "voir" },
          { id: "24", front: "to know", back: "savoir" },
          { id: "25", front: "good", back: "bon" },
          { id: "26", front: "bad", back: "mauvais" },
          { id: "27", front: "big", back: "grand" },
          { id: "28", front: "small", back: "petit" },
          { id: "29", front: "water", back: "eau" },
          { id: "30", front: "bread", back: "pain" },
          { id: "31", front: "house", back: "maison" },
          { id: "32", front: "day", back: "jour" },
          { id: "33", front: "night", back: "nuit" },
          { id: "34", front: "time", back: "temps" },
          { id: "35", front: "man", back: "homme" },
          { id: "36", front: "woman", back: "femme" },
          { id: "37", front: "child", back: "enfant" },
          { id: "38", front: "friend", back: "ami" },
          { id: "39", front: "today", back: "aujourd'hui" },
          { id: "40", front: "tomorrow", back: "demain" },
          { id: "41", front: "yesterday", back: "hier" },
          { id: "42", front: "here", back: "ici" },
          { id: "43", front: "there", back: "là" },
          { id: "44", front: "now", back: "maintenant" },
          { id: "45", front: "very", back: "très" },
          { id: "46", front: "much", back: "beaucoup" },
          { id: "47", front: "little", back: "peu" },
          { id: "48", front: "more", back: "plus" },
          { id: "49", front: "less", back: "moins" },
          { id: "50", front: "when", back: "quand" },
        ],
      },
      {
        id: "set-a2-1",
        name: "A2",
        items: [
          { id: "51", front: "to understand", back: "comprendre" },
          { id: "52", front: "to speak", back: "parler" },
          { id: "53", front: "to listen", back: "écouter" },
          { id: "54", front: "to read", back: "lire" },
          { id: "55", front: "to write", back: "écrire" },
          { id: "56", front: "to learn", back: "apprendre" },
          { id: "57", front: "to teach", back: "enseigner" },
          { id: "58", front: "to work", back: "travailler" },
          { id: "59", front: "to live", back: "vivre" },
          { id: "60", front: "to love", back: "aimer" },
          { id: "61", front: "to think", back: "penser" },
          { id: "62", front: "to believe", back: "croire" },
          { id: "63", front: "to take", back: "prendre" },
          { id: "64", front: "to give", back: "donner" },
          { id: "65", front: "to find", back: "trouver" },
          { id: "66", front: "to search", back: "chercher" },
          { id: "67", front: "to ask", back: "demander" },
          { id: "68", front: "to answer", back: "répondre" },
          { id: "69", front: "to open", back: "ouvrir" },
          { id: "70", front: "to close", back: "fermer" },
          { id: "71", front: "to begin", back: "commencer" },
          { id: "72", front: "to finish", back: "finir" },
          { id: "73", front: "to help", back: "aider" },
          { id: "74", front: "to wait", back: "attendre" },
          { id: "75", front: "to leave", back: "partir" },
          { id: "76", front: "to arrive", back: "arriver" },
          { id: "77", front: "to return", back: "retourner" },
          { id: "78", front: "to stay", back: "rester" },
          { id: "79", front: "beautiful", back: "beau" },
          { id: "80", front: "new", back: "nouveau" },
          { id: "81", front: "old", back: "vieux" },
          { id: "82", front: "young", back: "jeune" },
          { id: "83", front: "happy", back: "heureux" },
          { id: "84", front: "sad", back: "triste" },
          { id: "85", front: "easy", back: "facile" },
          { id: "86", front: "difficult", back: "difficile" },
          { id: "87", front: "important", back: "important" },
          { id: "88", front: "possible", back: "possible" },
          { id: "89", front: "necessary", back: "nécessaire" },
          { id: "90", front: "money", back: "argent" },
          { id: "91", front: "car", back: "voiture" },
          { id: "92", front: "street", back: "rue" },
          { id: "93", front: "city", back: "ville" },
          { id: "94", front: "country", back: "pays" },
          { id: "95", front: "world", back: "monde" },
          { id: "96", front: "life", back: "vie" },
          { id: "97", front: "work", back: "travail" },
          { id: "98", front: "school", back: "école" },
          { id: "99", front: "book", back: "livre" },
          { id: "100", front: "door", back: "porte" },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(SPACES_KEY, JSON.stringify([frenchSpace]));
  localStorage.setItem(INIT_KEY, "true");
}

// Get all spaces
export function getAllSpaces() {
  initializeDefaultData();

  const raw = localStorage.getItem(SPACES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save all spaces
function saveSpaces(spaces) {
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
}

// Create a new space
export function createSpace(name) {
  const spaces = getAllSpaces();
  const newSpace = {
    id: Date.now().toString(),
    name: name.trim(),
    sets: [],
    createdAt: new Date().toISOString(),
  };

  spaces.push(newSpace);
  saveSpaces(spaces);
  return newSpace;
}

// Rename space
export function renameSpace(spaceId, newName) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    space.name = newName.trim();
    saveSpaces(spaces);
  }
}

// Delete a space
export function deleteSpace(spaceId) {
  const spaces = getAllSpaces();
  const filtered = spaces.filter((s) => s.id !== spaceId);
  saveSpaces(filtered);
}

// Get a specific space
export function getSpace(spaceId) {
  const spaces = getAllSpaces();
  return spaces.find((s) => s.id === spaceId);
}

// Get all sets (flattened, for backward compatibility)
export function getAllSets() {
  const spaces = getAllSpaces();
  const allSets = [];

  spaces.forEach((space) => {
    space.sets.forEach((set) => {
      allSets.push({
        ...set,
        spaceId: space.id,
        spaceName: space.name,
      });
    });
  });

  return allSets;
}

// Create a new set within a space
export function createSet(spaceId, name) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    const newSet = {
      id: Date.now().toString(),
      name: name.trim(),
      items: [],
      createdAt: new Date().toISOString(),
    };

    space.sets.push(newSet);
    saveSpaces(spaces);
    return newSet;
  }
}

// Rename set
export function renameSet(spaceId, setId, newName) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    const set = space.sets.find((s) => s.id === setId);
    if (set) {
      set.name = newName.trim();
      saveSpaces(spaces);
    }
  }
}

// Delete a set
export function deleteSet(spaceId, setId) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    space.sets = space.sets.filter((s) => s.id !== setId);
    saveSpaces(spaces);
  }
}

// Get a specific set
export function getSet(spaceId, setId) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    return space.sets.find((s) => s.id === setId);
  }
  return null;
}

// Add item to set
export function addItem(spaceId, setId, front, back) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    const set = space.sets.find((s) => s.id === setId);

    if (set) {
      const newItem = {
        id: Date.now().toString(),
        front: front.trim(),
        back: back.trim(),
        createdAt: new Date().toISOString(),
      };

      set.items.push(newItem);
      saveSpaces(spaces);
      return newItem;
    }
  }
}

// Update an item
export function updateItem(spaceId, setId, itemId, front, back) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    const set = space.sets.find((s) => s.id === setId);

    if (set) {
      const item = set.items.find((i) => i.id === itemId);
      if (item) {
        item.front = front.trim();
        item.back = back.trim();
        saveSpaces(spaces);
      }
    }
  }
}

// Delete an item
export function deleteItem(spaceId, setId, itemId) {
  const spaces = getAllSpaces();
  const space = spaces.find((s) => s.id === spaceId);

  if (space) {
    const set = space.sets.find((s) => s.id === setId);

    if (set) {
      set.items = set.items.filter((i) => i.id !== itemId);
      saveSpaces(spaces);
    }
  }
}

// Get total item count across all sets
export function getTotalItemCount() {
  const sets = getAllSets();
  return sets.reduce((total, set) => total + set.items.length, 0);
}
