<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface FormData {
  username: string
  password: string
}

const router = useRouter()
const submitted = ref(false)
const errorMessage = ref('')

const submitHandler = async (formData: FormData) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Login failed')
    }

    const { token, user } = await response.json()

    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(user))

    submitted.value = true
    setTimeout(() => {
      router.push('/chat')
    }, 1500)

  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Ошибка входа'
  }
}
</script>

<template>
  <div
    class="flex flex-row justify-center items-center p-[40px] rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#252525]">
    <FormKit type="form" id="login-example" :form-class="submitted ? 'hide' : 'show'" submit-label="Войти"
      @submit="submitHandler" :actions="false" :classes="{
        form: 'flex flex-col items-center justify-center w-full',
        messages: 'text-center',
        message: 'text-red-400 text-sm mt-1'
      }">
      <h1 class="text-2xl font-bold mb-2">Вход</h1>

      <FormKit type="text" name="username" label="Ваш ник" placeholder="Ник" validation="required"
        autocomplete="username" :classes="{
          outer: 'flex flex-col justify-center items-center mb-4',
          label: 'block mb-2 font-medium text-gray-200',
          inner: submitted ? 'w-[300px] border-2 border-green-500 border-solid rounded-[20px] overflow-hidden' : 'w-[300px] border-2 border-[#289ed5] border-dashed rounded-[20px] overflow-hidden focus-within:border-solid',
          input: 'w-[300px] px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none',
          messages: 'text-red-400 text-sm mt-1'
        }" />

      <FormKit type="password" name="password" label="Ваш пароль" placeholder="Пароль" validation="required"
        autocomplete="current-password" :classes="{
          outer: 'mb-4',
          label: 'block mb-1 font-medium text-gray-200',
          inner: submitted ? 'w-[300px] border-2 border-green-500 border-solid rounded-[20px] overflow-hidden' : 'w-[300px] border-2 border-[#289ed5] border-dashed rounded-[20px] overflow-hidden focus-within:border-solid',
          input: 'w-[300px] px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none',
          messages: 'text-red-400 text-sm mt-1'
        }" />

      <div v-if="errorMessage" class="text-red-400 mb-4 text-center">
        {{ errorMessage }}
      </div>

      <FormKit type="submit" label="Войти" :classes="{
        input: 'w-full bg-[#289ed5] hover:bg-[#1e87b5] text-white font-bold py-2 px-4 rounded-[20px] transition-colors cursor-pointer'
      }" />

      <div class="mt-4 text-center text-gray-300">
        Нет аккаунта?
        <router-link to="/reg" class="text-[#289ed5] hover:underline cursor-pointer">
          Зарегистрируйтесь
        </router-link>
      </div>
    </FormKit>

    <div v-if="submitted" class="text-center">
      <h2 class="text-xl text-green-500 mb-2">Вход выполнен успешно!</h2>
      <p>Перенаправляем в чат...</p>
    </div>
  </div>
</template>