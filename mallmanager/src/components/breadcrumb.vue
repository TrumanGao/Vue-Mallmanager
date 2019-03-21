// 多个位置使用一样的页面结构，封装面包屑组件
<template>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name:'breadcrumb',
  //使用props选项，把父组件（引用面包屑组件）的参数传入子组件（面包屑组件），则子组件可以直接调用该参数（插值表达式）
  // props的数据和data的数据用法一样
  // props的值可以是字符串数组
  props: ["level1", "level2"]
};
</script>

<style scoped>
</style>