<template>
  <div class="comment-mangn">
    <div class="query-form">
      <el-form inline :model="user" ref="form">
        <el-form-item label="文章ID" prop="articleId">
          <el-input v-model.trim="user.articleId" placeholder="请输入文章ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model.trim="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model.trim="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="留言状态" prop="state">
          <el-select v-model="user.state" size="small">
            <el-option value="" label="所有"></el-option>
            <el-option :value="1" label="公开"></el-option>
            <el-option :value="2" label="隐藏"></el-option>
          </el-select>
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
                  v-permission:comment-display
                >
                  隐藏
                </el-button>
                <el-button type="primary" v-else v-permission:comment-display>
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
    <!-- 查看弹窗开始 -->
    <el-dialog title="留言详情" v-model="showDialog" destroy-on-close>
      <el-form label-width="1.2rem" label-suffix=":" size="medium">
        <el-form-item label="_id">
          <div>{{ detail._id }}</div>
        </el-form-item>
        <el-form-item label="文章ID">
          <div>{{ detail.articleId }}</div>
        </el-form-item>
        <el-form-item label="用户ID">
          <div>{{ detail.userInfo.userId }}</div>
        </el-form-item>
        <el-form-item label="用户名称">
          <div>{{ detail.userInfo.userName }}</div>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <div>{{ detail.userInfo.email }}</div>
        </el-form-item>
        <el-form-item label="用户网站">
          <div>{{ detail.userInfo.webUrl }}</div>
        </el-form-item>
        <el-form-item label="内容">
          <div>{{ detail.content }}</div>
        </el-form-item>
        <el-form-item label="被回复人ID">
          <div>{{ detail.replyId }}</div>
        </el-form-item>
        <el-form-item label="被回复人名称">
          <div>{{ detail.replyName }}</div>
        </el-form-item>
        <el-form-item label="状态">
          <div>{{ detail.state }}</div>
        </el-form-item>
        <el-form-item label="parentId">
          <div>{{ detail.parentId }}</div>
        </el-form-item>
        <el-form-item label="注册时间">
          <div>{{ detail.createTime }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import utils from "@/utils/utils.js";
export default {
  name: "Comment",
  setup() {
    const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
    //初始化查询选项
    const user = reactive({ state: "" });
    //初始表格头
    const tableHeaderData = reactive([
      {
        label: "文章ID",
        prop: "articleId",
        width: 180,
      },
      {
        label: "用户ID",
        prop: "userInfo.userId",
        width: 180,
      },
      {
        label: "用户名称",
        prop: "userInfo.userName",
        width: 180,
      },
      {
        label: "内容",
        prop: "content",
        width: 180,
      },
      {
        label: "被回复人ID",
        prop: "replyId",
        width: 180,
      },
      {
        label: "被回复人名称",
        prop: "replyName",
        width: 180,
      },
      {
        label: "状态",
        prop: "state",
        width: 180,
        formatter(row, column, value) {
          return {
            1: "公开",
            2: "隐藏",
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
    ]);
    //初始表格
    const tableData = ref([]);
    //弹窗显示隐藏
    const showDialog = ref(false);
    const detail = ref({
      userInfo: {},
    });
    //初始化页码
    const pages = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0,
    });

    onMounted(() => {
      //获取表格数据
      getComment();
    });
    //获取列表
    const getComment = async function () {
      const params = Object.assign(user, {
        pageSize: pages.pageSize,
        pageNum: pages.pageNum,
      });
      const {
        data: { list, page },
      } = await ctx.$api.getCommentList(params);
      //表格数据
      tableData.value = list;
      //页码
      pages.total = page.total;
    };
    //查询
    const handleQuery = () => {
      getComment();
    };
    //重置
    const handleReset = (form) => {
      //组件内置方法
      ctx.$refs[form].resetFields();
    };
    //分页事件
    const handleCurrentChange = (current) => {
      pages.pageNum = current;
      getComment();
    };
    //分页大小事件
    const handleSizeChange = (val) => {
      pages.pageSize = val;
      getComment();
    };
    //查看
    const handleDetail = (row) => {
      showDialog.value = true;
      ctx.$nextTick(() => {
        Object.assign(detail.value, row);
        detail.value.state = {
          1: "公开",
          2: "隐藏",
        }[row.state];
        detail.value.createTime = utils.formateDate(new Date(row.createTime));
      });
    };
    //公开/隐藏
    const handleOperate = async (row) => {
      const params = {
        _id: row._id,
        state: row.state == 1 ? 2 : 1,
      };
      const { msg } = await ctx.$api.commentOperate(params);
      ctx.$message.success(msg);
      getComment();
    };
    return {
      user,
      tableHeaderData,
      tableData,
      showDialog,
      detail,
      pages,
      getComment,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleSizeChange,
      handleDetail,
      handleOperate
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