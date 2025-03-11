import axios from "~/axios";

// 管理员的相关接口
export function login(username, password) {
  return axios.post("/admin/login", {
    username,
    password,
  });
}

export function logout() {
  return axios.post("/admin/logout", {});
}

// 获取个人信息
export function getInfo() {
  return axios.post("/admin/getinfo", {});
}

// 修改密码
export function updatePassword({ oldpassword, password, repassword }) {
  return axios.post("/admin/updatepassword", {
    oldpassword,
    password,
    repassword,
  });
}

export function getManngerList(page, query = { limit: 10, keyword: "" }) {
  return axios.get(`/admin/manager/${page}`, {
    params: query,
  });
}

export function updateManngerStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, {
    status,
  });
}

export function createMannger(data) {
  return axios.post(`/admin/manager`, data);
}

export function updateMannger(id, data) {
  return axios.post(`/admin/manager/${id}`, data);
}

export function deleteMannger(id) {
  return axios.post(`/admin/manager/${id}/delete`);
}
