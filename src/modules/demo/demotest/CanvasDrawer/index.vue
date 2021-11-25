<template>
  <div class="canvas-drawer">
    <ul class="drawer-list-content">
      <li v-for="item in list" :key="item.serial" class="frame-item">
        <FrameImage 
          :data="item.targetRois || []" 
          :imageSrc="item.imageSrc" 
          :drawerType="item.drawerType"
          class="image"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import listData from "./mork/listData.json";
import FrameImage from "@/components/FrameImage";

export default {
  components: {
    FrameImage
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    if (listData?.data?.list?.length) {
      this.list = listData.data.list.map(item => {
        return {
          ...item,
          imageSrc: require(`@/assets/images/canvas-demo.jpg`)
        }
      });
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.canvas-drawer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  flex: 1;
  overflow-y: auto;
  .drawer-list-content {
    display: flex;
    flex-wrap: wrap;
    .frame-item {
      width: 300px;
      height: 200px;
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
}
</style>