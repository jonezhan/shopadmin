import axios from "~/axios";

// 后台首页统计1接口
export function getStatistics1() {
  return axios.get("/admin/statistics1", {});
}

// 后台首页统计2接口
export function getStatistics2() {
  return axios.get("/admin/statistics2", {});
}

// 后台首页统计3接口
export function getStatistics3(type) {
  return axios.get("/admin/statistics3", {
    params: {
      type,
    },
  });
}
