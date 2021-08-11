<template>
  <div class="blogUser-mangn">
    <div class="query-form">
      <el-form inline :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model.trim="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model.trim="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <el-table stripe size="medium" :data="tableData">
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
            <el-button @click="handleDetail(scope.row)"> 查看 </el-button>
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
    <!-- 查看弹窗开始 -->
    <el-dialog title="博客用户详情" v-model="showDialog" destroy-on-close>
      <el-form label-width="1.2rem" label-suffix=":" size="medium">
        <el-form-item label="用户ID">
          <div>{{ detail.userId }}</div>
        </el-form-item>
        <el-form-item label="用户名称">
          <div>{{ detail.userName }}</div>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <div>{{ detail.email }}</div>
        </el-form-item>
        <el-form-item label="ip">
          <div>{{ detail.ip }}</div>
        </el-form-item>
        <el-form-item label="网站">
          <div>{{ detail.webUrl }}</div>
        </el-form-item>
        <el-form-item label="状态">
          <div>{{ detail.state }}</div>
        </el-form-item>
        <el-form-item label="注册时间">
          <div>{{ detail.createTime }}</div>
        </el-form-item>
        <el-form-item label="最后登录时间">
          <div>{{ detail.lastLoginTime }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import utils from "@/utils/utils.js";
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
//初始化查询选项
const user = reactive({});
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
    prop: "email",
    width: 180,
  },
  {
    label: "ip",
    prop: "ip",
    width: 180,
  },
  {
    label: "网站",
    prop: "webUrl",
    width: 180,
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
    prop: "lastLoginTime",
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
const detail = ref({});
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
//获取列表
const getUserList = async function () {
  const params = Object.assign(user, {
    pageSize: pages.pageSize,
    pageNum: pages.pageNum,
  });
  const {
    data: { list, page },
  } = await ctx.$api.getBlogUserList(params);
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
//查看
const handleDetail = (row) => {
  showDialog.value = true;
  ctx.$nextTick(() => {
    Object.assign(detail.value, row);
    detail.value.createTime = utils.formateDate(new Date(row.createTime));
    detail.value.lastLoginTime = utils.formateDate(new Date(row.lastLoginTime));
  });
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