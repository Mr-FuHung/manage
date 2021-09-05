<template>
  <el-form inline ref="querForm" :model="querModel" size="small">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="querModel[item.model]" />
    </template>

    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/* *
*fomr = [
    {
        typeInput:'input',
        model:'userId',
        label:'用户ID',
        placeholder:''
    }
]
*/
import { getCurrentInstance, reactive } from "vue";
import FormItem from "./FormItem.vue";
export default {
  name: "QueryForm",
  props: ["modelValue", "form"],
  emits: ["update:modelValue", "handleQuery"],
  components: {
    FormItem,
  },
  setup(props, context) {
    const ctx = getCurrentInstance();
    const form = props.form;
    const querModel = reactive({
      ...props.modelValue,
    });

    const handleReset = () => {
      ctx.refs.querForm.resetFields();
    };
    const handleQuery = () => {
      context.emit("update:modelValue", { ...querModel });
      context.emit("handleQuery", { ...querModel });
    };
    return {
      querModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>

<style>
</style>