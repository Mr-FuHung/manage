<template>
  <div class="login_wrapper">
    <div class="modal">
      <el-form ref="userForm" :rules="rules" :model="user" status-icon>
        <div class="title">地球</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="账号"
            v-model.trim="user.userName"
            clearable
          />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            @keyup.enter="login"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            v-model.trim="user.userPwd"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login_btn" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/utils.js";
export default {
  name: "Login",
  data() {
    return {
      user: {
        userName: "",
        userPwd: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "change"],
          },
          {
            min: 5,
            max: 11,
            message: "长度在 5 到 11 个字符",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        //验证表单是否rules符合验证规则
        if (valid) {
          this.$api.login(this.user).then(async ({ data, msg }) => {
            this.$store.commit("saveUserInfo", data);
            this.$message.success(msg);
            let {
              data: { menuList },
            } = await this.$api.getPermissionList();
            this.asyncLoadRoutes(menuList);
            this.$router.push("/");
          });
        }
      });
    },
    asyncLoadRoutes(menuList) {
      //生成由权限
      const routesList = [...this.$store.state.routesList];
      let routes = utils.generateRoutes(menuList);
      routes.forEach((menus) => {
        // let url = `./../views/${menus.component}.vue`;
        // menus.component = () => import(url);
        menus.name && routesList.push(menus.name.toLocaleLowerCase());
        // this.$router.addRoute("home", menus);
      });
      this.$store.commit("saveRoutesList", routesList);
    },
  },
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
      font-size: 0.2rem;
    }
  }
}
</style>