<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">预览</router-link> |
      <router-link to="/about">学习</router-link> |
      <router-link to="/docs">文档</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
body {
  background: rgba(30, 30, 30);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

#nav {
  padding: 15px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
