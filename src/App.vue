<template>
  <el-container class="container">
    <el-aside width="2rem">Aside</el-aside>
    <el-container>
      <el-header>
        <el-row align="middle" type='flex' >
          <el-col :span="20" class="hidden-md-only">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :md="{span:2,push:2}" :xs="{push:20,span:4}">
            用户
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
</script>

<style lang="scss">
@import "./assets/css/reset.css";
html {
  font-size: 100px;
}
body {
  font-size: 14px;
}
.el-row{
  height: 100%;
}
.container {
  position: relative;
  height: 100vh;
}
.el-header,
.el-footer {
  // background-color: #2D97CC;
  color: #333;
  text-align: center;
  line-height: 0.6rem;
}
.el-header {
  border-bottom: 1px solid #ccc;
}
.el-aside {
  background-color: #4badde;
  color: #333;
  text-align: center;
  line-height: 2rem;
}

.el-main {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 1.6rem;
}
</style>
