
"use strict";

const $ = id => document.getElementById(id);
const SAVE_KEY = "patience-love-room-v1";

const items = [
  { type: "bed", name: "Dream Bed", emoji: "🛏️" },
  { type: "flowers", name: "Flowers", emoji: "💐" },
  { type: "heart", name: "Heart Pillow", emoji: "💗" },
  { type: "rug", name: "Soft Rug", emoji: "🟣" },
  { type: "plant", name: "Little Plant", emoji: "🪴" },
  { type: "lights", name: "Fairy Lights", emoji: "✨" },
  { type: "sofa", name: "Cosy Sofa", emoji: "🛋️" },
  { type: "candles", name: "Candles", emoji: "🕯️" },
  { type: "teddy", name: "Teddy Bear", emoji: "🧸" }
];

const rooms = [
  {
    name: "A cosy beginning",
    icon: "🛏️",
    roomName: "Dream Bedroom",
    description: "Make a sweet little bedroom with a few lovely decorations.",
    goal: "Create a cosy bedroom",
    goalText: "Add a bed, flowers and a heart decoration.",
    required: ["bed", "flowers", "heart"],
    messageTitle: "For you, Patience",
    message: "Every beautiful thing begins with a little love. Keep creating your dream space. ♡"
  },
  {
    name: "A little love lounge",
    icon: "🛋️",
    roomName: "The Cosy Lounge",
    description: "Create a warm place to relax and dream.",
    goal: "Make a lovely lounge",
    goalText: "Add a sofa, a soft rug and a plant.",
    required: ["sofa", "rug", "plant"],
    messageTitle: "You deserve comfort",
    message: "May your life always have a soft place to land, reasons to smile and love surrounding you. ♡"
  },
  {
    name: "A romantic evening",
    icon: "✨",
    roomName: "Our Romantic Retreat",
    description: "Add a little sparkle and make this room feel magical.",
    goal: "Create a romantic retreat",
    goalText: "Add fairy lights, flowers and candles.",
    required: ["lights", "flowers", "candles"],
    messageTitle: "A little surprise for you",
    message: "If I could design a perfect place, I would fill it with warmth, laughter, beautiful dreams and moments that make you smile. This little room is for you, Patience. ♡"
  }
];

const positions = [
  [50, 65], [27, 57], [70, 66], [50, 82], [83, 70],
  [50, 23], [65, 67], [35, 71], [57, 59]
];

function freshState() {
  return { room: 0, hearts: 0, completed: [], placed: [], seen: [] };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || typeof saved !== "object") return freshState();
    return {
      room: Math.max(0, Math.min(rooms.length - 1, Number(saved.room) || 0)),
      hearts: Math.max(0, Number(saved.hearts) || 0),
      completed: Array.isArray(saved.completed) ? saved.completed.filter(n => Number.isInteger(n) && n >= 0 && n < rooms.length) : [],
      placed: Array.isArray(saved.placed) ? saved.placed.filter(x => x && items.some(i => i.type === x.type) && Number.isFinite(x.x) && Number.isFinite(x.y)) : [],
      seen: Array.isArray(saved.seen) ? saved.seen.filter(n => Number.isInteger(n) && n >= 0 && n < rooms.length) : []
    };
  } catch {
    return freshState();
  }
}

let state = load();
let toastTimeout;
let modalAction = null;

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    notify("Your browser couldn't save progress.");
  }
}

function currentRoom() {
  return rooms[state.room];
}

function itemInfo(type) {
  return items.find(item => item.type === type);
}

function count(type) {
  return state.placed.filter(item => item.type === type).length;
}

function completedGoal() {
  return currentRoom().required.every(type => count(type) > 0);
}

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2100);
}

function render() {
  $("hearts").textContent = state.hearts;
  $("level").textContent = `ROOM ${state.room + 1} OF ${rooms.length}`;
  $("roomNumber").textContent = String(state.room + 1).padStart(2, "0");
  $("missionIcon").textContent = currentRoom().icon;
  $("missionTitle").textContent = currentRoom().name;
  $("missionText").textContent = currentRoom().description;
  $("goalTitle").textContent = currentRoom().goal;
  $("goalText").textContent = currentRoom().goalText;
  $("loveTitle").textContent = currentRoom().messageTitle;
  $("loveMessage").textContent = currentRoom().message;

  renderDecorations();
  renderShop();
  renderProgress();

  const done = state.completed.includes(state.room);
  const last = state.room === rooms.length - 1;
  $("nextRoom").disabled = !done;
  $("nextRoom").textContent = !done
    ? "Complete your room to continue ♡"
    : last ? "You've completed every room! ♡" : "Visit the next room →";

  $("roomMood").textContent = state.placed.length
    ? "Looking lovely already! ♡"
    : "A blank room, full of possibilities.";

  save();
}

