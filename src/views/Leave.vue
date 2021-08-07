<template>
  <div class="user-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="query_form">
        <el-form-item label="审批状态" prop="auditState">
          <el-select v-model="queryForm.auditState" size="small">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
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
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-permission:leave-add>
          申请休假
        </el-button>
      </div>

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
              v-permission:leave-detail
            >
              详情
            </el-button>

            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              iconColor="red"
              title="确定要作废吗？"
              v-if="scope.row.auditState <= 2"
              @confirm="handleDel(scope.row._id)"
            >
              <template #reference>
                <el-button type="danger" v-permission:leave-delete>
                  作废
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
    <el-dialog title="申请休假" v-model="showDialog">
      <el-form
        ref="dialogForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="leaveType" required>
          <el-select v-model="operateForm.leaveType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" prop="startTime" required>
          <!-- <el-row>
                <el-col :span="8">
                      <el-form-item  prop="startTime" required>
                            <el-date-picker v-model="operateForm.startTime" type="date" placeholder="请选择开始日期"/>
                      </el-form-item>
                </el-col>
                <el-col :span="1">-</el-col>
                <el-col :span="8">
                      <el-form-item  prop="endTime" required>
                            <el-date-picker v-model="operateForm.endTime" type="date" placeholder="请选择结束日期"/>
                      </el-form-item>
                </el-col>
            </el-row> -->
          <el-date-picker
            v-model="startAndEndTime"
            type="daterange"
            start-placeholder="请选择开始日期"
            range-separator="至"
            end-placeholder="请选择结束日期"
          />
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime">
          {{ operateForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入休假原因"
            v-model="operateForm.reasons"
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

    <!-- 查看弹窗开始 -->
    <el-dialog title="休假申请详情" v-model="showDetailDialog" destroy-on-close>
      <el-steps
        :active="detail.auditState > 2 ? 3 : detail.auditState"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>

      <el-form label-width="1.2rem" label-suffix=":" size="medium">
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
        <el-form-item label="申请人">
          <div>{{ detail.applyUserName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.auditUsers }}</div>
        </el-form-item>
        <el-form-item label="当前审批人">
          <div>{{ detail.currentAuditUser }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看弹窗结束 -->
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  toRaw,
  computed,
} from "vue";
import utils from "@/utils/utils.js";
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
export default {
  name: "Levae",
  setup() {
    const { ctx } = getCurrentInstance(); //初始化一个实例，拿到vue3上下文的配置，ctx===this
    //初始化查询选项
    const queryForm = reactive({
      auditState: "",
    });
    //初始表格头
    const tableHeaderData = reactive([
      {
        label: "单号",
        prop: "orderNo",
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
        label: "申请人",
        prop: "applyUser.userName",
        width: 180,
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
    //新增弹窗显示隐藏
    const showDialog = ref(false);
    //详情弹窗显示隐藏
    const showDetailDialog = ref(false);

    //查看详情弹窗数据
    const detail = ref({});
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
      startTime: {
        type: "date",
        required: true,
        message: "请选择开始日期和结束日期",
        trigger: ["change", "blur"],
      },
      reasons: {
        required: true,
        message: "请填写休假原因",
        trigger: ["change", "blur"],
      },
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
    // 用户单个删除/作废
    const handleDel = async (id) => {
      let { msg } = await ctx.$api.leaveDel({ id });
      ctx.$message.success(msg);
      getTableList();
    };
    //新增按钮
    const handleAdd = () => {
      showDialog.value = true;
    };
    //取消
    const handleClose = () => {
      showDialog.value = false;
      handleReset("dialogForm");
    };
    //提交
    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        //验证表单是否rules符合验证规则
        if (valid) {
          let params = { ...operateForm, ...pages }; //转为普通对象
          let { msg } = await ctx.$api.leaveOperate(params);
          ctx.$message.success(msg);
          handleClose();
          getTableList();
        }
      });
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
    //导出
    return {
      queryForm,
      tableHeaderData,
      tableData,
      pages,
      showDialog,
      rules,
      operateForm,
      startAndEndTime,
      showDetailDialog,
      detail,
      handleDetail,
      handleQuery,
      handleReset,
      handleClose,
      handleSubmit,
      handleCurrentChange,
      handleSizeChange,
      handleDel,
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