<template>
  <div class="module-layout">
    <HeaderCrumbs />
    <section class="module-layout-main">
      <slot></slot>
    </section>
  </div>
</template>

<script>
import HeaderCrumbs from "@/components/HeaderCrumbs";
export default {
  components: {
    HeaderCrumbs
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 0 0 4px 4px;
  .module-layout-main {
    flex: 1 0 0;
    overflow: hidden;
    background-color: #ffffff;
  }
}
</style>