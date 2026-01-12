const KEY = "apertum.dailyState";

// local date key: YYYY-MM-DD
function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getDailyState() {
  const dateKey = todayKey();
  const raw = localStorage.getItem(KEY);

  if (!raw) return { status: "pending", dateKey };

  try {
    const parsed = JSON.parse(raw);

    // new day → reset to pending
    if (parsed.dateKey !== dateKey) return { status: "pending", dateKey };

    return {
      status: parsed.status === "done" ? "done" : "pending",
      dateKey,
    };
  } catch {
    return { status: "pending", dateKey };
  }
}

export function markDoneForToday() {
  const dateKey = todayKey();
  localStorage.setItem(KEY, JSON.stringify({ status: "done", dateKey }));
}

export function resetForToday() {
  const dateKey = todayKey();
  localStorage.setItem(KEY, JSON.stringify({ status: "pending", dateKey }));
}
