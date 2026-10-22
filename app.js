
"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const $ = id => document.getElementById(id);
const KEY = "patience-studio-v1";
const W = 1000, H = 700;

const state = {
  tool: "select",
  color: "#e8e4db",
  wallColor: "#f1eee7",
  floorColor: "#fbfaf7",
  grid: true,
  items: [],
  strokes: [],
  walls: [],
  selected: null,
  drawing: null,
  wallStart: null,
  drag: null,
  history: [],
  future: [],
  nextId: 1
};

function notify(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => el.classList.remove("show"), 2000);
}

function snapshot() {
  return JSON.stringify({
    items: state.items,
    strokes: state.strokes,
    walls: state.walls,
    wallColor: state.wallColor,
    floorColor: state.floorColor,
    nextId: state.nextId
  });
}

function remember() {
  state.history.push(snapshot());
  if (state.history.length > 40) state.history.shift();
  state.future = [];
  updateHistory();
}

function updateHistory() {
  $("undoBtn").disabled = !state.history.length;
  $("redoBtn").disabled = !state.future.length;
}

function restore(data) {
  const s = JSON.parse(data);
  state.items = s.items || [];
  state.strokes = s.strokes || [];
  state.walls = s.walls || [];
  state.wallColor = s.wallColor || "#f1eee7";
  state.floorColor = s.floorColor || "#fbfaf7";
  state.nextId = s.nextId || 1;
  state.selected = null;
  render();
  updateHistory();
  save();
}

function undo() {
  if (!state.history.length) return;
  state.future.push(snapshot());
  restore(state.history.pop());
  notify("Undo");
}

function redo() {
  if (!state.future.length) return;
  state.history.push(snapshot());
  restore(state.future.pop());
  notify("Redo");
}

function save() {
  const name = $("projectName").value.trim() || "Untitled project";
  $("projectTitle").textContent = name;

  const data = {
    name,
    items: state.items,
    strokes: state.strokes,
    walls: state.walls,
    wallColor: state.wallColor,
    floorColor: state.floorColor,
    nextId: state.nextId
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    $("saveStatus").textContent = "● Saved locally";
  } catch (error) {
    $("saveStatus").textContent = "Storage full";
    notify("Storage full. Export your design to keep a copy.");
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);

    $("projectName").value = d.name || "A space of your own";
    state.items = d.items || [];
    state.strokes = d.strokes || [];
    state.walls = d.walls || [];
    state.wallColor = d.wallColor || state.wallColor;
    state.floorColor = d.floorColor || state.floorColor;
    state.nextId = d.nextId || 1;
    $("projectTitle").textContent = $("projectName").value;
  } catch (error) {
    console.warn("Saved project could not be loaded", error);
  }
}

function roundedRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawItem(o) {
  const selected = o.id === state.selected;
  ctx.save();
  ctx.translate(o.x + o.w / 2, o.y + o.h / 2);
  ctx.rotate((o.rotation || 0) * Math.PI / 180);

  const x = -o.w / 2, y = -o.h / 2;
  const w = o.w, h = o.h;
  ctx.fillStyle = o.color;
  ctx.strokeStyle = "#879182";
  ctx.lineWidth = 2;

  if (o.type === "sofa") {
    roundedRect(x, y, w, h, 8, true, true);
    ctx.beginPath();
    ctx.moveTo(x + 5, y + h * .53);
    ctx.lineTo(x + w - 5, y + h * .53);
    ctx.moveTo(0, y + 4);
    ctx.lineTo(0, y + h * .53);
    ctx.stroke();
  }

  if (o.type === "bed") {
    ctx.strokeStyle = "#b5a38e";
    roundedRect(x, y, w, h, 5, true, true);
    ctx.fillStyle = "#fffefa";
    roundedRect(x + 7, y + 7, w * .35, h * .17, 3, true, false);
    roundedRect(x + w * .58, y + 7, w * .35, h * .17, 3, true, false);
    ctx.beginPath();
    ctx.moveTo(x + 4, y + h * .32);
    ctx.lineTo(x + w - 4, y + h * .32);
    ctx.stroke();
  }

  if (o.type === "table") {
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (o.type === "chair") {
    roundedRect(x, y, w, h, 5, true, true);
    ctx.beginPath();
    ctx.moveTo(x + 4, y + h * .65);
    ctx.lineTo(x + w - 4, y + h * .65);
    ctx.stroke();
  }

  if (o.type === "plant") {
    ctx.fillStyle = "#879b7e";
    ctx.strokeStyle = "#6e8267";
    ctx.beginPath();
    ctx.arc(0, -h * .12, Math.min(w, h) * .26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-w * .15, -h * .23, w * .14, h * .22, -.5, 0, Math.PI * 2);
    ctx.ellipse(w * .15, -h * .25, w * .14, h * .22, .5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#c5b39c";
    ctx.fillRect(-w * .18, h * .1, w * .36, h * .28);
  }

  if (o.type === "rug") {
    ctx.strokeStyle = "#b5a592";
    ctx.setLineDash([5, 4]);
    roundedRect(x, y, w, h, 4, true, true);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h / 3);
    ctx.lineTo(x + w - 10, y + h / 3);
    ctx.moveTo(x + 10, y + h * 2 / 3);
    ctx.lineTo(x + w - 10, y + h * 2 / 3);
    ctx.stroke();
  }

  if (selected) {
    ctx.strokeStyle = "#526b50";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(x - 5, y - 5, w + 10, h + 10);
    ctx.setLineDash([]);
    ctx.fillStyle = "#526b50";
    ctx.fillRect(x + w - 5, y + h - 5, 10, 10);
  }

  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = state.floorColor;
  ctx.fillRect(0, 0, W, H);

  if (state.grid) {
    ctx.strokeStyle = "rgba(125,140,122,.13)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  // Base room boundary
  ctx.fillStyle = state.wallColor;
  ctx.fillRect(95, 75, 810, 550);
  ctx.strokeStyle = "#a9aea3";
  ctx.lineWidth = 8;
  ctx.strokeRect(95, 75, 810, 550);
  ctx.strokeStyle = "#d5d7ce";
  ctx.lineWidth = 1;
  ctx.strokeRect(107, 87, 786, 526);

  state.walls.forEach(w => {
    ctx.strokeStyle = w.color;
    ctx.lineWidth = w.width;
    ctx.beginPath();
    ctx.moveTo(w.x1, w.y1);
    ctx.lineTo(w.x2, w.y2);
    ctx.stroke();
  });

  state.strokes.forEach(s => {
    if (!s.points.length) return;
    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    s.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.restore();
  });

  state.items.forEach(drawItem);

  $("hint").classList.toggle(
    "hidden",
    state.items.length + state.strokes.length + state.walls.length > 0
  );
}

function pointFromEvent(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * W / r.width,
    y: (e.clientY - r.top) * H / r.height
  };
}

function itemAt(p) {
  for (let i = state.items.length - 1; i >= 0; i--) {
    const o = state.items[i];
    if (p.x >= o.x && p.x <= o.x + o.w &&
        p.y >= o.y && p.y <= o.y + o.h) return o;
  }
  return null;
}

function setTool(tool) {
  state.tool = tool;
  document.querySelectorAll("[data-tool]").forEach(b =>
    b.classList.toggle("active", b.dataset.tool === tool)
  );
  const labels = {
    select: "· Select and move",
    draw: "· Freehand sketch",
    erase: "· Eraser",
    wall: "· Draw walls"
  };
  $("toolLabel").textContent = labels[tool];
  canvas.style.cursor = tool === "select" ? "default" : "crosshair";
}

function addItem(type) {
  const dimensions = {
    sofa: [155, 78], bed: [145, 175], table: [86, 68],
    chair: [70, 75], plant: [54, 60], rug: [190, 125]
  };
  remember();
  const [w, h] = dimensions[type];
  const item = {
    id: state.nextId++, type,
    x: W / 2 - w / 2, y: H / 2 - h / 2,
    w, h, rotation: 0, color: state.color
  };
  state.items.push(item);
  state.selected = item.id;
  render();
  save();
  notify(type[0].toUpperCase() + type.slice(1) + " added");
}

let downPoint = null;

canvas.addEventListener("pointerdown", e => {
  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);
  const p = pointFromEvent(e);
  downPoint = p;

  if (state.tool === "draw" || state.tool === "erase") {
    remember();
    state.drawing = {
      points: [p],
      color: state.color,
      width: state.tool === "erase" ? 25 : 4,
      erase: state.tool === "erase"
    };
    state.strokes.push(state.drawing);
    render();
    return;
  }

  if (state.tool === "wall") {
    state.wallStart = p;
    return;
  }

  const item = itemAt(p);
  if (!item) {
    state.selected = null;
    state.drag = null;
    render();
    return;
  }

  state.selected = item.id;
  remember();
  state.drag = {
    id: item.id, start: p, moved: false,
    x: item.x, y: item.y, w: item.w, h: item.h,
    resize: p.x > item.x + item.w - 13 && p.y > item.y + item.h - 13
  };
  render();
});

