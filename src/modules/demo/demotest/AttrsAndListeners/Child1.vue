<template>
  <div class="child1-container">
    <p>Child1 inner</p> 
    <Child2 v-bind="$attrs" v-on="$listeners"></Child2>
  </div>
</template>

<script>
import Child2 from "./Child2";
export default {
  components: {
    Child2
  }
}
</script>

<style lang="scss" scoped>
.child1-container {
  width: 300px;
  height: 300px;
  border: 1px solid #eeeeee;
  margin: 10px;
}
</style>