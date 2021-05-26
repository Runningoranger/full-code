<template>
  <div class="bit-map">
    <canvas
      ref="canvas"
      :style="canvasStyle"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleCanvasMouseMove"
      class="canvas"
    ></canvas>
    <img ref="image" style="display:none" :src="imageSrc" alt />
  </div>
</template>

<script>
const mouseType = {
  move: "move",
  down: "down",
  up: "up"
};
const stateMap = {
  none: 0,
  circle: 1,
  drawRects: 2
};
import { calculator } from "./calculate";
import { transformVertex, drawCircle, clearCanvas, drawRect, drawRectLine } from "./utils";
export default {
  props: {
    imageSrc: {
      type: String
    },
    drawState: {
      type: Number
    },
    rects: {
      type: Array
    }
  },
  data() {
    return {
      canvasStyle: {},
      canvasPosition: {
        x: 0,
        y: 0
      },
      currentPosition: {
        clientX: 0,
        clientY: 0
      },
      mouseState: "",
      scale: 1,
      maxScale: 5,
      minScale: 1,
      containerStyle: {},
      config: {},
      canvas: null,
      image: null,
      canvasCtx: null,
      rect: null,
      circles: [],
      transformCircles: [],
      zoomLevel: 1
    };
  },
  watch: {
    drawState(val) {
      const flag = Object.values(stateMap).findIndex(_ => _ === val);
      if (flag === -1) {
        throw new Error('drawState is not undefind');
      }
      this.changeState();
      if (val === stateMap.drawRects) {
        this.drawRects();
      }
    }
  },
  mounted() {
    this.init();
    this.addDocumentListen();
  },
  methods: {
     changeState() {
      this.clearAndDrawImage();
      this.circles = []; // 置空 标注圆
      this.transformCircles = []; // 置空转换的标注圆
      // this.emit(Events.changeDrawState, state);
    },
    getImageDom() {
      if (!this.imageSrc) {
        throw new Error("the imageSrc must exist and be unique ");
      }
      const image = this.$refs.image;
      return new Promise(resolve => {
        image.onload = event => {
          const target = event.target;
          const { naturalWidth: width, naturalHeight: height } = target;

          const containerStyle = this.$el.getBoundingClientRect();

          resolve({
            containerStyle: containerStyle,
            imageSize: { width, height },
            image: event.target
          });
        };
      });
    },
    async getComputedStyle() {
      // eslint-disable-next-line
      return new Promise(resolve => {
        // eslint-disable-next-line
        this.getImageDom().then(({ containerStyle, imageSize, image }) => {
          this.containerStyle = containerStyle;
          if (!this.containerStyle.height) {
            throw new Error("[Razor Error] the container height is unset");
          }
          resolve({ containerStyle: this.containerStyle, image, imageSize });
        });
      });
    },
    async init() {
      const {
        containerStyle,
        image,
        imageSize
      } = await this.getComputedStyle();

      // const { circleLength } = this.config;
      const circleLength = 99999;
      const config = { containerStyle, imageSize, circleLength };
      const canvasElem = this.$refs.canvas;
      this.config = config;
      this.createCanvas(canvasElem, containerStyle, image);
      // const options = this.options;

      // this.Editor = new Editor(canvasElem, config, options, image);

      // this.Editor.on(Events.drawCircles, this.handleDrawCircles);
      // this.Editor.on(Events.drawCircleDone, this.handleDrawCircleDone);
      // this.Editor.on(Events.changeDrawState, this.handleChangeState);
      if (this.drawState === stateMap.drawRects && this.rects.length) {
        this.drawRects();
      }
    },
    beforeDestroy() {
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
    addDocumentListen() {
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    swallowEvent(event) {
      event.stopPropagation();
      event.preventDefault();
    },
    getCanvasStyle() {
      const { width, height } = this.containerStyle;
      return {
        width: `${width * this.scale}px`,
        height: `${height * this.scale}px`,
        top: `${this.canvasPosition.y}px`,
        left: `${this.canvasPosition.x}px`
      };
    },
    handleMouseDown(event) {
      this.mouseState = mouseType.down;
      this.currentPosition = {
        clientX: event.clientX,
        clientY: event.clientY
      };
      this.prevPosition = {
        clientX: event.clientX,
        clientY: event.clientY
      };
    },
    handleCanvasMouseMove(event) {
      // 判断是不是鼠标按下
      if (this.mouseState === mouseType.down) {
        this.mouseState = mouseType.move;
      }
      // 不是画矩形的状态 关闭
      if (this.mouseState !== mouseType.move) {
        return;
      } else {
        this.moveCanvas(event);
      }
    },
    handleMouseUp(event) {
      this.mouseState = mouseType.up;
      if (!event || !this.$el.contains(event.target)) {
        // 鼠標移出容器的兼容
        this.currentPosition = null;
        return;
      }
      const vertex = transformVertex(event, this.scale);
      let circleIndex = -1;

      switch (this.drawState) {
        case stateMap.circle:
          if (
            // 鼠标移动了则不画标注
            this.prevPosition.clientX !== this.currentPosition.clientX ||
            this.prevPosition.clientY !== this.currentPosition.clientY
          ) {
            break;
          }
          circleIndex = this.isCircleExist(vertex);
          if (this.circles.length && circleIndex >= 0) {
            this.removeCircle(circleIndex);
          } else {
            this.addCircle(vertex);
          }
          break;
        case stateMap.drawRects:
          // this.selectRect(vertex);
          break;
        default:
          break;
      }
      this.currentPosition = null;
    },
    getMoveDistance({ clientX, clientY }) {
      const movementX = clientX - this.currentPosition.clientX;
      const movementY = clientY - this.currentPosition.clientY;
      return {
        movementX,
        movementY
      };
    },
    handleWheel(event, scaleStep = 0.1) {
      this.swallowEvent(event);
      const scaleFlag = event.deltaY < 0;
      let newScale = this.scale + scaleStep * (scaleFlag ? 1 : -1);
      if (newScale > this.maxScale) {
        newScale = this.maxScale;
      } else if (newScale < this.minScale) {
        newScale = this.minScale;
      }
      const canvasElem = this.$refs.canvas;
      // 当前位置
      const boundingRect = canvasElem.getBoundingClientRect();

      const x = event.clientX - boundingRect.left;
      const y = event.clientY - boundingRect.top;
      const changeRate = newScale / this.scale;
      this.scale = newScale;

      if (newScale === this.minScale) {
        this.canvasPosition = {
          x: 0,
          y: 0
        };
      } else {
        // 换算后新的位置
        this.canvasPosition = {
          x: this.canvasPosition.x - (changeRate - 1) * x,
          y: this.canvasPosition.y - (changeRate - 1) * y
        };
      }
      this.canvasStyle = this.getCanvasStyle();
      this.zoom(this.scale);
    },
    moveCanvas(event) {
      this.swallowEvent(event);
      const { clientX, clientY } = event;
      const movementX = clientX - this.currentPosition.clientX;
      const movementY = clientY - this.currentPosition.clientY;
      if (
        (movementX > 0 && movementX < 5) ||
        (movementY > 0 && movementY < 5) ||
        (movementX < 0 && movementX > -5) ||
        (movementY < 0 && movementY > -5)
      ) {
        return;
      }
      this.canvasPosition.x += movementX;
      this.canvasPosition.y += movementY;
      this.canvasStyle = this.getCanvasStyle();
      this.currentPosition = { clientX, clientY };
    },
    createCanvas(canvasElem, containerStyle, image) {
      this.canvas = canvasElem;
      const { width, height } = containerStyle;
      if (!width || !height) {
        throw new Error(`[Razor Error] width is ${width},height is ${height}`);
      }
      this.canvas.width = width;
      this.canvas.height = height;
      // 获取画笔
      this.canvasCtx = this.canvas.getContext("2d");
      this.image = image;
      this.drawImage();
    },
    drawImage() {
      const {
        width: containerWidth,
        height: containerHeight
      } = this.containerStyle;

      const {
        imageSize: { width: imageWidth, height: imageHeight }
      } = this.config;

      this.rect = calculator(
        imageWidth,
        imageHeight,
        containerWidth,
        containerHeight
      );

      const { scale, vertexes } = this.rect;
      const [vertexStart] = vertexes;

      const scaleImageWidth = imageWidth / scale; // imageWidth;
      const scaleImageHeight = imageHeight / scale; // imageHeight;
      /**
       * @param image Image
       * @param vertexStart 起点坐标
       * @param vertexStart.x // 绘画的起点横坐标
       * @param vertexStart.y // 绘画的起点纵坐标
       * @param scaleImageWidth / scale 后图片的宽度
       * @param scaleImageHeight scale 后图片的高度
       * */
      this.canvasCtx.drawImage(
        this.image,
        vertexStart.x,
        vertexStart.y,
        scaleImageWidth,
        scaleImageHeight
      );
    },
    isCircleExist(vertex) {
      let index = -1;
      if (!this.circles.length) {
        return index;
      }
      const radius = 5;
      let i = 0;
      for (; i < this.circles.length; i++) {
        const { vertex: targetVertex } = this.circles[i];
        if (
          vertex.x >= targetVertex.x - radius &&
          vertex.x <= targetVertex.x + radius &&
          vertex.y >= targetVertex.y - radius &&
          vertex.y <= targetVertex.y + radius
        ) {
          index = i;
        }
      }
      return index;
    },
    isInImageArea(vertex) {
      const { vertexes } = this.rect;
      const [vertexStart, vertexEnd] = vertexes;
      /**
       * 大于左上角的坐标 x y
       * 小于右下角的坐标 x y
       * 则落入区域
       */
      const flag =
        vertex.x >= vertexStart.x &&
        vertex.y >= vertexStart.y &&
        vertex.x <= vertexEnd.x &&
        vertex.y <= vertexEnd.y;
      return flag;
    },
    addCircle(vertex) {
      if (this.drawState !== stateMap.circle) {
        return;
      }
      const { circleLength } = this.config;
      if (this.circles.length >= circleLength) {
        return;
      }
      // 如果添加的点不在图片区域内不处理
      if (!this.isInImageArea(vertex)) {
        return;
      }

      // const { drawCircleOption, radius } = this.options;
      const ctx = this.canvasCtx;

      drawCircle(ctx, vertex, 5 / this.zoomLevel);

      this.circles.push({ vertex });

      const transformVertex = this.transformVertex(vertex);
      this.transformCircles.push({ vertex: transformVertex });

      // this.emit(Events.drawCircles, this.transformCircles);

      // if (this.circles.length === circleLength) {
      //   this.emit(Events.drawCircleDone, this.transformCircles);
      // }
    },
    removeCircle(index) {
      this.circles.splice(index, 1);
      this.transformCircles.splice(index, 1);
      // this.emit(Events.drawCircles, this.transformCircles);
      this.drawCircles();
    },
    drawCircles() {
      this.clearAndDrawImage();
      this.circles.forEach(circle => {
        const ctx = this.canvasCtx;
        drawCircle(ctx, circle.vertex, 5 / this.zoomLevel);
      });
    },
    zoom(zoom) {
      this.zoomLevel = zoom;
      switch (this.drawState) {
        // 圆跟着缩放
        case stateMap.circle:
          this.drawCircles();
          break;
        case stateMap.drawRects:
          this.drawRects();
          break;
      }
    },
    clearAndDrawImage() {
      this.clear();
      this.drawImage();
    },
    clear() {
      const { width, height } = this.containerStyle;
      const ctx = this.canvasCtx;
      clearCanvas(ctx, { width, height });
    },
    transformVertex(vertex) {
      const { scale, vertexes } = this.rect;
      const [vertexStart] = vertexes;
      const x = (vertex.x - vertexStart.x) * scale;
      const y = (vertex.y - vertexStart.y) * scale;
      const transformVertex = { x, y };
      return transformVertex;
    },
    drawRects() {
      const rects = this.rects.map(rect => {
        const vertexes = rect.vertexes.map(vertex =>
          this.shrinkVertex(vertex)
        );
        return { ...rect, vertexes };
      });
      if (rects.length) this.canvasDrawRects(rects);
    },
    shrinkVertex(vertex) {
      const { scale, vertexes } = this.rect;
      const [vertexStart] = vertexes;
      const x = vertex.x / scale + vertexStart.x;
      const y = vertex.y / scale + vertexStart.y;
      const transformVertex = { x, y };
      return transformVertex;
    },
    canvasDrawRects(rects) {
      this.clearAndDrawImage();
      const ctx = this.canvasCtx;
      const radius = 10 / this.zoomLevel;
      rects.forEach(rect => {
        const { vertexes, options: drawRectOption } = rect;
        drawRect(ctx, vertexes, drawRectOption, radius);
      });
      drawRectLine(ctx, rects);
    }
  }
};
</script>

<style lang="scss" scoped>
.bit-map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .canvas {
    position: absolute;
  }
}
</style>