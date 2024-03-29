<template>
  <div class="article-mangn">
    <div class="query-form">
      <query-form
        :form="form"
        v-model="queryForm"
        @handleQuery="getTableData"
      />
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
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="pages.total"
        :page-size="pages.pageSize"
        :current-page="pages.pageNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 新增弹窗开始 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
        <el-form-item label="文章分类" prop="articleClass">
          <el-select v-model="operateForm.articleClass" size="small">
            <el-option
              :value="item.articleClassId"
              :label="item.articleClassName"
              v-for="(item, ind) in classifyAll"
              :key="ind"
            ></el-option>
          </el-select>
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
              <div class="el-upload__tip">只能上传 jpg/png 文件,最大5M</div>
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
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
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
    <!-- 预览图片 -->
    <el-image
      style="visibility: hidden; width: 0; height: 0"
      :src="previewImgUrl"
      ref="el_image"
      :preview-src-list="[previewImgUrl]"
      :z-index="9999"
    >
      <template #error>
        <div class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </template>
    </el-image>
    <!-- 预览图片 -->
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
      form: [
        {
          type: "input",
          model: "title",
          label: "文章标题",
          placeholder: "请输入文章标题",
        },
        {
          type: "input",
          model: "userName",
          label: "作者",
          placeholder: "请输入作者名称",
        },
        {
          type: "select",
          model: "state",
          label: "状态",
          placeholder: "请选择文章状态",
          options: [
            {
              label: "全部",
              value: "",
            },
            {
              label: "公开",
              value: 1,
            },
            {
              label: "隐藏",
              value: 2,
            },
          ],
        },
        {
          type: "select",
          model: "articleClass",
          label: "文章分类",
          placeholder: "请选择文章分类",
          options: [
            {
              label: "全部",
              value: "",
            },
          ],
        },
      ],
      //查询条件
      queryForm: {
        state: "",
        articleClass: "",
      },
      //预览放大图片
      previewImgUrl: "",
      //新增
      showDialog: false,
      operateForm: {
        coverPic: [],
        state: 1,
        content: "",
      },
      fileList: [],
      rules: {
        // coverPic: [
        //   {
        //     required: true,
        //     type: "array",
        //     message: "请选择上传封面图片",
        //     trigger: "change",
        //   },
        //   {
        //     validator: (rule, value, callback) => {
        //       if (value[0] === undefined) {
        //         callback(new Error("请选择上传封面图片"));
        //       } else {
        //         callback();
        //       }
        //     },
        //     trigger: "change",
        //   },
        // ],
        content: {
          required: true,
          message: "请编写文章内容",
          trigger: ["blur", "input"],
        },
        articleClass: {
          required: true,
          message: "请选择文章分类",
          trigger: ["blur", "change"],
        },
        desc: [
          {
            required: true,
            message: "请编写文章描述",
            trigger: ["blur", "change"],
          },
          {
            min: 5,
            message: "文章描述不少于5个字符",
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
          label: "文章分类",
          prop: "articleClass",
          // width: 180,
          formatter: (row, column, value) => {
            let val = this.classifyAll.filter(
              (item) => item.articleClassId == value
            )[0];
            if (val) {
              return val.articleClassName;
            }
            return "-";
          },
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
      pages: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      classifyAll: [], //文章分类
    };
  },
  mounted() {
    this.getTableData();
    this.getClassifyAll();
  },
  methods: {
    async getClassifyAll() {
      let { data } = await this.$api.getClassifyAll();
      this.classifyAll = data;
      this.form.some((item) => {
        if (item.model === "articleClass") {
          data.forEach((options) => {
            item.options.push({
              label: options.articleClassName,
              value: options.articleClassId,
            });
          });
          return true;
        }
      });
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(current) {
      this.pages.pageNum = current;
      this.getTableData();
    },
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url || file;
      this.$nextTick(() => {
        this.$refs?.el_image?.clickHandler();
      });
    },
    async onRemove(file) {
      await this.$api.removeFile({ file: file.name });
      this.fileList.forEach((item, index, arr) => {
        if (item.name == file.name) {
          arr.splice(index, 1);
        }
      });
      this.operateForm.coverPic.forEach((item, index, arr) => {
        if ((item.name || item).indexOf(file.name) != -1) {
          arr.splice(index, 1);
        }
      });
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
      this.$api
        .uploadFile(formdata)
        .then(({ data }) => {
          this.operateForm.coverPic.push(data);
          this.fileList.push({ name: data.name, url: data.path });
          option.onSuccess(); //设置为成功状态
        })
        .catch((err) => {
          this.$message.error(err);
          option.onError();
        });
    },
    async getTableData() {
      let {
        data: { list, page },
      } = await this.$api.getArticleList({
        ...this.queryForm,
        ...this.pages,
      });
      this.tableData = list;
      this.pages.total = page.total;
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
          params.coverPic = params.coverPic.map((item) => item.path || item);
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
          if (Object.prototype.toString.call(file) === "[object String]") {
            this.fileList.push({
              name: utils.getFileName(file),
              url: file,
            });
          } else {
            this.fileList.push({
              name: file.name,
              url: file.path,
            });
          }
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
.article-mangn {
  .el-upload-list__item {
    transition: none !important;
  }
}
.el-form--inline .el-form-item {
  margin-right: 0.3rem;
}
.el-dialog .el-select .el-input {
  width: 130px;
}
.article-mangn {
  .el-image-viewer__wrapper {
    visibility: visible !important;
  }
}
</style>