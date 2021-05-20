<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎</div>
      <div class="title">统一通用后台管理系统</div>
      <div class="desc">-Vue3.0+ElementPlus+Koa2+MongoDB</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style lang='scss'>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content {
    text-align: left;
    .sub-title {
      font-size: 0.3rem;
      line-height: 0.42rem;
      color: #333;
    }
    .title {
      font-size: 0.4rem;
      color: #409eff;
      line-height: 0.62rem;
    }
    .desc {
      font-size: 0.15rem;
      text-align: right;
      line-height: 0.62rem;
      color: #999;
    }
  }
  .img {
    margin-left: 1rem;
    background: url("./../assets/images/welcome.png") no-repeat;
    background-size: cover;
    width: 6.35rem;
    height: 4.7rem;
  }
}
</style>