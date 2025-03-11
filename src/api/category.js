import axios from "~/axios";

// 商品的相关接口

export function getCategoryList() {
  return axios.get(`/admin/category`);
}

export function createCategory(name) {
  return axios.post(`/admin/category`, {
    name,
  });
}

export function updateCategory(id, name) {
  return axios.post(`/admin/category/${id}`, {
    name,
  });
}

export function updateCategoryStatus(id, status) {
  return axios.post(`/admin/category/${id}/update_status`, {
    status,
  });
}

export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`);
}

//
export function getRecommendGoodsList(id) {
  return axios.get(`/admin/app_category_item/list?category_id=${id}`);
}

export function deleteRecommendGoods(id) {
  return axios.post(`/admin/app_category_item/${id}/delete`);
}

export function connectRecommendGoods(data) {
  return axios.post(`/admin/app_category_item`, data);
}
