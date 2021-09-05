<template>
  <div class="user-mangn">
    <div class="query-form">
      <query-form :form="form" v-model="user" @handleQuery="handleQuery" />
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-permission:user-add>
          新增
        </el-button>
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-permission:user-batch-delete
        >
          批量删除
        </el-button>
      </div>

      <el-table
        stripe
        size="medium"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" v-permission:user-edit>
              编辑
            </el-button>
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              iconColor="red"
              title="确定要删除吗？"
              @confirm="handleDel(scope.row)"
            >
              <template #reference>
                <el-button type="danger" v-permission:user-delete>
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
      title="新增用户"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="showDialog"
    >
      <el-form
        ref="dialogUserForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            prefix-icon="el-icon-user"
            v-model.trim="operateForm.userName"
            :disabled="action === 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            prefix-icon="el-icon-message"
            v-model.trim="operateForm.userEmail"
            placeholder="请输入用户邮箱"
          >
            <template #append>
              <el-select v-model="operateForm.userEmailSuffix">
                <el-option label="@qq.com" value="@qq.com"></el-option>
                <el-option label="@163.com" value="@163.com"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            prefix-icon="el-icon-mobile-phone"
            v-model.trim="operateForm.mobile"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input
            v-model="operateForm.job"
            prefix-icon="el-icon-document"
            placeholder="请输入岗位"
          />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="operateForm.state" placeholder="请选择活动区域">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="systemRole">
          <el-select
            v-model="operateForm.systemRole"
            placeholder="请选择系统角色"
            clearable
          >
            <el-option label="超级管理员" :value="0" />
            <el-option label="管理员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="userRole">
          <el-select
            v-model="operateForm.userRole"
            placeholder="请选择用户角色"
            clearable
            multiple
            style="width: 100%"
          >
            <el-option
              :label="item.roleName"
              :value="item._id"
              v-for="item in roleList"
              :key="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            style="width: 4rem"
            v-model="operateForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
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
import { onMounted, reactive, ref, getCurrentInstance, toRaw } from "vue";
import utils from "@/utils/utils.js";
import QueryForm from "../QueryForm/QueryForm.vue";
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
export default {
  components: { QueryForm },
  name: "User",
  setup() {
    const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
    //初始化查询选项
    const user = ref({
      state: 0,
    });
    //定义表单
    const form = [
      {
        type: "input",
        model: "userId",
        label: "用户ID",
        placeholder: "请输入用户ID",
      },
      {
        type: "input",
        model: "userName",
        label: "用户名称",
        placeholder: "请输入用户名称",
      },
      {
        type: "select",
        model: "state",
        label: "状态",
        placeholder: "请选择状态",
        options: [
          {
            label: "所有",
            value: 0,
          },
          {
            label: "在职",
            value: 1,
          },
          {
            label: "离职",
            value: 2,
          },
          {
            label: "试用期",
            value: 3,
          },
        ],
      },
    ];
    //初始表格头
    const tableHeaderData = reactive([
      {
        label: "用户ID",
        prop: "userId",
        width: 180,
      },
      {
        label: "用户名",
        prop: "userName",
        width: 180,
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
        width: 180,
      },
      {
        label: "系统角色",
        prop: "systemRole",
        width: 180,
        formatter(row, column, value) {
          return {
            0: "超级管理员",
            1: "管理员",
            2: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        width: 180,
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "updateTime",
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    //初始表格
    const tableData = ref([]);
    //弹窗显示隐藏
    const showDialog = ref(false);
    //用户操作状态
    const action = ref("add");
    //初始化页码
    const pages = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0,
    });
    //用户列表多选数量
    const checkedUsersId = ref([]);
    //新增弹窗表单
    const operateForm = reactive({
      userEmailSuffix: "@qq.com",
      state: 3,
      systemRole: 2,
    });
    //新增弹窗表单验证规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        // {
        //   required: true,
        //   message: "请输入手机号",
        //   trigger: "blur",
        // },
        {
          pattern: /^1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: ["blur", "change"],
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur",
        },
      ],
    });
    //角色列表
    const roleList = ref([]);
    //部门列表
    const deptList = ref([]);
    onMounted(() => {
      //获取表格数据
      getUserList();
      getRoleAllList();
      getDeptList();
    });
    //获取列表
    const getUserList = async function () {
      const params = Object.assign(user.value, {
        pageSize: pages.pageSize,
        pageNum: pages.pageNum,
      });
      const {
        data: { list, page },
      } = await ctx.$api.getUserList(params);
      //表格数据
      tableData.value = list;
      //页码
      pages.total = page.total;
    };
    //查询
    const handleQuery = () => {
      getUserList();
    };
    //重置
    const handleReset = (form) => {
      //组件内置方法
      ctx.$refs[form].resetFields();
    };
    //分页事件
    const handleCurrentChange = (current) => {
      pages.pageNum = current;
      getUserList();
    };
    //分页大小事件
    const handleSizeChange = (val) => {
      pages.pageSize = val;
      getUserList();
    };
    // 用户单个删除
    const handleDel = (row) => {
      ctx.$api
        .userDel({
          userIds: [row.userId],
        })
        .then((result) => {
          ctx.$message.success(result.msg);
          getUserList();
        });
    };
    // 用户批量删除
    const handlePatchDel = () => {
      if (checkedUsersId.value.length === 0) {
        return ctx.$message.error("请选择需要删除的用户");
      }
      ctx.$api
        .userDel({
          userIds: checkedUsersId.value,
        })
        .then((result) => {
          ctx.$message.success(result.msg);
          getUserList();
        });
    };
    //列表多选
    const handleSelectionChange = (list) => {
      checkedUsersId.value = list.map((item) => {
        return item.userId;
      });
    };
    //新增按钮
    const handleAdd = () => {
      action.value = "add";
      showDialog.value = true;
    };
    //角色列表
    const getRoleAllList = () => {
      ctx.$api.getRoleAllList().then((list) => {
        roleList.value = list.data;
      });
    };
    //部门列表
    const getDeptList = () => {
      ctx.$api.getDeptList().then((list) => {
        deptList.value = list.data;
      });
    };
    //取消
    const handleClose = () => {
      showDialog.value = false;
      handleReset("dialogUserForm");
    };
    //提交
    const handleSubmit = () => {
      ctx.$refs.dialogUserForm.validate(async (valid) => {
        //验证表单是否rules符合验证规则
        if (valid) {
          let params = Object.assign({}, toRaw(operateForm)); //转为普通对象
          params.userEmail += params.userEmailSuffix;
          delete params.userEmailSuffix;
          params.action = action.value;
          let { data, msg } = await ctx.$api.userSubmit(params);
          if (data) {
            showDialog.value = false;
            ctx.$message.success(msg);
            handleReset("dialogUserForm");
            getUserList();
          }
        }
      });
    };
    //编辑
    const handleEdit = (row) => {
      showDialog.value = true;
      action.value = "edit";
      let email = row.userEmail.split("@");
      ctx.$nextTick(() => {
        Object.assign(operateForm, row, {
          userEmailSuffix: `@${email[1]}`,
          userEmail: email[0],
        });
      });
    };
    //导出
    return {
      form,
      user,
      tableHeaderData,
      tableData,
      action,
      pages,
      showDialog,
      rules,
      operateForm,
      deptList,
      roleList,
      checkedUsersId,
      handleEdit,
      handleQuery,
      handleReset,
      handleClose,
      handleSubmit,
      handleCurrentChange,
      handleSizeChange,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      handleAdd,
    };
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