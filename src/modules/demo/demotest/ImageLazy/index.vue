<template>
  <div class="image-lazy">
    <!-- 利用intersectionobserver 自定义指令实现的图片懒加载 -->
    <ul class="image-list">
      <li v-for="(item,i) in imageList" :key="i" class="item">
        <img v-imagelazy="item.src" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
const imgs = [];
for(let i = 1; i <= 6; i++) {
  const img = require(`@/assets/${i}.jpg`);
  imgs.push({ src: img });
}

export default {
  data() {
    return {
      imageList: imgs
    };
  },
};
</script>

<style lang="scss" scoped>
.image-lazy {
  width: 600px;
  height: 200px;
  overflow: auto;
  .item {
    width: 200px;
    height: 200px;
    margin: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .el-image {
    width: 200px;
    height: 200px;
    display: block;
  }
}
</style>