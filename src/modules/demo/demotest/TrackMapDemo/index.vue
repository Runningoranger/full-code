<template>
  <div class="track-demo-wrap">
    <div class="action">
      <el-button @click.stop="handleChangeState('circle')">标点</el-button>
      <el-button @click.stop="handleChangeState('drawRects')">显示点位和轨迹</el-button>
      <el-button @click.stop="handleChangeState('none')">清空</el-button>
    </div>
    <TrackMap
      :drawState="drawState"
      :imageSrc="imageSrc"
      :marks="marks"
      :mapSize="{ width: '1248px', height: '600px' }"
      @handleMark="handleMark"
      class="track-demo"
    />
  </div>
</template>

<script>
import TrackMap from "@/components/TrackMap";
const drawState = {
  none: 0, // 无操作
  circle: 1, // 手动标注
  drawRects: 2 // 显示轨迹
};
export default {
  components: {
    TrackMap
  },
  data() {
    return {
      marks: [],
      drawState: 0,
      imageSrc: "static/images/we.jpg"
    };
  },
  methods: {
    handleChangeState(type) {
      this.drawState = drawState[type];
      switch (this.drawState) {
        case 2:
        if (!this.marks.length) {
          this.$message.warning("请先标点");
        }
        break;
        case 0:
        this.marks = []
        break;
      }
    },
    handleMark(marks) {
      this.marks = marks;
    }
  }
};
</script>

<style lang="scss" scoped>
.track-demo {
  background: #eeeeee;
}
.track-demo-wrap {
  width: 100%;
  height: calc(100% - 40px);
}
.action {
  margin: 25px 0;
}
</style>