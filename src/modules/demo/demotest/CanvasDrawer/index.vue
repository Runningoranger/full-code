<template>
  <div class="canvas-drawer">
    <canvas ref="canvasDrawer" :width="canvasConfig.width" :height="canvasConfig.height"></canvas>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      canvasConfig: {
        width: 830,
        height: 467
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.canvas-drawer {

}
</style>