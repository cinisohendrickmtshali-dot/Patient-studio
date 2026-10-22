
"use strict";

const $ = id => document.getElementById(id);
const SAVE_KEY = "patience-studio-colouring-v1";

const colours = [
  { name: "Rose pink", hex: "#E7A4B4" },
  { name: "Blush", hex: "#F6D8DF" },
  { name: "Hot pink", hex: "#E66D99" },
  { name: "Lavender", hex: "#CDB9E8" },
  { name: "Lilac", hex: "#E9E0F5" },
  { name: "Sage", hex: "#B9CBAE" },
  { name: "Mint", hex: "#D8E9D6" },
  { name: "Forest", hex: "#66836A" },
  { name: "Sky blue", hex: "#BBDCEB" },
  { name: "Ocean", hex: "#709BB9" },
  { name: "Cream", hex: "#FFF0D2" },
  { name: "Ivory", hex: "#F8F3E9" },
  { name: "Sand", hex: "#D8B99A" },
  { name: "Wood", hex: "#B78360" },
  { name: "Terracotta", hex: "#C97961" },
  { name: "Butter yellow", hex: "#F2D781" },
  { name: "Charcoal", hex: "#56545B" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Soft grey", hex: "#D7D9DE" },
  { name: "Black", hex: "#343039" }
];

const rooms = {
  bedroom: {
    title: "The Dream Bedroom",
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 490" role="img" aria-label="Bedroom interior line drawing">
        <rect width="600" height="490" fill="#fffdf9"/>
        <path class="colorable" data-part="back-wall" tabindex="0" aria-label="Back wall" fill="#F8F0E9" d="M55 45 H545 V350 H55 Z"/>
        <path class="colorable" data-part="left-wall" tabindex="0" aria-label="Left wall" fill="#F2E5DE" d="M55 45 L15 80 V380 L55 350 Z"/>
        <path class="colorable" data-part="floor" tabindex="0" aria-label="Floor" fill="#E9D3BD" d="M55 350 H545 L585 390 H15 L55 350 Z"/>
        <path class="colorable" data-part="window" tabindex="0" aria-label="Window" fill="#DDEFF4" d="M92 90 H218 V225 H92 Z"/>
        <path class="colorable" data-part="curtain-left" tabindex="0" aria-label="Left curtain" fill="#E7A4B4" d="M78 78 H111 L105 245 L80 230 Z"/>
        <path class="colorable" data-part="curtain-right" tabindex="0" aria-label="Right curtain" fill="#E7A4B4" d="M203 78 H232 L238 230 L213 245 Z"/>
        <path d="M155 90 V225 M92 157 H218" stroke="#514749" stroke-width="3" fill="none"/>
        <path class="colorable" data-part="picture-frame" tabindex="0" aria-label="Picture frame" fill="#D8B99A" d="M355 88 H448 V168 H355 Z"/>
        <path class="colorable" data-part="picture-art" tabindex="0" aria-label="Picture artwork" fill="#F6D8DF" d="M365 98 H438 V158 H365 Z"/>
        <path d="M401 145 C370 124 390 109 401 125 C412 109 432 124 401 145Z" fill="#A94E70"/>
        <path class="colorable" data-part="bedside-table" tabindex="0" aria-label="Bedside table" fill="#D8B99A" d="M420 260 H500 L510 340 H410 Z"/>
        <path class="colorable" data-part="drawer" tabindex="0" aria-label="Bedside drawer" fill="#F8F3E9" d="M421 280 H495 V310 H421 Z"/>
        <circle cx="458" cy="295" r="3" fill="#514749"/>
        <path class="colorable" data-part="lamp-base" tabindex="0" aria-label="Lamp base" fill="#D8B99A" d="M448 248 H472 L477 264 H443 Z"/>
        <path class="colorable" data-part="lamp-shade" tabindex="0" aria-label="Lamp shade" fill="#F2D781" d="M439 213 H481 L489 246 H431 Z"/>
        <path class="colorable" data-part="rug" tabindex="0" aria-label="Rug" fill="#D9C8EF" d="M112 338 Q300 315 460 340 L486 383 Q294 405 88 382 Z"/>
        <path class="colorable" data-part="bed-frame" tabindex="0" aria-label="Bed frame" fill="#B78360" d="M150 246 H390 L405 350 H136 Z"/>
        <path class="colorable" data-part="mattress" tabindex="0" aria-label="Mattress" fill="#FFF0F3" d="M153 250 H388 L395 329 H145 Z"/>
        <path class="colorable" data-part="headboard" tabindex="0" aria-label="Headboard" fill="#D8B99A" d="M145 220 H390 V260 H145 Z"/>
        <path class="colorable" data-part="pillow-left" tabindex="0" aria-label="Left pillow" fill="#FFFFFF" d="M174 260 Q204 249 232 265 L228 292 H176 Z"/>
        <path class="colorable" data-part="pillow-right" tabindex="0" aria-label="Right pillow" fill="#FFFFFF" d="M244 265 Q272 249 302 260 L300 292 H246 Z"/>
        <path class="colorable" data-part="blanket" tabindex="0" aria-label="Bed blanket" fill="#CDB9E8" d="M155 294 H385 L393 330 H146 Z"/>
        <path class="colorable" data-part="plant-pot" tabindex="0" aria-label="Plant pot" fill="#C97961" d="M89 300 H123 L118 338 H94 Z"/>
        <path class="colorable" data-part="plant-leaves" tabindex="0" aria-label="Plant leaves" fill="#B9CBAE" d="M105 303 C65 290 82 266 101 285 C94 252 124 259 111 285 C145 259 151 287 117 304 Z"/>
        <path d="M55 350 H545 M15 390 H585" stroke="#514749" stroke-width="3" fill="none"/>
      </svg>`
  },

  living: {
    title: "The Cosy Living Room",
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 490" role="img" aria-label="Living room interior line drawing">
        <rect width="600" height="490" fill="#fffdf9"/>
        <path class="colorable" data-part="back-wall" tabindex="0" aria-label="Back wall" fill="#F8F0E9" d="M55 45 H545 V350 H55 Z"/>
        <path class="colorable" data-part="left-wall" tabindex="0" aria-label="Left wall" fill="#F2E5DE" d="M55 45 L15 80 V380 L55 350 Z"/>
        <path class="colorable" data-part="floor" tabindex="0" aria-label="Floor" fill="#E9D3BD" d="M55 350 H545 L585 390 H15 L55 350 Z"/>
        <path class="colorable" data-part="window" tabindex="0" aria-label="Window" fill="#DDEFF4" d="M90 85 H210 V215 H90 Z"/>
        <path d="M150 85 V215 M90 150 H210" stroke="#514749" stroke-width="3" fill="none"/>
        <path class="colorable" data-part="curtain" tabindex="0" aria-label="Curtains" fill="#E7A4B4" d="M76 75 H98 L100 239 L80 230 Z M204 75 H226 L235 230 L213 239 Z"/>
        <path class="colorable" data-part="art-frame" tabindex="0" aria-label="Wall art frame" fill="#B78360" d="M340 85 H450 V175 H340 Z"/>
        <path class="colorable" data-part="art" tabindex="0" aria-label="Wall art" fill="#D9C8EF" d="M350 95 H440 V165 H350 Z"/>
        <circle class="colorable" data-part="art-sun" tabindex="0" aria-label="Art sun" cx="395" cy="122" r="17" fill="#F2D781"/>
        <path class="colorable" data-part="rug" tabindex="0" aria-label="Living room rug" fill="#D9C8EF" d="M100 330 Q300 300 495 330 L510 382 H88 Z"/>
        <path class="colorable" data-part="sofa-back" tabindex="0" aria-label="Sofa back" fill="#B9CBAE" d="M145 235 Q145 216 166 216 H426 Q450 216 450 242 V315 H145 Z"/>
        <path class="colorable" data-part="sofa-left" tabindex="0" aria-label="Left sofa cushion" fill="#D8E9D6" d="M155 252 H245 V315 H155 Z"/>
        <path class="colorable" data-part="sofa-middle" tabindex="0" aria-label="Middle sofa cushion" fill="#D8E9D6" d="M253 252 H340 V315 H253 Z"/>
        <path class="colorable" data-part="sofa-right" tabindex="0" aria-label="Right sofa cushion" fill="#D8E9D6" d="M348 252 H440 V315 H348 Z"/>
        <path class="colorable" data-part="sofa-arm-left" tabindex="0" aria-label="Left sofa arm" fill="#B9CBAE" d="M128 260 Q128 238 150 238 H170 V321 H128 Z"/>
        <path class="colorable" data-part="sofa-arm-right" tabindex="0" aria-label="Right sofa arm" fill="#B9CBAE" d="M425 238 H449 Q470 238 470 260 V321 H425 Z"/>
        <path class="colorable" data-part="pillow-left" tabindex="0" aria-label="Left sofa pillow" fill="#E7A4B4" d="M178 233 L226 240 L216 279 L170 267 Z"/>
        <path class="colorable" data-part="pillow-right" tabindex="0" aria-label="Right sofa pillow" fill="#D9C8EF" d="M367 239 L411 230 L422 267 L378 279 Z"/>
        <path class="colorable" data-part="coffee-table-top" tabindex="0" aria-label="Coffee table top" fill="#D8B99A" d="M218 320 H390 L408 347 H202 Z"/>
        <path class="colorable" data-part="coffee-table-leg" tabindex="0" aria-label="Coffee table legs" fill="#B78360" d="M220 344 H230 V374 H220 Z M380 344 H390 V374 H380 Z"/>
        <path class="colorable" data-part="plant-pot" tabindex="0" aria-label="Plant pot" fill="#C97961" d="M488 302 H523 L518 342 H493 Z"/>
        <path class="colorable" data-part="plant-leaves" tabindex="0" aria-label="Plant leaves" fill="#B9CBAE" d="M504 303 C468 284 484 263 501 287 C493 255 521 258 512 285 C543 263 553 285 516 306 Z"/>
        <path d="M55 350 H545 M15 390 H585" stroke="#514749" stroke-width="3" fill="none"/>
      </svg>`
  },

  kitchen: {
    title: "The Dream Kitchen",
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 490" role="img" aria-label="Kitchen interior line drawing">
        <rect width="600" height="490" fill="#fffdf9"/>
        <path class="colorable" data-part="back-wall" tabindex="0" aria-label="Back wall" fill="#F8F0E9" d="M55 45 H545 V350 H55 Z"/>
        <path class="colorable" data-part="left-wall" tabindex="0" aria-label="Left wall" fill="#F2E5DE" d="M55 45 L15 80 V380 L55 350 Z"/>
        <path class="colorable" data-part="floor" tabindex="0" aria-label="Floor" fill="#E9D3BD" d="M55 350 H545 L585 390 H15 L55 350 Z"/>
        <path class="colorable" data-part="window" tabindex="0" aria-label="Kitchen window" fill="#DDEFF4" d="M100 80 H215 V180 H100 Z"/>
        <path d="M157 80 V180 M100 130 H215" stroke="#514749" stroke-width="3" fill="none"/>
        <path class="colorable" data-part="upper-cabinet-left" tabindex="0" aria-label="Left upper cabinet" fill="#B9CBAE" d="M245 78 H340 V173 H245 Z"/>
        <path class="colorable" data-part="upper-cabinet-right" tabindex="0" aria-label="Right upper cabinet" fill="#B9CBAE" d="M350 78 H445 V173 H350 Z"/>
        <path class="colorable" data-part="cabinet-door-left" tabindex="0" aria-label="Left cabinet door" fill="#D8E9D6" d="M255 88 H331 V163 H255 Z"/>
        <path class="colorable" data-part="cabinet-door-right" tabindex="0" aria-label="Right cabinet door" fill="#D8E9D6" d="M360 88 H435 V163 H360 Z"/>
        <path d="M318 121 V133 M422 121 V133" stroke="#514749" stroke-width="3"/>
        <path class="colorable" data-part="backsplash" tabindex="0" aria-label="Backsplash tiles" fill="#FFF0D2" d="M75 195 H495 V230 H75 Z"/>
        <path d="M120 195 V230 M165 195 V230 M210 195 V230 M255 195 V230 M300 195 V230 M345 195 V230 M390 195 V230 M435 195 V230" stroke="#514749" stroke-width="1.5"/>
        <path class="colorable" data-part="countertop" tabindex="0" aria-label="Countertop" fill="#D8B99A" d="M70 228 H500 L518 245 H65 Z"/>
        <path class="colorable" data-part="lower-left-cabinet" tabindex="0" aria-label="Left lower cabinet" fill="#B9CBAE" d="M78 245 H195 V338 H78 Z"/>
        <path class="colorable" data-part="lower-middle-cabinet" tabindex="0" aria-label="Middle lower cabinet" fill="#B9CBAE" d="M205 245 H322 V338 H205 Z"/>
        <path class="colorable" data-part="lower-right-cabinet" tabindex="0" aria-label="Right lower cabinet" fill="#B9CBAE" d="M332 245 H489 V338 H332 Z"/>
        <path class="colorable" data-part="lower-door-left" tabindex="0" aria-label="Left lower cabinet door" fill="#D8E9D6" d="M88 255 H185 V328 H88 Z"/>
        <path class="colorable" data-part="lower-door-middle" tabindex="0" aria-label="Middle lower cabinet door" fill="#D8E9D6" d="M215 255 H312 V328 H215 Z"/>
        <path class="colorable" data-part="lower-door-right" tabindex="0" aria-label="Right lower cabinet door" fill="#D8E9D6" d="M342 255 H479 V328 H342 Z"/>
        <path class="colorable" data-part="sink" tabindex="0" aria-label="Sink" fill="#DDEFF4" d="M115 230 H183 Q190 230 186 239 L176 258 H125 L115 239 Z"/>
        <path class="colorable" data-part="island-top" tabindex="0" aria-label="Kitchen island countertop" fill="#FFFFFF" d="M190 300 H435 L457 320 H170 Z"/>
        <path class="colorable" data-part="island-front" tabindex="0" aria-label="Kitchen island front" fill="#E7A4B4" d="M170 320 H457 V365 H170 Z"/>
        <path class="colorable" data-part="island-panel" tabindex="0" aria-label="Kitchen island panel" fill="#F6D8DF" d="M185 329 H442 V356 H185 Z"/>
        <path d="M55 350 H545 M15 390 H585" stroke="#514749" stroke-width="3" fill="none"/>
      </svg>`
  },

  bathroom: {
    title: "The Calm Bathroom",
    svg: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 490" role="img" aria-label="Bathroom interior line drawing">
        <rect width="600" height="490" fill="#fffdf9"/>
        <path class="colorable" data-part="back-wall" tabindex="0" aria-label="Back wall" fill="#F8F0E9" d="M55 45 H545 V350 H55 Z"/>
        <path class="colorable" data-part="left-wall" tabindex="0" aria-label="Left wall" fill="#F2E5DE" d="M55 45 L15 80 V380 L55 350 Z"/>
        <path class="colorable" data-part="floor" tabindex="0" aria-label="Bathroom floor" fill="#DDE6E8" d="M55 350 H545 L585 390 H15 L55 350 Z"/>
        <path class="colorable" data-part="tile-wall" tabindex="0" aria-label="Wall tiles" fill="#DDEFF4" d="M65 180 H535 V350 H65 Z"/>
        <path d="M65 220 H535 M65 260 H535 M65 300 H535 M130 180 V350 M195 180 V350 M260 180 V350 M325 180 V350 M390 180 V350 M455 180 V350" stroke="#514749" stroke-width="1.5" fill="none"/>
        <path class="colorable" data-part="mirror-frame" tabindex="0" aria-label="Mirror frame" fill="#D8B99A" d="M125 75 H260 V174 H125 Z"/>
        <path class="colorable" data-part="mirror" tabindex="0" aria-label="Mirror glass" fill="#DDEFF4" d="M136 85 H249 V164 H136 Z"/>
        <path class="colorable" data-part="vanity-top" tabindex="0" aria-label="Vanity countertop" fill="#FFFFFF" d="M92 195 H286 L299 210 H82 Z"/>
        <path class="colorable" data-part="vanity" tabindex="0" aria-label="Vanity cabinet" fill="#B9CBAE" d="M100 210 H283 V300 H100 Z"/>
        <path class="colorable" data-part="vanity-door-left" tabindex="0" aria-label="Left vanity door" fill="#D8E9D6" d="M110 220 H187 V290 H110 Z"/>
        <path class="colorable" data-part="vanity-door-right" tabindex="0" aria-label="Right vanity door" fill="#D8E9D6" d="M196 220 H273 V290 H196 Z"/>
        <path class="colorable" data-part="basin" tabindex="0" aria-label="Basin" fill="#FFFFFF" d="M148 192 H230 Q238 192 232 202 L221 211 H157 L146 202 Z"/>
        <path class="colorable" data-part="tap" tabindex="0" aria-label="Tap" fill="#D8B99A" d="M181 174 H192 V194 H181 Z M181 174 Q181 162 195 162 H202 V170 H195 Q190 170 190 177 Z"/>
        <path class="colorable" data-part="bathtub" tabindex="0" aria-label="Bathtub" fill="#FFFFFF" d="M330 240 H500 L484 325 Q480 341 463 341 H360 Q343 341 340 325 Z"/>
        <path class="colorable" data-part="bath-interior" tabindex="0" aria-label="Inside bathtub" fill="#DDEFF4" d="M345 252 H485 L474 315 Q472 328 459 328 H365 Q352 328 350 315 Z"/>
        <path class="colorable" data-part="bath-panel" tabindex="0" aria-label="Bathtub front panel" fill="#F6D8DF" d="M350 330 H475 L469 344 H356 Z"/>
        <path class="colorable" data-part="towel" tabindex="0" aria-label="Towel" fill="#E7A4B4" d="M420 87 H472 V154 H420 Z"/>
        <path d="M420 105 H472 M420 122 H472 M55 350 H545 M15 390 H585" stroke="#514749" stroke-width="3" fill="none"/>
      </svg>`
  }
};

let selectedRoom = "bedroom";
let selectedColour = colours[0];
let history = [];
let drawings = {};
let toastTimer;

function blankDrawings() {
  const result = {};
  Object.keys(rooms).forEach(key => result[key] = {});
  return result;
}

function loadSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!data || typeof data !== "object") return;
    if (data.drawings && typeof data.drawings === "object") {
      Object.keys(rooms).forEach(key => {
        if (data.drawings[key] && typeof data.drawings[key] === "object") {
          drawings[key] = data.drawings[key];
        }
      });
    }
  } catch {}
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ drawings }));
  } catch {
    toast("Unable to save on this device. Try downloading your PNG.");
  }
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2100);
}

