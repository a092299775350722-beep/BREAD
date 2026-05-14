<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-amber-100">
    <div v-if="!isLoggedIn" class="text-center py-10">
      <h2 class="text-2xl font-bold text-amber-900 mb-6">🍞 麵包店管理員登入</h2>
      <input 
        v-model="password" 
        type="password" 
        @keyup.enter="login"
        class="border border-gray-300 p-3 rounded-lg w-64 mb-4 text-center focus:ring-2 focus:ring-amber-500 outline-none" 
        placeholder="請輸入通關密碼"
      />
      <br>
      <button @click="login" class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md">
        開門
      </button>
      <p v-if="errorMessage" class="text-red-500 mt-4 text-sm">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h2 class="text-2xl font-bold text-amber-900">商品庫存管理</h2>
        <button class="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold">
          📢 儲存並發布更新
        </button>
      </div>
      
      <div class="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
        <p>（這裡是控制室！我們下一步會把 Google 試算表的資料接到這裡來顯示）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(false);
const password = ref('');
const errorMessage = ref('');

// 呼叫後端 API 進行密碼驗證
const login = async () => {
  errorMessage.value = '驗證中...'; 
  
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: password.value })
    });
    
    const data = await res.json();
    
    if (data.success) {
      isLoggedIn.value = true;
      errorMessage.value = '';
    } else {
      errorMessage.value = '密碼錯誤，請重新輸入。';
      password.value = '';
    }
  } catch (error) {
    errorMessage.value = '系統連線異常，請檢查伺服器狀態。';
  }
};
</script>