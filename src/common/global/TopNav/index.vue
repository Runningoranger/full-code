<template>
  <div class="home-top-nav">
    <div class="left">
      <span>Free Style</span>
    </div>
    <div class="right">
      <ul class="top-nav-list">
        <li 
          v-for="(item, i) in navList" 
          :key="i" 
          @click="$router.push(item.route)"
          class="top-nav-item"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [{ name: "demo", route: { path: "/demo" } }],
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
  background-color: #14447A;
  padding: 0 24px;
  .right {
    height: 100%;
    .top-nav-list {
      display: flex;
      align-items: center;
      height: 100%;
      .top-nav-item {
        padding: 0 16px;
        cursor: pointer;
      }
    }
  }
}
</style>