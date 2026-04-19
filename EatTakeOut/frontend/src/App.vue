<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

.app {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>