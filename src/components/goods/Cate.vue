<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-col>
    </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable">
        <!-- v-slot:isok='scope' 相当于 slot='isok' v-slot='scope' -->
        <template v-slot:isok="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" @click="removeRoleById(scope.row)">删除</el-button>
        </template>
      </tree-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表，默认为空
      cateList: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 定义当前列为模板类型
          type: 'template',
          // 设置模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类的对话框 显示隐藏
      addCateDialogVisible: false,
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 父级分类的等级，默认是最高级0
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      // 指定联级选择器的配置项
      cascaderProps: {
        checkStrictly: true, // 允许选择任意一级选项
        expandTrigger: 'hover', // 子级菜单的触发方式
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中父级分类的数组
      selectedKeys: [],
      // 控制编辑对话框
      editDialogVisible: false,
      // 编辑的表单
      editForm: {},
      // 编辑的表单信息验证
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 请求分类数据的函数
    async getCateList() {
      const { data: res } = await this.$http.get('categories/', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      // 把数据列表赋值给cateList
      this.cateList = res.data.result
      console.log(this.cateList)
      // 赋值总条数
      this.total = res.data.total
    },
    // 控制每页多少条数据
    handleSizeChange(newSize) {
      console.log('每页', newSize, '条数据')
      this.queryInfo.pagesize = newSize
      // 重新加载数据
      this.getCateList()
    },
    // 控制当前页数
    handleCurrentChange(newPage) {
      console.log('现在是第', newPage, '页')
      this.queryInfo.pagenum = newPage
      // 重新加载数据
      this.getCateList()
    },
    showAddCateDialog() {
      // 获取所有父级分类列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取所有父级分类列表的函数
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败！')
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发函数
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        // 层级大于0 父级的id永远是 选项中数组的最后一项
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        console.log(this.addCateForm)
        // 层级 和 选项的长度一致
        this.addCateForm.cat_level = this.selectedKeys.length
        // return // 返回的函数后面没有代码执行时 （返回）会报错
      } else { // 没有选就是最大层级为0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async vaild => {
        console.log(vaild)
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        console.log(res.data)
        this.$message.success('添加分类成功!')
        // 重新加载分类列表数据
        this.getCateList()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
      console.log('添加的分类信息', this.addCateForm)
    },
    // 关闭对话框 重置表单 和 联级选择器中的数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editRoleInfo() {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        })
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error('更新分类失败！')
        this.$message.success('更新成功！')
        this.editDialogVisible = false
        // 更新列表数据
        this.getCateList()
      })
    },
    async removeRoleById(cat) {
      console.log(cat)
      const confirmResult = await this.$confirm('此操作将永久删除 <' + cat.cat_name + '> 类,是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('categories/' + cat.cat_id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  }
}
</script>

<style  lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
