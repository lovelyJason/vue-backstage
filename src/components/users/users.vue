<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search-box">
      <el-col :span="8">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="keywords">
          <el-button slot="append" icon="el-icon-search" @click.prevent="search(keywords)"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" row-key>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeSta(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            class="edit"
            type="primary"
            icon="el-icon-edit"
            plain
            @click="getEditData(scope.row.id)"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-button type="success" icon="el-icon-check" plain @click="getRoleData(scope.row.id)"></el-button>
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
    <!-- 添加数据表单 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postEdit(form.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色表单 -->
    <el-dialog title="分配角色" :visible.sync="roleFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <span>{{ form.username }}</span>
        </el-form-item>

        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <!-- 下拉框 -->
          <el-select v-model="form.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolePost(form.id,form.rid)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      tableData: [],
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      editFormVisible: false,
      roleFormVisible: false,
      flag: true,
      options: [
       
      ],
      value: "",
      rules: {
        // 添加验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      keywords: ""
    };
  },
  methods: {
    // 查询所有用户
    getAllList: function() {
      let token = window.localStorage.getItem("token");
      this.$http
        .get("/users", {
          params: {
            query: this.keywords,
            pagenum: 1,
            pagesize: 10
          }
          // headers: {
          //   Authorization: token
          // }
        })
        .then(res => {
          console.log(res.data);
          if(res.data === undefined){
            console.log('接口出错')
            return
          }
          this.tableData = res.data.data.users;
        });
    },
    // 新增用户
    postAdd: function() {
      let token = window.localStorage.getItem("token");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 2.0 将数据提交到服务器
          this.$http
            .post("users", this.form, {
              // token
              // headers: {
              //   Authorization: token
              // }
            })
            .then(res => {
              // 3.0 接收结果，重新渲染
              let { meta } = res.data;
              if (meta.status === 201) {
                this.$message({
                  type: "success",
                  message: meta.msg
                });
                this.getAllList();
                // 关闭面板
                this.dialogFormVisible = false;
                // 清空数据
                this.form.username = "";
                this.form.password = "";
                this.form.email = "";
                this.form.mobile = "";
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除用户
    del: function(id) {
      let token = window.localStorage.getItem("token");
      console.log(id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/users/" + id, {
              // headers: {
              //   Authorization: token
              // }
            })
            .then(res => {
              console.log(res.data);
              let { data, meta } = res.data;
              if (meta.status === 200) {
                this.$message({
                  type: "success",
                  message: meta.msg
                });
                this.getAllList();
              } else {
                this.$message.error(meta.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 搜索
    search: function(keywords) {
      this.getAllList();
    },
    // 根据Id查询用户信息
    getEditData: function(id) {
      this.editFormVisible = true;
      this.$http.get("/users/" + id).then(res => {
        console.log(res.data);
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.form = res.data.data;
        } else {
          alert("获取失败");
        }
      });
    },
    // 获取角色列表
    getAllRoles: async function() {
      let res = await this.$http.get("/roles");
      console.log('角色列表')
      console.log(res.data)
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    //角色分配表单
    getRoleData: function(id) {
      this.roleFormVisible = true;
      this.$http.get("/users/" + id).then(res => {
        console.log(res.data);
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.form = res.data.data;
          //此时form存储了当前行的id用户的信息
          /*
          {
            "id": 534,
            "rid": -1,
            "username": "hzj",
            "mobile":
          }
          */
        } else {
          alert("获取失败");
        }
      })
      this.getAllRoles()
    },
    //角色分配提交
    rolePost: async function(id,rid) {
      console.log(id,rid)
      let res = await this.$http.put(`/users/${id}/role`,{
        rid: rid
      })
      let {data,meta} = res.data
      console.log('分配用户角色')
      console.log(res.data)
      if(meta.status === 200){
        this.$message({
          message: meta.msg,
          type:'success'
        })
        this.getAllList()
      }else{
        this.$message.error(meta.msg)
      }
    },
    //修改用户信息
    postEdit: function(id) {
      // console.log(id)
      this.$http
        .put("/users/" + id, {
          email: this.form.email,
          mobile: this.form.mobile
        })
        .then(res => {
          // console.log(res.data)
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              type: "success",
              message: meta.msg
            });
            //重新请求users
            this.getAllList();
            this.editFormVisible = false;
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    //状态切换
    changeSta: async function(id, sta) {
      // console.log(this.tableData)
      // console.log(id,sta)
      let res = await this.$http.put(`/users/${id}/state/${sta}`);
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    //页面加载时获取会员列表
    this.getAllList();
  }
};
</script>
<style lang="">
.search-box {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
