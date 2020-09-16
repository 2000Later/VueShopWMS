<template>
<div class="login_contaniner">
  <div class="login_box">
<!--    头像区域-->
    <div class="avatar_login">
      <img src="../assets/logo.png" alt="">
    </div>
<!--    登录表单区域-->
    <el-form :model="loginForm" ref="loginFromRef" class="login_form" :rules="loginFromRules">
<!--      用户名-->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"> </el-input>
      </el-form-item>
<!--      密码-->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-user icon-3702mima"> </el-input>
      </el-form-item>
<!--      按钮区域-->
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginFrom">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      toekn: '',
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          {
            required: true, // 必填项
            message: '请输入登录名称', // 提示
            trigger: 'blur' // 失去焦点触发
          },
          {
            min: 3, // 最小长度
            max: 10, // 最大长度
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, // 必填项
            message: '请输入密码名称', // 提示
            trigger: 'blur' // 失去焦点触发
          },
          {
            min: 6, // 最小长度
            max: 15, // 最大长度
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }

    }
  },
  methods: {
    resetLoginFrom () {
      // 重置表单的初始值
      this.$refs.loginFromRef.resetFields()
    },
    login() {
      // 表单校验通过 返回true 否则false
      this.$refs.loginFromRef.validate(async vaild => {
        const { data: res } = await this.$http.post('/login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 设置token
        window.sessionStorage.setItem('token', res.data.token)
        // 跳到主页
        this.$router.replace('/home')
      })
    }
  },
  // 销毁前
  beforeDestroy () {
    // this.$emit('')
    this.token = window.sessionStorage.getItem('token')
  }
}
</script>

<style lang="less" scoped>
.login_contaniner{
  background-color: deepskyblue;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_login{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}
.login_form{
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
