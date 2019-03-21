<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row>
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        clearable
        @clear="this.getTableData"
      >
        <el-button slot="append" icon="el-icon-search" @click.prevent="handleQuery()"></el-button>
      </el-input>
      <el-button type="primary" @click.prevent="showAddUser()">添加用户</el-button>
    </el-row>

    <!-- 表格 -->
    <!-- el-table组件通过data属性绑定数据源tableData，该数据源是数组，在el-table组件中自动被列表渲染 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="create_time" label="创建日期" width="120">
        <!-- 
          1. 当插值表达式要展示的不是字符串时，需要在外侧套一个template标签
          2. template是子组件，无法直接用父组件el-table-column的数据，所以给子组件添加slot-scope属性scope（值随意），该属性值会自动锁定上一级的数据源，即scope = tableData。
          3. slot-scope作用：上下级传递数据。该属性是vue提供的写法
        -->
        <template slot-scope="scope">
          <!-- 4. scope.row 就是数组中的每个成员 -->
          {{scope.row.create_time | formatTime}}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="100">
        <!-- 该单元格中要展示的数据不是prop的值，而是一个UI组件，需要再外侧套一个template标签 -->
        <!-- 给子组件template添加slot-scope属性，绑定上一级数据源，即scope = tableData -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeMg_State(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑用户：把对应用户的tableData作为参数传入showEditUser函数 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click.prevent="showEditUser(scope.row)"
          ></el-button>
          <!-- 删除用户：把对应用户的id作为参数传入showDeleteUser函数 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click.prevent="showDeleteUser(scope.row.id)"
          ></el-button>
          <!-- 分配角色：把对应用户的tableData作为参数传入showChangeRole_name函数 -->
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click.prevent="showChangeRole_name(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <!-- layout 分页组件的功能 -->
      <!-- total 数组总个数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="dialogFormVisibleAddUser = false">取 消</el-button>
        <el-button type="primary" @click.prevent="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEditUser">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="dialogFormVisibleEditUser = false">取 消</el-button>
        <el-button type="primary" @click.prevent="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleChangeRole_name">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{this.form.username}}</el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 点击不同的option时，v-model绑定的值就会变成该option对应的value值 -->
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option
              v-for="(role,index) in roles"
              :key="index"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleChangeRole_name = false">取 消</el-button>
        <el-button type="primary" @click.prevent="changeRole_name()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesizes: [2, 4, 6, 8, 10],
      pagesize: 10,
      // 请求未发起时，total用一个不存在的数
      total: 0,
      // 嵌套表单的对话框显示隐藏-添加用户
      dialogFormVisibleAddUser: false,
      formLabelWidth: "60px",
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 对话框显示隐藏
      dialogVisible: false,
      // 嵌套表单的对话框显示隐藏-编辑用户
      dialogFormVisibleEditUser: false,
      // 嵌套表单的对话框显示隐藏-分配角色
      dialogFormVisibleChangeRole_name: false,
      currentRoleId: -1,
      roles: []
    };
  },
  components: {},

  created() {
    this.getTableData();
  },

  methods: {
    // query 查询参数 可以为空
    // pagenum 当前页码 不能为空
    // pagesize 每页显示条数 不能为空
    async getTableData() {
      // 根据接口文档要求，在发送请求(除登录请求外)之前，先设置请求头
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        data: {
          data: { pagenum, total, users },
          meta: { status, msg }
        }
      } = res;
      if (status === 200) {
        this.tableData = users;
        console.log(this.tableData);
        // this.$message.success(msg);
        this.total = total;
        // this.pagenum = pagenum;
      }
    },
    // 分页相关的方法
    handleSizeChange(val) {
      // 修改每页展示条数
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // 修改当前页码
      this.pagenum = val;
      this.getTableData();
    },
    handleQuery() {
      // 搜索用户
      this.pagenum = 1;
      this.getTableData();
    },
    showAddUser() {
      // 显示添加用户对话框
      this.form = {};
      this.dialogFormVisibleAddUser = true;
    },
    async addUser() {
      // 添加用户
      this.dialogFormVisibleAddUser = false;
      const res = await this.$http.post("users", this.form);
      // console.log(res);
      const {
        data: {
          meta: { msg, status }
        }
      } = res;
      if (status === 201) {
        const {
          data: { reate_time, email, id, mobile, role_id, username }
        } = res;
        this.$message({
          type: "success",
          message: msg
        });
      } else {
        this.$message({
          type: "error",
          message: msg
        });
      }
      this.getTableData();
    },
    showDeleteUser(id) {
      // 显示删除用户弹框
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`);
          this.$message.success("删除成功!");
          this.pagenum = 1;
          this.getTableData();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async showEditUser(tableData) {
      // 显示编辑用户对话框
      // console.log(tableData);
      this.form = tableData;
      this.dialogFormVisibleEditUser = true;
    },
    async editUser() {
      // 编辑用户
      this.dialogFormVisibleEditUser = false;
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res);
      const {
        data: {
          data,
          meta: { msg }
        }
      } = res;
      this.$message.success(msg);
      this.getTableData();
    },
    async changeMg_State(tableData) {
      // 修改用户状态
      // console.log(tableData);
      this.$http.put(`users/${tableData.id}/state/${tableData.mg_state}`);
    },
    async showChangeRole_name(tableData) {
      // 显示分配角色对话框
      this.form = tableData;
      // 下拉选单显示所有角色
      const res = await this.$http.get("roles");
      // console.log(res);
      const {
        data: { data }
      } = res;
      this.roles = data;
      // console.log(this.form);

      // 获取当前用户角色id（用于显示当前用户角色）
      const userInfo = await this.$http.get(`users/${this.form.id}`);
      // console.log(userInfo);
      const {
        data: {
          data: { rid }
        }
      } = userInfo;
      this.currentRoleId = rid;
      this.dialogFormVisibleChangeRole_name = true;
    },
    async changeRole_name() {
      // 分配角色
      const res = await this.$http.put(`users/${this.form.id}/role`, {
        rid: this.currentRoleId
      });
      // console.log(res);
      this.dialogFormVisibleChangeRole_name = false;
    }
  }
};
</script>

<style scoped>
.input-with-select {
  width: 300px;
  margin: 10px 0;
}

.el-table {
  height: 350px;
  overflow: scroll;
}
.block {
  margin-top: 10px;
}
</style>