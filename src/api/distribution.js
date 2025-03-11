import axios from "~/axios";

export function getAgentStatistics() {
  return axios.get(`/admin/agent/statistics`);
}

export function getAgentList(page, query = { type: "all" }) {
  return axios.get(`/admin/agent/${page}`, {
    params: query,
  });
}

export function getAgentOrderList(page, query = { type: "all" }) {
  return axios.get(`/admin/user_bill/${page}`, {
    params: query,
  });
}

// 获取分销配置
export function getConfig() {
  return axios.get(`/admin/distribution_setting/get`);
}

export function setConfig(data) {
  return axios.post(`/admin/distribution_setting/set`, data);
}
