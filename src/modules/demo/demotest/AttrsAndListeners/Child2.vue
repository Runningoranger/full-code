<template>
  <div class="child2-container">
    <h2>child2 inner</h2>
    <div>
      <p :style="{ color }">{{ (color) }}</p>
      <el-button @click="handleSubmitToDemo"> to demo say hello </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleSubmitToDemo() {
      this.$emit("submit", "hello demo")
    }
  }
}
</script>
<style lang="scss" scoped>
.child2-container {
  width: 200px;
  height: 200px;
  border: 1px solid #eeeeee;
  margin: 10px;
}
</style>