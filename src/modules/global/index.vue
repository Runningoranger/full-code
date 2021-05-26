<template>
  <div class="home-content">
    <TopNav />
    <section class="home-contannier">
      <SideNav />
      <main class="home-main">
        <slot></slot>
      </main>
    </section>
  </div>
</template>

<script>
import TopNav from "./TopNav";
import SideNav from "./SideNav";
export default {
  components: {
    TopNav,
    SideNav
  },
  data() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.home-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .home-contannier {
    display: flex;
    justify-content: space-between;
    flex: 1;
    overflow: hidden;
    .home-main {
      flex: 1;
      overflow: hidden;
      padding: 24px;
    }
  } 
  
}
</style>