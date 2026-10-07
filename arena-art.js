// Canvas artwork reused from Sphero Mission App 2; adapted by the Mars mission designer.
function drawRoundedRect(x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.fill();
}

function drawStarfield(rect) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  for (let i = 0; i < 145; i += 1) {
    const x = (i * 83) % rect.width;
    const y = (i * 47) % rect.height;
    const radius = i % 9 === 0 ? 1.7 : 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(79, 217, 191, 0.22)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 211) % rect.width) - 60;
    const y = 92 + ((i * 67) % Math.max(120, rect.height - 180));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 90, y - 26);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(80, 184, 255, 0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 11; i += 1) {
    const x = ((i * 157) % rect.width) - 140;
    const y = 60 + ((i * 89) % Math.max(120, rect.height - 120));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 170, y + 34);
    ctx.stroke();
  }
}

function drawHazardBlock(hazard, scene, topColor = "#d33f49", sideColor = "#a8232d") {
  const height = 34;
  const topLeft = worldToCanvas({ x: hazard.x, y: hazard.y }, height, scene);
  const topRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y }, height, scene);
  const bottomRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, height, scene);
  const bottomLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, height, scene);
  const floorRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, 0, scene);
  const floorLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, 0, scene);

  ctx.fillStyle = "rgba(25, 34, 30, 0.2)";
  ctx.beginPath();
  ctx.ellipse((floorLeft.x + floorRight.x) / 2, floorRight.y + 11, (floorRight.x - floorLeft.x) * 0.58, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.moveTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(floorRight.x, floorRight.y);
  ctx.lineTo(floorLeft.x, floorLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  clipHazardTop(hazard, scene);
  ctx.strokeStyle = currentMission.theme === "mars" ? "rgba(255, 255, 255, 0.38)" : currentMission.planet.grid;
  ctx.lineWidth = currentMission.theme === "mars" ? 5 : 2;
  for (let stripe = hazard.x - hazard.h; stripe < hazard.x + hazard.w; stripe += 42) {
    const a = worldToCanvas({ x: stripe, y: hazard.y + hazard.h }, height + 1, scene);
    const b = worldToCanvas({ x: stripe + hazard.h, y: hazard.y }, height + 1, scene);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRockField(hazard, scene) {
  drawHazardBlock(hazard, scene, "#7f6757", "#4c3a31");
  const count = Math.max(4, Math.round((hazard.w + hazard.h) / 55));
  for (let i = 0; i < count; i += 1) {
    const rock = {
      x: hazard.x + 18 + ((i * 43) % Math.max(24, hazard.w - 28)),
      y: hazard.y + 14 + ((i * 31) % Math.max(18, hazard.h - 22)),
    };
    const point = worldToCanvas(rock, 42, scene);
    const radius = (9 + (i % 3) * 4) * scene.scale;
    ctx.fillStyle = i % 2 ? "#b48b6a" : "#8d684e";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius * 1.25, radius, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e4c7ac";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawSandTrap(hazard, scene) {
  drawHazardBlock(hazard, scene, "#d59a52", "#8f5e2a");
  const center = worldToCanvas({ x: hazard.x + hazard.w / 2, y: hazard.y + hazard.h / 2 }, 44, scene);
  ctx.strokeStyle = "rgba(255, 234, 199, 0.72)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const radius = (22 + i * 18) * scene.scale;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, Math.PI * 0.9, Math.PI * 1.85);
    ctx.stroke();
  }
}

function drawDustStorm(hazard, scene) {
  drawHazardBlock(hazard, scene, "#b96b42", "#6d3926");
  ctx.strokeStyle = "rgba(255, 225, 172, 0.58)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    const start = worldToCanvas({ x: hazard.x + i * 18, y: hazard.y + hazard.h - 10 }, 45, scene);
    const end = worldToCanvas({ x: hazard.x + hazard.w - i * 10, y: hazard.y + 10 + i * 9 }, 45, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(start.x + 38, start.y - 24, end.x - 42, end.y + 18, end.x, end.y);
    ctx.stroke();
  }
}

function drawDebrisCloud(hazard, scene) {
  drawHazardBlock(hazard, scene, "#45515f", "#242b34");
  ctx.fillStyle = "#cfd8e3";
  for (let i = 0; i < 9; i += 1) {
    const bit = {
      x: hazard.x + 12 + ((i * 19) % Math.max(20, hazard.w - 22)),
      y: hazard.y + 10 + ((i * 17) % Math.max(16, hazard.h - 18)),
    };
    const point = worldToCanvas(bit, 43, scene);
    const size = (5 + (i % 3) * 3) * scene.scale;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(i * 0.7);
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.7);
    ctx.restore();
  }
}

function drawTargetBase(beacon, complete, scene) {
  const point = worldToCanvas(beacon, 7, scene);
  const ground = worldToCanvas(beacon, 0, scene);
  const radius = beacon.r * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 9, radius * 1.2, radius * scene.ySquash * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = complete ? "#1f8a70" : "#f5b942";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffe49a";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (beacon.code) drawColorCodeChips(beacon.code, point, radius);
  return { point, radius };
}

function drawColorCodeChips(code, point, radius) {
  const colors = normalizeColorCode(code).split("-");
  const chipSize = Math.max(5, radius * 0.17);
  const totalWidth = colors.length * chipSize + (colors.length - 1) * chipSize * 0.45;
  let x = point.x - totalWidth / 2;
  const y = point.y - radius * 1.2;
  colors.forEach((color) => {
    ctx.fillStyle = colorValue(color);
    ctx.fillRect(x, y, chipSize, chipSize);
    ctx.strokeStyle = "rgba(255,255,255,0.76)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, chipSize, chipSize);
    x += chipSize * 1.45;
  });
}

function drawCapsule(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#effff6" : "#e7efe9";
  drawRoundedRect(point.x - radius * 0.18, point.y - radius * 1.02, radius * 0.36, radius * 1.1, radius * 0.16);
  ctx.fillStyle = "#6bd2ff";
  ctx.fillRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.12);
  ctx.strokeStyle = "#c8f0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 1.02);
  ctx.lineTo(point.x, point.y - radius * 1.34);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawSatellite(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#e6fff6" : "#cdd7de";
  drawRoundedRect(point.x - radius * 0.2, point.y - radius * 0.7, radius * 0.4, radius * 0.95, 4);
  ctx.fillStyle = "#2db4d6";
  ctx.fillRect(point.x - radius * 0.95, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.fillRect(point.x + radius * 0.37, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.strokeStyle = "#eef8ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 0.7);
  ctx.lineTo(point.x + radius * 0.2, point.y - radius * 1.08);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawDock(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.84);
  ctx.fillStyle = complete ? "#9affea" : "#f3c178";
  ctx.fillRect(point.x - radius * 0.46, point.y - radius * 0.14, radius * 0.92, radius * 0.28);
  ctx.fillStyle = "#5f4638";
  ctx.fillRect(point.x - radius * 0.18, point.y - radius * 0.54, radius * 0.36, radius * 0.34);
  drawTargetLabel(beacon.label, point, radius);
}

function drawSample(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = beacon.label === "Ice" ? "#9fdfff" : beacon.label === "Soil" ? "#cf7d43" : "#9f8e7a";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(point.x - radius * 0.12, point.y - radius * 0.12, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();
  drawTargetLabel(beacon.label, point, radius);
}

function drawTargetLabel(label, point, radius) {
  ctx.fillStyle = "#eef8f2";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
  ctx.lineWidth = 4;
  ctx.font = `800 ${Math.max(11, radius * 0.36)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(label, point.x, point.y + radius * 0.98);
  ctx.fillText(label, point.x, point.y + radius * 0.98);
}

function drawCrater(item, scene) {
  const point = worldToCanvas(item, 1, scene);
  const radius = item.size * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHabitat(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 44 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  ctx.beginPath();
  ctx.arc(point.x, point.y, size * 0.55, Math.PI, 0);
  ctx.lineTo(point.x + size * 0.55, point.y + size * 0.35);
  ctx.lineTo(point.x - size * 0.55, point.y + size * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f7b267";
  ctx.fillRect(point.x - size * 0.72, point.y + size * 0.06, size * 1.44, size * 0.16);
  drawSmallLabel(item.label, point.x, point.y + size * 0.6);
}

function drawCommandPost(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 42 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  drawRoundedRect(point.x - size * 0.5, point.y - size * 0.36, size, size * 0.72, 6);
  ctx.strokeStyle = "#6bd2ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - size * 0.36);
  ctx.lineTo(point.x, point.y - size * 0.95);
  ctx.lineTo(point.x + size * 0.42, point.y - size * 0.7);
  ctx.stroke();
  drawSmallLabel(item.label, point.x, point.y + size * 0.65);
}

function drawSmallLabel(label, x, y) {
  ctx.fillStyle = "#eef8f2";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}

function drawRoverBody(radius) {
  const body = ctx.createLinearGradient(0, -radius, 0, radius);
  body.addColorStop(0, robot.crashed ? "#877e75" : "#efe8d6");
  body.addColorStop(1, robot.crashed ? "#413a37" : "#a2876f");
  ctx.fillStyle = body;
  drawRoundedRect(-radius * 0.95, -radius * 0.36, radius * 1.9, radius * 0.88, 8);
  ctx.fillStyle = robot.crashed ? "#ff6655" : robot.flashing || robot.color;
  ctx.fillRect(-radius * 0.42, -radius * 0.18, radius * 0.84, radius * 0.16);
  ctx.fillStyle = "#6e7176";
  ctx.fillRect(-radius * 0.22, radius * 0.04, radius * 0.44, radius * 0.16);
}

function drawRoverWheels(radius) {
  ctx.fillStyle = "#35393f";
  const wheelX = radius * 0.88;
  const wheelY = radius * 0.44;
  const wheelW = radius * 0.34;
  const wheelH = radius * 0.22;
  [
    [-wheelX, -wheelY],
    [wheelX - wheelW, -wheelY],
    [-wheelX, wheelY],
    [wheelX - wheelW, wheelY],
  ].forEach(([x, y]) => {
    ctx.fillStyle = "#35393f";
    ctx.fillRect(x, y, wheelW, wheelH);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, wheelW, wheelH); ctx.clip();
    ctx.strokeStyle = "#9ba3ac";
    ctx.lineWidth = Math.max(1, radius * .045);
    const spacing = wheelW / 3;
    const phase = reducedMotion ? 0 : sceneAnimation.wheelPhase % 1;
    for (let tread = -1; tread < 4; tread++) {
      const treadX = x + (tread + phase) * spacing;
      ctx.beginPath(); ctx.moveTo(treadX, y); ctx.lineTo(treadX, y + wheelH); ctx.stroke();
    }
    ctx.restore();
  });
}

function drawRoverMast(radius) {
  ctx.strokeStyle = "#d9dde2";
  ctx.lineWidth = Math.max(2, radius * 0.07);
  ctx.beginPath();
  ctx.moveTo(radius * 0.22, -radius * 0.22);
  ctx.lineTo(radius * 0.42, -radius * 0.82);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(radius * 0.46, -radius * 0.9, radius * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#202a32";
  ctx.beginPath();
  ctx.arc(radius * 0.5, -radius * 0.9, radius * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function clipHazardTop(hazard, scene) {
  ctx.beginPath();
  [[hazard.x, hazard.y], [hazard.x + hazard.w, hazard.y], [hazard.x + hazard.w, hazard.y + hazard.h], [hazard.x, hazard.y + hazard.h]].forEach(([x, y], index) => {
    const point = worldToCanvas({x, y}, 34, scene);
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath(); ctx.clip();
}


