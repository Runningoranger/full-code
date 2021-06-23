<template>
  <div v-if="crumbs.length" class="bread-crumb">
    <el-breadcrumb :separator="configs.separator">
      <el-breadcrumb-item v-for="crumb in crumbs" :key="crumb.key" :to="crumb.to">{{ crumb.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    crumbs: {
      type: Array,
      default: () => {
        return []
      }
    },
    configs: {
      type: Object,
      default: () => {
        return { 
          separator: "/"
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.bread-crumb {
  
}
</style>