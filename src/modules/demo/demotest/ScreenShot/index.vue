<template>
  <div ref="container" class="screen-shot">
    <section ref="content" @mousedown="screenShotStart" class="content">
      <!-- 图片层 -->
      <div class="content-img">
        <img :src="imageUrl" crossorigin="anonymous" :draggable="false" alt="bg" />
      </div>
      <!-- 遮罩层 -->
      <div v-if="canShotScreen" class="mask"></div>
      <!-- 截图层 -->
      <div 
       v-if="showShotScreenBox"
       ref="shotbox"
       :style="screenShotBoxStyle" 
       class="screen-shot-box"
      >
        <div class="screen-shot-image">
          <img :src="imageUrl" :style="screenShotImgStyle" :draggable="false" alt="bg" />
        </div>
      </div>
    </section>
    <el-button @click="handleScreenShot">开始截图</el-button>
    <el-button @click="handleCancelScreenShot">取消截图</el-button>
  </div>
</template>

<script>
const imageUrl = require('@/assets/images/dxt.jpg');
export default {
  data() {
    return {
      imageUrl,
      canShotScreen: false,
      screenShotBox: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },
      showShotScreenBox: false
    }
  },
  computed: {
    screenShotBoxStyle() {
      return {
        width:`${this.screenShotBox.width}px`,
        height: `${this.screenShotBox.height}px`,
        left: `${this.screenShotBox.left}px`,
        top: `${this.screenShotBox.top}px`
      }
    },
    screenShotImgStyle() {
      return {
        left: `${-this.screenShotBox.left}px`,
        top: `${-this.screenShotBox.top}px`
      }
    },
  },
  mounted() {
    const { width, height } = getComputedStyle(this.$refs.container);
    this.outerWidth = parseInt(width);
    this.outerHeight = parseInt(height);
  },
  methods: {
    handleScreenShot() {
      //  开启遮罩
      this.canShotScreen = true;
    },
    handleCancelScreenShot() {
      this.canShotScreen = false;
      this.showShotScreenBox = false;
      this.screenShotBox = {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      }
    },
    // startShotScreen(event) {
    //   if (!this.canShotScreen) return;
    //   const { left, top } = this.$refs.content.getBoundingClientRect();
    //   this.screenShotBox.top = event.clientY - top;
    //   this.screenShotBox.left = event.clientX - left;
    //   this.screenShotBox.width = 0;
    //   this.screenShotBox.height = 0;
      
    //   document.addEventListener("mousemove", this.shotScreenIng);
    //   document.addEventListener("mouseup", this.shotScreenEnd);
    // },
    // shotScreenIng(event) {
    //   this.showShotScreenBox = true;
    //   const { left, top } = this.$refs.content.getBoundingClientRect();

    //   // 计算框位置
    //   const endLeft = event.clientX - left;
    //   const endTop = event.clientY - top;
    //   const width = endLeft - this.screenShotBox.left;
    //   const height = endTop - this.screenShotBox.top;

    //   const borderWidth = 2;

    //   this.screenShotBox.width = width < 0 ? 0 : width;
    //   this.screenShotBox.height = height < 0 ? 0 : height;

    //   this.screenShotBox.width =
    //     width + this.screenShotBox.left > this.outerWidth
    //       ? this.outerWidth - this.screenShotBox.left - borderWidth
    //       : width;
    //   this.screenShotBox.height =
    //     height + this.screenShotBox.top > this.outerHeight
    //       ? this.outerHeight - this.screenShotBox.top - borderWidth
    //       : height;
    // },
    // shotScreenEnd(event) {
    //   this.shotScreenIng(event);
    //   document.removeEventListener("mousemove", this.shotScreenIng);
    //   document.removeEventListener("mouseup", this.shotScreenEnd);
    // },
    screenShotStart(event) {
      if (!this.canShotScreen) return;
      const { width, height, left, top } = this.$refs.content.getBoundingClientRect();
      const maxW = width + left;
      const maxT = top + height;
      // 左临界点
      if (event.clientX > maxW) {
        this.screenShotBox.left = maxW - left;
      }else {
        this.screenShotBox.left = event.clientX - left;
      }
      // 下临界点
      if (event.clientY > maxT) {
        this.screenShotBox.top = maxT - top;
      }else {
        this.screenShotBox.top = event.clientY - top;
      }
      this.screenShotBox.width = 0;
      this.screenShotBox.height = 0;

      document.addEventListener("mousemove", this.screenShotMove);
      document.addEventListener("mouseup", this.screenShotEnd);
    },
    screenShotMove(event) {
      this.showShotScreenBox = true;
      const { left: cleft, top: ctop } = this.$refs.content.getBoundingClientRect();
      const endLeft = event.clientX - cleft;
      const endTop = event.clientY - ctop;
      const { left, top } = this.screenShotBox;
      this.screenShotBox.width = endLeft - left;
      this.screenShotBox.height = endTop - top;
    },
    screenShotEnd(event) {
      this.screenShotMove(event);
      document.removeEventListener("mousemove", this.screenShotMove);
      document.removeEventListener("mouseup", this.screenShotEnd);
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-shot {
  .content {
    width: 400px;
    height: 400px;
    margin-left: 100px;
    position: relative;
    overflow: hidden;
    .content-img {
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        user-select: none;
      }
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.5;
    }
    .screen-shot-box {
      position: absolute;
      user-select: none;
      cursor: move;
      .screen-shot-image {
        overflow: hidden;
        position: relative;
        height: 100%;
        box-sizing: border-box;
        box-shadow: 0 0 0 2px rgb(98, 150, 255 / 80%);
        img {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 400px;
          height: 400px;
        }
      }
    }
  }
}
</style>