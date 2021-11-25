<template>
  <div :class="['global-side-nav', isCollapse && 'isCollapse']">
    <section class="list">
      <el-menu :collapse="isCollapse">
        <template v-for="(item, i) in navList">
          <el-submenu v-if="item.submenus.length" :key="i" :index="item.id">
            <template slot="title">
              <i :class="[item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="(subitem, s) in item.submenus"
              :key="s"
              :index="subitem.id"
              @click="$router.push({ path: subitem.path })"
            >
              <i :class="[subitem.icon]"></i>
              <span>{{ subitem.name }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :key="i" :index="item.id" @click="$router.push({ path: item.path })">
            <i :class="[item.icon]"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </section>
    <div @click="isCollapse = !isCollapse" class="tool-expand">
      <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      navList: [
        {
          id: "1",
          icon: "el-icon-s-home",
          name: "home",
          path: "/home",
          submenus: [],
        },
        {
          id: "2",
          icon: "el-icon-s-marketing",
          name: "e-chart",
          path: "/e-chart",
          submenus: [],
        },
        {
          id: "3",
          icon: "el-icon-document",
          name: "form",
          path: "/form",
          submenus: [],
        }
      ],
    };
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
.global-side-nav {
  width: 190px;
  height: 100%;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  background-color: #14447A;
  &.isCollapse {
    width: 65px;
  }
  .tool-expand {
    height: 30px;
    text-align: left;
    padding: 10px 22px;
    line-height: 30px;
    cursor: pointer;
    font-size: 24px;
  }
  .list {
    flex: 1 0 0;
    overflow: auto;
    width: 100%;
    /deep/.el-menu {
      border-right: none;
      background-color: #14447A;
      .el-menu-item {
        span {
          color: #cbcbcb;
        }
      }
    }
  }
}
</style>