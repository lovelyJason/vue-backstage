<template>
  <el-card class="card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示框 -->
    <el-alert class="alert-box" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab标签页 -->
    <el-tabs :tab-position="'left'" @tab-click="handleClick" class="mytabs">
      <el-tab-pane label="基本信息" name="first">
        <!-- 基本信息 -->
        <el-form :label-position="'top'" label-width="80px">
          <el-form-item label="商品名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input></el-input>
          </el-form-item>
          <!-- 级联框 -->
          {{ value }}
          <el-cascader v-model="value" :options="catesList" :props="cateobj" @change="handleChange"></el-cascader>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="(item1,index1) in manyparams" :key="index1">
          <h4>{{ item1.attr_name }}</h4>
          <el-checkbox
            v-for="(item2,index2) in item1.attr_vals.split(',')"
            :key="index2"
            v-model="checked"
            border
          >{{ item2 }}</el-checkbox>
        </div>
      </el-tab-pane>
      <!-- index==='2的面板' -->
      <el-tab-pane label="商品属性" name="third">
        <el-form
          :label-position="'top'"
          label-width="80px"
          v-for="(item,index) in onlyparams"
          :key="index"
        >
          <h4>{{ item.attr_name }}</h4>
          <el-input v-model="item.attr_vals"></el-input>
        </el-form>
      </el-tab-pane>
      <!-- 上传按钮 -->
      <el-tab-pane label="商品图片" name="forth">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :headers="uploadHead"
          :on-success="uploadsuccess"
          :on-remove="remove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
          <quill-editor v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
               >
  </quill-editor>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data: function() {
    return {
      active: 0,
      catesList: [],
      value: [],
      cateobj: {
        value: "cat_id", //id组成的数组
        label: "cat_name"
      },
      checked: true,
      manyparams: [],
      onlyparams: [],
      //上传文件请求头
      uploadHead: {
        Authorization: localStorage.getItem('token')
      },
      fileList: [],
      //富文本编辑框
      content:'<h2>I am Example</h2>', 
      editorOption: {
          // some quill options
        }
    };
  },
  methods: {
    //标签页点击事件
    handleClick: function(tab, event) {
      // console.log('111')
      // console.log(tab)
      this.active = +tab.index;

      console.log("我是第一级tab");
      this.getCate(tab.index);
    },
    handleChange: function() {
      // console.log('111')
      // console.log(this.catesList)
    },
    //级联框分类数据获取
    getAllCate: async function() {
      let res = await this.$http.get("/categories?type=3");
      // console.log(res.data);
      let { data, meta } = res.data;
      this.catesList = data;
    },
    //根据id查询参数only & many
    getCate: async function(index) {
      //得到分类id
      let id = this.value[this.value.length - 1];
      console.log(id);
      let sel = index === "1" ? "many" : "only";
      let res = await this.$http.get(`/categories/${id}/attributes`, {
        params: {
          sel: sel
        }
      });
      console.log("params:");
      console.log(res.data);
      //res.data.data是manyparams 或 manyparams数组
      if (index === "1") {
        this.manyparams = res.data.data;
        /*
          attr_id: 3077
          attr_name: "版式"
          attr_sel: "many"
          attr_vals: "asfd,asdf"
          attr_write: "list"
          cat_id: 6
          delete_time: null
          */
      } else {
        this.onlyparams = res.data.data;
        /*
        attr_id: 3068
        attr_name: "主体-商品名称"
        attr_sel: "only"
        attr_vals: "TCL电视 55A950C"
        attr_write: "manual"
        cat_id: 6
        delete_time: null
        */
      }
    },
    // 图片上传成功进执行的函数
    uploadsuccess(res, file, fileList) {
      // 将上传成功的图片保存到 fileList 中
      // res: 服务器响应回来的数据
      //  tmp_path: 生成的图片的名称
      //  url: 上传后图片所在的服务器的路径
      // file: 本次上传文件信息（包含了 res）
      // fileList: 上传的所有文件信息（包信了 file）
      this.fileList.push({
        name: res.data.tmp_path,
        url: res.data.url
      })
    },
    // 删除图片时触发
    remove(file, fileList) {
      // 通过 file 中的属性去删除 fileList中的数据
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name === file.name) {
          this.fileList.splice(i, 1)
        }
      }
    },
  },
  mounted() {
    this.getAllCate();
  }
};
</script>

<style scoped>
.alert-box {
  margin-top: 10px;
}
.mytabs {
  margin-top: 20px;
}
.card {
  height: 800px;
  background-color: #e9eef3;
  padding: 10px;
}
</style>
