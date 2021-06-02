<template>
  <div class="user-mangn">
    <div class="query-form">
      <el-form inline :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state" size="small">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button @click="handleAdd"> 新增 </el-button>
        <el-button type="danger" @click="handlePatchDel"> 批量删除 </el-button>
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
            <el-button @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
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
    <el-dialog title="新增用户" v-model="showDialog">
      <el-form
        ref="dialogUserForm"
        size="medium"
        :model="addUserForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            prefix-icon="el-icon-user"
            v-model.trim="addUserForm.userName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            prefix-icon="el-icon-message"
            v-model.trim="addUserForm.userEmail"
            placeholder="请输入用户邮箱"
          >
            <template #append>
              <el-select v-model="addUserForm.userEmailSuffix">
                <el-option label="@qq.com" value="@qq.com"></el-option>
                <el-option label="@163.com" value="@163.com"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            prefix-icon="el-icon-mobile-phone"
            v-model.trim="addUserForm.mobile"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input
            v-model="addUserForm.job"
            prefix-icon="el-icon-document"
            placeholder="请输入岗位"
          />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addUserForm.state" placeholder="请选择活动区域">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="addUserForm.roleList"
            placeholder="请选择系统角色"
          >
            <el-option label="在职" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="addUserForm.deptId"
            placeholder="请选择所属部门"
            :options="[]"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button>取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增弹窗结束 -->
  </div>
</template>

<script>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
export default {
  name: "User",
  setup() {
    const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
    //初始化查询选项
    const user = reactive({
      state: 0,
    });
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
        prop: "role",
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
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
      },
    ]);
    //初始表格
    const tableData = ref([]);
    //弹窗显示隐藏
    const showDialog = ref(false);
    //初始化页码
    const pages = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0,
    });
    //用户列表多选数量
    const checkedUsersId = ref([]);
    //新增弹窗表单
    const addUserForm = reactive({
      userEmailSuffix: "@qq.com",
      state: 3,
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

    onMounted(() => {
      //获取表格数据
      getUserList();
    });
    //获取列表
    const getUserList = async function () {
      const params = Object.assign(user, {
        pageSize: pages.pageSize,
        pageNum: pages.pageNum,
      });
      const { list, page } = await ctx.$api.getUserList(params);
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
    const handleReset = () => {
      //组件内置方法
      ctx.$refs.form.resetFields();
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
        .then(() => {
          ctx.$message.success("删除成功");
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
        .then(() => {
          ctx.$message.success("删除成功");
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
      showDialog.value = true;
    };
    //导出
    return {
      user,
      tableHeaderData,
      tableData,
      pages,
      showDialog,
      rules,
      addUserForm,
      checkedUsersId,
      handleQuery,
      handleReset,
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
.el-select .el-input {
  width: 1.3rem;
}
</style>