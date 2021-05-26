<template>
  <div @drop.prevent="handleDragUpload" v-if="visable" :style="areaSize" class="drag-upload">
    <slot name="icon"></slot>
  </div>
</template>

<script>
export default {
  props: {
    areaSize: {
      type: Object,
    },
    visable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created(){
    console.log("created")
  },
  beforeMount() {
    console.log("beforeMount")
  },
  mounted() {
    this.addGlobalDragEvents();
    console.log("mounted")
  },
  beforeDestroy() {
    this.removeGlobalDragEvents();
    console.log("beforedestroy")
  },
  destroyed() {
    console.log("destroyed")
  },
  methods: {
    addGlobalDragEvents() {
      document.body.addEventListener("dragenter", this.dragEnter, false);
      document.body.addEventListener("dragleave", this.dragLeave, false);
      document.body.addEventListener("dragover", this.dragOver, false);
      document.body.addEventListener("drop", this.drop, false);
    },
    removeGlobalDragEvents() {
      document.body.removeEventListener("dragenter", this.dragEnter, false);
      document.body.removeEventListener("dragleave", this.dragLeave, false);
      document.body.removeEventListener("dragover", this.dragOver, false);
      document.body.removeEventListener("drop", this.drop, false);
    },
    dragEnter(ev) {
      this.swallowEvent(ev);
      this.triggerDialog(true);
    },
    dragOver(ev) {
      ev.preventDefault();
    },
    drop(ev) {
      this.swallowEvent(ev);
      this.triggerDialog(false);
    },
    swallowEvent(ev) {
      ev.stopPropagation();
      ev.preventDefault();
    },
    dragLeave(ev) {
      this.swallowEvent(ev);
      if (
        ev.pageY <= 0 ||
        ev.pageY >= document.body.clientHeight ||
        ev.pageX <= 0 ||
        ev.pageX >= document.body.clientWidth
      ) {
        this.triggerDialog(false);
      }
    },
    triggerDialog(state) {
      this.$nextTick(() => {
        this.$emit("update:visable", state);
      });
    },
    handleDragUpload(e) {
      const files = e.dataTransfer.files;
      this.$emit("files", files);
    },
  },
};
</script>

<style lang="scss" scoped>
.drag-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed blueviolet;
}
</style>