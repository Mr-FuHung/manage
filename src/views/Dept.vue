<template>
  <div class="dept-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="form">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
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

      <el-table
        stripe
        size="medium"
        :data="tableData"
        row-key="_id"
        default-expand-all
        highlight-current-row
        :indent='60'
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          v-bind="item"
        />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="primary">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增弹窗开始 -->
    <el-dialog
      :title="action === 'add' ? '创建部门' : '编辑部门'"
      v-model="showDialog"
    >
      <el-form
        ref="dialogDeptForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            style="width: 4rem"
            v-model="operateForm.parentId"
            placeholder="请选择上级部门"
            :options="tableData"
            :props="{ checkStrictly: true, label: 'deptName', value: '_id' }"
            clearable
          />
          <span>不选，则创建一级部门</span>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model.trim="operateForm.deptName"
            placeholder="请输入部门名称"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="operateForm.user"
            placeholder="请选择负责人"
            @change="handleUser"
          >
            <el-option
              :label="item.userName"
              :value="`${item.userId}/${item.userEmail}/${item.userName}`"
              v-for="item in userList"
              :key="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            placeholder="请输入负责人邮箱"
            disabled
            prefix-icon="el-icon-message"
            v-model.trim="operateForm.userEmail"
          >
          </el-input>
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
      //查询条件
      queryForm: {},
      //新增
      showDialog: false,
      operateForm: {
        parentId: [null],
      },
      rules: {
        // parentId: [
        //   {
        //     required: true,
        //     type: "array",
        //     message: "请选择上级部门",
        //     trigger: "change",
        //   },
        //   {
        //     validator: (rule, value, callback) => {
        //       if (value[0] === undefined) {
        //         callback(new Error("请选择上级部门"));
        //       } else {
        //         callback();
        //       }
        //     },
        //     trigger: "change",
        //   },
        // ],
        deptName: {
          required: true,
          message: "请输入部门名称",
          trigger: "blur",
        },
        user: {
          required: true,
          message: "请选择负责人",
          trigger: "change",
        },
      },
      userList: [],
      //表格
      tableHeaderData: [
        {
          label: "部门名称",
          prop: "deptName",
          // width: 300,
        },
        {
          label: "负责人",
          prop: "userName",
          // width: 180,
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
    };
  },
  mounted() {
    this.getTableData();
    this.getAllUserList();
  },
  methods: {
    handleUser(val) {
      let [userId, userEmail, userName] = val.split("/");
      Object.assign(this.operateForm, { userId, userEmail, userName });
    },
    async getTableData() {
      let { data } = await this.$api.getDeptList({
        ...this.queryForm,
      });
      this.tableData = data;
    },
    async getAllUserList() {
      let { data } = await this.$api.getAllUserList();
      this.userList = data;
    },
    //重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showDialog = false;
      this.handleReset("dialogDeptForm");
    },
    //新增弹窗
    handleAdd(row) {
      this.action = "add";
      this.showDialog = true;
    },
    //提交
    handleSubmit() {
      //待优化
      this.$refs.dialogDeptForm.validate(async (valid) => {
        if (valid) {
          let { operateForm, action } = this;
          const params = { ...operateForm, action };
          delete params.user;
          let { msg } = await this.$api.deptSubmit(params);
          this.showDialog = false;
          this.$message.success(msg);
          this.handleReset("dialogDeptForm");
          this.getTableData();
        }
      });
    },
    //编辑
    handleEdit(row) {
      this.showDialog = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.operateForm, row, {
          user: `${row.userId}/${row.userEmail}/${row.userName}`,
        });
      });
    },
    //删除
    async handleDel({ _id }) {
      let { msg } = await this.$api.deptDel({ _id });
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