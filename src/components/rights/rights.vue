<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card class="card">
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column label="层级">
          <template slot-scope="scope">{{ scope.row.level === '0'?'一级':scope.row.level ==='1'?'二级':'三级' }}</template>
        </el-table-column>
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
    getAllAuthority: async function() {
      let res = await this.$http.get("/rights/list");
      console.log(res.data);
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.tableData = res.data.data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getAllAuthority();
  }
};
</script>

<style>
.card {
  margin-top: 15px;
}
</style>
