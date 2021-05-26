<template>
  <div class="read-more">
    <div :title="limitValue" class="read-more__slice">{{ limitValue }}</div>
    <el-popover
      v-if="data.length && data.length > this.maxLen"
      placement="right-start"
      :width="width"
      trigger="hover"
      popper-class="read-more__popover"
      >
      <section class="popover-content">
        <div v-for="(item,i) in data.slice(this.maxLen, this.data.length)" :key="i" class="list-item">
          <el-tooltip 
            :disabled="isDisabledTooltip" 
            class="item" 
            effect="light" 
            :content="item.text" 
            placement="right"
          > 
            <div @mouseover="onMouseOver('itemText', i)" class="item-text">
              <span ref="itemText">{{ item.text }}</span>
            </div>
          </el-tooltip>
        </div>
      </section>
      <div slot="reference" class="dot">...</div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    width: {  //  popover 宽度
      type: Number,
      default: 250
    },
    data: {  //  要展示的数据列表
      type: Array,
      default: () => {
        return []
      }
    },
    maxLen: {  //  超过最大限制数后显示“...”
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      isDisabledTooltip: false
    }
  },
  computed: {
    limitValue() {
      if (!this.data.length) return "";
      return this.data.slice(0, this.maxLen).map(item => item.text).join("、");
    }
  },
  methods: {
    onMouseOver(str, index) {
      let parentWidth = this.$refs[str][index].parentNode.offsetWidth;
      let contentWidth = this.$refs[str][index].offsetWidth;
      this.isDisabledTooltip = contentWidth <= parentWidth;
    },
  }
}
</script>

<style lang="scss" scoped>
.read-more {
  display: flex;
  align-items: center;

  .read-more__slice {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dot {
  width: 25px;
  height: 25px;
  font-size: 20px;
  text-align: center;
  line-height: 14px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
<style lang="scss">
.read-more__popover {
  .popover-content {
    height: 260px;
    overflow: auto;

    .list-item {
      height: 30px;
      line-height: 30px;
      padding-left: 15px;

      .item-text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>