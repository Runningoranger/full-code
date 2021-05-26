<template>
  <div v-loadmore="loadmore">
    <ul ref="scroller-wrap" v-if="list.length" class="scroller-wrap list"> 
      <li 
        v-for="(item, i) in list"
        :key="i"
        class="item"
      >{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      for (let i = 0; i < 40; i++) {
        this.list.push(i);
      } 
    },
    loadmore() {
      for (let i = 0; i < 10; i++) {
        this.list.push(i + this.list.length);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 600px;
  height: 650px;
  overflow: auto;
  .item {
    height: 40px;
  }
}
</style>