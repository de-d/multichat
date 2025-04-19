<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface FormData {
  name: string
  password: string
}

const router = useRouter()
const submitted = ref(false)

const submitHandler = async (formData: FormData) => {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.name,
        password: formData.password,
        avatar: 'https://i.pravatar.cc/150'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    submitted.value = true;

    setTimeout(() => {
      router.push('/chat')
    }, 3000)

  } catch (error) {
    console.error('Registration error:', error);
  }
}
</script>

<template>
  <div
    class="flex flex-row justify-center items-center p-[40px] rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#252525]">
    <FormKit type="form" id="registration-example" :form-class="submitted ? 'hide' : 'show'" submit-label="Register"
      @submit="submitHandler" :actions="false" #default="{ value }" :classes="{
        form: 'flex flex-col items-center justify-center w-full',
        messages: 'text-center',
        message: 'text-center'
      }">
      <h1 class="text-2xl font-bold mb-2">Регистрация</h1>
      <FormKit type="text" name="name" label="Ник" placeholder="Ваш ник" validation="required" autocomplete="nope"
        :classes="{
          outer: 'mb-4',
          label: 'block mb-2 font-medium text-gray-200',
          inner: 'w-[300px] border-2 border-[#289ed5] border-dashed rounded-[20px] overflow-hidden focus-within:border-solid',
          input: 'w-[300px] px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none',
          messages: 'text-red-400 text-sm mt-1',
          message: 'text-red-400'
        }" />
      <div class="flex flex-col justify-center items-center double">
        <FormKit type="password" name="password" label="Пароль" placeholder="Ваш пароль" autocomplete="nope"
          validation="required|length:6|matches:/[^a-zA-Z]/" :validation-messages="{
            matches: 'Пароль должен содержать хотя бы один символ',
          }" :classes="{
            outer: 'flex flex-col justify-center items-center mb-4',
            label: 'block mb-1 font-medium text-gray-200',
            inner: 'w-[300px] relative border-2 border-[#289ed5] border-dashed rounded-[20px] overflow-hidden focus-within:border-solid',
            input: 'w-[300px] px-3 py-2 bg-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#289ed5] :focus:border-solid',
            messages: 'text-red-400 text-sm mt-1',
            message: 'text-red-400'
          }" />
        <FormKit type="password" name="password_confirm" label="Повторите пароль" placeholder="Повторите пароль"
          autocomplete="nope" validation="required|confirm" :classes="{
            outer: 'flex flex-col justify-center items-center mb-4',
            label: 'block mb-1 font-medium text-gray-200',
            inner: 'w-[300px] relative border-2 border-[#289ed5] border-dashed rounded-[20px] overflow-hidden focus-within:border-solid',
            input: 'w-[300px] px-3 py-2 bg-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#289ed5]',
            messages: 'text-red-400 text-sm mt-1',
            message: 'text-red-400'
          }" />
      </div>

      <FormKit type="submit" label="Зарегистрироваться" :classes="{
        input: `
          w-full
          bg-gradient-to-r from-[#289ed5] to-[#289ed5]
          bg-[length:0%_100%] bg-center bg-no-repeat
          hover:bg-[length:100%_100%] hover:bg-center
          transition-all duration-500 ease-in-out
          border-2 border-[#289ed5] hover:border-solid
          text-white hover:text-black
          font-bold py-2 px-4 rounded-[20px] cursor-pointer`
      }" />

      <pre wrap>{{ value }}</pre>
    </FormKit>
    <div v-if="submitted">
      <h2 class="text-xl text-green-500">Регистрация выполнена успешно!</h2>
    </div>
  </div>
</template>
