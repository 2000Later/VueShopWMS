<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <!-- 提示区域 -->
    <el-alert
      title="消息提示的文案"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>
    <!-- 步骤条区域 -->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addForm" :rules="addFormRules" label-position="top" ref="addFormRef" label-width="100px" class="demo-ruleForm">
      <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="addForm.goods_introduce"
          />
          <el-button type="primary" class="btnAdd" @click="add">添加</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog :visible.sync="previewVisible" width="420px" title="图片预览">
    <img class="previewImg" :src="previewPath" alt="">
  </el-dialog>
</div>
</template>

<script>
import _ from 'lodash'
export default {
  name: '',
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload/',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 级联选择器选中的结果改变时触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    // 标签页离开时触发
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('进入的标签的名字', activeName)
      // console.log('即将离开的标签的名字', oldActiveName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData, '动态参数')
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get('categories/' + this.cateId + '/attributes', {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败！')
        this.onlyTableData = res.data
        console.log(this.onlyTableData, '静态属性')
      }
    },
    // 图片预览处理
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片效果
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data
      // 2.从pics数组中使用图片路径找到对应的索引值
      const index = this.addForm.pics.findIndex(item => item.tmp_path === filePath)
      // 3.调用数组的splice方法，把图片的信息对象，从pics中数组移除
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm.pics)
    },
    // 图片加载成功事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      const pathInfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片信息对象，push pics数组中
      this.addForm.pics.push(pathInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要表单项！')
        // 深度拷贝赋值给另一个变量（同时使用一个表单变量 级联选择器选中的值 必须是个数组，而这里必须是个对象）
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发送请求添加商品
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 得到选中的最后一个分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
