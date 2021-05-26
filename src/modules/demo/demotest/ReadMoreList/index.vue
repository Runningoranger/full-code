<template>
  <div class="read-more-list">
    <div class="header">
      <ReadMoreList :data="data" :maxLen="3"></ReadMoreList>
    </div>
    
  </div>
</template>

<script>
import ReadMoreList from "@/components/ReadMore";
export default {
  components: {
    ReadMoreList
  },
  data() {
    return {
      data: [
        { text: "你可能不太熟知的CSS布局技巧" },
        { text: "你可能不太熟知的CSS布局技巧" },
        { text: "你可能不太熟知的CSS布局技巧" },
        { text: "你可能不太熟知的CSS布局技巧" },
        { text: "你可能不太熟知的CSS布局技巧" },
        { text: "你可能不太熟知的CSS布局技巧" }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 350px;
}
</style>