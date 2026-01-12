import { useState } from "react";
import { createSpace, deleteSpace, renameSpace } from "../storage/spaces";
import "./SpaceList.scss";

export default function SpaceList({ spaces, onSelectSpace, onSpacesChange }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function handleCreate() {
    if (newSpaceName.trim()) {
      createSpace(newSpaceName);
      setNewSpaceName("");
      setIsCreating(false);
      onSpacesChange();
    }
  }

  function handleRename(spaceId) {
    if (editName.trim()) {
      renameSpace(spaceId, editName);
      setEditingId(null);
      setEditName("");
      onSpacesChange();
    }
  }

  function handleDelete(spaceId) {
    if (confirm("Delete this space and all its folders?")) {
      deleteSpace(spaceId);
      onSpacesChange();
    }
  }

  function startEdit(space) {
    setEditingId(space.id);
    setEditName(space.name);
  }

  const totalSets = spaces.reduce((sum, space) => sum + space.sets.length, 0);
  const totalItems = spaces.reduce(
    (sum, space) =>
      sum + space.sets.reduce((setSum, set) => setSum + set.items.length, 0),
    0
  );

  return (
    <div className="space-list">
      <div className="space-list__header">
        <div>
          <h2 className="space-list__title">Learning Spaces</h2>
          <p className="space-list__subtitle">
            {totalSets} folders · {totalItems} items
          </p>
        </div>
        {!isCreating && (
          <button
            className="space-list__btn space-list__btn--small"
            onClick={() => setIsCreating(true)}
          >
            + New Space
          </button>
        )}
      </div>

      {isCreating && (
        <div className="space-list__create">
          <input
            type="text"
            className="space-list__input"
            placeholder="Space name (e.g., French, UX Concepts)"
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <div className="space-list__actions">
            <button
              className="space-list__btn space-list__btn--primary"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="space-list__btn"
              onClick={() => {
                setIsCreating(false);
                setNewSpaceName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {spaces.length === 0 && !isCreating && (
        <p className="space-list__empty">
          No spaces yet. Create one to organize your learning.
        </p>
      )}

      <div className="space-list__items">
        {spaces.map((space) => (
          <div key={space.id} className="space-card">
            {editingId === space.id ? (
              <div className="space-card__edit">
                <input
                  type="text"
                  className="space-list__input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(space.id)}
                  autoFocus
                />
                <div className="space-list__actions">
                  <button
                    className="space-list__btn space-list__btn--small"
                    onClick={() => handleRename(space.id)}
                  >
                    Save
                  </button>
                  <button
                    className="space-list__btn space-list__btn--small"
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
                  className="space-card__content"
                  onClick={() => onSelectSpace(space.id)}
                >
                  <h3 className="space-card__name">{space.name}</h3>
                  <p className="space-card__count">
                    {space.sets.length}{" "}
                    {space.sets.length === 1 ? "folder" : "folders"}
                  </p>
                </div>
                <div className="space-card__menu">
                  <button
                    className="space-card__menu-btn"
                    onClick={() => startEdit(space)}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    className="space-card__menu-btn"
                    onClick={() => handleDelete(space.id)}
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
