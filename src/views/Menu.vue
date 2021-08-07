<template>
  <div class="menu-mangn">
    <div class="query-form">
      <el-form inline :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select
            v-model="queryForm.menuState"
            size="small"
            placeholder="请选择菜单状态"
          >
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" v-permission:menu-add>
          新增
        </el-button>
      </div>

      <el-table
        size="medium"
        :data="tableData"
        row-key="_id"
        :row-class-name="tableRowClassName"
        highlight-current-row
        :indent="60"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleAdd(2, scope.row)"
              v-permission:menu-add-child
            >
              新增子级
            </el-button>
            <el-button @click="handleEdit(scope.row)" v-permission:menu-edit>
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
                <el-button type="danger" v-permission:menu-delete>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增弹窗开始 -->
    <el-dialog title="新增菜单" v-model="showDialog">
      <el-form
        ref="dialogMenuForm"
        size="medium"
        :model="operateForm"
        label-width="1.2rem"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            style="width: 4rem"
            v-model="operateForm.parentId"
            placeholder="请选择父级菜单"
            :options="tableData"
            :props="{ checkStrictly: true, label: 'menuName', value: '_id' }"
            clearable
          />
          <span>不选，则创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="operateForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model.trim="operateForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="operateForm.menuType == 1"
        >
          <el-input v-model="operateForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="operateForm.menuType == 1"
        >
          <el-input v-model="operateForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="operateForm.menuType == 2"
        >
          <el-input
            v-model="operateForm.menuCode"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="operateForm.menuType == 1"
        >
          <el-input
            v-model="operateForm.component"
            placeholder="请输入组件路径"
          />
        </el-form-item>

        <el-form-item label="菜单状态" prop="menuState">
          <el-radio-group v-model="operateForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
// reactive//用来创建引用类型
// ref//用来创建基础类型,需用.size配合使用
//toRaw 响应式对象 转为普通对象
//getCurrentInstance  初始化一个实例，拿到vue3上下文的配置，ctx
export default {
  name: "Menu",
  data() {
    return {
      //查询条件
      queryForm: {
        menuState: "",
      },
      //新增
      showDialog: false,
      operateForm: {
        parentId: [null],
        menuState: 1,
        menuType: 1,
      },
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "菜单名称长度在2-8个字符之间",
            trigger: ["blur", "change"],
          },
        ],
      },
      //表格
      tableHeaderData: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 300,
        },
        {
          label: "图标",
          prop: "icon",
          width: 180,
        },
        {
          label: "菜单类型",
          prop: "menuType",
          width: 180,
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
          width: 180,
        },
        {
          label: "路由地址",
          prop: "path",
          width: 180,
        },
        {
          label: "组件路径",
          prop: "component",
          width: 180,
        },
        {
          label: "菜单状态",
          prop: "menuState",
          width: 90,
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 180,
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
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.menuState === 2) {
        return "disable";
      }
      return "";
    },
    getTableData() {
      this.$api.getMenuList(this.queryForm).then((list) => {
        this.tableData = list.data;
      });
    },
    //重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showDialog = false;
      this.handleReset("dialogMenuForm");
    },
    //新增弹窗
    handleAdd(type, row) {
      this.action = "add";
      this.showDialog = true;
      if (type === 2) {
        this.operateForm.parentId = [...row.parentId, row._id].filter(
          (value) => value
        );
      }
    },
    //提交
    handleSubmit() {
      //待优化
      this.$refs.dialogMenuForm.validate(async (valid) => {
        if (valid) {
          let { operateForm, action } = this;
          const params = { ...operateForm, action };
          delete params.children;
          let { msg } = await this.$api.menuSubmit(params);
          this.showDialog = false;
          this.$message.success(msg);
          this.handleReset("dialogMenuForm");
          this.getTableData();
        }
      });
    },
    //编辑
    handleEdit(row) {
      this.showDialog = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.operateForm, row);
      });
    },
    //删除
    async handleDel({ _id }) {
      let { msg } = await this.$api.menuDel({ _id });
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
.el-table .disable {
  background-color: #ff848438 !important;
}
</style>