canvas.addEventListener("pointermove", e => {
  const p = pointFromEvent(e);

  if (state.drawing) {
    state.drawing.points.push(p);
    render();
    return;
  }

  if (!state.drag) return;
  const o = state.items.find(i => i.id === state.drag.id);
  if (!o) return;

  const dx = p.x - state.drag.start.x;
  const dy = p.y - state.drag.start.y;
  if (Math.abs(dx) + Math.abs(dy) > 2) state.drag.moved = true;

  if (state.drag.resize) {
    o.w = Math.max(35, state.drag.w + dx);
    o.h = Math.max(35, state.drag.h + dy);
  } else {
    o.x = state.drag.x + dx;
    o.y = state.drag.y + dy;
  }
  render();
});

function finishPointer(e) {
  if (state.drawing) {
    state.drawing = null;
    save();
    return;
  }

  if (state.wallStart) {
    const p = pointFromEvent(e);
    if (Math.hypot(p.x - state.wallStart.x, p.y - state.wallStart.y) > 8) {
      remember();
      state.walls.push({
        x1: state.wallStart.x, y1: state.wallStart.y,
        x2: p.x, y2: p.y, color: state.color, width: 6
      });
      save();
    }
    state.wallStart = null;
    render();
    return;
  }

  if (state.drag) {
    if (state.drag.moved) save();
    state.drag = null;
  }
}

canvas.addEventListener("pointerup", finishPointer);
canvas.addEventListener("pointercancel", finishPointer);

document.querySelectorAll("[data-tool]").forEach(b =>
  b.addEventListener("click", () => setTool(b.dataset.tool))
);

document.querySelectorAll("[data-item]").forEach(b =>
  b.addEventListener("click", () => addItem(b.dataset.item))
);

document.querySelectorAll("[data-color]").forEach(b => {
  b.addEventListener("click", () => {
    state.color = b.dataset.color;
    $("customColor").value = state.color;
    document.querySelectorAll(".swatch").forEach(s =>
      s.classList.toggle("selected", s === b)
    );

    const item = state.items.find(o => o.id === state.selected);
    if (item) {
      remember();
      item.color = state.color;
      render();
      save();
    }
  });
});

$("customColor").addEventListener("input", e => {
  state.color = e.target.value;
  document.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
});

$("paintWall").addEventListener("click", () => {
  remember();
  state.wallColor = state.color;
  render(); save(); notify("Wall colour updated");
});

$("paintFloor").addEventListener("click", () => {
  remember();
  state.floorColor = state.color;
  render(); save(); notify("Floor colour updated");
});

$("undoBtn").addEventListener("click", undo);
$("redoBtn").addEventListener("click", redo);

$("gridBtn").addEventListener("click", () => {
  state.grid = !state.grid;
  $("gridBtn").textContent = "Grid: " + (state.grid ? "On" : "Off");
  $("canvasWrap").classList.toggle("no-grid", !state.grid);
  render();
});

$("projectName").addEventListener("input", save);

$("exportBtn").addEventListener("click", () => {
  const previous = state.selected;
  state.selected = null;
  render();
  const link = document.createElement("a");
  link.download = ($("projectName").value || "patience-design")
    .trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  state.selected = previous;
  render();
  notify("Design exported as PNG");
});

$("newBtn").addEventListener("click", () => {
  if (!confirm("Start a new design? Export your current design first if you want to keep an image.")) return;
  remember();
  state.items = [];
  state.strokes = [];
  state.walls = [];
  state.selected = null;
  state.wallColor = "#f1eee7";
  state.floorColor = "#fbfaf7";
  $("projectName").value = "Untitled interior";
  save(); render(); notify("New design started");
});

$("challengeBtn").addEventListener("click", () => $("challenge").showModal());
$("closeChallenge").addEventListener("click", () => $("challenge").close());
$("startChallenge").addEventListener("click", () => {
  $("challenge").close();
  notify("Challenge: create a calm reading corner");
});

window.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    e.shiftKey ? redo() : undo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault(); redo();
  }
  if ((e.key === "Delete" || e.key === "Backspace") && state.selected) {
    remember();
    state.items = state.items.filter(o => o.id !== state.selected);
    state.selected = null;
    render(); save(); notify("Furniture removed");
  }
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}

load();
render();
updateHistory();
