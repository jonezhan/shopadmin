import axios from "~/axios";
export function getUserList(
  page,
  query = { limit: 10, keyword: "", user_level_id: null }
) {
  return axios.get(`/admin/user/${page}`, {
    params: query,
  });
}

export function updateUserStatus(id, status) {
  return axios.post(`/admin/user/${id}/update_status`, {
    status,
  });
}

export function createUser(data) {
  return axios.post(`/admin/user`, data);
}

export function updateUser(id, data) {
  return axios.post(`/admin/user/${id}`, data);
}

export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`);
}
