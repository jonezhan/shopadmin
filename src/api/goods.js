import axios from "~/axios";

// 商品的相关接口

export function getGoodsList(
  page,
  query = { tab: "all", title: null, category_id: null, limit: 10 }
) {
  return axios.get(`/admin/goods/${page}`, {
    params: query,
  });
}

export function createGoods(data) {
  return axios.post(`/admin/goods`, data);
}

export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}

export function deleteGoods(ids) {
  ids = Array.isArray(ids) ? ids : [ids];
  return axios.post(`/admin/goods/delete_all`, {
    ids,
  });
}

export function restoreGoods(ids) {
  ids = Array.isArray(ids) ? ids : [ids];
  return axios.post(`/admin/goods/restore`, {
    ids,
  });
}

export function destroyGoods(ids) {
  ids = Array.isArray(ids) ? ids : [ids];
  return axios.post(`/admin/goods/destroy`, {
    ids,
  });
}

// 批量上架下架
export function updateGoodsStatus(ids, status) {
  return axios.post(`/admin/goods/changestatus`, {
    ids,
    status,
  });
}

export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`);
}

export function setGoodsBanner(id, banners) {
  return axios.post(`/admin/goods/banners/${id}`, {
    banners,
  });
}

export function updateGoodsSkus(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data);
}

export function createGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card`, data);
}

export function updateGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data);
}

export function deleteGoodsSkusCard(id) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`);
}

export function sortGoodsSkusCard(sortdata) {
  return axios.post(`/admin/goods_skus_card/sort`, {
    sortdata,
  });
}

export function createGoodsSkusCardValue(data) {
  return axios.post(`/admin/goods_skus_card_value`, data);
}

export function updateGoodsSkusCardValue(id, data) {
  return axios.post(`/admin/goods_skus_card_value/${id}`, data);
}

export function deleteGoodsSkusCardValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`);
}

export function chooseAndSetGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/set`, data);
}
