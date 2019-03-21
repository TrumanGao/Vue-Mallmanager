<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb level1="权限管理"
                level2="权限列表"></breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="rights"
              border
              style="width: 100%">
      <el-table-column type="index"
                       prop="id"
                       label="#"
                       width="80"></el-table-column>
      <el-table-column prop="authName"
                       label="权限名称"
                       width="180"></el-table-column>
      <el-table-column prop="path"
                       label="路径"></el-table-column>
      <el-table-column prop="level"
                       label="层级">
        <template slot-scope="scope">
          <!-- slot-scope用于传递数据 -->
          <!-- slot-scope=scope，scope的值会自动锁定为上级的数据源rights -->
          <!-- scope.row会自动取出数组中的每个成员（对象） -->
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'"></span>
          <span v-if="scope.row.level==='2'"></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rights: []
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    // 获取所有权限
    async getRights () {
      // 根据接口文档要求，在发送请求(除登录请求外)之前，先设置请求头
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get('rights/list')
      console.log(res)
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res
      if (status === 200) {
        this.rights = data
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scoped>
.el-table {
  height: 400px;
  margin: 10px 0;
  overflow: scroll;
}
</style>
