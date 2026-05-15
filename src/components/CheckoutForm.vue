<template>
  <div class="min-h-screen bg-[#fef7e8] py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-5xl mb-2">🥐</div>
        <h1 class="text-3xl font-serif text-stone-800">填寫訂購資料</h1>
        <p class="text-stone-500 mt-1">請告訴我們如何聯繫您</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-stone-50 px-6 py-4 border-b border-stone-100">
          <div class="text-stone-600 text-sm font-medium mb-2">您的訂單內容</div>
          <div class="space-y-1">
            <div v-for="item in cartItems" :key="item.name" class="flex justify-between text-sm">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>NT$ {{ item.price * item.quantity }}</span>
            </div>
            <div class="flex justify-between font-bold pt-2 border-t border-stone-200">
              <span>總計</span>
              <span class="text-amber-700">NT$ {{ total }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-stone-700 text-sm font-medium mb-1">收件人姓名 *</label>
            <input v-model="form.name" @input="clearError('name')" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" :class="{'border-red-400': errors.name}" placeholder="陳小美" />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <label class="block text-stone-700 text-sm font-medium mb-1">聯絡電話 *</label>
            <input v-model="form.phone" @input="clearError('phone')" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" :class="{'border-red-400': errors.phone}" placeholder="0912-345-678" />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>
          <div>
            <label class="block text-stone-700 text-sm font-medium mb-1">備註（選填）</label>
            <textarea v-model="form.note" rows="2" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" placeholder="例如：不要切、下午送達"></textarea>
          </div>
          <div class="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl">
            💡 送出後我們會盡快以電話確認，請保持手機暢通。
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="goBack" class="flex-1 border border-stone-200 text-stone-600 py-2 rounded-xl hover:bg-stone-50">← 返回</button>
            <button @click="submitOrder" class="flex-1 bg-stone-800 text-white py-2 rounded-xl hover:bg-black">確認訂購</button>
          </div>
        </div>
      </div>
      <div class="text-center text-stone-400 text-xs mt-6">🔒 資料僅用於訂單聯繫</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cartItems = ref([]);
const total = ref(0);
const form = ref({ name: '', phone: '', note: '' });
const errors = ref({ name: '', phone: '' });

onMounted(() => {
  const temp = sessionStorage.getItem('tempCart');
  if (temp) {
    const data = JSON.parse(temp);
    cartItems.value = data.items;
    total.value = data.total;
  } else {
    window.location.href = '/';
  }
});

const goBack = () => window.location.href = '/';

const clearError = (field) => {
  errors.value[field] = '';
};

const submitOrder = () => {
  let valid = true;
  if (!form.value.name.trim()) {
    errors.value.name = '請填寫收件人姓名';
    valid = false;
  }
  if (!form.value.phone.trim()) {
    errors.value.phone = '請填寫聯絡電話';
    valid = false;
  }
  if (!valid) return;

  const orderId = Date.now();
  const order = {
    id: orderId,
    date: new Date().toLocaleString(),
    customer: {
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      note: form.value.note || ''
    },
    items: cartItems.value,
    total: total.value,
    status: '待處理'
  };
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  existingOrders.push(order);
  localStorage.setItem('orders', JSON.stringify(existingOrders));
  sessionStorage.removeItem('tempCart');
  // 帶入訂單編號到完成頁面
  window.location.href = `/checkout-success?orderId=${orderId}&clearCart=true`;
};
</script>