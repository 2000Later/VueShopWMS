<template>
 <div>
   <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>商品参数</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图区域 -->
   <el-card>
     <!--警告区域-->
     <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
     <!-- 选择商品分类区域 -->
     <el-row class="cat-opt">
       <el-col>
         <span>选择商品分类：</span>
         <el-cascader
           v-model="selectedCateKeys"
           :options="cateList"
           :props="cateProp"
           @change="handleChange"></el-cascader>
       </el-col>
     </el-row>
     <!-- Tab栏区域 -->
     <el-tabs v-model="activeName" @tab-click="handleTabClick">
       <el-tab-pane label="动态参数" name="many">
         <el-button type="primary" size="mini" :disabled="isBtnDisable"  @click="addDialogVisible = true">添加参数</el-button>
         <!-- 动态属性表格 -->
         <el-table :data="manyTableData">
           <!-- 展开行 -->
           <el-table-column type="expand">
             <template v-slot="scope">
               <!-- 循环渲染Tag标签 -->
               <el-tag closable @close="handleClosed(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="item">{{item}}</el-tag>
               <!--inputVisible 和 inputValue 不能与所有被渲染的标签的值相同 获取参数数据时为每一个值添加唯一的变量存储-->
               <el-input
                 class="input-new-tag"
                 v-if="scope.row.inputVisible"
                 v-model="scope.row.inputValue"
                 ref="saveTagInput"
                 size="small"
                 @keyup.enter.native="handleInputConfirm(scope.row)"
                 @blur="handleInputConfirm(scope.row)"></el-input>
               <!-- 添加按钮输入框 -->
               <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <el-table-column type="index" label="#"></el-table-column>
           <el-table-column label="参数名称" prop="attr_name"></el-table-column>
           <el-table-column label="操作">
            <template v-slot="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
           </el-table-column>
         </el-table>
       </el-tab-pane>
       <el-tab-pane label="静态属性" name="only">
         <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加属性</el-button>
         <!-- 静态属性表格 -->
         <el-table :data="onlyTableData">
           <!-- 展开行 -->
           <el-table-column type="expand">
             <template v-slot="scope">
               <!-- 循环渲染Tag标签 -->
               <el-tag closable @close="handleClosed(i, scope.row)" v-for="(item, i) in scope.row.attr_vals" :key="item">{{item}}</el-tag>
               <el-input
               class="input-new-tag"
               v-if="scope.row.inputVisible"
               v-model="scope.row.inputValue"
               ref="saveTagInput"
               size="small"
               @keyup.enter.native="handleInputConfirm(scope.row)"
               @blur="handleInputConfirm(scope.row)"></el-input>
               <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <!-- 索引列 -->
           <el-table-column type="index" label="#"></el-table-column>
           <el-table-column label="属性名称" prop="attr_name"></el-table-column>
           <el-table-column label="操作">
             <template v-slot="scope">
               <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
               <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
             </template>
           </el-table-column>
         </el-table>
       </el-tab-pane>
     </el-tabs>
   </el-card>
   <!-- 添加分类参数的对话框 -->
   <el-dialog
     :title="'添加'+ titleText"
     :visible.sync="addDialogVisible"
     @close="addDialogClosed"
     width="50%" >
     <el-form label-width="80px" ref="addFormRef" :model="addForm" :rules="addFormRules">
       <el-form-item :label="titleText" prop="attr_name">
         <el-input v-model="addForm.attr_name"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 认</el-button>
     </span>
   </el-dialog>
   <!-- 修改参数的对话框 -->
   <el-dialog
     :title="'修改'+ titleText"
     :visible.sync="editDialogVisible"
     @close="editDialogClosed"
     width="50%" >
     <el-form label-width="80px" ref="editFormRef" :model="editForm" :rules="editFormRules">
       <el-form-item :label="titleText" prop="attr_name">
         <el-input v-model="editForm.attr_name"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 认</el-button>
     </span>
   </el-dialog>
 </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      cateList: [],
      cateProp: {
        // true 可以选到父级 false只能选到最后一级
        // checkStrictly: true, // 严格遵守子节点相互不关联 (默认必须选到最后一级) 默认false
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联选择框选中的分类id
      selectedCateKeys: [],
      // 默认选中的tab选项
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      onlyTableData: [],
      // 控制添加分类参数 的对话框
      addDialogVisible: false,
      // 添加参数表单对象
      addForm: {},
      // 添加分类表单规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 编辑参数表单
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 计算联级选择框没有选中三级分类按钮禁用
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 计算当前三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 计算添加操作的对话框标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data
    },
    // 联级选择框中选中的数据发生改变触发
    async handleChange() {
      this.getParamsData()
    },
    // Tab栏中的tab项点击触发
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      // 选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 如果选中的不是三级分类 清空表单数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log('categories/' + this.cateId + '/attributes')
      //  否则是三级分类 是产品有参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      // 把attr_vals字符串 切割成数组
      res.data.forEach(item => {
        // 三元表达式解决 字符串产生数组元素问题
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制按钮与文本框的切换显示
        item.inputVisible = false
        // 文本框输入内容
        item.inputValue = ''
      })
      console.log(res.data)
      // 区分不同的类型参数 保存到对应的变量中
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭添加分类参数的对话框触发
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加对话框中的确认按钮 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.addForm.attr_name)
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        console.log(res.data)
        this.$message.success('添加参数成功！')
        // 重新获取分类参数数据
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 关闭编辑对话框事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮事件
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击编辑对话框的 确认按钮 编辑提交
    editParams() {
      // vaild 表单域校验的结果 布尔值
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams(attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$http.delete('categories/' + this.cateId + '/attributes/' + attrId)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    // 文本框失去焦点 和 按下Enter键 都会触发
    handleInputConfirm(row) {
      // 文本框去除两端空白字符串时长度为0 就清空表单 关闭文本框
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        // return
      }
      // 如果没有return 则证明输入内容需要做后续处理 保存文本内容
      // 长度为0 不能发送请求
      if (row.inputValue.length !== 0) {
        row.attr_vals.push(row.inputValue.trim())
        // row.attr_vals.join(' ') 将数组元素以空格的形式分开，拼接字符串
        row.inputValue = ''
        row.inputVisible = false
        // 发送请求保存操作
        this.savaAttrVals(row)
      }
    },
    // 点击+ New Tag按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick 方法的作用 就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        // 不在这里面获取焦点 点击按钮时 文本框可能还没有渲染完成
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 标签关闭事件
    handleClosed(i, row) {
      // 删除对应参数可选项
      row.attr_vals.splice(i, 1)
      // 发送请求保存操作
      this.savaAttrVals(row)
    },
    // 对参数项的操作
    async savaAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败！')
      this.$message.success('修改参数成功！')
      // 先更新了数组数据 不用再次向服务器请求数据
    }
  }
}
</script>

<style scoped>
.cat-opt {
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
