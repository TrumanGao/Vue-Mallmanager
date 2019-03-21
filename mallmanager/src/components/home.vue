<template>
  <el-container class="home-wrap">
    <!-- 头部 -->
    <el-header class="home-header">
      <img src="@/assets/logo.png"
           alt="avengers">
      <h2>后台管理系统</h2>
      <a href="#"
         @click.prevent="logout()">退出</a>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px"
                class="home-aside">
        <!-- 导航组件 -->
        <el-menu router
                 default-active="2"
                 :unique-opened="false">

          <!-- 左侧菜单 -->
          <!-- 一级菜单 -->
          <el-submenu :index="item1.order + ''"
                      v-for="(item1,i) in menus"
                      :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="item2.path"
                          v-for="(item2,i) in item1.children"
                          :key="item2.id">
              <i class="el-icon-menu"></i>{{item2.authName}}
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 内容区 -->
      <el-main class="home-main">
        <div class="home-main-card">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    };
  },
  created () {
    this.getMenus();
  },
  methods: {
    async getMenus () {
      const res = await this.$http.get('menus');
      // console.log(res);
      this.menus = res.data.data;
    },
    logout () {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    }
  }
};
</script>

<style scoped>
.home-wrap {
  height: 100%;
  background-color: whitesmoke;
}
.home-header {
  background-color: #b3c0d1;
  padding: 0;
  display: flex;
}
.home-header img {
  width: 200px;
  height: 60px;
  float: left;
}
.home-header h2 {
  color: white;
  margin: auto;
  line-height: 60px;
}
.home-header a {
  width: 200px;
  padding-right: 30px;
  text-align: right;
  box-sizing: border-box;
  line-height: 60px;
}
.home-aside {
  background-color: white;
  text-align: center;
}
.home-main-card {
  height: 100%;
  min-height: 500px;
  padding: 20px;
  box-sizing: border-box;
  background: white;
  border-radius: 3px;
  box-shadow: 0px 0px 5px #b3c0d1;
}
</style>