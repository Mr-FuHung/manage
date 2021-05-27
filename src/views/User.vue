<template>
  <div class="user-mangn">
    <div class="query-form">
      <el-form inline :model="user">
        <el-form-item>
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
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
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
// reactive//用来创建引用类型
// ref//用来创建基础类型
export default {
  name: "User",
  setup() {
    const user = reactive({
      state: 0,
    });
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
    const tableData = reactive([
      {
        state: 1,
        role: "o",
        roleList: [
          "60180b07b1eaed6c45fbebdb",
          "60150cb764de99631b2c3cd3",
          "60180b59b1eaed6c45fbebdc",
        ],
        deptId: ["60167059c9027b7d2c520a61", "60167345c6a4417f2d27506f"],
        userId: 1000002,
        userName: "admin",
        userEmail: " admin@imooc.com",
        createTime: "2021-01-17 13:32:06",
        lastLoginTime: "2021-01-17 13:32:06",
        _v: 0,
        job: "前端架构师",
        mobile: "1761102000o",
      },
      {
        state: 1,
        role: "o",
        roleList: [
          "60180b07b1eaed6c45fbebdb",
          "60150cb764de99631b2c3cd3",
          "60180b59b1eaed6c45fbebdc",
        ],
        deptId: ["60167059c9027b7d2c520a61", "60167345c6a4417f2d27506f"],
        userId: 1000002,
        userName: "admin",
        userEmail: " admin@imooc.com",
        createTime: "2021-01-17 13:32:06",
        lastLoginTime: "2021-01-17 13:32:06",
        _v: 0,
        job: "前端架构师",
        mobile: "1761102000o",
      },
    ]);
    onMounted(() => {});

    return {
      user,
      tableHeaderData,
      tableData,
    };
  },
};
</script>

<style lang='scss'>
.el-form--inline .el-form-item {
  margin-right: 30px;
}
</style>