import { useState } from "react";
import { createSet, deleteSet, renameSet } from "../storage/spaces";
import "./SetList.scss";

export default function SetList({ space, onSelectSet, onSetsChange, onBack }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function handleCreate() {
    if (newSetName.trim()) {
      createSet(space.id, newSetName);
      setNewSetName("");
      setIsCreating(false);
      onSetsChange();
    }
  }

  function handleRename(setId) {
    if (editName.trim()) {
      renameSet(space.id, setId, editName);
      setEditingId(null);
      setEditName("");
      onSetsChange();
    }
  }

  function handleDelete(setId) {
    if (confirm("Delete this folder and all its items?")) {
      deleteSet(space.id, setId);
      onSetsChange();
    }
  }

  function startEdit(set) {
    setEditingId(set.id);
    setEditName(set.name);
  }

  return (
    <div className="set-list">
      <div className="set-list__header">
        <div>
          <button className="set-list__back" onClick={onBack}>
            ← Back
          </button>
          <h2 className="set-list__title">{space.name}</h2>
          <p className="set-list__subtitle">
            {space.sets.length} {space.sets.length === 1 ? "folder" : "folders"}
          </p>
        </div>
        {!isCreating && (
          <button
            className="set-list__btn set-list__btn--small"
            onClick={() => setIsCreating(true)}
          >
            + New Folder
          </button>
        )}
      </div>

      {isCreating && (
        <div className="set-list__create">
          <input
            type="text"
            className="set-list__input"
            placeholder="Folder name (e.g., A1 Basics, A2 Intermediate)"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <div className="set-list__actions">
            <button
              className="set-list__btn set-list__btn--primary"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="set-list__btn"
              onClick={() => {
                setIsCreating(false);
                setNewSetName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {space.sets.length === 0 && !isCreating && (
        <p className="set-list__empty">
          No folders yet. Create one to add learning items.
        </p>
      )}

      <div className="set-list__items">
        {space.sets.map((set) => (
          <div key={set.id} className="set-card">
            {editingId === set.id ? (
              <div className="set-card__edit">
                <input
                  type="text"
                  className="set-list__input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(set.id)}
                  autoFocus
                />
                <div className="set-list__actions">
                  <button
                    className="set-list__btn set-list__btn--small"
                    onClick={() => handleRename(set.id)}
                  >
                    Save
                  </button>
                  <button
                    className="set-list__btn set-list__btn--small"
                    onClick={() => {
                      setEditingId(null);
                      setEditName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="set-card__content"
                  onClick={() => onSelectSet(set.id)}
                >
                  <h3 className="set-card__name">{set.name}</h3>
                  <p className="set-card__count">
                    {set.items.length}{" "}
                    {set.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="set-card__menu">
                  <button
                    className="set-card__menu-btn"
                    onClick={() => startEdit(set)}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    className="set-card__menu-btn"
                    onClick={() => handleDelete(set.id)}
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
