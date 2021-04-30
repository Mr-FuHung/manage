<template>
  <p>账号：<input type="text" v-model="assgin" /></p>
  <p>密码：<input type="password" v-model="psw" /></p>
  <el-button @click="$router.push({ name: 'home' })">回首页</el-button>
</template>

<script>
export default {
  data() {
    return {
      assgin: "",
      psw: "",
    };
  },
  mounted() {
    // this.$ajax({
    //   method: "POST",
    //   url: "/login",
    //   data: {
    //     a: 1,
    //   },
    // }).then((res) => {
    //   console.log(res);
    // });

    
    // this.$ajax.post("/login", { a: 1 }, { mock: true }).then((res) => {
    //   console.log(res);
    // });
  },
};
</script>

<style>
</style>