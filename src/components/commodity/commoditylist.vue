<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search-box">
      <el-col :span="8">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" row-key>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="160">
       <template slot-scope="scope" >
          {{ $moment(scope.row.add_time).format('YYYY-MM-DD hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="edit" type="primary" icon="el-icon-edit" plain></el-button>
          <!-- 删除 -->
          <el-button :id="scope.row.id" type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span="12">
        <div class="block">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      addFormVisible: false,
      tableData: [],
      //总页数,
      total:0,
      pagenum:"1",
      pagesize:10
    };
  },
  methods: {
    getAllCom: async function() {
      let res = await this.$http.get("/goods", {
        params: {
          query: "",
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      let { data, meta } = res.data;
      if (meta.status === 200) {
       
        console.log(data);
        this.tableData = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg);
      }
    },
    //页码
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getAllCom()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    //   console.log(this.tableData);
    this.pagenum = `${val}`
    this.getAllCom()
    },
    //商品添加页面
    addGoods:function(){
      this.$router.push('/goods/add')
    }
  },

  mounted() {
    this.getAllCom();
  }
};
</script>

<style scoped>
.search-box {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
