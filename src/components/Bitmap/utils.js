export function transformVertex(event, zoom = 1) {
  const { offsetX: x, offsetY: y } = event;
  return { x: x / zoom, y: y / zoom };
}
export const drawCircle = (ctx, vertex, radius) => {
  //   if (!options.hasOwnProperty("dashed") || options.dashed === false) {
  //     ctx.setLineDash([]);
  //   } else {
  //     const _dashedConfig =
  //       options.dashedConfig && options.dashedConfig.length
  //         ? options.dashedConfig
  //         : [5, 5, 5];
  //     ctx.setLineDash(_dashedConfig);
  //   }
  ctx.setLineDash([5, 5, 5]);
  //   const { lineColor, weight, opacity, fillColor } = options;
  ctx.beginPath();
  ctx.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#DC143C";
  ctx.fill();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#FF69B4";
  ctx.stroke();
};
export const clearCanvas = (ctx, rect) => {
  const { width, height } = rect;
  ctx.clearRect(0, 0, width, height);
};

export function drawRect(ctx, rect, drawRectOption, radius) {
  const {
    lineColor,
    fillColor,
    weight,
    opacity,
    dashed,
    dashedConfig,
  } = drawRectOption;
  ctx.beginPath();
  // 虚线设置
  if (dashed) {
    const _dashedConfig =
      dashedConfig && dashedConfig.length ? dashedConfig : [5, 5, 5];
    ctx.setLineDash(_dashedConfig);
  } else {
    ctx.setLineDash([]);
  }

  // ctx.lineWidth = weight;
  // ctx.strokeStyle = hex2rgba(lineColor, opacity);
  // if (fillColor) { ctx.fillStyle = hex2rgba(fillColor, opacity) };

  // const [{ x: startX, y: startY }, { x: endX, y: endY }] = rect;
  // const width = endX - startX;
  // const height = endY - startY;

  // ctx.rect(startX, startY, width, height);

  // fillColor && ctx.fill()
  const [{ x: startX, y: startY }] = rect;
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = hex2rgba(fillColor, opacity);
  ctx.fill();
  ctx.lineWidth = weight;
  ctx.strokeStyle = hex2rgba(lineColor, opacity);

  ctx.stroke();
}
export function hex2rgba(hexColor, opacity) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const result = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return result;
}

export const drawRectLine = (ctx, rects) => {
  ctx.beginPath();
  ctx.strokeStyle = "#00E1FF";
  for (let i = 0; i < rects.length; i++) {
    ctx.lineTo(rects[i].vertexes[0].x, rects[i].vertexes[0].y);
  }
  ctx.closePath();
  ctx.stroke();
};
