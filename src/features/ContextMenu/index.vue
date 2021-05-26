<template>
  <transition appear name="fade" mode="out-in">
    <div ref="parentMenu" v-show="menuList.length" :style="parentStyle" class="parent-menu">
      <div
        :class="[typeFlag && parentIndex === 0 && 'border', 'parent-item']"
        v-for="(parentItem, parentIndex) in menuList"
        :key="parentIndex"
        @click.stop="handlerWrapper(parentItem.onClick)"
        @mouseenter="handleMouseEnter(parentItem)"
        @mouseleave="visible = false"
      >
        <div v-if="parentItem.menu">
          <div>{{ parentItem.label }}</div>
          <i class="iconfont icon-arrowR"></i>
          <transition appear name="fade" mode="out-in">
            <div ref="subMenu" v-show="visible" :style="subStyle" class="sub-menu">
              <div class="mask">
                <div
                  v-for="(subItem, subIndex) in parentItem.menu"
                  :key="subIndex"
                  @click.stop="handlerWrapper(subItem.onClick)"
                  class="sub-item"
                >
                  {{ subItem.label }}
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else>{{ parentItem.label }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import contextMenuList from "@/utils/contextMenuList";

export default {
  name: "ContextMenu",
  props: {
    coordinate: {
      type: Object,
      default() {
        return {};
      },
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      typeFlag: false, // 模块类型判断
      menuList: this.data.type ? contextMenuList[this.data.type] : [], // 右键菜单列表
      parentMenuWidth: 0, // 父菜单宽 高 偏移量
      parentMenuHeight: 0,
      parentLeft: 0,
      parentTop: 0,
      subMenuWidth: 0, // 子菜单宽 高 偏移量
      subMenuHeight: 0,
      subLeft: 0,
      subTop: 0,
      visible: false, // 子菜单显示隐藏
    };
  },
  computed: {
    parentStyle() {
      return {
        left: this.parentLeft + "px",
        top: this.parentTop + "px",
      };
    },
    subStyle() {
      return {
        left: this.subLeft + "px",
        top: this.subTop + "px",
      };
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.subMenuWidth = this.$refs.subMenu[0].offsetWidth;
            this.subMenuHeight = this.$refs.subMenu[0].offsetHeight;
          });
        }
      },
    },
  },
  mounted() {
    if (navigator.platform === "Linux x86_64") {
      let flag = true;
      for (let i = 0; i < this.menuList.length; i++) {
        const element = this.menuList[i];
        if (element.moduleCode && element.moduleCode === "cancel") {
          flag = false;
        }
      }
      let cancel = {
        moduleCode: "cancel",
        label: "退出",
        onClick: () => {
          this.$destroy();
        }
      }
      flag && this.menuList.push(cancel);
    }
    // visible 这个变值得操作是为了让watch里能够提前获取到subMenu的宽高
    this.visible = true;
    this.$nextTick(() => {
      this.visible = false;
      this.parentMenuWidth = this.$refs.parentMenu.offsetWidth;
      this.parentMenuHeight = this.$refs.parentMenu.offsetHeight;

      if (this.coordinate.x + this.parentMenuWidth > this.coordinate.windowW) {
        this.coordinate.x = this.coordinate.x - this.parentMenuWidth;
      }

      if (this.coordinate.y + this.parentMenuHeight > this.coordinate.windowH) {
        this.coordinate.y = this.coordinate.y - this.parentMenuHeight;
      }

      this.parentLeft = this.coordinate.x;
      this.parentTop = this.coordinate.y;
    });
  },
  methods: {
    handlerWrapper(fn) {
      if (typeof fn === "function") {
        this.data.imageData.routerName = this.$route.name;
        fn.call(this, this.data.imageData);
        this.menuList = [];
      }
    },
    handleMouseEnter(parentItem) {
      if (parentItem.menu) {
        this.subLeft = this.parentMenuWidth;
        this.subTop = -12;

        if (this.coordinate.x + this.parentMenuWidth + this.subMenuWidth > this.coordinate.windowW) {
          this.subLeft = this.parentMenuWidth - this.subMenuWidth - this.subMenuWidth + 16;
        }

        if (this.coordinate.y + this.parentMenuHeight + this.subMenuHeight > this.coordinate.windowH) {
          this.subTop = -this.subMenuHeight + 44;
        }

        this.visible = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font-color: #d5d5d5;
$hover-color: #263451;
$background-color: #3b4764;

.parent-menu,
.sub-menu,
.mask {
  background-color: $background-color;
  border-radius: 3px;
  z-index: 9999;
  padding: 4px 0px;
  font-size: 14px;
  cursor: pointer;
}

.parent-menu {
  position: fixed;
}

.sub-menu {
  position: absolute;
  background-color: transparent;
}

.parent-item,
.sub-item {
  width: 88px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  display: block;
  color: $font-color;
  position: relative;
  &:hover {
    background: $hover-color;
    color: $font-color;
  }
}

.border {
  border-bottom: 1px solid #56668d;
}

.mask {
  padding: 8px 0px;
  margin: 0px 8px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}

i.iconfont {
  font-size: 12px;
  position: absolute;
  top: 2px;
  right: 5px;
}

.disable {
  cursor: not-allowed;
  color: #999;
}
</style>
