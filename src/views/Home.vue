<template>
  <el-container class="container">
    <el-aside :width="isCollapse ? '.64rem' : '2rem'">
      <!-- logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <div class="Manage">Manage</div>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        router
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <!-- 递归遍历菜单 -->
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </el-aside>
    <el-container>
      <!-- header -->
      <el-header>
        <el-row align="middle" type="flex" :gutter="20">
          <!-- 展开按钮 -->
          <el-col :span="1" class="hidden-md-only">
            <div class="menu-fold" @click="toggle">
              <i class="el-icon-s-fold"></i>
            </div>
          </el-col>
          <!-- 面包屑 -->
          <el-col :md="{ span: 18 }" class="hidden-md-only">
            <BreadCrumb />
          </el-col>
          <!-- 角色 -->
          <el-col :md="{ span: 3, offset: 2 }" class="self">
            <el-badge :is-dot="!!noticeCount" class="notice" type="danger">
              <i class="el-icon-bell"></i>
            </el-badge>
            <!-- 下拉菜单 -->
            <el-dropdown @command="handleCommand">
              <span class="user-link">
                {{ userInfo.userName }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="email">
                    邮箱：{{ userInfo.userEmail }}
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <!-- 页面主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 页脚 -->
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script >
import TreeMenu from "@/components/TreeMenu.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  name: "Home",
  components: {
    TreeMenu,
    BreadCrumb,
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: this.$route.path, //获取路由地址
    };
  },
  mounted() {
    console.log(this.$route);
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    handleCommand(key) {
      if (key === "logout") {
        this.$store.commit("saveUserInfo", null);
        this.userInfo = {};
        this.$router.push("/login");
      }
    },
    async getNoticeCount() {
      this.noticeCount = await this.$api.getNoticeCount();
    },
    async getMenuList() {
      this.userMenu = await this.$api.getMenuList();
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang='scss'>
.el-row {
  height: 100%;
}
.container {
  position: relative;
  height: 100vh;
  .el-main {
    background-color: #eef0f3;
  }
}
.el-header,
.el-footer {
  // background-color: #2D97CC;
  color: #333;
  line-height: 0.6rem;
}
.el-header {
  border-bottom: 1px solid #ccc;
  .menu-fold {
    cursor: pointer;
    font-size: 0.3rem;
    text-align: left;
  }
  .self {
    text-align: right;
  }
  .notice {
    line-height: 0.2rem;
    margin-right: 0.1rem;
  }
  .user-link {
    cursor: pointer;
    color: #409eff;
  }
}
.el-menu-item:focus,
.el-menu-item:hover,
.el-submenu__title:hover {
  outline: none;
  background-color: #ecf5ff81 !important;
}
.el-aside {
  color: #fff;
  background-color: #001529;
  color: #333;
  line-height: 2rem;
  transition: width 0.5s;
  overflow-x: hidden !important;
  .el-menu--collapse {
    width: 0.64rem;
  }
  .nav-menu {
    border: none;
    height: calc(100vh - 0.5rem);
  }
  .logo {
    display: flex;
    align-items: center;
    font-size: 0.2rem;
    color: #fff;
    height: 0.5rem;
    img {
      width: 0.4rem;
      margin: 0 0.15rem;
    }
  }
}
</style>
