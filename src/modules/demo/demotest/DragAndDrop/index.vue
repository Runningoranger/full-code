<template>
  <div>
    <img 
      v-if="!Object.keys(imageData).length" 
      v-drag="{ imageData: { smallSrc: imgSrc, src: imgSrc } }" 
      :src="imgSrc" 
      alt=""
    />
    <div v-drop="handleDrop" class="drop-box">
      <img v-if="Object.keys(imageData).length" :src="imageData.src" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: "static/images/pig.jpg",
      imageData: {}
    }
  },
  methods: {
    handleDrop({ imageData }) {
      this.imageData = imageData;
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-box {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>