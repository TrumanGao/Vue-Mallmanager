<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb level1="权限管理"
                level2="角色列表"></breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary"
               @click="showAddRole()">添加角色</el-button>

    <!-- 表格 -->
    <!-- el-table组件通过data属性绑定数据源roles，该数据源是数组，在el-table组件中自动被列表渲染 -->
    <el-table :data="roles"
              style="width: 100%">
      <!-- 展开行开始 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 行列布局：v-for列表渲染 -->
          <el-row v-for="(item1, i) in scope.row.children">
            <!-- 一级权限 -->
            <el-col :span="3">
              <el-tag closable
                      @close="deleteRight(scope.row,item1)"
                      type="success">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <el-row v-for="(item2,i) in item1.children">
                <!-- 二级权限 -->
                <el-col :span="4">
                  <el-tag closable
                          @close="deleteRight(scope.row,item2)"
                          type="info">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag closable
                          @close="deleteRight(scope.row,item3)"
                          type="warning"
                          v-for="(item3,i) in item2.children">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0">
            <el-col><span>该角色未分配权限</span></el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 展开行结束 -->
      <el-table-column prop="id"
                       label="#"
                       width="80"></el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称"
                       width="150"></el-table-column>
      <el-table-column prop="roleDesc"
                       label="角色描述"
                       width="200"></el-table-column>
      <el-table-column label="操作">
        <!-- 操作 -->
        <template slot-scope="scope">
          <!-- 编辑角色：把对应角色的roles作为参数传入函数 -->
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     plain></el-button>
          <!-- 删除角色：把对应角色的id作为参数传入函数 -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     plain></el-button>
          <!-- 分配权限：把对应角色的rights作为参数传入函数 -->
          <el-button type="success"
                     icon="el-icon-check"
                     circle
                     size="mini"
                     plain
                     @click.prevent="showChangeRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="dialogVisibleChangeRights"
               width="30%">
      <!-- 树形结构
               data：树形结构绑定的数据；
               show-checkbox：是否支持选中；
               node-key：每个节点唯一标识；
               default-expanded-keys：默认展开（想要展开的节点的id值）；
               default-checked-keys：默认选中（被选中的节点的id值）；
               props：配置选项{label,children}
                -->
      <el-tree ref="txt"
               :data="rightsTree"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys=checkedArray
               :props="defaultProps">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisibleChangeRights = false">取 消</el-button>
        <el-button type="primary"
                   @click="changeRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      dialogVisibleChangeRights: false,
      // 树形结构数据
      rightsTree: [],
      defaultProps: {
        // label和children的值来源于树形结构绑定数据key名；
        // label指的是文本信息
        // children指的是树形结构的子节点的数据的key名
        label: "authName",
        children: "children",
      },
        checkedArray: [],
        currRoleId: -1
    };
  },
  created () {
    this.getRoles();
  },
  methods: {
    async getRoles () {
      // 获取角色列表
      const res = await this.$http.get("roles");
      // console.log(res);
      const {
        data: { data }
      } = res;
      this.roles = data;
    },
    showAddRole () {
      // 显示添加角色对话框
    },
    addRole () {
      // 添加角色
    },
    async deleteRight (role, right) {
      // 关闭标签，删除角色指定权限
      // console.log(role, right);
      const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`);
      // console.log(res);
      const { data: { data, meta } } = res;
      if (meta.status == 200) {
        // 更新当前角色权限
        role.children = data;
        this.$message.success(meta.msg);
      }
    },
    async showChangeRights (rights) {
      // 显示分配权限对话框
      // 获取所有权限（树状）
      const res = await this.$http.get('rights/tree')
      // console.log(res)
      this.rightsTree = res.data.data;
      // 取出当前角色拥有的权限
      const tempArr = [];
      rights.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      this.checkedArray = tempArr;
      // 取出当前角色的id
      this.currRoleId = rights.id;
      this.dialogVisibleChangeRights = true;
    },
    async changeRights () {
      // 分配权限
      // roleId 角色id
      // rids 权限id列表
      // 权限id列表：1.全选的节点 2.半选的节点
      // 在vue中操作dom
      // 1. 给要操作的标签设置ref属性值
      // 2. 在js中通过this.$refs获取标签
      // 获取树形结构的全选节点
      const arr1 = this.$refs.txt.getCheckedKeys();
      // 获取树形结构的半选节点
      const arr2 = this.$refs.txt.getHalfCheckedKeys();
      // 数组合并
      // const arr = arr1.concat(arr2);
      // 数组合并ES6写法
      const arr = [...arr1, ...arr2];
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      this.getRoles();

      this.dialogVisibleChangeRights = false;
    }
  }
};
</script>

<style scoped>
.el-button {
  margin: 10px 0;
}
.el-table {
  height: 400px;
  overflow: scroll;
}
.el-table__expanded-cell > .el-row > .el-col:first-child {
  margin: 10px 0;
}
.el-table__expanded-cell > .el-row > .el-col > .el-row {
  margin: 10px 0;
}
</style>