<template>
  <div class="home-top-nav">
    <div class="left">
      <span></span>
    </div>
    <div class="right">
      <ul class="list">
        <router-link v-for="(item, i) in navList" :key="i" :to="item.path">
          <li>{{ item.name }}</li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [{ name: "demo", path: "/demo" }],
    };
  },
};
</script>

<style lang="scss" scoped>
.home-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #eee;
  padding: 0 24px;
  .right {
    height: 100%;
    .list {
      display: flex;
      align-items: center;
      height: 100%;
      li {
        padding: 0 16px;
      }
    }
  }
}
</style>