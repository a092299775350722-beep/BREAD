<template>
  <div v-if="$isCartOpen" class="fixed inset-0 z-100 flex justify-end">
    <div @click="isCartOpen.set(false)" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <div class="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-amber-900">購物車清單</h2>
        <button @click="isCartOpen.set(false)" class="text-gray-400 hover:text-gray-600">✕ 關閉</button>
      </div>

      <div class="grow overflow-y-auto space-y-6">
        <div v-if="Object.values($cartItems).length === 0" class="text-center py-20 text-gray-400">
          購物車是空的 🍞
        </div>
        
        <div v-for="item in Object.values($cartItems)" :key="item.name" class="flex justify-between items-center border-b pb-4">
          <div>
            <h4 class="font-bold text-gray-800">{{ item.name }}</h4>
            <p class="text-amber-700 font-medium">NT$ {{ item.price }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="decreaseQty(item.name)" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
            <span class="font-bold w-4 text-center">{{ item.quantity }}</span>
            <button @click="increaseQty(item.name)" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
          </div>
        </div>
      </div>

      <div class="border-t pt-6 mt-6">
        <div class="flex justify-between items-center mb-6 text-xl font-bold">
          <span>總計金額</span>
          <span class="text-amber-800">NT$ {{ totalPrice }}</span>
        </div>
        <button 
          @click="checkout"
          :disabled="Object.values($cartItems).length === 0"
          class="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700 disabled:bg-gray-300 transition-colors"
        >
          確認訂單，下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { cartItems, isCartOpen, increaseQty, decreaseQty } from '../store/cartStore.js';

const $cartItems = useStore(cartItems);
const $isCartOpen = useStore(isCartOpen);

// 自動計算總額
const totalPrice = computed(() => {
  return Object.values($cartItems.value).reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const checkout = () => {
  // 關閉側邊欄
  isCartOpen.set(false);
  // 直接讓網頁跳轉到我們即將建立的結帳頁面
  window.location.href = '/checkout';
};
</script>