function renderDecorations() {
  const container = $("decorations");
  container.replaceChildren();

  state.placed.forEach((placed, index) => {
    const info = itemInfo(placed.type);
    if (!info) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "decoration";
    button.dataset.type = placed.type;
    button.style.left = `${placed.x}%`;
    button.style.top = `${placed.y}%`;
    button.setAttribute("aria-label", `${info.name}. Tap to remove.`);
    button.title = "Tap to remove this decoration";

    const emoji = document.createElement("div");
    emoji.className = "item-emoji";
    emoji.textContent = info.emoji;
    const label = document.createElement("span");
    label.textContent = info.name;

    button.append(emoji, label);
    button.addEventListener("click", () => {
      state.placed.splice(index, 1);
      render();
      notify(`${info.name} removed. Tap below to add it again.`);
    });
    container.append(button);
  });
}

function renderShop() {
  const container = $("decorGrid");
  container.replaceChildren();

  items.forEach(info => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "decor-option";
    button.setAttribute("aria-label", `Add ${info.name}`);

    const emoji = document.createElement("span");
    emoji.className = "emoji";
    emoji.textContent = info.emoji;

    const name = document.createElement("strong");
    name.textContent = info.name;

    const hint = document.createElement("small");
    hint.textContent = "Tap to add ♡";

    button.append(emoji, name, hint);
    button.addEventListener("click", () => addItem(info.type));
    container.append(button);
  });
}

function renderProgress() {
  const required = currentRoom().required;
  const done = required.filter(type => count(type) > 0).length;
  $("progressBar").style.width = `${done / required.length * 100}%`;
  $("progressText").textContent = `${done} of ${required.length} decorations`;

  const isComplete = done === required.length;
  $("nextRoom").disabled = !isComplete && !state.completed.includes(state.room);
}

function addItem(type) {
  const info = itemInfo(type);
  if (!info) return;

  if (state.completed.includes(state.room)) {
    notify("This room is complete! You can still decorate it. ♡");
  }

  const position = positions[state.placed.length % positions.length];
  state.placed.push({
    type,
    x: position[0],
    y: position[1]
  });

  render();
  notify(`${info.emoji} ${info.name} added with love!`);

  if (completedGoal() && !state.completed.includes(state.room)) {
    completeRoom();
  }
}

function completeRoom() {
  const roomIndex = state.room;
  if (state.completed.includes(roomIndex)) return;

  state.completed.push(roomIndex);
  state.hearts += 3;
  save();
  render();

  $("winTitle").textContent = roomIndex === rooms.length - 1
    ? "You made every room lovely!"
    : "Your room is beautiful!";

  $("winMessage").textContent = roomIndex === rooms.length - 1
    ? "You've completed all three rooms. Thank you for filling this little world with love. ♡"
    : "You earned 3 hearts! Your next romantic room is ready whenever you are.";

  $("winButton").textContent = roomIndex === rooms.length - 1
    ? "Enjoy your dream home ♡"
    : "Continue to the next room →";

  modalAction = roomIndex < rooms.length - 1 ? "next" : "finish";
  $("winModal").classList.remove("hidden");
}

function continueRoom() {
  $("winModal").classList.add("hidden");

  if (modalAction === "next" && state.room < rooms.length - 1) {
    state.room += 1;
    state.placed = [];
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    notify(`Welcome to ${currentRoom().roomName} ♡`);
  } else {
    render();
    notify("Thank you for playing, Patience. Sending you a little love! 💗");
  }
  modalAction = null;
}

function clearRoom() {
  if (!state.placed.length) {
    notify("Your room is already empty.");
    return;
  }
  state.placed = [];
  render();
  notify("A fresh start. Let's decorate again! ♡");
}

function restartGame() {
  if (!window.confirm("Start the whole game again? Your hearts and room progress will be reset.")) return;
  state = freshState();
  $("winModal").classList.add("hidden");
  render();
  notify("A new little love story begins. ♡");
}

$("clearRoom").addEventListener("click", clearRoom);
$("nextRoom").addEventListener("click", () => {
  if (state.completed.includes(state.room)) {
    if (state.room < rooms.length - 1) {
      state.room += 1;
      state.placed = [];
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      notify("You completed every room. Beautifully done! ♡");
    }
  }
});
$("resetGame").addEventListener("click", restartGame);
$("winButton").addEventListener("click", continueRoom);

render();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
