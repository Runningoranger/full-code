<template>
  <div :style="markStyle" class="mark-point">
    <div class="box">
      <i class="el-icon-location mark-icon" :markId="mark.id"></i>
      <i v-if="drawState === 1" class="el-icon-error delete-icon" :markId="mark.id"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mark: {
      type: Object,
      default: () => {
        return {};
      }
    },
    drawState: {
      type: Number
    }

  },
  data() {
    return {
      markStyle: {}
    };
  },
  watch: {
    mark: {
      deep: true,
      handler() {
        this.markStyle = this.getmarkStyle();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.markStyle = this.getmarkStyle();
    },
    getmarkStyle() {
      const { position } = this.mark;
      return {
        top: `${position.top}px`,
        left: `${position.left}px`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.mark-point {
  position: absolute;
  width: 24px;
  height: 24px;
  background-color:transparent;
  transform: translate(-12px, -24px);
  .box {
    width: 100%;
    height: 100%;
    background:transparent;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      .delete-icon {
        display: block;
      }
    }
    .delete-icon {
      position: absolute;
      transform: translate(-50%, -55%);
      left: 50%;
      top: 50%;
      cursor: pointer;
      font-size: 14px;
      color: black;
      display: none;
    }
    .mark-icon {
      font-size: 24px;
      color: red;
    }
  }
  
}
</style>