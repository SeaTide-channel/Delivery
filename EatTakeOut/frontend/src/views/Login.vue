<template>
  <div class="container">
    <h2>登录</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="form.username" required>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" required>
      </div>
      <input type="submit" value="登录">
    </form>
    <div class="register-link">
      没有账号？<router-link to="/register">立即注册</router-link>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      password: ''
    })
    const error = ref('')

    const handleSubmit = async () => {
      try {
        const formData = new FormData()
        formData.append('username', form.value.username)
        formData.append('password', form.value.password)

        const response = await fetch('/api/login', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          // 登录成功，跳转到首页
          const data = await response.json()
          if (data.success) {
            router.push('/home')
          } else {
            error.value = data.error || '登录失败，请稍后重试'
          }
        } else {
          // 登录失败，解析错误信息
          const data = await response.json()
          error.value = data.error || '登录失败，请稍后重试'
        }
      } catch (err) {
        console.error('登录失败:', err)
        error.value = '登录失败，请稍后重试'
      }
    }

    return {
      form,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.container {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: border-box;
}

input[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #0e79f3;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}

input[type="submit"]:hover {
  background-color: #3f8afa;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #237bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>