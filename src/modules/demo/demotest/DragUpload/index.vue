<template>
  <div>
    <DragUpload
      :areaSize="areaSize"
      :visable.sync="dragUploadShow"
      @files="uploadFiles"
    >
      <i class="el-icon-upload2" slot="icon"></i>
    </DragUpload>
  </div>
</template>

<script>
import DragUpload from "@/components/DragUpload";
export default {
  components: {
    DragUpload,
  },
  data() {
    return {
      areaSize: {
        width: "1000px",
        height: "200px",
      },
      dragUploadShow: false,
    };
  },
  methods: {
    uploadFiles(files) {
      console.log(files, "files");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-upload2 {
  font-size: 24px;
}
</style>