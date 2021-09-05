<template>
  <el-form-item :prop="item.model">
    <el-input v-if="item.type === 'input'" v-bind="$attrs" />
    <el-select v-if="item.type === 'select'" v-bind="$attrs" >
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: "FormItem",
  props: ["item"],
  setup() {},
};
</script>

<style>
</style>