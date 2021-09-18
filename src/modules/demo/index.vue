s<template>
  <div class="demo-wrapper">
    <div class="sidebar">
      <ul>
        <li 
        v-for="(com,i) in arrComponents" 
        :key="i"
        @click="handleClickItem(com)"
        :class="{ active: activeComponent === com }"
        >
        {{ com }}
        </li>
      </ul>
    </div>
    <div class="content">
      <component :is="activeComponent" v-if="activeComponent" />
    </div>
  </div>  
</template>

<script>
const components = {};
const demoComps = require.context("./demotest", true, /index.vue$/);
const setComps = (component, componentName) => {
  component.key = componentName;
  component.componentName = componentName;
  components[componentName] = component;
}
demoComps.keys().map(url => {
  setComps(demoComps(url).default, url.replace(/^\.\/|\/index.vue$/g,''));
});

export default {
  components,
  data() {
    return {
      activeComponent: "",
      arrComponents: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.arrComponents = Object.keys(components);
      this.activeComponent = this.arrComponents[0];
    },
    handleClickItem(key) {
      this.activeComponent = key;
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-wrapper {
  display: flex;
  height: 100%;
  .sidebar {
    width: 160px;
    border: 1px solid #eee;
    border-radius: 10px 0 0 10px;
    overflow-x: hidden;
    overflow-y: auto;
    li {
      height: 48px;
      width: 100%;
      text-align: left;
      line-height: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      border-radius: 10px;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .active {
      background-color: pink;
    }
  }
  .content {
    flex: 1;
    border: 1px solid #eee;
    border-left: none;
    border-radius: 0 10px 10px 0;
    padding: 24px;
  }
}
</style>