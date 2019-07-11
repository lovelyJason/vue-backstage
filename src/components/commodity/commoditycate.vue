<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="myrow">
      <el-col :span="8">
        <el-button round>添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-tree-column
          prop="cat_name"
          label="分类名称"
          width="320"
        ></el-table-tree-column>
        <el-table-column label="级别"></el-table-column>
        <el-table-column label="是否有效"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      tableData: []
    };
  },
  methods: {
    getAllCategory:async function(){
      let res = await this.$http.get('/categories?type=3')
      let { data,meta } = res.data
      if(meta.status === 200){
        this.tableData = res.data.data
        console.log(data)
        console.log(res.data.data)
      }else{
        alert(meta.msg)
      }
    }
  },
  mounted() {
    this.getAllCategory()
  },
};
</script>

<style scoped>
.myrow {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
