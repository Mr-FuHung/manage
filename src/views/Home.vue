<template>
  <button @click="state.count++">count is: {{ state.count }}</button>
  <button @click="goLogin">去登陆</button>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
const state = reactive({ count: 0 });
const router = useRouter();
const goLogin = function () {
  router.push({ name: "login" });
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
