import axios from "axios";
import { getToken } from "@/composables/auth";
import { toast } from "@/composables/util";
import store from "./store";

// Axios 实例
const service = axios.create({
  // baseURL: "/api",
  baseURL: import.meta.env.VITE_APP_BASE_API,
  withCredentials: false,
  // headers: { Cookie: "" }, // 删除Cookie头
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// service.defaults.withCredentials = true;

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    // 往headers头自动添加token
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }
    // config.withCredentials = false;
    // config.headers["Cookie"] = "";

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 对导出excel表格的响应进行特判
    return response.request.responseType == "blob"
      ? response.data
      : response.data.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = error.response.data.msg || "请求失败";
    const errorCode = error.response.data.errorCode;

    // token过期
    if (msg == "非法token，请先登录！") {
      console.log("非法token，请先登录！");
      store.dispatch("logout");
      // .finally(() => {
      //   location.reload();
      // });
    }

    if (errorCode != 40000 && errorCode != 20000) {
      toast(msg, "error");
    }
    console.log(msg);
    // toast(msg, "error");

    return Promise.reject(error);
  }
);

export default service;
