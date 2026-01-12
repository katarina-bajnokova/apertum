import { useEffect, useState } from "react";
import {
  IoChevronBack,
  IoClose,
  IoTrashOutline,
  IoAdd,
  IoBookOutline,
  IoChevronForward,
  IoFolderOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import "./AppSimple.scss";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState("home"); // home, topic, category, addTopic, addCategory, addItem, settings
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemFront, setNewItemFront] = useState("");
  const [newItemBack, setNewItemBack] = useState("");
  const [newItemGroup, setNewItemGroup] = useState("");
  const [reminderInterval, setReminderInterval] = useState(10); // Default 10 minutes
  const [reminderEnabled, setReminderEnabled] = useState(true); // Default enabled
  const [practiceSelection, setPracticeSelection] = useState({ mode: "all" }); // { mode: "all" | "specific", setIds: [], groupNames: [] }
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: null,
    id: null,
    name: null,
  });

  useEffect(() => {
    loadTopics();
    loadSettings();
  }, []);

  async function loadTopics() {
    const result = await chrome.storage.local.get("apertum.spaces");
    const spaces = result["apertum.spaces"] || [];
    setTopics(spaces);
  }

  async function loadSettings() {
    const result = await chrome.storage.local.get([
      "apertum.reminderInterval",
      "apertum.reminderEnabled",
      "apertum.practiceSelection",
    ]);
    const interval = result["apertum.reminderInterval"] || 10;
    const enabled = result["apertum.reminderEnabled"] !== false; // Default true
    const selection = result["apertum.practiceSelection"] || { mode: "all" };
    setReminderInterval(interval);
    setReminderEnabled(enabled);
    setPracticeSelection(selection);
  }

  async function handleIntervalChange(newInterval) {
    setReminderInterval(newInterval);
    await chrome.storage.local.set({ "apertum.reminderInterval": newInterval });
    // Notify background script to update the alarm
    chrome.runtime.sendMessage({
      type: "UPDATE_INTERVAL",
      interval: newInterval,
    });
  }

  async function handleToggleReminder(enabled) {
    setReminderEnabled(enabled);
    await chrome.storage.local.set({ "apertum.reminderEnabled": enabled });
    // Notify background script
    chrome.runtime.sendMessage({ type: "TOGGLE_REMINDER", enabled: enabled });
  }

  async function handlePracticeSelectionChange(newSelection) {
    setPracticeSelection(newSelection);
    await chrome.storage.local.set({
      "apertum.practiceSelection": newSelection,
    });
  }

  function handleAddTopicClick() {
    setView("addTopic");
  }

  async function handleSaveNewTopic(e) {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      sets: [],
    };

    const updated = [...topics, newTopic];
    await chrome.storage.local.set({ "apertum.spaces": updated });
    setTopics(updated);

    setNewTopicName("");
    setView("home");
  }

  function handleCancelAddTopic() {
    setNewTopicName("");
    setView("home");
  }

  async function handleDeleteTopic(e, topicId) {
    e.stopPropagation();
    const topic = topics.find((t) => t.id === topicId);
    setDeleteModal({
      show: true,
      type: "topic",
      id: topicId,
      name: topic?.name,
      onConfirm: async () => {
        const updated = topics.filter((t) => t.id !== topicId);
        await chrome.storage.local.set({ "apertum.spaces": updated });
        setTopics(updated);
        setDeleteModal({ show: false, type: null, id: null, name: null });
        if (view === "topic") {
          handleBackToHome();
        }
      },
    });
  }

  function handleOpenTopic(topicId) {
    setSelectedTopicId(topicId);
    setView("topic");
  }

  function handleBackToHome() {
    setSelectedTopicId(null);
    setView("home");
    loadTopics();
  }

  function handleAddItemClick() {
    setView("addItem");
  }

  async function handleSaveNewItem(e) {
    e.preventDefault();
    if (!newItemFront.trim() || !newItemBack.trim()) return;

    const updated = topics.map((topic) => {
      if (topic.id === selectedTopicId) {
        const newItem = {
          id: Date.now().toString(),
          front: newItemFront.trim(),
          back: newItemBack.trim(),
          group: newItemGroup.trim() || "General",
        };

        // Add to first set or create a default set
        const sets =
          topic.sets.length > 0
            ? topic.sets.map((set, idx) =>
                idx === 0
                  ? { ...set, items: [...(set.items || []), newItem] }
                  : set
              )
            : [
                {
                  id: Date.now().toString(),
                  name: "Main",
                  items: [newItem],
                },
              ];

        return { ...topic, sets };
      }
      return topic;
    });

    await chrome.storage.local.set({ "apertum.spaces": updated });
    setTopics(updated);
    setNewItemFront("");
    setNewItemBack("");
    // Keep group if in category view, otherwise clear
    if (!selectedCategoryName) {
      setNewItemGroup("");
    }
    setView(selectedCategoryName ? "category" : "topic");
  }

  function handleCancelAddItem() {
    setNewItemFront("");
    setNewItemBack("");
    if (!selectedCategoryName) {
      setNewItemGroup("");
    }
    setView(selectedCategoryName ? "category" : "topic");
  }

  async function handleDeleteItem(itemId) {
    // Find the item to get its name for the modal
    const selectedTopic = topics.find((t) => t.id === selectedTopicId);
    const allTopicItems = selectedTopic
      ? selectedTopic.sets.flatMap((set) => set.items || [])
      : [];
    const item = allTopicItems.find((i) => i.id === itemId);

    setDeleteModal({
      show: true,
      type: "item",
      id: itemId,
      name: item?.front,
      onConfirm: async () => {
        const updated = topics.map((topic) => {
          if (topic.id === selectedTopicId) {
            return {
              ...topic,
              sets: topic.sets.map((set) => ({
                ...set,
                items: (set.items || []).filter((item) => item.id !== itemId),
              })),
            };
          }
          return topic;
        });

        await chrome.storage.local.set({ "apertum.spaces": updated });
        setTopics(updated);
        setDeleteModal({ show: false, type: null, id: null, name: null });
      },
    });
  }

  async function handleDeleteGroup(groupName) {
    setDeleteModal({
      show: true,
      type: "category",
      id: groupName,
      name: groupName,
      onConfirm: async () => {
        const updated = topics.map((topic) => {
          if (topic.id === selectedTopicId) {
            return {
              ...topic,
              sets: topic.sets.map((set) => ({
                ...set,
                items: (set.items || []).filter(
                  (item) => (item.group || "General") !== groupName
                ),
              })),
            };
          }
          return topic;
        });

        await chrome.storage.local.set({ "apertum.spaces": updated });
        setTopics(updated);
        setDeleteModal({ show: false, type: null, id: null, name: null });
        if (view === "category") {
          setSelectedCategoryName(null);
          setView("topic");
        }
      },
    });
  }

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  const allItems = selectedTopic
    ? selectedTopic.sets.flatMap((set) => set.items || [])
    : [];

  // Group items by their group/category
  const itemsByGroup = allItems.reduce((acc, item) => {
    const group = item.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const categoryItems = selectedCategoryName
    ? itemsByGroup[selectedCategoryName] || []
    : [];

  // Add category view
  if (view === "addCategory") {
    return (
      <main className="apertum-simple">
        <button className="back-button" onClick={() => setView("topic")}>
          <IoChevronBack />
        </button>

        <h1 className="page-title">Create new category</h1>
        <p className="page-subtitle">
          Organize your words into meaningful groups
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newCategoryName.trim()) return;
            setNewItemGroup(newCategoryName.trim());
            setNewCategoryName("");
            setView("addItem");
          }}
        >
          <input
            type="text"
            className="topic-input"
            placeholder="e.g., Greetings, Verbs, Numbers..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="add-button-large">
            Continue
          </button>
        </form>
      </main>
    );
  }

  // Category detail view - Items in category
  if (view === "category" && selectedTopic && selectedCategoryName) {
    return (
      <main className="apertum-simple">
        <button
          className="back-button"
          onClick={() => {
            setSelectedCategoryName(null);
            setView("topic");
          }}
        >
          <IoChevronBack />
        </button>

        <div className="set-header">
          <div className="set-header-left">
            <h1 className="page-title">{selectedCategoryName}</h1>
            <p className="set-metadata">
              {categoryItems.length}{" "}
              {categoryItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            className="text-link-danger"
            onClick={() => handleDeleteGroup(selectedCategoryName)}
          >
            Delete category
          </button>
        </div>

        <button
          className="add-button-large"
          onClick={() => {
            setNewItemGroup(selectedCategoryName);
            setView("addItem");
          }}
        >
          <IoAdd /> Add words
        </button>

        {categoryItems.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No words yet</p>
            <p className="empty-hint">Add your first word to this category</p>
          </div>
        ) : (
          <div className="items-list">
            {categoryItems.map((item) => (
              <div key={item.id} className="item-card">
                <button
                  className="delete-button-icon"
                  onClick={() => handleDeleteItem(item.id)}
                  title="Delete this note"
                >
                  <IoTrashOutline />
                </button>
                <div className="item-front">{item.front}</div>
                <div className="item-back">{item.back}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  // Add item view
  if (view === "addItem" && selectedTopic) {
    return (
      <main className="apertum-simple">
        <button className="back-button" onClick={handleCancelAddItem}>
          <IoChevronBack />
        </button>

        <h1 className="page-title">Add to {selectedTopic.name}</h1>
        <p className="page-subtitle">
          Create a note with a question and answer, or term and definition.
        </p>

        <form onSubmit={handleSaveNewItem}>
          <input
            type="text"
            className="topic-input"
            placeholder="Question or term..."
            value={newItemFront}
            onChange={(e) => setNewItemFront(e.target.value)}
            autoFocus
          />
          <textarea
            className="topic-input textarea"
            placeholder="Answer or definition..."
            value={newItemBack}
            onChange={(e) => setNewItemBack(e.target.value)}
            rows="4"
          />
          {!selectedCategoryName && (
            <>
              <input
                type="text"
                className="topic-input"
                placeholder="Group (optional) - e.g., Chapter 1, Basics, Week 2..."
                value={newItemGroup}
                onChange={(e) => setNewItemGroup(e.target.value)}
              />
              <p className="group-hint">
                Notes in the same group will be shown together
              </p>
            </>
          )}
          <button type="submit" className="add-button-large">
            Save
          </button>
        </form>
      </main>
    );
  }

  // Add topic view
  if (view === "addTopic") {
    return (
      <main className="apertum-simple">
        <button className="back-button" onClick={handleCancelAddTopic}>
          <IoChevronBack />
        </button>

        <h1 className="page-title">What are you learning?</h1>
        <p className="page-subtitle">
          This could be a language, a skill, or any topic you want to remember.
        </p>

        <form onSubmit={handleSaveNewTopic}>
          <input
            type="text"
            className="topic-input"
            placeholder="e.g., French, Cooking, Design..."
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="add-button-large">
            Save
          </button>
        </form>
      </main>
    );
  }

  // Settings view
  if (view === "settings") {
    const intervalOptions = [
      { value: 5, label: "5 minutes" },
      { value: 10, label: "10 minutes" },
      { value: 15, label: "15 minutes" },
      { value: 30, label: "30 minutes" },
      { value: 60, label: "1 hour" },
      { value: 180, label: "3 hours" },
      { value: 720, label: "12 hours" },
      { value: 1440, label: "24 hours" },
    ];

    return (
      <main className="apertum-simple">
        <button className="back-button" onClick={() => setView("home")}>
          <IoChevronBack />
        </button>

        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Customize how often you want to be reminded to practice
        </p>

        <div className="settings-section">
          <div className="settings-toggle-row">
            <div>
              <h3 className="settings-label">Enable Reminders</h3>
              <p className="settings-description">
                Show practice questions at regular intervals
              </p>
            </div>
            <button
              className={`toggle-switch ${reminderEnabled ? "active" : ""}`}
              onClick={() => handleToggleReminder(!reminderEnabled)}
            >
              <div className="toggle-slider" />
            </button>
          </div>
        </div>

        {reminderEnabled && (
          <div className="settings-section">
            <h3 className="settings-label">Reminder Interval</h3>
            <div className="interval-options">
              {intervalOptions.map((option) => (
                <button
                  key={option.value}
                  className={`interval-option ${
                    reminderInterval === option.value ? "active" : ""
                  }`}
                  onClick={() => handleIntervalChange(option.value)}
                >
                  <div className="interval-radio">
                    {reminderInterval === option.value && (
                      <div className="interval-radio-dot" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {reminderEnabled && (
          <div className="settings-section">
            <h3 className="settings-label">Practice From</h3>
            <p className="settings-description">
              Choose which sets or categories to practice
            </p>

            <div className="practice-selection">
              <button
                className={`practice-option ${
                  practiceSelection.mode === "all" ? "active" : ""
                }`}
                onClick={() => handlePracticeSelectionChange({ mode: "all" })}
              >
                <div className="practice-checkbox">
                  {practiceSelection.mode === "all" && (
                    <div className="practice-check">✓</div>
                  )}
                </div>
                <span>All Sets</span>
              </button>

              {topics.length > 0 && (
                <>
                  <div className="practice-divider">or choose specific:</div>
                  {topics.map((topic) => {
                    const allGroups = [
                      ...new Set(
                        topic.sets.flatMap((set) =>
                          set.items.map((item) => item.group)
                        )
                      ),
                    ];

                    return (
                      <div key={topic.id} className="practice-topic-group">
                        <div className="practice-topic-name">{topic.name}</div>
                        {allGroups.map((group) => {
                          const isSelected =
                            practiceSelection.mode === "specific" &&
                            practiceSelection.setIds?.includes(topic.id) &&
                            practiceSelection.groupNames?.includes(group);

                          return (
                            <button
                              key={`${topic.id}-${group}`}
                              className={`practice-option practice-option-sub ${
                                isSelected ? "active" : ""
                              }`}
                              onClick={() => {
                                if (practiceSelection.mode === "all") {
                                  handlePracticeSelectionChange({
                                    mode: "specific",
                                    setIds: [topic.id],
                                    groupNames: [group],
                                  });
                                } else {
                                  const setIds = practiceSelection.setIds || [];
                                  const groupNames =
                                    practiceSelection.groupNames || [];

                                  if (isSelected) {
                                    // Remove
                                    const newSetIds = setIds.filter(
                                      (id) =>
                                        id !== topic.id ||
                                        !groupNames.includes(group)
                                    );
                                    const newGroupNames = groupNames.filter(
                                      (g) =>
                                        g !== group ||
                                        !setIds.includes(topic.id)
                                    );

                                    handlePracticeSelectionChange(
                                      newSetIds.length === 0
                                        ? { mode: "all" }
                                        : {
                                            mode: "specific",
                                            setIds: newSetIds,
                                            groupNames: newGroupNames,
                                          }
                                    );
                                  } else {
                                    // Add
                                    handlePracticeSelectionChange({
                                      mode: "specific",
                                      setIds: [
                                        ...new Set([...setIds, topic.id]),
                                      ],
                                      groupNames: [
                                        ...new Set([...groupNames, group]),
                                      ],
                                    });
                                  }
                                }
                              }}
                            >
                              <div className="practice-checkbox">
                                {isSelected && (
                                  <div className="practice-check">✓</div>
                                )}
                              </div>
                              <span>{group}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    );
  }

  // Topic detail view - Category grid
  if (view === "topic" && selectedTopic) {
    const categories = Object.entries(itemsByGroup).map(([name, items]) => ({
      name,
      itemCount: items.length,
    }));

    return (
      <main className="apertum-simple">
        <div className="set-header">
          <div className="set-header-left">
            <button className="text-link" onClick={handleBackToHome}>
              <IoChevronBack />
            </button>
            <h1 className="page-title">{selectedTopic.name}</h1>
            <p className="set-metadata">
              {allItems.length} {allItems.length === 1 ? "item" : "items"} ·{" "}
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </p>
          </div>
          <button
            className="text-link-danger"
            onClick={(e) => handleDeleteTopic(e, selectedTopic.id)}
          >
            Delete set
          </button>
        </div>

        <button
          className="create-category-button"
          onClick={() => setView("addCategory")}
        >
          <IoAdd /> Create new category
        </button>

        {categories.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No categories yet</p>
            <p className="empty-hint">
              Create a category to organize your words
            </p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategoryName(category.name);
                  setView("category");
                }}
                className="category-card"
              >
                <div className="category-icon">
                  <IoFolderOutline />
                </div>
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-count">
                    {category.itemCount}{" "}
                    {category.itemCount === 1 ? "card" : "cards"}
                  </p>
                </div>
                <IoChevronForward className="category-arrow" />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    );
  }

  // Home view - Library
  const totalItems = topics.reduce(
    (sum, topic) =>
      sum +
      topic.sets.reduce((setSum, set) => setSum + (set.items?.length || 0), 0),
    0
  );
  const activeSets = topics.length;

  return (
    <main className="apertum-library">
      <div className="library-header">
        <div className="library-logo">
          <img src="/icon-140.svg" alt="apertum" className="library-logo-img" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="library-title">Your Library</h1>
          <p className="library-subtitle">
            Manage your learning content and practice sets
          </p>
        </motion.div>
        <button
          className="settings-icon-button"
          onClick={() => setView("settings")}
        >
          <IoSettingsOutline />
        </button>
      </div>

      {/* Create new set card */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleAddTopicClick}
        className="create-set-card"
      >
        <div className="create-set-icon">
          <IoAdd />
        </div>
        <div className="create-set-content">
          <p className="create-set-title">Create new set</p>
          <p className="create-set-description">
            Add flashcards, vocabulary, or study notes
          </p>
        </div>
      </motion.button>

      {/* Learning sets list */}
      {topics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="empty-library"
        >
          <p className="empty-message">Your library is empty</p>
          <p className="empty-hint">Create your first set to start learning</p>
        </motion.div>
      ) : (
        <div className="library-sets">
          {topics.map((topic, index) => {
            const itemCount = topic.sets.reduce(
              (sum, set) => sum + (set.items?.length || 0),
              0
            );

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenTopic(topic.id)}
                className="library-set-card"
              >
                <div className="set-card-icon">
                  <IoBookOutline />
                </div>
                <div className="set-card-content">
                  <h3 className="set-card-title">{topic.name}</h3>
                  <p className="set-card-description">
                    {itemCount === 0
                      ? "No items yet"
                      : itemCount === 1
                      ? "1 item"
                      : `${itemCount} items`}
                  </p>
                  <div className="set-card-meta">
                    <span>{itemCount} items</span>
                  </div>
                </div>
                <div className="set-card-actions">
                  <button
                    className="set-delete-button"
                    onClick={(e) => handleDeleteTopic(e, topic.id)}
                    title="Delete this set"
                  >
                    <IoClose />
                  </button>
                  <IoChevronForward className="set-card-arrow" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats footer */}
      {topics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="library-stats"
        >
          <div className="stat-item">
            <p className="stat-value">{totalItems}</p>
            <p className="stat-label">Total items</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">{activeSets}</p>
            <p className="stat-label">Active sets</p>
          </div>
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal.show && (
        <div
          className="modal-overlay"
          onClick={() =>
            setDeleteModal({ show: false, type: null, id: null, name: null })
          }
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              {deleteModal.type === "topic" && "Delete set?"}
              {deleteModal.type === "category" && "Delete category?"}
              {deleteModal.type === "item" && "Delete item?"}
            </h2>
            <p className="modal-message">
              {deleteModal.type === "topic" &&
                `Are you sure you want to delete "${deleteModal.name}"? This will remove all categories and items inside it.`}
              {deleteModal.type === "category" &&
                `Are you sure you want to delete all items in "${deleteModal.name}"?`}
              {deleteModal.type === "item" &&
                `Are you sure you want to delete "${deleteModal.name}"?`}
            </p>
            <div className="modal-actions">
              <button
                className="modal-button modal-button-cancel"
                onClick={() =>
                  setDeleteModal({
                    show: false,
                    type: null,
                    id: null,
                    name: null,
                  })
                }
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-danger"
                onClick={deleteModal.onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
