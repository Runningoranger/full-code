<template>
  <div class="attr-listeners">
    <p>parent</p>
    (v-bind = $attrs) And (v-on = $listeners) used
    <Child1 
      :color ="color" 
      @submit="submit"
    />
    <section>
      <span>来自child2的传值</span><input v-model="value"  type="text" /><br/>
      <span>直接传递给child2的值</span><input v-model="color"  type="text" />
    </section>
    
  </div>  
</template>

<script>
import Child1 from "./Child1";
export default {
  components: {
    Child1
  },
  data() {
    return {
      color: "red",
      value: ""
    }
  },
  methods: {
    submit(str) {
      this.value = str;
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-listeners {
  width: 400px;
  height: 500px;
  border: 1px solid #eeeeee;
}
</style>