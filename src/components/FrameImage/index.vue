<template>
  <div ref="container" class="frame-image">
    <div :style="canvasBoxStyle" class="canvas-area">
      <img
        :key="imageSrc"
        :style="imageStyle"
        :src="imageSrc"
      />
      <canvas
        ref="frameImage"
        :width="imageWidth"
        :height="imageHeight"
      />
    </div>
  </div>
</template>

<script>
import { getDrawingOrigin } from "./utils";
import { cloneDeep } from 'lodash';
import { DrawingTools } from './utils/canvas';
import { getBenchmark, getScaleValue } from './utils/imageUtils';

export default {
  props: {
    imageSrc: {
      require: true,
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    drawerType: {
      type: String,
      default: "frame"
    }
  },
  data() {
    return {
      containerSize: {
        width: 0,
        height: 0
      },
      imageOriginSize: {
        width: 0,
        height: 0
      },
      scaleValue: 1
    }
  },
  computed: {
    imageStyle() {
      return {
        width: `${this.imageWidth}px`,
        height: `${this.imageHeight}px`,
      }
    },
    imageWidth() {
      return parseInt(this.imageOriginSize.width.toFixed(0)) * this.scaleValue;
    },
    imageHeight() {
      return parseInt(this.imageOriginSize.height.toFixed(0)) * this.scaleValue;
    },
    canvasBoxStyle() {
      return {
        width: `${this.containerSize.width}px`,
        height: `${this.containerSize.height}px`,
      }
    }
  },
  watch: {
    containerSize: {
      immediate: true,
      handler(val) {
        if (!val || !Object.keys(val).length || !this.imageSrc) return;
        const image = new Image();
        image.src = this.imageSrc;
        image.onload = () => {
          this.imageOriginSize = {
            width: image.width,
            height: image.height,
          };
          const benchmark = getBenchmark(this.imageOriginSize, val);
          this.scaleValue = getScaleValue(val, benchmark);
          this.data && this.data.length && this.setFrame();
        };
      }
    },
    data: {
      handler(val) {
        val && val.length && this.setFrame();
      }
    }
  },
  mounted() {
    this.getContainerSize();
  },
  methods: {
    getContainerSize() {
      this.$nextTick(() => {
        if (this.$refs.container) {
          const { width } = getComputedStyle(this.$refs.container);
          this.containerSize.width = parseInt(width);
          this.containerSize.height = parseInt(width) / (1920 / 1080);
        }
      });
    },
    setFrame() {
      const frameImage = this.$refs.frameImage;
      if (!frameImage) {
        return;
      }
      const ctx = frameImage.getContext("2d");

      if (!ctx) {
        console.warn("ctx 缺失");
        return;
      }
      this.$nextTick(() => {
        ctx.clearRect(0, 0, this.containerSize.width, this.containerSize.height);
        const drawerObj = getDrawingOrigin(this.data);
        const drawData = cloneDeep(drawerObj);
        const size = {
          width: this.imageOriginSize.width,
          height: this.imageOriginSize.height,
          imageWidth: this.imageWidth,
          imageHeight: this.imageHeight,
        }
        this.handleDrawType(this.drawerType, drawData, ctx, size);
      });
    },
    canvasDraw(type, funcName, data, ctx, size) {
      // 检测type对应数据是否存在
      if (data) {
        DrawingTools[funcName](data, ctx, size);
      } else {
        console.error(`绘制检测图层时：${type}数据缺失`);
      }
    },
    handleDrawType(type, drawData, ctx, size) {
      const point = drawData?.point?.map(item => { return { ...item, pointRadius: 1.5 } });
      const line = drawData?.line?.map(item => { return { ...item, lineWidth: 1.5, pointRadius: 1.5 } });
      switch(type) {
        case 'frame': this.canvasDraw('frame', 'drawPolygons', drawData.frame, ctx, size); return;
        case 'point': this.canvasDraw('point', 'drawPoints', point, ctx, size); return;
        case 'line': this.canvasDraw('line', 'drawLines', line, ctx, size); return;
        default: console.warn(`检测模式 ${type} 还未被实现...`);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.frame-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  img,
  canvas {
    position: absolute;
  }

  img {
    z-index: 1;
  }

  canvas {
    z-index: 2;
  }

  .canvas-area {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
