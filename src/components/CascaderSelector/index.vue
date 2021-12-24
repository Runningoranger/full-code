<template>
  <div class="cascader-selector">
    <el-popover
      placement="bottom-start"
      trigger="click"
      popper-class="cascader-selector-popper"
      v-model="visible"
      @hide="handlePopoverHide"
    >
      <section class="selector-content">
        <el-checkbox 
          v-if="needAllCheck" 
          v-model="allCheck" 
          :indeterminate="indeterminate" 
          @change="handleAllCheck" 
          class="all-check"
        />
        <!-- <el-cascader-panel
          :value="checkedValues"
          :border="false"
          :options="options" 
          :props="cascaderProps"
          @change="handleChange"
        >
        </el-cascader-panel> -->
        <el-cascader-panel 
          :options="options"
        >
        </el-cascader-panel>
        <div v-if="showButton" class="footer">
          <el-button type="text" @click="handleCancel">取消</el-button>
          <el-button size="small" color="primary" @click="handleConfirm">确定</el-button>
        </div>
      </section>
      <el-select 
        v-model="currentValue" 
        :style="{ width }" 
        :placeholder="selectPlaceholder" 
        slot="reference"
      />
    </el-popover>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
export default {
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    cascaderProps: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
          children: "children"
        }
      }
    },
    width: {
      type: String,
      default: "200px"
    },
    referencePlaceholder: {
      type: String,
      default: "请选择"
    },
    showButton: {
      type: Boolean,
      default: false
    },
    needAllCheck: {
      type: Boolean,
      default: false
    },
    selectPlaceholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      currentValue: "",
      checkeds: [],
      selectValues: [],
      checkedValues: [],
      allCheck: false,
      indeterminate: false
    }
  },
  computed: {
    checkValueOptions() {
      const { value, label, children } = this.cascaderProps;
      const data = this.options;
      let obj = {};
      data?.length && data.map(item => {
        item[children] && item[children].map(child => {
          obj[child[value]] = {
            name: child[label],
            parentValue: item[value]
          };
        });
      });
      return obj;
    }
  },
  watch: {
    checkValueOptions: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.setCheckedValues();
        }
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (val) {
          this.setCheckedValues();
        }
      }
    }
  },
  methods: {
    setCheckedValues() {
      this.selectValues = cloneDeep(this.value);
      this.checkedValues = this.selectValues.map(item => {
        return [
          this.checkValueOptions[item].parentValue,
          item
        ]
      });
      this.allCheck = this.selectValues.length === Object.keys(this.checkValueOptions).length;
      this.indeterminate = !!this.selectValues.length && !this.allCheck;
    },
    handleConfirm() {
      if (this.showButton) {
        this.visible = !this.visible;
      }
      this.$emit("checkChange", cloneDeep(this.selectValues));
    },
    handleCancel() {
      this.visible = false;
    },
    handleChange(data) {
      if (!this.cascaderProps.multiple) {
        this.$emit("handleRadioChange", data[1]);
        this.currentValue = this.checkValueOptions[data[1]][this.cascaderProps.label];
        this.handleCancel();
        return;
      }
      if (data && data.length) {
        this.selectValues = data.map((item) => {
          return item[1];
        });
        this.allCheck = this.selectValues.length === Object.keys(this.checkValueOptions).length;
        this.indeterminate = !!this.selectValues.length && !this.allCheck;
      }else {
        this.selectValues = [];
        this.indeterminate = false;
      }
      if (!this.showButton) {
        this.handleConfirm();
      }
    },
    handlePopoverHide() {
      this.handleCancel();
    },
    handleCloseSelect(item) {
      const index = this.selectValues.findIndex(c => c === item);
      this.selectValues.splice(index, 1);
      this.checkedValues = this.selectValues.map((item) => {
        return [
          this.checkValueOptions[item].parentValue,
          item
        ]
      });
      if (!this.showButton) {
        this.handleConfirm();
      }
    },
    handleAllCheck() {
      const keys = Object.keys(this.checkValueOptions);
      this.checkedValues = this.allCheck ? keys.map(item => {
        return [
          this.checkValueOptions[item].parentValue,
          item
        ]
      }) : [];
      this.selectValues = this.allCheck ? [ ...keys ] : [];
      this.indeterminate = false; 
    }
  }
}
</script>

<style lang="scss" scoped>
.cascader-selector-popper {
  .selector-content {
    .footer {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 16px;
      border-top: 1px solid #d9d9d9;
    }

    .unlimited,
    .all-check {
      height: 30px;
      display: flex;
      align-items: center;
      padding: 6px 20px 0 20px;
      cursor: pointer;

      &.unlimit {
        padding-left: 50px;
      }
    }
  }
}

.popoper-select {
  height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  justify-content: space-between;
  padding: 0 8px;
  cursor: text;

  .placeholder {
    color: #d9d9d9;
  }

  .rz-icon-arrow-up {
    transform: rotate(180deg);
  }

  .add-num {
    border: 1px solid #d9d9d9;
    height: 24px;
    line-height: 24px;
    text-align: center;
    padding: 0 4px;
  }

  .select-tag-box {
    display: flex;
    align-items: center;
    width: 60%;

    .select-tag {
      display: flex;
      align-items: center;
      padding: 0 8px;
      justify-content: space-between;
      height: 24px;
      width: 50%;
      border: 1px solid #d9d9d9;
      margin-right: 8px;
      font-size: 12px;
      position: relative;

      &.over-one {
        flex: 1 0 0;
      }

      &-name {
        flex: 1 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 24px;
      }

      .icon-delete_search {
        cursor: pointer;
        position: absolute;
        top: -6px;
        right: -6px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>