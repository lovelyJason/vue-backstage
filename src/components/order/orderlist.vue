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
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150"></el-table-column>
        <el-table-column label="是否付款" width="120">
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.order_pay==='0'?'未付款':'已付款' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="180"></el-table-column>
        <el-table-column label="下单时间" width="180">
            <template slot-scope="scope">
             {{ $moment(scope.row.create_time).format('YYYY-MM-DD h:mm:ss') }}                
            </template>
             
        </el-table-column>
       
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      tableData: [],
      total: 0,
      pagenum: "1",
      pagesize: 10
    };
  },
  methods: {
    // 订单数据列表
    getOrderList: async function() {
      let res = await this.$http.get("/orders", {
        params: {
          query: "",
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      let { data, meta } = res.data;
      if (meta.status === 200) {
        this.tableData = data.goods;
        this.total = data.total;
      } else {
        alert(meta.msg);
      }
    },
     //页码
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getOrderList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    //   console.log(this.tableData);
    this.pagenum = `${val}`
    this.getOrderList()
    }
  },
  mounted() {
    this.getOrderList();
    console.log(this)
  }
};
</script>

<style>
</style>
