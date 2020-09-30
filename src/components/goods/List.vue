<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getGoodsList" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddpage">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="goodsList" border stripe>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px" ></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px">
        <template v-slot="scope">
          {{scope.row.add_time | dataFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeById(scope.row)" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=queryInfo.pagenum
      :page-sizes="[5, 10, 15, 50]"
      :page-size=queryInfo.pagesize
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.$message.success('获取商品列表成功！')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 删除按钮的点击事件
    async removeById(row) {
      console.log(row)
      const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') this.$message.info('已经取消删除！')
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped>

</style>
