import axios from "~/axios";

// 订单的相关接口

export function getOrderList(
  page,
  query = {
    tab: "all",
    no: null,
    starttime: null,
    endtime: null,
    name: null,
    phone: null,
  }
) {
  return axios.get(`/admin/order/${page}`, {
    params: query,
  });
}

export function deleteOrder(ids) {
  ids = Array.isArray(ids) ? ids : [ids];
  return axios.post(`/admin/order/delete_all`, {
    ids,
  });
}

export function shipOrder(id, { express_company, express_no }) {
  return axios.post(`/admin/order/${id}/ship`, {
    express_company,
    express_no,
  });
}

export function refundOrder(id, { agree, disagree_reason = null }) {
  return axios.post(`/admin/order/${id}/handle_refund`, {
    agree,
    disagree_reason,
  });
}

export function exportOrder(
  query = {
    tab: "all",
    starttime: null,
    endtime: null,
  }
) {
  return axios.post(
    `/admin/order/excelexport`,
    {
      params: query,
    },
    { responseType: "blob" }
  );
}

export function getExpressCompanyList(page) {
  return axios.get(`/admin/express_company/${page}`);
}

export function getShipInfoList(id) {
  return axios.get(`/admin/order/${id}/get_ship_info`);
}
