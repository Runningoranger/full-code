export const calculator = (
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight
) => {
  const vertexStart = {
    x: 0,
    y: 0,
  };

  const vertexEnd = {
    x: containerWidth,
    y: containerHeight,
  };

  const widthScale = imageWidth / containerWidth;
  const heightScale = imageHeight / containerHeight;

  // 图片的 长 > 容器的 长 或者 图片的 宽 > 容器的 宽
  // if (imageWidth >= containerWidth || imageHeight >= containerHeight) {
  // 看谁的比例大
  if (widthScale > heightScale) {
    // 绘画起点 从左边 坐标为0 开始
    // 横坐标不需要变
    // 计算出纵坐标
    // 容器的高 减去 图片的高缩小后的尺寸 除以二
    vertexStart.y = (containerHeight - imageHeight / widthScale) / 2;
    // 算出右下角的纵坐标 因为上下等距, 所以容器高减掉上面计算出来的数就知道右下角的纵坐标
    vertexEnd.y = containerHeight - vertexStart.y;
  } else {
    // 容器的宽 减去 图片的宽缩小后的尺寸 除以二
    vertexStart.x = (containerWidth - imageWidth / heightScale) / 2;
    // 算出右下角的横坐标 因为左右等距, 所以容器高减掉上面计算出来的数就知道右下角的横坐标
    vertexEnd.x = containerWidth - vertexStart.x;
  }

  const scale = Math.max(widthScale, heightScale);

  const rect = {
    scale,
    widthScale,
    heightScale,
    vertexes: [vertexStart, vertexEnd],
  };
  return rect;
};
export function transformVertex(event, zoom = 1) {
  const { offsetX: x, offsetY: y } = event;
  return { x: x / zoom, y: y / zoom };
}
/* 根据计算出来的箭头的点, 画箭头 */
export function drawArrow(ctx, arrowPoints, options) {
  const { endPoint, leftArrowPoint, rightArrowPoint } = arrowPoints;
  // 画第一条箭头线
  ctx.beginPath();
  ctx.strokeStyle = options.strokeStyle;
  ctx.lineWidth = 1;
  ctx.moveTo(endPoint.x, endPoint.y);
  ctx.lineTo(leftArrowPoint.x, leftArrowPoint.y);
  ctx.lineTo(rightArrowPoint.x, rightArrowPoint.y);
  ctx.moveTo(rightArrowPoint.x, rightArrowPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  const grd = ctx.createLinearGradient(0, 0, endPoint.x, 0); // 使用渐变颜色填充,从(0,0)到(200,0) （左到右）
  grd.addColorStop(0, options.colorFill[0]); // 起始颜色
  grd.addColorStop(1, options.colorFill[1]); // 终点颜色
  ctx.fillStyle = grd; // 以上面定义的渐变填充
  ctx.fill(); // 闭合形状并且以填充方式绘制出来
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  ctx.save();
}

/* 获取画箭头两端的点 */
export function getArrowPoint(pixelStart, pixelEnd, length = 15) {
  // 绘制箭头的函数
  // const length = 12;
  const angleValue = Math.PI / 7;
  const angle = angleValue; // 箭头和主线的夹角
  const r = length; // r/Math.sin(angle)代表箭头长度
  let delta = 0; // 主线斜率，垂直时无斜率
  let param = 0; // 代码简洁考虑
  let pixelTemX = 0;
  let pixelTemY = 0; // 临时点坐标
  let pixelX = 0;
  let pixelY = 0;
  let pixelX1 = 0;
  let pixelY1 = 0; // 箭头两个点
  if (pixelEnd.x - pixelStart.x === 0) {
    // 斜率不存在是时
    pixelTemX = pixelEnd.x;
    if (pixelEnd.y > pixelStart.y) {
      pixelTemY = pixelEnd.y - r;
    } else {
      pixelTemY = pixelEnd.y + r;
    }
    // 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    pixelX = pixelTemX - r * Math.tan(angle);
    pixelX1 = pixelTemX + r * Math.tan(angle);
    pixelY = pixelY1 = pixelTemY;
  } else {
    // 斜率存在时
    delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
    param = Math.sqrt(delta * delta + 1);

    if (pixelEnd.x - pixelStart.x < 0) {
      // 第二、三象限
      pixelTemX = pixelEnd.x + r / param;
      pixelTemY = pixelEnd.y + (delta * r) / param;
    } else {
      // 第一、四象限
      pixelTemX = pixelEnd.x - r / param;
      pixelTemY = pixelEnd.y - (delta * r) / param;
    }
    // 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    pixelX = pixelTemX + (Math.tan(angle) * r * delta) / param;
    pixelY = pixelTemY - (Math.tan(angle) * r) / param;

    pixelX1 = pixelTemX - (Math.tan(angle) * r * delta) / param;
    pixelY1 = pixelTemY + (Math.tan(angle) * r) / param;
  }
  return {
    leftArrowPoint: {
      x: pixelX,
      y: pixelY,
    },
    rightArrowPoint: {
      x: pixelX1,
      y: pixelY1,
    },
  };
}
export const drawLine = (ctx, start, end, drawLineOption) => {
  const { color, weight, opacity, strokeStyle, noStrokeStyle } = drawLineOption;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  if (!noStrokeStyle) {
    const style = hex2rgba(color, opacity);
    ctx.strokeStyle = strokeStyle ? strokeStyle : style;
  }

  ctx.lineWidth = weight;
  ctx.stroke();
  return {
    start,
    end,
  };
};
export function hex2rgba(hexColor, opacity) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const result = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return result;
}