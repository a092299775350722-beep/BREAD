export const prerender = false; // 加上這行

export const POST = async ({ request }) => {
  // ... 後面的程式碼保持不變 ...
  try {
    const data = await request.json();
    
    // 👇 加入這三行，讓終端機印出真實狀況！
    console.log('--- 登入測試開始 ---');
    console.log('1. 姊姊剛剛輸入的密碼：', data.password);
    console.log('2. 系統從 .env 讀到的密碼：', import.meta.env.ADMIN_PASSWORD);
    
    if (data.password === import.meta.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};