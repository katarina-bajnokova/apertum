import { useState } from "react";
import { addItem, updateItem, deleteItem } from "../storage/spaces";
import "./SetEditor.scss";

export default function SetEditor({ spaceId, set, onBack, onItemsChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  function handleAdd() {
    if (newFront.trim() && newBack.trim()) {
      addItem(spaceId, set.id, newFront, newBack);
      setNewFront("");
      setNewBack("");
      setIsAdding(false);
      onItemsChange();
    }
  }

  function handleUpdate(itemId) {
    if (editFront.trim() && editBack.trim()) {
      updateItem(spaceId, set.id, itemId, editFront, editBack);
      setEditingId(null);
      setEditFront("");
      setEditBack("");
      onItemsChange();
    }
  }

  function handleDelete(itemId) {
    if (confirm("Delete this item?")) {
      deleteItem(spaceId, set.id, itemId);
      onItemsChange();
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditFront(item.front);
    setEditBack(item.back);
  }

  return (
    <div className="set-editor">
      <div className="set-editor__header">
        <button className="set-editor__back" onClick={onBack}>
          ← Back
        </button>
        <h2 className="set-editor__title">{set.name}</h2>
        {!isAdding && (
          <button
            className="set-editor__btn set-editor__btn--small"
            onClick={() => setIsAdding(true)}
          >
            + Add Item
          </button>
        )}
      </div>

      {isAdding && (
        <div className="set-editor__form">
          <div className="set-editor__field">
            <label className="set-editor__label">Front (prompt)</label>
            <input
              type="text"
              className="set-editor__input"
              placeholder="e.g., Bonjour"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              autoFocus
            />
          </div>
          <div className="set-editor__field">
            <label className="set-editor__label">Back (answer)</label>
            <input
              type="text"
              className="set-editor__input"
              placeholder="e.g., Hello"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
            />
          </div>
          <div className="set-editor__actions">
            <button
              className="set-editor__btn set-editor__btn--primary"
              onClick={handleAdd}
            >
              Add
            </button>
            <button
              className="set-editor__btn"
              onClick={() => {
                setIsAdding(false);
                setNewFront("");
                setNewBack("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {set.items.length === 0 && !isAdding && (
        <p className="set-editor__empty">
          No items yet. Add your first learning item.
        </p>
      )}

      <div className="set-editor__items">
        {set.items.map((item) => (
          <div key={item.id} className="item-card">
            {editingId === item.id ? (
              <div className="item-card__edit">
                <div className="set-editor__field">
                  <label className="set-editor__label">Front</label>
                  <input
                    type="text"
                    className="set-editor__input"
                    value={editFront}
                    onChange={(e) => setEditFront(e.target.value)}
                  />
                </div>
                <div className="set-editor__field">
                  <label className="set-editor__label">Back</label>
                  <input
                    type="text"
                    className="set-editor__input"
                    value={editBack}
                    onChange={(e) => setEditBack(e.target.value)}
                  />
                </div>
                <div className="set-editor__actions">
                  <button
                    className="set-editor__btn set-editor__btn--small"
                    onClick={() => handleUpdate(item.id)}
                  >
                    Save
                  </button>
                  <button
                    className="set-editor__btn set-editor__btn--small"
                    onClick={() => {
                      setEditingId(null);
                      setEditFront("");
                      setEditBack("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="item-card__content">
                  <div className="item-card__side">
                    <span className="item-card__label">Front</span>
                    <p className="item-card__text">{item.front}</p>
                  </div>
                  <div className="item-card__side">
                    <span className="item-card__label">Back</span>
                    <p className="item-card__text">{item.back}</p>
                  </div>
                </div>
                <div className="item-card__menu">
                  <button
                    className="item-card__menu-btn"
                    onClick={() => startEdit(item)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="item-card__menu-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
