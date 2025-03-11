import { useCookies } from "@vueuse/integrations/useCookies";
// cookie有大坑啊我靠( ‵o′)凸
const cookies = useCookies();
const TokenKey = "admin-token";

// 获取token到cookie中
export function getToken() {
  // return cookies.get(TokenKey);
  return localStorage.getItem(TokenKey);
}

// 设置token
export function setToken(token) {
  // 将token保存到cookie中，有效期为一天
  // cookies.set(TokenKey, token, {
  //   maxAge: 86400,
  // });
  localStorage.setItem(TokenKey, token);
}

// 移除token
export function removeToken() {
  // cookies.remove(TokenKey);
  localStorage.removeItem(TokenKey);
}
