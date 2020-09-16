<template>
  <div>
    <h2>Home组件</h2>
    <el-button type="info" @click="logout">信息按钮</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>

</style>
