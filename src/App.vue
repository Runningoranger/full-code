<template>
  <GlobalView>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </GlobalView>
</template>

<script>
import GlobalView from "@/common/global";
export default {
  name: 'App',
  components: {
    GlobalView
  }
}
</script>

