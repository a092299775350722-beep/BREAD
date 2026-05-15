<template>
  <Transition name="fade">
    <div v-if="$isCartOpen" class="fixed inset-0 z-50 flex justify-end">
      <div @click="closeDrawer" class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"></div>

      <div class="relative w-full max-w-md bg-gradient-to-br from-amber-50 to-white h-full shadow-2xl flex flex-col animate-slide-in">
        <!-- 頭部 (共用) -->
        <div class="flex justify-between items-center p-6 border-b border-amber-200 bg-white/80 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ view === 'cart' ? '🛒' : '📝' }}</span>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
              {{ view === 'cart' ? '我的購物車' : '填寫訂購資料' }}
            </h2>
          </div>
          <button @click="closeDrawer" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-black/40 text-gray-500 flex items-center justify-center transition-colors">✕</button>
        </div>

        <!-- 動態內容區：根據 view 狀態切換 -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- 畫面 1：購物車商品列表 -->
          <div v-if="view === 'cart'">
            <div v-if="Object.keys($cartItems).length === 0" class="text-center py-16">
              <div class="text-6xl mb-4 opacity-50">🍞</div>
              <p class="text-gray-400 text-lg">購物車空空如也</p>
              <p class="text-gray-300 text-sm mt-2">快去選購美味麵包吧～</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="item in Object.values($cartItems)" :key="item.name" class="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
                <div class="text-4xl bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center">🥖</div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800 text-lg">{{ item.name }}</h4>
                  <p class="text-amber-700 font-semibold">NT$ {{ item.price }}</p>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1">
                  <button @click="decreaseQty(item.name)" class="w-7 h-7 rounded-full bg-white shadow-sm text-amber-700 font-bold hover:bg-amber-50">−</button>
                  <span class="font-bold w-6 text-center text-gray-700">{{ item.quantity }}</span>
                  <button @click="increaseQty(item.name)" class="w-7 h-7 rounded-full bg-white shadow-sm text-amber-700 font-bold hover:bg-amber-50">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 畫面 2：填寫表單 -->
          <div v-if="view === 'form'" class="space-y-5">
            <div>
              <label class="block text-stone-700 text-sm font-medium mb-1">收件人姓名 *</label>
              <input v-model="form.name" type="text" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" :class="{'border-red-400': errors.name}" placeholder="陳小美" />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-stone-700 text-sm font-medium mb-1">聯絡電話 *</label>
              <input v-model="form.phone" type="tel" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" :class="{'border-red-400': errors.phone}" placeholder="0912-345-678" />
              <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
            </div>
            <div>
              <label class="block text-stone-700 text-sm font-medium mb-1">備註（選填）</label>
              <textarea v-model="form.note" rows="2" class="w-full border border-stone-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none" placeholder="例如：不要切、下午送達"></textarea>
            </div>
            <div class="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl">
              💡 送出訂單後我們會盡快以電話確認，請保持手機暢通。
            </div>
          </div>

          <!-- 畫面 3：訂單完成訊息 -->
          <div v-if="view === 'complete'" class="text-center py-8">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-2xl font-bold text-amber-800 mb-2">訂單已送出！</h3>
            <p class="text-gray-600 mb-4">感謝您的訂購，我們會盡快與您聯繫。</p>
            <div class="bg-amber-50 rounded-xl p-3 text-left text-sm">
              <p class="font-bold text-amber-800">📌 訂單編號：{{ lastOrderId }}</p>
              <p class="text-stone-600 mt-1">請記下此編號，可用於查詢訂單進度。</p>
              <div class="mt-3 pt-2 border-t border-amber-200">
                <p class="font-bold">💰 匯款資訊</p>
                <p>銀行：XX銀行 帳號：123-456-7890</p>
                <p class="text-xs mt-1">※ 請於三日內匯款，並來電告知後五碼。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按鈕區 (根據不同畫面顯示不同按鈕) -->
        <div class="border-t border-amber-200 bg-white/90 backdrop-blur-sm p-6 space-y-3">
          <!-- 購物車畫面的底部 -->
          <div v-if="view === 'cart'">
            <div class="flex justify-between items-center text-xl mb-4">
              <span class="text-gray-600">總計金額</span>
              <span class="font-black text-2xl text-amber-800">NT$ {{ totalPrice }}</span>
            </div>
            <button @click="goToForm" :disabled="Object.keys($cartItems).length === 0"
              class="w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              :class="Object.keys($cartItems).length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg hover:shadow-xl'">
              🧾 確認訂單，下一步
            </button>
          </div>

          <!-- 填寫表單畫面的底部 -->
          <div v-if="view === 'form'" class="flex gap-3">
            <button @click="view = 'cart'" class="flex-1 border border-stone-200 text-stone-600 py-2 rounded-xl hover:bg-stone-50">← 返回購物車</button>
            <button @click="submitOrder" class="flex-1 bg-stone-800 text-white py-2 rounded-xl hover:bg-black">確認訂購</button>
          </div>

          <!-- 訂單完成畫面的底部 -->
          <div v-if="view === 'complete'">
            <button @click="closeDrawerAndReset" class="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700">
              繼續選購
            </button>
            <button @click="goToOrderStatus" class="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 text-sm">
              查詢訂單進度
            </button>
          </div>

          <p v-if="view !== 'complete'" class="text-xs text-center text-gray-400">訂單送出後我們會盡快與您聯繫</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { cartItems, isCartOpen, increaseQty, decreaseQty } from '../store/cartStore.js';

