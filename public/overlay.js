(function () {
  console.log("Apertum: overlay.js loaded on", location.href);

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Apertum: Message received:", message);
    if (message.action === "showQuestion") {
      showQuestionModal(message.item, message.choices);
    }
  });

  function showQuestionModal(item, choices) {
    console.log("Apertum: Showing modal for", item);

    // Remove any existing overlay
    const existing = document.querySelector(".apertum-overlay-modal");
    if (existing) existing.remove();

    // Build overlay with guaranteed visibility
    const overlay = document.createElement("div");
    overlay.className = "apertum-overlay-modal";
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:2147483647;display:flex;align-items:center;justify-content:center;";

    const modal = document.createElement("div");
    modal.className = "apertum-modal-card";
    modal.style.cssText =
      "background:#fff;padding:32px;border-radius:16px;max-width:500px;box-shadow:0 8px 32px rgba(0,0,0,0.3);";

    const setLabel = document.createElement("div");
    setLabel.className = "apertum-set-label";
    setLabel.textContent = item.setName;
    setLabel.style.cssText = "color:#666;font-size:14px;margin-bottom:12px;";

    const prompt = document.createElement("div");
    prompt.className = "apertum-prompt";
    prompt.textContent = item.front;
    prompt.style.cssText =
      "font-size:20px;font-weight:bold;margin-bottom:24px;color:#000;";

    const choicesContainer = document.createElement("div");
    choicesContainer.className = "apertum-choices";
    choicesContainer.style.cssText =
      "display:flex;flex-direction:column;gap:12px;";

    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "apertum-choice";
      btn.textContent = choice;
      btn.style.cssText =
        "padding:16px;border:2px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:16px;transition:all 0.2s;";
      btn.onmouseover = () => (btn.style.background = "#f0f0f0");
      btn.onmouseout = () => (btn.style.background = "#fff");
      btn.addEventListener("click", () => handleAnswer(choice));
      choicesContainer.appendChild(btn);
    });

    modal.appendChild(setLabel);
    modal.appendChild(prompt);
    modal.appendChild(choicesContainer);
    overlay.appendChild(modal);
    document.documentElement.appendChild(overlay);

    function handleAnswer(answer) {
      const isCorrect = answer === item.back;

      if (isCorrect) {
        overlay.remove();
      } else {
        choicesContainer.innerHTML = `
          <div class="apertum-result" style="text-align:center;">
            <div class="apertum-feedback incorrect" style="color:#e74c3c;font-size:18px;margin-bottom:16px;">✗ Not quite</div>
            <div class="apertum-answer-box" style="background:#f8f9fa;padding:16px;border-radius:8px;">
              <div class="apertum-answer-label" style="color:#666;margin-bottom:8px;">Correct answer:</div>
              <div class="apertum-answer-text" style="font-weight:bold;font-size:18px;">${item.back}</div>
            </div>
            <button onclick="this.closest('.apertum-overlay-modal').remove()" style="margin-top:16px;padding:12px 24px;background:#007bff;color:#fff;border:none;border-radius:8px;cursor:pointer;">OK</button>
          </div>
        `;
      }
    }
  }
})();
