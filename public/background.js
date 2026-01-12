// Handle extension icon click to open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Initialize test data
async function initTestData() {
  const result = await chrome.storage.local.get("apertum.spaces");
  if (!result["apertum.spaces"]) {
    const testData = [
      {
        id: "test-space-1",
        name: "Test Space",
        sets: [
          {
            id: "test-set-1",
            name: "Sample Questions",
            items: [
              {
                id: "1",
                front: "What is the capital of France?",
                back: "Paris",
              },
              { id: "2", front: "What is 2 + 2?", back: "4" },
              { id: "3", front: "What color is the sky?", back: "Blue" },
              { id: "4", front: "How many continents are there?", back: "7" },
            ],
          },
        ],
      },
    ];
    await chrome.storage.local.set({ "apertum.spaces": testData });
  }
}

async function getAllItems() {
  const result = await chrome.storage.local.get("apertum.spaces");
  const spaces = result["apertum.spaces"] || [];
  const allItems = [];
  spaces.forEach((space) => {
    space.sets.forEach((set) => {
      set.items.forEach((item) => {
        allItems.push({ ...item, setName: set.name, spaceName: space.name });
      });
    });
  });
  return allItems;
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

let currentQuestion = null;

// Set up alarm
chrome.runtime.onInstalled.addListener(() => {
  console.log("Apertum: Extension installed, creating alarm");
  initTestData();
  chrome.alarms.create("showQuestion", {
    delayInMinutes: 1,
    periodInMinutes: 1,
  });
});

// Handle alarm - inject script and show overlay
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("Apertum: Alarm fired", alarm.name);
  if (alarm.name === "showQuestion") {
    const items = await getAllItems();
    if (items.length === 0) return;

    const item = getRandomItem(items);

    // Get wrong answers
    const wrongAnswers = items
      .filter((i) => i.id !== item.id && i.back !== item.back)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((i) => i.back);

    const choices = [item.back, ...wrongAnswers].sort(
      () => Math.random() - 0.5
    );

    // Get active tab
    const tabs = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const tab = tabs[0];
    console.log("Apertum: Active tab", tab);

    if (!tab || !tab.id) {
      console.log("Apertum: No valid tab found");
      return;
    }

    if (
      tab.url?.startsWith("chrome://") ||
      tab.url?.startsWith("edge://") ||
      tab.url?.startsWith("about:")
    ) {
      console.log("Apertum: Skipping - browser internal page");
      return;
    }

    try {
      console.log("Apertum: Injecting script into tab", tab.id);

      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["overlay.js"],
      });

      console.log("Apertum: Injecting CSS");
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["overlay.css"],
      });

      console.log("Apertum: Waiting 100ms before sending message");
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("Apertum: Sending message with data");
      // Now send the message with the question data
      await chrome.tabs.sendMessage(tab.id, {
        action: "showQuestion",
        item: item,
        choices: choices,
      });

      console.log("Apertum: Message sent successfully");
    } catch (error) {
      console.error("Apertum: Error:", error);
    }
  }
});
