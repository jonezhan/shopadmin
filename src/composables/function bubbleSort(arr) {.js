function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 相邻元素两两对比
        // 如果前一个元素比后一个元素大，则交换它们的位置
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// 示例使用
let array = [64, 34, 25, 12, 22, 11, 90];
console.log("原始数组：", array);
array = bubbleSort(array);
console.log("排序后的数组：", array);
