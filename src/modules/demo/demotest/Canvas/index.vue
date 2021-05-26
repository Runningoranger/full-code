<template>
  <div class="canvas-wrap">
    <canvas ref="canvas" :width="canvasSize.width" :height="canvasSize.height" class="canvas-box"></canvas>
    <div class="operation-area">
      <el-select v-model="activedType" @change="handleSelect" placeholder="请选择">
        <el-option 
          v-for="item in canvasTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { drawerClock } from "./utils/drawerClock";
export default {
  data() {
    return {
      timer: null,
      activedType: "clock",
      canvasTypes: [
        {
          label: "clock",
          value: "clock"
        },
        {
          label: "image",
          value: "image"
        }
      ],
      canvasElm: null,
      canvasSize: {
        width: 800,
        height: 400
      }
    }
  },
  computed: {
    drawerHandles() {
      return {
        clock: this.handleDrawerClock,
        image: this.handleDrawerImage
      }
    }
  },
  watch: {
    activedType: {
      immediate: true,
      handler() {
        this.clearTimer();
        this.canvasCtx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
      }
    }
  },
  mounted() {
    this.initCanvas();
    this.$nextTick(() => {
      this.drawerHandles[this.activedType]();
    });
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    handleSelect(value) {
      this.$nextTick(() => {
        this.drawerHandles[value]();
      });
    },
    handleDrawerClock() {
      this.timer = setInterval(()=> {
        this.initCanvas();
        this.$nextTick(() => {
          drawerClock(this.canvasCtx);
        });
      },1000);
    },
    handleDrawerImage() {
      
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    initCanvas() {
      const { width, height } = this.canvasSize;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      this.canvasElm = canvas;
      this.canvasCtx = ctx;
      canvas.width = width;
      canvas.height = height;
    },
  }
}
</script>

<style lang="scss" scoped>
.canvas-box {
  background: rgba(0,0,0,0.5);
}
</style>