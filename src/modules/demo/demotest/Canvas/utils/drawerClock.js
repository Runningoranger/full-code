export const runClock = (ctx) => {
  const time = new Date();
  let h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  if (h > 12) {
    h -= 12;
  }
  // 时:时针每小时走动30度（360/ 12）
  ctx.save();
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.rotate((Math.PI / 6) * h + (Math.PI / 360) * m + (Math.PI / 21600) * s)
  ctx.moveTo(0,0);
  ctx.lineTo(0,-50);
  ctx.stroke();
  ctx.restore();
  // 分：分针每分钟走动6度 （360/ 60）
  ctx.save();
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.rotate(((2 * Math.PI)/ 60) * m + ((2 * Math.PI)/ 60) *  (s/60))
  ctx.moveTo(0,0);
  ctx.lineTo(0,-90);
  ctx.stroke();
  ctx.restore();
  // 秒：秒针每秒钟走动6度（360/ 60）
  ctx.save();
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.rotate(((2 * Math.PI)/ 60) * s)
  ctx.moveTo(0,0);
  ctx.lineTo(0, -110);
  ctx.stroke();
  ctx.restore();
}

export const drawerClock = (ctx) => {
  ctx.translate(400, 200);  //  把坐标中心点移到画布中心
  ctx.beginPath();          //  开始路径
  ctx.arc(0, 0, 150, 0, 360, false);  //  画圆
  ctx.stroke();                       //  结束
  for (let i = 0; i< 12; i++) {       //  画时钟的时针刻度
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 6;
    ctx.rotate(2 * Math.PI / 12);
    ctx.moveTo(0, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();
  }
  for (let i = 0; i< 60; i++) {       //  画分针和秒针的刻度
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.rotate(Math.PI/30);
    ctx.moveTo(0, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.strokeStyle = "rgb(255,255,255)"
  ctx.arc(0, 0, 135, 0, 360, false);
  ctx.fill();
  ctx.stroke();
  runClock(ctx);
}