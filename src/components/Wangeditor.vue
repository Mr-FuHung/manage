<template>
  <div ref="editor"></div>
</template>

<script>
import E from "Wangeditor";
export default {
  name: "Wangeditor",
  props: {
    content: String,
  },
  data() {
    return {
      editor: "",
    };
  },
  emits: ["update:content"],
  watch: {
    content(newval) {
      if (newval === "") {
        this.editor.txt.html(this.content);
      }
    },
  },
  mounted() {
    this.editor = new E(this.$refs.editor);
    Object.assign(this.editor.config, {
      height: 500,
      placeholder: "请编写博客文章",
      customAlert: (s, t) => {
        switch (t) {
          case "success":
            this.$message.success(s);
            break;
          case "info":
            this.$message.info(s);
            break;
          case "warning":
            this.$message.warning(s);
            break;
          case "error":
            this.$message.error(s);
            break;
          default:
            this.$message.info(s);
            break;
        }
      },
      excludeMenus: ["video"],
      showFullScreen: false,
      uploadImgMaxSize: 10 * 1024 * 1024, // 2M
      uploadImgAccept: ["jpg", "jpeg", "png", "gif"],
      uploadImgMaxLength: 1,
      customUploadImg: (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        var formdata = new FormData();
        formdata.append("file", resultFiles.pop());
        this.$api.uploadFile(formdata).then(({ data }) => {
          insertImgFn(data.path);
        });
        // 上传图片，返回结果，将图片插入到编辑器中
      },
      onchange: (newHtml) => {
        this.$emit("update:content", newHtml);
      },
    });
    this.editor.create();
    this.editor.txt.html(this.content);
  },
};
</script>

<style>
</style>