<template>
  <div :style="mapSize">
    <div class="track-map">
      <section
        ref="canvas"
        :style="canvasStyle"
        @wheel="handleWheel"
        @mousedown="handleMouseDown"
        @mousemove="handleCanvasMouseMove"
        class="canvas"
      >
        <ArrowLine v-if="drawState === 2" :lines="arrowLines" :key="renderKey" class="track-arrow">
          <div style="width: 100%; height:100%;" slot="container"></div>
        </ArrowLine>
        <section class="marks-area">
          <Mark v-for="(mark,i) in markList" :key="i" :mark="mark" :drawState="drawState" />
        </section>
        <img ref="image" :style="imageStyle" :src="imageSrc" alt />
      </section>
    </div>
  </div>
</template>

<script>
import { calculator, transformVertex } from "./utils";
import ArrowLine from "./ArrowLine";
import Mark from "./Mark";
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
const options = {
  drawArrowLineOption: {
    color: "#3395f4",
    weight: 3,
    opacity: 0.8,
    strokeStyle: "#3C5EDC",
    colorFill: ["#3C5EDC", "#3C5EDC"]
  }
};
export default {
  components: {
    Mark,
    ArrowLine
  },
  props: {
    imageSrc: {
      type: String
    },
    drawState: {
      type: Number
    },
    marks: {
      type: Array,
      default: () => {
        return [];
      }
    },
    mapSize: {
      type: Object
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
      prevPosition: {},
      mouseState: "",
      scale: 1,
      maxScale: 5,
      minScale: 1,
      containerStyle: {},
      imageStyle: {},
      relativeScale: null,
      imageSize: {},
      rect: null,
      markList: [],
      arrowLines: [],
      renderKey: Math.random()
    };
  },
  watch: {
    drawState(val) {
      this.markList = [];
      if (val === stateMap.drawRects) {
        this.viewTrack();
      }
    }
  },
  mounted() {
    this.init();
    this.addDocumentListen();
  },
  methods: {
    viewTrack() {
        this.markList = JSON.parse(JSON.stringify(this.marks));
        if (this.markList < 1) {
          this.arrowLines = [];
          return false;
        }
        this.setMarksScalePosition();
        this.computeLocus();
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
            imageSize: { width, height }
          });
        };
      });
    },
    async getComputedStyle() {
      return new Promise(resolve => {
        this.getImageDom().then(({ containerStyle, imageSize }) => {
          if (!containerStyle.height) {
            throw new Error("container height is unset");
          }
          resolve({ containerStyle, imageSize });
        });
      });
    },
    async init() {
      const { containerStyle, imageSize } = await this.getComputedStyle();
      this.containerStyle = containerStyle;
      this.imageSize = imageSize;
      const { width: containerWidth, height: containerHeight } = containerStyle;
      const { width: imageWidth, height: imageHeight } = imageSize;
      const rect = calculator(
        imageWidth,
        imageHeight,
        containerWidth,
        containerHeight
      );
      this.rect = rect;
      const { scale } = rect;
      this.relativeScale = scale;
      this.imageStyle = this.getImageStyle();
      this.canvasStyle = this.getCanvasStyle();
      if (this.drawState === stateMap.drawRects) {
        this.viewTrack();
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
    getImageStyle() {
      const { width, height } = this.imageSize;
      return {
        width: `${(width / this.relativeScale) * this.scale}px`,
        height: `${(height / this.relativeScale) * this.scale}px`
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
      if (this.mouseState !== mouseType.move) {
        return;
      }
      this.moveCanvas(event);
    },
    handleMouseUp(event) {
      this.mouseState = mouseType.up;
      if (!event || !this.$el.contains(event.target)) {
        // 鼠標移出容器的兼容
        this.currentPosition = null;
        return;
      }
      const vertex = transformVertex(event, this.scale);
      let markId = null;

      switch (this.drawState) {
        case stateMap.circle:
          //  打点
          if (
            // 鼠标移动了则不画标注
            this.prevPosition.clientX !== this.currentPosition.clientX ||
            this.prevPosition.clientY !== this.currentPosition.clientY
          ) {
            break;
          }
          markId = this.isMarkExist(event);
          if (this.markList.length && markId) {
            //  删除打点
            this.removeMark(markId);
          } else {
            this.addMark(event, vertex);
          }
          break;
        case stateMap.drawRects:
          //  画轨迹
          break;
        default:
          break;
      }
      this.currentPosition = null;
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
      this.imageStyle = this.getImageStyle();
      this.setMarksScalePosition();
      this.computeLocus();
    },
    setMarksScalePosition() {
      this.markList.forEach(item => {
        item.position.left = item.position.initLeft * this.scale;
        item.position.top = item.position.initTop * this.scale;
      });
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
    isMarkExist(event) {
      let id = null;
      if (!this.markList.length) {
        return null;
      }
      const hasMark = event.target.classList.contains("delete-icon");
      if (hasMark) {
        id = event.target.getAttribute("markId");
      }
      return id;
    },
    addMark(event, vertex) {
      if (!this.isInImageArea(vertex)) {
        return;
      }
      const mark = {
        id: `${+new Date()}`,
        position: {
          left: vertex.x * this.scale,
          top: vertex.y * this.scale,
          initLeft: vertex.x,
          initTop: vertex.y
        }
      };
      this.markList.push(mark);
      this.$emit("handleMark", this.markList);
    },
    removeMark(markId) {
      const targetIndex = this.markList.findIndex(item => item.id === markId);
      if (targetIndex !== -1) {
        this.markList.splice(targetIndex, 1);
      }
    },
    copy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    computeLocus() {
      const point = this.markList.map(item => {
        const { position } = item;
        return {
          x: position.left,
          y: position.top
        };
      });
      this.arrowLines = [];
      const arrowLineOption = this.copy(options.drawArrowLineOption);
      let locus = [];
      if (point.length > 0) {
        point.reduce((arr, cur, index) => {
          let cur2Scale = {
            x: Number(cur.x.toFixed(2)),
            y: Number(cur.y.toFixed(2))
          };
          if (index !== 0) {
            locus.push({
              vertexes: [arr[arr.length - 1], cur2Scale],
              options: arrowLineOption
            });
            if (index === point.length - 1) {
              locus.push({
                vertexes: [cur2Scale, arr[0]],
                options: arrowLineOption
              });
            }
            arr.push(cur2Scale);
          } else {
            arr.push(cur2Scale);
          }
          return arr;
        }, []);
        this.arrowLines = locus;
        // 重绘canvas
        this.renderKey = Math.random();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.track-map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .canvas {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    .track-arrow,
    .marks-area {
      width: 100%;
      height: 100%;
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>