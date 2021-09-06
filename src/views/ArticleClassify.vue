<template>
  <div class="classify-mangn">
    <div class="query-form">
      <query-form
        :form="form"
        v-model="queryForm"
        @handleQuery="getTableData"
      />
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleAdd"
          v-permission:articleClassify-add
        >
          新增
        </el-button>
      </div>

      <el-table
        stripe
        size="medium"
        :data="tableData"
        highlight-current-row
        :indent="60"
      >
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          v-bind="item"
        />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              v-permission:articleClassify-edit
              type="primary"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              iconColor="red"
              :title="`确定要${scope.row.state == 1 ? '隐藏' : '公开'}吗？`"
              @confirm="handleOperate(scope.row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  v-if="scope.row.state == 1"
                  v-permission:articleClassify-display
                >
                  隐藏
                </el-button>
                <el-button
                  type="primary"
                  v-else
                  v-permission:articleClassify-display
                >
                  公开
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
      :title="action === 'add' ? '创建分类' : '编辑分类'"
      v-model="showDialog"
    >
      <el-form
        ref="dialogClassifyForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="articleClassName">
          <el-input
            v-model.trim="operateForm.articleClassName"
            placeholder="请填写分类名称"
          />
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请填写分类描述"
            v-model="operateForm.desc"
          />
        </el-form-item>
        <el-form-item label="分类状态" prop="state">
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
export default {
  name: "Dept",
  data() {
    return {
      form: [
        {
          type: "input",
          model: "articleClassName",
          label: "文章分类名称",
          placeholder: "请输入文章分类名称",
        },
        {
          type: "input",
          model: "articleClassId",
          label: "文章分类ID",
          placeholder: "请输入文章分类ID",
        },
        {
          type: "select",
          model: "state",
          label: "状态",
          placeholder: "请选择分类状态",
          options: [
            {
              label: "所有",
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
      ],
      //查询条件
      queryForm: {
        state: "",
      },
      //新增
      showDialog: false,
      operateForm: {
        state: 1,
      },
      rules: {
        articleClassName: {
          required: true,
          message: "请输入分类名称",
          trigger: ["blur", "change"],
        },
      },
      //表格
      tableHeaderData: [
        {
          label: "分类ID",
          prop: "articleClassId",
          // width: 180,
        },
        {
          label: "分类名称",
          prop: "articleClassName",
          // width: 180,
        },
        {
          label: "分类描述",
          prop: "desc",
          // width: 180,
        },
        {
          label: "状态",
          prop: "state",
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
      //新增或修改
      action: "add",
      pages: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(current) {
      this.pages.pageNum = current;
      this.getTableData();
    },
    async handleOperate(row) {
      const params = {
        _id: row._id,
        state: row.state == 1 ? 2 : 1,
      };
      const { msg } = await this.$api.articleClassifySubmit(params);
      this.$message.success(msg);
      this.getTableData();
    },
    async getTableData() {
      let {
        data: { list, page },
      } = await this.$api.getArticleClassifyList({
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
      this.handleReset("dialogClassifyForm");
    },
    //新增弹窗
    handleAdd(row) {
      this.action = "add";
      this.showDialog = true;
    },
    //提交
    handleSubmit() {
      //待优化
      this.$refs.dialogClassifyForm.validate(async (valid) => {
        if (valid) {
          let { operateForm, action } = this;
          const params = { ...operateForm, action };
          delete params.user;
          let { msg } = await this.$api.articleClassifySubmit(params);
          this.showDialog = false;
          this.$message.success(msg);
          this.handleReset("dialogClassifyForm");
          this.getTableData();
        }
      });
    },
    //编辑
    handleEdit(row) {
      this.showDialog = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.operateForm, row);
      });
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