<template>
  <div class="login_wrapper">
    <div class="modal">
      <el-form>
        <div class="title">地球</div>
        <el-form-item>
          <el-input type="text"  prefix-icon="el-icon-user" placeholder="账号" v-model.trim="assgin" clearable/>
        </el-form-item>
        <el-form-item>
          <el-input type="password"  prefix-icon="el-icon-lock" placeholder="密码" v-model.trim="psw" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login_btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assgin: "",
      psw: "",
    };
  },
  mounted() {},
};
</script>

<style lang='scss'>
.login_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 5rem;
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 0.04rem;
    box-shadow: 0px 0px 10px 3px #c7c9cd;
    .title {
      font-size: 0.5rem;
      text-align: center;
      line-height: 0.5rem;
      margin-bottom: 0.3rem;
    }
    .login_btn {
      width: 100%;
      font-size: .2rem;
    }
  }
}
</style>