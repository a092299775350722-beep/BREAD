import { atom } from 'nanostores';

export const cartItems = atom({}); 
export const isCartOpen = atom(false);

// 🌟 新增：讓網頁具備記憶能力 (localStorage)
if (typeof window !== 'undefined') {
  // 1. 網頁剛載入時，去瀏覽器找找看有沒有上次沒結帳的購物車
  const savedCart = localStorage.getItem('sister-bakery-cart');
  if (savedCart) {
    cartItems.set(JSON.parse(savedCart));
  }

  // 2. 只要購物車有變動，就自動存檔到瀏覽器裡
  cartItems.listen((newValue) => {
    localStorage.setItem('sister-bakery-cart', JSON.stringify(newValue));
  });
}

// === 以下保留你原本的邏輯 ===
export function addCartItem({ name, price }) {
  const currentCart = cartItems.get();
  if (currentCart[name]) {
    cartItems.set({
      ...currentCart,
      [name]: { ...currentCart[name], quantity: currentCart[name].quantity + 1 }
    });
  } else {
    cartItems.set({
      ...currentCart,
      [name]: { name, price, quantity: 1 }
    });
  }
}

export function increaseQty(name) {
  const currentCart = cartItems.get();
  cartItems.set({
    ...currentCart,
    [name]: { ...currentCart[name], quantity: currentCart[name].quantity + 1 }
  });
}

export function decreaseQty(name) {
  const currentCart = cartItems.get();
  if (currentCart[name].quantity > 1) {
    cartItems.set({
      ...currentCart,
      [name]: { ...currentCart[name], quantity: currentCart[name].quantity - 1 }
    });
  } else {
    const { [name]: _, ...rest } = currentCart;
    cartItems.set(rest);
  }
}