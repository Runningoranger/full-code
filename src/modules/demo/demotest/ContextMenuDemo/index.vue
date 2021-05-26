<template>
  <div class="context-menu">
    <div v-menu="{ imageData: { src: 'static/images/pig.png', smallSrc: 'static/images/pig.png' }, type: 'FACE' }" class="box"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>