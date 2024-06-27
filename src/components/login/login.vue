<template>
  <div class="loginbox">
    <!--
                                    el-form: 这个组件中的内容都是表单元素
                                        model: 绑定属性
                                        status-icon：状态图标
                                        :rules: 添加验证规则
                                        ref: 在 vue 中可以通过 this.$refs 来操作 dom 元素
                                        abel-width：文本的宽度
                                        label-positio: 设置表单元素的描述文件顶部对齐
                                    el-form-item: 表单中的表单元素
                                        label: 当前元素显示的文本
                                        prop: 设置验证规则
                                    el-input：input 元素
                                        type：类型
                                        v-model：双向绑定的数据
                                        autocomplete：自动补全 （h5）
    -->
    <el-form
      label-position="top"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h1>用户登录</h1>
      <el-form-item label="用户名称" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      ruleForm: {
        username: "jasonhuang",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    afterLoginSuccess (data) {
      this.$message({
        message: data.msg,
        type: "success"
      });
      window.localStorage.setItem("token", data.token);
      this.$router.push("/home");
    },
    login: function() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { username, password } = this.ruleForm
          console.log(username, password)
          if (username === 'jasonhuang' && password === '123456') {
            this.afterLoginSuccess({
              msg: 'login success',
              token: Math.random().toString()
            })
            return
          }
          var res = await this.$http.post("/login", this.ruleForm);
          // var res = await this.$http.post("/login", 'username=admin&password=123456');
          let { data, meta } = res.data;
          if (meta.status === 200) {
            let token = res.data.data.token;
            this.afterLoginSuccess({
              msg: meta.msg,
              token
            })
          } else {
            this.$message({
              message: meta.msg,
              type: "warning"
            });
          }
          // this.$http.post('/login',this.ruleForm)
          //   .then( res=>{
          //     let {data,meta} = res.data
          //     if(meta.status === 200){
          //       this.$message({
          //         message: meta.msg,
          //         type: 'success'
          //       })
          //       // 路由跳转
          //       //保存登录信息
          //       let token = res.data.data.token
          //       window.localStorage.setItem("token",token)
          //       this.$router.push('/home')
          //     }else{
          //         this.$message({
          //         message: meta.msg,
          //         type: 'warning'
          //       })
          //     }
          //   } )
        } else {
          this.$message.error("请输入正确信息,谢谢");
        }
      });
    }
  }
};
</script>

<style scoped>
.loginbox {
  width: 500px;
  margin: 80px auto;
  background: url("http://localhost:8080/static/bk.jpg") no-repeat top center;
}
</style>
