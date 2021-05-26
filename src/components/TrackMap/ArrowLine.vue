<template>
  <div class="arrow-line">
    <slot name="container"></slot>
    <canvas ref="canvas" class="arrow-canvas"></canvas>
  </div>
</template>

<script>
import { drawArrow, getArrowPoint, drawLine } from "./utils";
export default {
  props: {
    lines: {
      type: Array
    }
  },
  data() {
    return {
      canvasElem: null,
      containerStyle: null,
      canvasCtx: null,
      arrowLines: []
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.lines.length) {
        return
      }
      let containerStyle = this.getComputedStyle();
      const canvasElem = this.$refs.canvas;
      this.canvasElem = canvasElem;
      this.setArrowLines(this.copy(this.lines));
      this.initCanvas(containerStyle);
      this.drawArrowLines(this.copy(this.lines));
    },
    copy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getContainer() {
      const containers = this.$slots.container;
      if (containers && containers.length === 1) {
        const container = containers[0].elm;
        return container;
      } else throw new Error("the slot container must exist and be unique");
    },
    getComputedStyle() {
      const container = this.getContainer();
      this.containerStyle = container.getBoundingClientRect();
      if (!this.containerStyle.height) {
        throw new Error("the container height is unset");
      }
      return this.containerStyle;
    },
    initCanvas(containerStyle) {
      const canvas = this.canvasElem;
      const { width, height } = containerStyle;
      if (!width || !height) {
        throw new Error(`width is ${width},height is ${height}`);
      }
      canvas.width = width;
      canvas.height = height;
      // 获取画笔
      this.canvasCtx = canvas.getContext("2d");
    },
    setArrowLines(arrowLines) {
      this.arrowLines = arrowLines || [];
    },
    drawStaticLines(lines = []) {
      const ctx = this.canvasCtx;
      lines.forEach(line => {
        const {
          vertexes: [preVertex, curVertex],
          options
        } = line;
        drawLine(ctx, preVertex, curVertex, options);
      });
    },
    drawArrowLines(arrowLines = []) {
      this.drawStaticLines(arrowLines);
      this.drawStaticArrows(arrowLines);
    },
    drawStaticArrows(arrowLines = []) {
      arrowLines.forEach(line => {
        const { vertexes, options } = line;
        this.drawArrow(vertexes, options);
      });
    },
    drawArrow(vertexes, options) {
      const arrowLength = 15;
      const [start, end] = vertexes;
      const { leftArrowPoint, rightArrowPoint } = getArrowPoint(
        start,
        end,
        arrowLength
      );
      const ctx = this.canvasCtx;
      const arrowPoints = {
        endPoint: end,
        leftArrowPoint,
        rightArrowPoint
      };
      const _options = options;
      drawArrow(ctx, arrowPoints, _options);
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow-line {
  width: 100%;
  height: 100%;
  .arrow-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>