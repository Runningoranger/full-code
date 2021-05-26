<template>
  <div :class="{ active: isActive }">
    actived
    <el-button @click="isActive = !isActive">切换</el-button>
    
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      isActive: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped> 
.active {
  color: red;
}
</style>