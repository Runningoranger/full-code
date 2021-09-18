<template>
  <div class="header-crumbs">
    <ul class="crumbs-content">
      <li 
        v-for="(item,index) in crumbsData" 
        :key="index"
        :class="['crumbs-item', index !== 0 && 'can-click']"
        @click="handleClick(item)"
      >
        <span>{{ item.name }}</span>
        <span v-if="showSeparator(index)" class="separator">{{ separator }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    separator: {
      type: String,
      default: "/"
    }
  },
  data() {
    return {

    }
  },
  computed: {
    crumbsData() {
      const { meta, name } = this.$route;
      if (meta && meta.crumbs) {
        return meta.crumbs;
      }else {
        return [
          { name }
        ]
      }
    }
  },
  methods: {
    showSeparator(index) {
      return this.crumbsData.length > 1 && index !== (this.crumbsData.length - 1);
    },
    handleClick(item) {
      const { route } = item;
      if (route?.name || route?.path) {
        if (this.$route.name === route.name) return;
        this.$router.push(route);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-crumbs {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #C4E2D8;
  color: black;
  border-radius: 4px 4px 0 0;
  .crumbs-content {
    display: flex;
    align-items: center;
    .crumbs-item {
      cursor: not-allowed;
      .separator {
        padding: 0 10px;
      }
      &.can-click {
        color: #576069;
        cursor: pointer;
      }
    }
  }
}
</style>