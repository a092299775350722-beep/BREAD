<template>
  <div class="bg-white rounded-2xl shadow-xl p-6">
    <div class="text-center mb-6">
      <div class="text-5xl mb-2">🔍</div>
      <h2 class="text-2xl font-bold text-stone-800">訂單進度查詢</h2>
      <p class="text-stone-500">請輸入訂單編號或手機號碼</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-stone-700 text-sm font-medium mb-1">訂單編號</label>
        <input v-model="queryId" type="text" class="w-full border border-stone-200 rounded-xl px-4 py-2" placeholder="例如 1742123456789" />
      </div>
      <div class="text-center text-stone-400">或</div>
      <div>
        <label class="block text-stone-700 text-sm font-medium mb-1">手機號碼</label>
        <input v-model="queryPhone" type="tel" class="w-full border border-stone-200 rounded-xl px-4 py-2" placeholder="0912-345-678" />
      </div>
      <button @click="searchOrder" class="w-full bg-amber-600 text-white py-2 rounded-xl font-bold hover:bg-amber-700">查詢</button>
    </div>

    <div v-if="result" class="mt-6 p-4 rounded-xl border" :class="result.found ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
      <p v-if="!result.found" class="text-red-600">{{ result.message }}</p>
      <div v-else>
        <p class="font-bold text-stone-800">訂單編號：{{ result.order.id }}</p>
        <p class="text-sm text-stone-600">訂購日期：{{ result.order.date }}</p>
        <p class="text-sm text-stone-600">收件人：{{ result.order.customer.name }} / {{ result.order.customer.phone }}</p>
        <div class="my-2">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-medium" :class="result.order.status === '待處理' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
            {{ result.order.status }}
          </span>
        </div>
        <div class="border-t pt-2 mt-2">
          <p class="font-medium">訂購商品：</p>
          <div v-for="item in result.order.items" :key="item.name" class="flex justify-between text-sm">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>NT$ {{ item.price * item.quantity }}</span>
          </div>
          <p class="text-right font-bold mt-2">總計 NT$ {{ result.order.total }}</p>
        </div>
        <div class="bg-amber-50 rounded-xl p-3 mt-4 text-sm">
          <p class="font-bold text-amber-800">📞 匯款資訊</p>
          <p>銀行：XX銀行 帳號：123-456-7890 戶名：姊姊的手作麵包坊</p>
          <p class="text-xs mt-1">※ 請於匯款後來電告知後五碼，以利對帳。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const queryId = ref('');
const queryPhone = ref('');
const result = ref(null);

const searchOrder = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  let foundOrder = null;
  if (queryId.value) {
    foundOrder = orders.find(o => o.id == queryId.value);
  } else if (queryPhone.value) {
    foundOrder = orders.find(o => o.customer.phone === queryPhone.value);
  }
  if (foundOrder) {
    result.value = { found: true, order: foundOrder };
  } else {
    result.value = { found: false, message: '查無訂單，請確認訂單編號或手機號碼是否正確。' };
  }
};
</script>