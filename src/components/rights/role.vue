<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class='myrow'>
      <el-col :span="8">
        <el-button round @click="addRoleFormVisible=true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-card class="card">
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 展开代码 -->
            <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
              <!-- 一级菜单 -->
              <el-col :span="6">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <!-- 二三级菜单所在row -->
              </el-col>
              <!-- 第二列再嵌套row -->
              <el-col :span="18">
                <el-row v-for="(item2,index2) in item1.children" :key="index2">
                  <!-- 第一列 -->
                  <el-col :span="4">
                    <el-tag closable :type="'success'">{{ item2.authName }}</el-tag>
                  </el-col>
                  <!-- 第二列 -->
                  <el-col :span="20">
                    <el-tag
                      class="tag3"
                      v-for="(item3,index3) in item2.children"
                      :key="index3"
                      closable
                      :type="'warning'"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="edit"
              type="primary"
              icon="el-icon-edit"
              plain
              
            ></el-button>
            <!-- 分配用户权限 -->
            <el-button type="success" icon="el-icon-check" plain @click="AssignAuthority"></el-button>
            <el-button
              :id="scope.row.id"
              type="danger"
              icon="el-icon-delete"
              plain
              @click="del(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 树 -->
    <el-dialog title="权限分配" :visible.sync="authoritylogVisible" width="30%">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :default-expand-all="true"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authoritylogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authoritylogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      tableData: [],
      treeData:[],
      list: [],
      addRoleFormVisible: false,
      authoritylogVisible: false,
      formLabelWidth: "120px",
      form: {
        roleName: "",
        roleDesc: ""
      },
      rules: {
        // 添加验证规则
        roleName: [
          { required: true, message: "请输入用角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      data: [//传入数组
        
      ],
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    // 获取角色列表---权限
    getAllRoles: async function() {
      let res = await this.$http.get("/roles");
      // console.log(res.data)
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //分配角色权限
    AssignAuthority: async function(){
      this.authoritylogVisible = true
      let res = await this.$http.get('/rights/tree')
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.treeData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //添加角色
    addRoles: async function() {
      let res = await this.$http.post("/roles", this.form);
      console.log(res.data);
      let { data, meta } = res.data;
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
        this.addRoleFormVisible = false;
        this.getAllRoles();
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除角色
    del: function(id) {
      // console.log(id)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //  console.log(this)
          let res = await this.$http.delete("/roles/" + id);
          console.log(res.data);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.getAllRoles();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
    //
  },
  mounted() {
    this.getAllRoles();
  }
};
</script>

<style>
.card {
  margin-top: 15px;
}
.tag3 {
  margin-bottom: 10px;
  margin-right: 10px;
}
.myrow {
  margin-top: 10px;
}
</style>
