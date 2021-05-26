<template>
  <div :class="['global-side-nav', isCollapse && 'isCollapse']">
    <section class="list">
      <div @click="isCollapse = !isCollapse" class="tool-expand">
        <i class="el-icon-s-unfold"></i>
      </div>
      <el-menu :collapse="isCollapse">
        <template v-for="(item, i) in navs">
          <el-submenu v-if="item.submenus.length" :key="i" :index="item.id">
            <template slot="title">
              <i :class="[item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="(subitem, s) in item.submenus"
              :key="s"
              :index="subitem.id"
            >
              <i :class="[subitem.icon]"></i>
              <router-link :to="subitem.path"><span>{{ subitem.name }}</span></router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :key="i" :index="item.id">
            <i :class="[item.icon]"></i>
            <router-link :to="item.path"><span>{{ item.name }}</span></router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      icons: [
        "el-icon-s-help",
        "el-icon-help",
        "el-icon-s-flag",
        "el-icon-s-grid",
        "el-icon-document-copy",
        "el-icon-suitcase-1"
      ],
      navList: [
        {
          id: "1",
          icon: "el-icon-menu",
          name: "home",
          path: "/home",
          submenus: [],
        },
        {
          id: "2",
          icon: "el-icon-menu",
          name: "module2",
          path: "/home",
          submenus: [],
        },
        {
          id: "3",
          icon: "el-icon-menu",
          name: "module3",
          path: "/home",
          submenus: [
            {
              id: "3-1",
              icon: "el-icon-menu",
              name: "page1",
              path: "/home",
            },
            {
              id: "3-2",
              icon: "el-icon-menu",
              name: "page2",
              path: "/home",
            },
          ],
        },
      ],
    };
  },
  computed: {
    navs() {
      return this.navList.map(item => {
        if (item.submenus.length) {
         item.submenus = item.submenus.map(subItem => {
            return {
              ...subItem,
              icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            }
          })
        }
        return {
          ...item,
          icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        }
      })
    }
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
.global-side-nav {
  width: 190px;
  height: 100%;
  box-shadow: 0.520833vw 0 0.520833vw #eee;
  transition: all 0.5s ease;
  &.isCollapse {
    width: 65px;
  }
  .list {
    display: flex;
    flex-direction: column;
    width: 100%;
    /deep/.el-menu {
      border-right: none;
    }
    .tool-expand {
      height: 30px;
      text-align: left;
      padding: 10px 22px;
      line-height: 30px;
      cursor: pointer;
      font-size: 24px;
      border-bottom: 1px solid #eeeeee;
    }
    div {
      height: 40px;
      text-align: center;
      line-height: 40px;
    }
    .submenu-title {
      display: flex;
      align-items: center;
    }
  }
}
</style>