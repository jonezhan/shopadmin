import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import nProgress from "nprogress";

// 消息提示的方法
export function toast(
  message,
  type = "success",
  duration = 2000,
  dangerouslyUseHTMLString = true // 是否支持html
) {
  ElNotification({
    message,
    type,
    duration,
    dangerouslyUseHTMLString,
  });
}

// 弹出确认提示框
export function showModal(contet = "", type = "warning", title = "") {
  return ElMessageBox.confirm(contet, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type,
  });
  // .then(() => {
  //   ElMessage({
  //     type: "success",
  //     message: "已退出登录",
  //   });
  // })
  // .catch(() => {
  //   ElMessage({
  //     type: "info",
  //     message: "Delete canceled",
  //   });
  // });
}

export function showPrompt(title = "重命名", value = "") {
  return ElMessageBox.prompt("", title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
    // inputPattern:
    //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: "Invalid Email",
  });
}

// 显示全屏loading
export function showFullLoading() {
  nProgress.start();
}

// 隐藏全屏loading
export function hideFullLoading() {
  nProgress.done();
}

// 数组元素上移
export function moveUp(arr, index) {
  if (index === 0) {
    return arr;
  }
  return swapArray(arr, index, index - 1);
}

// 数组元素下移
export function moveDown(arr, index) {
  if (index === arr.length - 1) {
    return arr;
  }
  return swapArray(arr, index, index + 1);
}

// 数组元素换位的方法
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat(b));
        });
      });
      return ret;
    },
    [[]]
  );
}
