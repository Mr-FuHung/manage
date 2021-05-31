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
        <el-button @click="handleEdit(scope.$index, scope.row)">
          新增
        </el-button>
        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
          批量删除
        </el-button>
      </div>
      <el-table stripe size="medium" :data="tableData">
        <el-table-column type="selection" align="center" />
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
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
      },
      {
        label: "用户状态",
        prop: "state",
        width: 180,
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
    //初始化页码
    const pages = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0,
    });
    onMounted(() => {
      //获取表格数据
      getUserList();
    });
    const getUserList = async function () {
      const params = Object.assign(user, {
        pageSize: pages.pageSize,
        pageNum: pages.pageNum,
      });
      const { list, page } = await ctx.$ajax({
        url: "/users/list",
        data: params,
        method: "get",
        mock: true,
      });
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
    //导出
    return {
      user,
      tableHeaderData,
      tableData,
      pages,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>

<style lang='scss'>
.el-form--inline .el-form-item {
  margin-right: 30px;
}
</style>