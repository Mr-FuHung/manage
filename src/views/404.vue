<template>
  <div class="page404">
    <img src="@/assets/images/404.svg" alt="404" />
    <div class="font">
      <div class="statusStyle">404</div>
      <div class="smallStyle">抱歉，你访问的页面不存在</div>
    </div>
    <el-button @click="goHome" size="medium"> 回首页</el-button>
  </div>
</template>

<script>
export default {
  name: "404",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.page404 {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 3rem;
  }
  .font {
      margin: .3rem 0;
    .statusStyle {
      margin-bottom: 0.2rem;
      color: #434e59;
      font-weight: 600;
      font-size: 0.4rem;
    }
    .smallStyle {
      margin-bottom: 0.2rem;
      color: rgba(0, 0, 0, 0.45);
      font-size: 0.2rem;
    }
  }
}
</style>
