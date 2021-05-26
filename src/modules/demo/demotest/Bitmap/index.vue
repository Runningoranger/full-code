<template>
  <div class="bit-map-demo">
    <div class="action">
      <el-button @click.stop="handleChangeState('circle')">标点</el-button>
      <el-button @click.stop="handleChangeState('drawRects')">显示点位</el-button>
      <el-button @click.stop="handleChangeState('none')">清空</el-button>
    </div>
    <Bitmap 
    :rects="rects"
    :drawState="drawState"
    :imageSrc="imageSrc"
    class="bit-map"
    />
  </div>
</template>

<script>
const drawState = {
  none: 0, // 无操作
  circle: 1, // 手动标注
  drawRects: 2
};
import Bitmap from "@/components/Bitmap";
export default {
  components: {
    Bitmap
  },
  data() {
    return {
      imageSrc: "static/images/we.jpg",
      drawState: 0,
      rects: [],
      lineOption: {
        lineColor: "#00E1FF",
        fillColor: "#00E1FF",
        weight: 2,
        opacity: 1,
        dashed: false,
        dashedConfig: [5, 5, 5],
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    handleChangeState(type) {
      this.drawState = drawState[type];
    },
    initData() {
      const marks = [
        { position: { start: { x: 124, y: 245 } } },
        { position: { start: { x: 132, y: 324 } } },
        { position: { start: { x: 145, y: 456 } } },
        { position: { start: { x: 245, y: 556 } } },
        { position: { start: { x: 345, y: 56 } } },
        { position: { start: { x: 42, y: 356 } } },
        { position: { start: { x: 235, y: 89 } } },
        { position: { start: { x: 645, y: 156 } } }
      ]
      this.rects = marks.map(_ => {
        const { start: { x, y } } = _.position;
        return {
          vertexes: [ { x, y } ],
          options: { ...this.lineOption }
        }
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.action {
  margin: 15px 0;
}
.bit-map {
  width: 900px;
  height: 640px;
  background-color: black;
}
</style>