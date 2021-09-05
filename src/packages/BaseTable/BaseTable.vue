<template>
  <div class="base-table">
    <div class="action">
      <slot name="action" />
    </div>

    <el-table size="medium" v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          type="selection"
          align="center"
          v-if="item.type === 'selection'"
        />
        <el-table-column v-bind="item" v-else-if="!item.type" />
        <el-table-column v-bind="item" v-if="item.type === 'action'">
          <template #default="scope">
            <template v-for="(btn, ind) in item.list" :key="ind">
              <el-button
                :type="btn.type"
                @click="handleActive(ind, scope.row)"
                v-if="btn.visible"
              >
                {{ btn.text }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
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
    />
  </div>
</template>

<script>
/* 
 <base-table
      :columns="tableHeaderData"
      :data="tableData"
      stripe
      @selection-change="handleSelectionChange"
      @handleActive="handleActive"
      :pages='pages'
      @handleCurrentChange='handleCurrentChange'
    >
*/


/* 
  const tableHeaderData = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "系统角色",
        prop: "systemRole",
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
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "updateTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        type: "action",
        label:'操作',
        list: [
          {
            text: "编辑",
            type: "primary",
            visible: true,
          },
          {
            text: "删除",
            type: "danger",
            visible: true,
          },
        ],
      },
    ]);
    
*/
export default {
  name: "BaseTable",
  props: ["columns", "pages"],
  setup(props, { emit }) {
    const handleActive = (index, row) => {
      emit("handleActive", { index, row: { ...row } });
    };

    /**
     * 页码变化
     * @param pageNum {number}页码
     */
    const handleCurrentChange = (pageNum) => {
      emit("handleCurrentChange", pageNum);
    };
    return {
      handleActive,
      handleCurrentChange,
    };
  },
};
</script>

<style>
</style>