<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header class="home-haeder">
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-->
    <el-container>
      <!-- 侧边栏-->
      <el-aside class="home-aside" :width="isCollapse? '64px':'200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!-- 一级菜单-->
<!--          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">-->
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <template slot="title">
<!--              <i :class="iconsObj[item.id]"></i>-->
              <i :class="['iconfont' ,icon[index] ]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单-->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savaNavState('/'+subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
       <!-- 右侧内容主体-->
      <el-main class="home-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      icon: ['icon-user', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // iconsObj: {
      //   125: 'iconfont icon-user',
      //   103: 'iconfont icon-tijikongjian',
      //   101: 'iconfont icon-shangpin',
      //   102: 'iconfont icon-danju',
      //   145: 'iconfont icon-baobiao'
      // },
      isCollapse: false,
      // 当前激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // 获取session中 活跃的地址
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    savaNavState(activePath) {
      // 保存活跃的地址到session中
      window.sessionStorage.setItem('activePath', activePath)
      // 保存当前的活跃地址
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  background-color: #363D40;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #313743;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #E9EDF0;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
