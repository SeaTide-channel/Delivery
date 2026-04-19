<template>
  <div class="container">
    <h2>注册</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="form.username" required>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" required>
      </div>
      <input type="submit" value="注册">
    </form>
    <div class="login-link">
      已有账号？<router-link to="/login">立即登录</router-link>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      password: '',
      confirmPassword: ''
    })
    const error = ref('')
    const success = ref('')

    const handleSubmit = async () => {
      // 客户端验证
      if (form.value.password !== form.value.confirmPassword) {
        error.value = '两次输入的密码不一致'
        return
      }

      try {
        const formData = new FormData()
        formData.append('username', form.value.username)
        formData.append('password', form.value.password)
        formData.append('confirmPassword', form.value.confirmPassword)

        const response = await fetch('/api/register', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          // 注册成功，跳转到登录页面
          const data = await response.json()
          success.value = data.message || '注册成功，请登录'
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        } else {
          // 注册失败，解析错误信息
          const data = await response.json()
          error.value = data.error || '注册失败，请稍后重试'
        }
      } catch (err) {
        console.error('注册失败:', err)
        error.value = '注册失败，请稍后重试'
      }
    }

    return {
      form,
      error,
      success,
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
  background-color: #237bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}

input[type="submit"]:hover {
  background-color: #408cff;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 15px;
}

.login-link a {
  color: #237bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>