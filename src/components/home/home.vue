<template>
  <div class="mycon">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4" class="logo">
            <img :src="pic" alt="" height="60" @click="toHome" style="cursor:pointer">
          </el-col>
          <el-col :span="20">
            <a href="" class="logout" @click.prevent="logout">退出登录</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <!-- Aside -->
        <el-aside width="200px">
          <el-menu :router="true" default-active="2" class="el-menu-vertical-demo" :unique-opened="true">
            <!-- 用户管理 -->
            <el-submenu v-for="(item1,index1) in menuList" :key="index1" :index="item1.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item1.authName }}</span>
              </template>

              <el-menu-item v-for="(item2,index2) in item1.children" :key="index2" :index="'/'+item2.path">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </el-menu-item>
            </el-submenu>
    
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- <img src="http://localhost:8080/static/bk.jpg" alt="" id="bk"> -->
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      menuList:[],
      pic:require('../../assets/1159.png'),
      
    }
  },
  methods:{
    //退出登录
    logout: function(){
      window.localStorage.removeItem("token")
      this.$router.push('/login')
      console.log(window.localStorage.getItem('token'))
    },
    getMenuList: async function(){
      console.log(window.localStorage.getItem('token'))
      let res = await this.$http.get('/menus')
      console.log(res.data)
      this.menuList = res.data.data
    },
    //点击logo跳转
    toHome: function(){
      this.$router.push('/home')
    }
  },
  mounted() {
    let token = window.localStorage.getItem("token")
    // console.log(token)
    if(!token){
      console.log(22222)
      this.$router.push('/login')
      return
    }
    this.getMenuList()
  }
};
</script>

<style scoped>
.mycon {
  height: 100%;
 
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}

.el-main {
  background: url("http://localhost:8080/static/bk1.jpg") no-repeat #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}

.el-container {
  height: 100%;
}
.el-menu-vertical-demo {
  height: 100%;
}
.logo {
  height: 60px;
}
.logout {
  float: right;
  /* text-align: right; */
}

</style>
