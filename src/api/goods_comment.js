import axios from "~/axios";
export function getCommentList(page, query = { title: "" }) {
  return axios.get(`/admin/goods_comment/${page}`, {
    params: query,
  });
}

export function updateCommentStatus(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, {
    status,
  });
}

export function reviewComment(id, data) {
  return axios.post(`/admin/goods_comment/review/${id}`, { data });
}