const $cartItems = useStore(cartItems);
const $isCartOpen = useStore(isCartOpen);

// 控制目前顯示的畫面：'cart'（商品列表）、'form'（填寫表單）、'complete'（完成）
const view = ref('cart');

// 表單資料與錯誤
const form = ref({ name: '', phone: '', note: '' });
const errors = ref({ name: '', phone: '' });

// 最後產生的訂單編號（用於完成畫面）
const lastOrderId = ref('');

// 計算總金額
const totalPrice = computed(() => {
  return Object.values($cartItems.value).reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// 關閉側邊欄並重置所有狀態（回到購物車畫面）
const closeDrawer = () => {
  isCartOpen.set(false);
  // 延遲重置，避免關閉動畫時視圖閃爍
  setTimeout(() => {
    if (!$isCartOpen.value) {
      view.value = 'cart';
      form.value = { name: '', phone: '', note: '' };
      errors.value = { name: '', phone: '' };
    }
  }, 300);
};

// 從購物車切換到填寫表單
const goToForm = () => {
  view.value = 'form';
};

// 提交訂單
const submitOrder = () => {
  // 驗證
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

  // 建立訂單
  const orderId = Date.now();
  const order = {
    id: orderId,
    date: new Date().toLocaleString(),
    customer: {
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      note: form.value.note || ''
    },
    items: Object.values($cartItems.value),
    total: totalPrice.value,
    status: '待處理'
  };
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  existingOrders.push(order);
  localStorage.setItem('orders', JSON.stringify(existingOrders));

  // 清空購物車（Nanostore）
  cartItems.set({});

  // 儲存訂單編號並切換到完成畫面
  lastOrderId.value = orderId.toString();
  view.value = 'complete';
};

// 從完成畫面關閉側邊欄並重置
const closeDrawerAndReset = () => {
  isCartOpen.set(false);
  setTimeout(() => {
    if (!$isCartOpen.value) {
      view.value = 'cart';
      form.value = { name: '', phone: '', note: '' };
      errors.value = { name: '', phone: '' };
    }
  }, 300);
};

// 跳轉到訂單查詢頁面（選擇性，如果你有 order-status 頁面）
const goToOrderStatus = () => {
  window.location.href = '/order-status';
};

// 頁面載入時，如果 localStorage 有清除購物車標記，就清空購物車（保留相容之前）
onMounted(() => {
  if (localStorage.getItem('shouldClearCart') === 'true') {
    cartItems.set({});
    localStorage.removeItem('shouldClearCart');
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>