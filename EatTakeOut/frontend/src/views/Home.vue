<template>
  <div class="container">
    <h1>欢迎来到首页</h1>
    <div class="welcome">
      <p>登录成功！您现在可以访问系统的各项功能。</p>
    </div>
    <div class="logout">
      <button @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()

    const handleLogout = () => {
      // 退出登录，跳转到登录页面
      router.push('/login')
    }

    return {
      handleLogout
    }
  }
}
</script>

<style scoped>
.container {
  background-color: white;
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.welcome {
  margin: 20px 0;
  font-size: 18px;
  color: #666;
}

.logout {
  margin-top: 30px;
}

.logout button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
}

.logout button:hover {
  background-color: #da190b;
}
</style>