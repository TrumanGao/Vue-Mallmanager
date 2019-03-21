<template>
  <div class="login-wrap">
    <el-form label-position="top" label-width="80px" :model="formdata" class="login-form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click.prevent="login()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formdata: {
        username: "",
        password: ""
      }
    };
  },

  components: {},

  methods: {
    // 传统写法
    // login() {
    //   this.$http.post("login", this.formdata).then(res => {
    //     // console.log(res);
    //     const {
    //       data: {
    //         data: { token },
    //         meta: { msg, status }
    //       }
    //     } = res;
    //     if (status === 200) {
    //       this.$router.push({ name: "home" });
    //       localStorage.setItem(token, "token");
    //     } else {
    //       this.$message.error(msg);
    //     }
    //   });
    // }
    // 优化写法（ES6）
    async login() {
      const res = await this.$http.post("login", this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        localStorage.setItem('token', data.token);
        this.$router.push({ name: "home" });
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style scoped>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
}

.login-form {
  background-color: white;
  width: 400px;
  border-radius: 10px;
  padding: 10px 30px 30px 30px;
  box-sizing: border-box;
  margin: auto;
}

.btn {
  width: 100%;
}
</style>