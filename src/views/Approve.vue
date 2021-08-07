<template>
  <div class="user-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="query_form">
        <el-form-item label="审批状态" prop="auditState">
          <el-select v-model="queryForm.auditState" size="small">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批 / 审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('query_form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <!-- <div class="action">
      </div> -->

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
            <el-button
              @click="handleDetail(scope.row)"
              v-if="
                scope.row.currentAuditUser == userInfo.userName &&
                [1, 2].includes(scope.row.auditState)
              "
              v-permission:approve-edit
            >
              审核
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
        :page-size="pages.pageSize"
        :current-page="pages.pageNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 查看弹窗开始 -->
    <el-dialog title="审核" v-model="showDetailDialog" destroy-on-close>
      <el-form
        label-width="1.2rem"
        label-suffix=":"
        size="medium"
        :model="approveRemark"
        :rules="rules"
        ref="approve-form"
      >
        <el-form-item label="申请人">
          <div>{{ detail.applyUserName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.leaveTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.auditStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.auditUsers }}</div>
        </el-form-item>
        <el-form-item label="当前审批人">
          <div>{{ detail.currentAuditUser }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input
            type="textarea"
            rows="3"
            placeholder="请填写审核备注"
            v-model="approveRemark.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleApprove('pass')"
            >通过</el-button
          >
          <el-button type="danger" @click="handleApprove('refuse')"
            >拒绝</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 查看弹窗结束 -->
  </div>
</template>

<script>
import { onMounted, reactive, ref, getCurrentInstance, computed } from "vue";
import utils from "@/utils/utils.js";
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
export default {
  name: "Approve",
  setup() {
    const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
    //初始化查询选项
    const queryForm = reactive({
      auditState: 1,
    });
    //获取用户信息
    const userInfo = ctx.$store.state.userInfo;
    //初始表格头
    const tableHeaderData = reactive([
      {
        label: "单号",
        prop: "orderNo",
        width: 180,
      },
      {
        label: "申请人",
        prop: "applyUser.userName",
        width: 180,
      },
      {
        label: "休假时间",
        // prop: "",
        width: 180,
        formatter(row) {
          return `${utils.formateDate(
            new Date(row.startTime),
            "YYYY-MM-DD"
          )} 到 ${utils.formateDate(new Date(row.endTime), "YYYY-MM-DD")}`;
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
        width: 180,
      },
      {
        label: "休假类型",
        prop: "leaveType",
        width: 180,
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
        width: 180,
      },
      {
        label: "申请时间",
        prop: "createTime",
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
        width: 180,
      },
      {
        label: "当前审批人",
        prop: "currentAuditUser",
        width: 180,
      },
      {
        label: "审批状态",
        prop: "auditState",
        width: 180,
        formatter(row, column, value) {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);
    //初始表格
    const tableData = ref([]);
    //详情弹窗显示隐藏
    const showDetailDialog = ref(false);

    //查看详情弹窗数据
    const detail = ref({
      remark: "",
    });
    //审核备注
    const approveRemark = reactive({
      remark: "",
    });
    //初始化页码
    const pages = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0,
    });
    let startAndEndTime = computed({
      get: () => {
        if (operateForm.startTime && operateForm.endTime) {
          return [operateForm.startTime, operateForm.endTime];
        }
        return [];
      },
      set: (val) => {
        if (val) {
          let [startT, endT] = val;
          operateForm.startTime = startT;
          operateForm.endTime = endT;
          operateForm.leaveTime =
            (endT - startT) / (24 * 60 * 60 * 1000) + 1 + "天";
        } else {
          operateForm.startTime = null;
          operateForm.endTime = null;
          operateForm.leaveTime = "0天";
        }
      },
    });
    //新增弹窗表单
    const operateForm = reactive({
      leaveType: 1,
      leaveTime: "0天",
      reasons: "",
      startTime: "",
      endTime: "",
    });
    //新增弹窗表单验证规则
    const rules = {
      remark: {
        required: true,
        message: "请填写审核备注",
        trigger: ["change", "blur"],
      }
    };
    onMounted(() => {
      //获取表格数据
      getTableList();
    });
    //获取列表
    const getTableList = async function () {
      const params = {
        ...queryForm,
        pageSize: pages.pageSize,
        pageNum: pages.pageNum,
        type: "approve",
      };
      const {
        data: { list, page },
      } = await ctx.$api.getLeaveList(params);
      //表格数据
      tableData.value = list;
      //页码
      pages.total = page.total;
    };
    //查询
    const handleQuery = () => {
      getTableList();
    };
    //重置
    const handleReset = (form) => {
      //组件内置方法
      ctx.$refs[form].resetFields();
    };
    //分页事件
    const handleCurrentChange = (current) => {
      pages.pageNum = current;
      getTableList();
    };
    //分页大小事件
    const handleSizeChange = (val) => {
      pages.pageSize = val;
      getTableList();
    };
    //编辑
    const handleDetail = (row) => {
      let data = { ...row };
      data.leaveTypeName = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[data.auditState];
      data.applyUserName = data.applyUser.userName;
      data.time = `${utils.formateDate(
        new Date(data.startTime),
        "YYYY-MM-DD"
      )} 到 ${utils.formateDate(new Date(data.endTime), "YYYY-MM-DD")}`;
      data.auditStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[data.auditState];
      detail.value = data;
      showDetailDialog.value = true;
    };
    //取消
    const handleClose = () => {
      showDetailDialog.value = false;
      handleReset("approve-form");
    };
    //审核操作
    const handleApprove = (action) => {
      ctx.$refs['approve-form'].validate(async (valid) => {
        //验证表单是否rules符合验证规则
        if (valid) {
          let params = { action,remark:approveRemark.remark,_id:detail.value._id }; //转为普通对象
          let { msg } = await ctx.$api.leaveApprove(params);
          ctx.$message.success(msg);
          handleClose();
          getTableList();
          getNoticeCount();
        }
      });
    };
      //更新任务角标
    const getNoticeCount = async () => {
      let { data } = await ctx.$api.getNoticeCount();
      ctx.$store.commit("saveNoticeCount", data);
    };
    //导出
    return {
      queryForm,
      tableHeaderData,
      tableData,
      pages,
      rules,
      operateForm,
      startAndEndTime,
      showDetailDialog,
      detail,
      userInfo,
      approveRemark,
      handleClose,
      handleApprove,
      handleDetail,
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
  margin-right: 0.3rem;
}
.el-dialog .el-select .el-input {
  width: 130px;
}
</style>