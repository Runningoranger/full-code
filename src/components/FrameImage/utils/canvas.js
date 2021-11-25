const polygonDefaultConfig = Object.freeze({
  strokeStyle: "#3e96d7",
  fillStyle: "rgba(62, 150, 215, .4)",
  lineWidth: 3,
  reverseTempColor: "#3e96d8",
});

export const _coordConvert = (sys, size, coord) => {
  /**
   * sys: 'absolute' | 'relative'
   * size: outbox size
   * coord: 坐标点
   */
  let x, y;
  if (sys === "absolute") {
    x = (coord.x / size.width) * size.imageWidth;
    y = (coord.y / size.height) * size.imageHeight;
  } else {
    x = coord.x * size.imageWidth;
    y = coord.y * size.imageHeight;
  }
  return {
    x,
    y,
  };
};

const drawPolygons = (polygons, ctx, size) => {
  /**
   * polygons: 数据源
   * ctx: CanvasRenderingContext2D
   * size: outbox size
   */
  polygons.forEach((item) => {
    // 如果有配置绘制颜色，则重新取色
    const { strokeStyle, fillStyle, lineWidth, reverseTempColor } = polygonDefaultConfig;
    ctx.strokeStyle = item.strokeStyle || strokeStyle;
    ctx.fillStyle = item.isReversed ? reverseTempColor : (item.fillStyle || fillStyle);
    ctx.lineWidth = item.lineWidth || lineWidth;

    ctx.beginPath();
    // 绘制图形
    item.vertices.forEach((path, index) => {
      // 两种坐标体系，一种是根据原图的绝对坐标，一种是百分比坐标
      let { x, y } = _coordConvert(item.coordSys, size, path);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
};

const DEFAULT_RADIUS = 3;
const drawPoints = (dots, ctx, size) => {
  /**
   * dots: 线对数据源
   * ctx: CanvasRenderingContext2D
   * size: outbox size
   */
  dots.forEach(dot => {
    ctx.fillStyle = dot.fillStyle;
    ctx.beginPath();

    const { x, y } = _coordConvert(dot.coordSys, size, dot.point)

    const radius = dot.pointRadius ? dot.pointRadius : DEFAULT_RADIUS;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  });
}

const DEFAULT_LINEWIDTH = 3;
const DEFAULT_POINTRADIUS = 3;
const drawLines = (lines, ctx, size) => {
  /**
   * lines: 线对数据源
   * ctx: CanvasRenderingContext2D
   * size: outbox size
   */
  lines.forEach(line => {
    ctx.strokeStyle = line.strokeStyle;
    ctx.fillStyle = line.fillStyle;
    ctx.lineWidth = line.lineWidth ? line.lineWidth : DEFAULT_LINEWIDTH;
    ctx.beginPath();

    line.line.forEach((vertex, index) => {
      const { x, y } = _coordConvert(line.coordSys, size, vertex)
      // 画线
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      const radius = line.pointRadius ? line.pointRadius : DEFAULT_POINTRADIUS;
      // 画节点
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    })
    ctx.closePath();
  });
}

export const DrawingTools = {
  drawPolygons,
  drawLines,
  drawPoints
};
