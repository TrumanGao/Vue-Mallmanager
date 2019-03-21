// 根组件，所有页面都是在App.vue下进行切换的
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app{
    height:100%;
  }
</style>