function renderPalette() {
  const container = $("palette");
  container.replaceChildren();

  colours.forEach(colour => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.style.backgroundColor = colour.hex;
    button.title = colour.name;
    button.setAttribute("aria-label", colour.name);
    button.setAttribute("aria-pressed", String(colour.hex === selectedColour.hex));

    if (colour.hex === selectedColour.hex) button.classList.add("active");

    button.addEventListener("click", () => chooseColour(colour));
    container.append(button);
  });

  $("selectedSwatch").style.backgroundColor = selectedColour.hex;
  $("selectedName").textContent = selectedColour.name;
  $("customColor").value = selectedColour.hex;
}

function chooseColour(colour) {
  selectedColour = colour;
  renderPalette();
  toast(`${colour.name} selected. Now tap a surface.`);
}

function renderRoom() {
  const container = $("drawing");
  container.innerHTML = rooms[selectedRoom].svg();

  container.querySelectorAll(".colorable").forEach(shape => {
    const part = shape.dataset.part;
    const savedColour = drawings[selectedRoom][part];
    if (savedColour) shape.setAttribute("fill", savedColour);

    shape.addEventListener("click", () => colourPart(shape));
    shape.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        colourPart(shape);
      }
    });
  });

  $("drawingTitle").textContent = rooms[selectedRoom].title;
  document.querySelectorAll(".room-option").forEach(button => {
    const active = button.dataset.room === selectedRoom;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updateProgress();
}

function colourPart(shape) {
  const part = shape.dataset.part;
  const previous = drawings[selectedRoom][part] || shape.getAttribute("fill");

  if (previous.toLowerCase() === selectedColour.hex.toLowerCase()) {
    toast("That surface already has this colour. ♡");
    return;
  }

  history.push({
    room: selectedRoom,
    part,
    previous: drawings[selectedRoom][part] || null
  });

  if (history.length > 100) history.shift();

  drawings[selectedRoom][part] = selectedColour.hex;
  shape.setAttribute("fill", selectedColour.hex);
  persist();
  updateProgress();
  $("helpText").textContent = `Beautiful choice! ${selectedColour.name} applied.`;
}

function undo() {
  const last = history.pop();
  if (!last) {
    toast("Nothing to undo yet.");
    return;
  }

  if (last.previous === null) {
    delete drawings[last.room][last.part];
  } else {
    drawings[last.room][last.part] = last.previous;
  }

  if (last.room === selectedRoom) renderRoom();
  persist();
  toast("Last colour change undone.");
}

function resetRoom() {
  if (!Object.keys(drawings[selectedRoom]).length) {
    toast("This drawing is already uncoloured.");
    return;
  }

  if (!window.confirm("Clear the colours from this room?")) return;
  drawings[selectedRoom] = {};
  history = history.filter(entry => entry.room !== selectedRoom);
  renderRoom();
  persist();
  toast("Your room is ready for a fresh design. ♡");
}

function updateProgress() {
  const completed = Object.keys(rooms).filter(key => Object.keys(drawings[key]).length > 0).length;
  $("progressText").textContent = `${completed} of ${Object.keys(rooms).length} rooms coloured`;
  $("progressTitle").textContent = completed === 4 ? "Interior designer in the making!" : "One room at a time";
}

function switchRoom(key) {
  if (!rooms[key]) return;
  selectedRoom = key;
  history = [];
  renderRoom();
  $("helpText").textContent = "Choose a colour, then tap any outlined surface.";
}

function downloadPNG() {
  const svg = $("drawing").querySelector("svg");
  if (!svg) return;

  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1200");
  clone.setAttribute("height", "980");

  clone.querySelectorAll(".colorable").forEach(shape => {
    shape.removeAttribute("tabindex");
    shape.removeAttribute("aria-label");
    shape.style.cursor = "default";
  });

  const source = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 980;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    canvas.toBlob(png => {
      if (!png) {
        toast("Couldn't create the image. Please try again.");
        return;
      }
      const pngUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `patience-studio-${selectedRoom}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1500);
      toast("Your design is ready to save! ♡");
    }, "image/png");
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    toast("Image export failed. Please try again.");
  };

  image.src = url;
}

$("roomOptions").addEventListener("click", event => {
  const button = event.target.closest("[data-room]");
  if (button) switchRoom(button.dataset.room);
});

$("customColor").addEventListener("input", event => {
  const hex = event.target.value;
  selectedColour = { name: "Custom colour", hex };
  renderPalette();
});

$("undoButton").addEventListener("click", undo);
$("resetButton").addEventListener("click", resetRoom);
$("downloadButton").addEventListener("click", downloadPNG);

$("saveButton").addEventListener("click", () => {
  persist();
  toast("Your designs are saved on this device. ♡");
});

loadSaved();
renderPalette();
renderRoom();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
