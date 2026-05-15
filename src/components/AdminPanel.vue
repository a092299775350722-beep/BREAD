<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-10 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 登入畫面 -->
      <div v-if="!isLoggedIn" class="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center border border-amber-100">
        <div class="text-6xl mb-4">🍞</div>
        <h2 class="text-2xl font-bold text-amber-900 mb-6">麵包店管理員登入</h2>
        <input 
          v-model="password" 
          type="password" 
          @keyup.enter="login"
          class="w-full border border-gray-200 rounded-xl p-3 mb-4 text-center focus:ring-2 focus:ring-amber-400 outline-none"
          placeholder="請輸入通關密碼"
        />
        <button @click="login" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition shadow-md">
          開門
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-4 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- 訂單管理面板 -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
        <div class="bg-amber-800 px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">📋 訂單管理</h2>
          <button @click="logout" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
            登出
          </button>
        </div>

        <div class="p-6">
          <div v-if="orders.length === 0" class="text-center py-16 text-gray-400">
            🍞 目前沒有任何訂單
          </div>
          <div v-else class="space-y-6">
            <div v-for="order in orders" :key="order.id" class="border border-amber-100 rounded-xl p-5 bg-amber-50/30 hover:shadow-md transition">
              <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <span class="font-mono text-sm text-amber-700 bg-amber-100 px-2 py-1 rounded">訂單編號：{{ order.id }}</span>
                  <span class="ml-3 text-sm text-gray-500">{{ order.date }}</span>
                </div>
                <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)" 
                        class="border rounded-full px-4 py-1 text-sm font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === '待處理',
                          'bg-green-100 text-green-800 border-green-200': order.status === '已完成'
                        }">
                  <option value="待處理">待處理</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
              <div class="bg-white rounded-lg p-3 mb-3 text-sm space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-amber-600">👤</span> <span class="font-medium">姓名：</span> {{ order.customer?.name || '未填寫' }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-amber-600">📞</span> <span class="font-medium">電話：</span> {{ order.customer?.phone || '未填寫' }}
                </div>
                <div v-if="order.customer?.note" class="flex items-start gap-2">
                  <span class="text-amber-600">📝</span> <span class="font-medium">備註：</span> {{ order.customer.note }}
                </div>
              </div>
              <div class="space-y-1">
                <div v-for="item in order.items" :key="item.name" class="flex justify-between text-sm">
                  <span>{{ item.name }} × {{ item.quantity }}</span>
                  <span class="font-medium">NT$ {{ item.price * item.quantity }}</span>
                </div>
              </div>
              <div class="text-right font-bold mt-3 pt-2 border-t border-amber-200">
                總計：NT$ {{ order.total }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(false);
const password = ref('');
const errorMessage = ref('');
const orders = ref([]);

const loadOrders = () => {
  const stored = localStorage.getItem('orders');
  orders.value = stored ? JSON.parse(stored) : [];
};

const updateOrderStatus = (orderId, newStatus) => {
  const updatedOrders = orders.value.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  orders.value = updatedOrders;
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
};

const logout = () => {
  isLoggedIn.value = false;
  password.value = '';
  errorMessage.value = '';
};

const login = async () => {
  errorMessage.value = '驗證中...'; 
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    const data = await res.json();
    if (data.success) {
      isLoggedIn.value = true;
      errorMessage.value = '';
      loadOrders();
    } else {
      errorMessage.value = '密碼錯誤，請重新輸入。';
      password.value = '';
    }
  } catch (error) {
    errorMessage.value = '系統連線異常，請檢查伺服器狀態。';
  }
};
</script>