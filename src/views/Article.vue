<template>
  <div class="dept-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="form">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="queryForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="作者" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="请输入作者名称" />
        </el-form-item>
        <el-form-item label="文章状态" prop="state">
          <el-select v-model="queryForm.state" size="small">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="公开"></el-option>
            <el-option :value="2" label="隐藏"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-permission:article-add>
          新增
        </el-button>
      </div>

      <el-table stripe size="medium" :data="tableData">
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          v-bind="item"
        />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              v-if="
                scope.row.author.userId == userInfo.userId ||
                userInfo.systemRole == 0
              "
              v-permission:article-edit
              type="primary"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              iconColor="red"
              title="确定要删除吗？"
              v-if="
                scope.row.author.userId == userInfo.userId ||
                userInfo.systemRole == 0
              "
              @confirm="handleDel(scope.row)"
            >
              <template #reference>
                <el-button type="danger" v-permission:article-delete>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增弹窗开始 -->
    <el-dialog
      :title="action === 'add' ? '创建文章' : '编辑文章'"
      v-model="showDialog"
    >
      <el-form
        ref="dialogForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model.trim="operateForm.title"
            placeholder="请输入文章标题"
          />
        </el-form-item>
        <el-form-item label="文章描述" prop="desc">
          <el-input
            placeholder="请输入文章描述"
            v-model.trim="operateForm.desc"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverPic">
          <el-upload
            accept="image/jpeg,image/gif,image/png"
            :before-upload="beforeUpload"
            action
            ref="upload"
            multiple
            show-file-list
            :file-list="fileList"
            list-type="picture-card"
            :http-request="httpRequest"
          >
            <el-button size="small" type="primary">选取文件</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传 jpg/png 文件</div>
            </template>
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="onRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <Wangeditor v-model:content="operateForm.content" ref="editor" />
        </el-form-item>
        <el-form-item label="文章状态" prop="state">
          <el-select v-model="operateForm.state" size="small">
            <el-option :value="1" label="公开"></el-option>
            <el-option :value="2" label="隐藏"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增弹窗结束 -->
  </div>
</template>

<script>
import utils from "@/utils/utils.js";
import Wangeditor from "@/components/Wangeditor.vue";
export default {
  name: "Article",
  components: {
    Wangeditor,
  },
  data() {
    return {
      //查询条件
      queryForm: {
        state: "",
      },
      //新增
      showDialog: false,
      operateForm: {
        coverPic: [],
        state: 1,
        content: "",
      },
      fileList: [],
      rules: {
        coverPic: [
          {
            required: true,
            type: "array",
            message: "请选择上传封面图片",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              if (value[0] === undefined) {
                callback(new Error("请选择上传封面图片"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        content: {
          required: true,
          message: "请编写文章内容",
          trigger: ["blur", "input"],
        },
        desc: [
          {
            required: true,
            message: "请编写文章描述",
            trigger: ["blur", "change"],
          },
          {
            min: 15,
            message: "文章描述不少于15个字符",
            trigger: ["blur", "change"],
          },
        ],
        title: {
          required: true,
          message: "请编写文章标题",
          trigger: ["blur", "change"],
        },
      },
      //表格
      tableHeaderData: [
        {
          label: "文章ID",
          prop: "articleId",
          // width: 300,
        },
        {
          label: "作者",
          prop: "author.userName",
          // width: 180,
        },
        {
          label: "标题",
          prop: "title",
          // width: 180,
        },
        {
          label: "描述",
          prop: "desc",
          // width: 180,
        },
        {
          label: "文章状态",
          prop: "state",
          // width: 180,
          formatter(row, column, value) {
            return {
              1: "公开",
              2: "隐藏",
            }[value];
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          // width: 180,
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          // width: 180,
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      tableData: [],
      userInfo: this.$store.state.userInfo,
      //新增或修改
      action: "add",
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    async onRemove(file) {
      let { msg, data } = await this.$api.removeFile({ file: file.name });

      if (data) {
        this.$message.success(msg);
        this.fileList = this.fileList.filter((item) => item.name !== file.name);
        this.operateForm.coverPic = this.operateForm.coverPic.filter(
          (item) => item.name !== file.name
        );
      } else {
        this.$message.error(msg);
      }
    },
    beforeUpload(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if (!["jpg", "jpge", "png", "gif"].includes(FileExt.toLowerCase())) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为jpg、png、gif的附件！",
        });
        return false;
      }
    },
    httpRequest(option) {
      var formdata = new FormData();
      formdata.append("file", option.file);
      this.$api.uploadFile(formdata).then(({ data }) => {
        this.operateForm.coverPic.push(data);
        option.onSuccess(); //设置为成功状态
      });
    },
    async getTableData() {
      let {
        data: { list },
      } = await this.$api.getArticleList({
        ...this.queryForm,
      });
      this.tableData = list;
    },
    //重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showDialog = false;
      this.fileList = []; //清空图片列表
      this.$refs.upload.clearFiles();
      this.handleReset("dialogForm");
    },
    //新增弹窗
    handleAdd(row) {
      this.action = "add";
      this.showDialog = true;
    },
    //提交
    handleSubmit() {
      //待优化
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { operateForm, action } = this;
          const params = { ...operateForm, action };
          if (action === "add") {
            const { userName, userId } = this.userInfo;
            params.author = { userName, userId };
          }
          let { msg } = await this.$api.articleSubmit(params);
          this.showDialog = false;
          this.$refs.upload.clearFiles();
          this.$message.success(msg);
          this.fileList = []; //清空图片列表
          this.handleReset("dialogForm");
          this.getTableData();
        }
      });
    },
    //编辑
    handleEdit(row) {
      this.showDialog = true;
      this.fileList = []; //清空图片列表
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.operateForm, row);
        this.$refs.editor.editor.txt.html(row.content);
        row.coverPic.forEach((file) => {
          this.fileList.push({
            name: file.name,
            url: file.path,
          });
        });
      });
    },
    //删除
    async handleDel({ _id }) {
      let { msg } = await this.$api.articleDel({ _id });
      this.$message.success(msg);
      this.getTableData();
    },
  },
};
</script>

<style lang='scss'>
.el-form--inline .el-form-item {
  margin-right: 0.3rem;
}
.el-dialog .el-select .el-input {
  width: 130px;
}
</style>