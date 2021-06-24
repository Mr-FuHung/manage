<template>
  <div class="role-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd"> 创建 </el-button>
      </div>

      <el-table stripe size="medium" :data="tableData">
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button type="primary"> 配置权限 </el-button>
            <el-button type="danger" @click="handleDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="pages.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 新增弹窗开始 -->
    <el-dialog title="新增角色" v-model="showDialog">
      <el-form
        ref="dialogRoleForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model.trim="operateForm.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="operateForm.remark"
            placeholder="请填写备注"
          />
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
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
export default {
  name: "Role",
  data() {
    this.action = "add";
    return {
      //查询条件
      queryForm: {
        roleName: "",
      },
      //新增
      showDialog: false,
      operateForm: {},
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "菜单名称长度在2-8个字符之间",
            trigger: ["blur", "change"],
          },
        ],
      },
      //表格
      tableHeaderData: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 300,
        },
        {
          label: "备注",
          prop: "remark",
          width: 180,
        },
        {
          label: "权限列表",
          prop: "menuType",
          width: 180,
          // formatter(row, column, value) {
          //   return {
          //     1: "菜单",
          //     2: "按钮",
          //   }[value];
          // },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 180,
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      tableData: [],
      pages: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //新增或修改
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const { list, page } = await this.$api
        .getRoleList(this.queryForm)
        .then((result) => result.data);
      this.tableData = list;
      this.pages.total = page.total;
    },
    handleCurrentChange() {
      this.getTableData();
    },
    handleSizeChange() {
      this.getTableData();
    },
    //重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showDialog = false;
      this.handleReset("dialogRoleForm");
    },
    //新增弹窗
    handleAdd() {
      this.action = "add";
      this.showDialog = true;
    },
    //删除弹窗
    async handleDel({ _id }) {
      let { msg } = await this.$api.roleDelete({ _id });
      this.$message.success(msg);
      this.getTableData();
    },
    //编辑弹窗
    handleEdit(row) {
      this.action = "edit";
      this.showDialog = true;
      this.$nextTick(() => {
        Object.assign(this.operateForm, row);
      });
    },
    //提交
    handleSubmit() {
      //待优化
      this.$refs.dialogRoleForm.validate(async (valid) => {
        if (valid) {
          let { operateForm, action } = this;
          const params = { ...operateForm, action };
          let { msg } = await this.$api.roleSubmit(params);
          this.showDialog = false;
          this.$message.success(msg);
          this.handleReset("dialogRoleForm");
          this.getTableData();
        }
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