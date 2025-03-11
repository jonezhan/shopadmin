import { computed, nextTick, ref } from "vue";

import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard,
} from "@/api/goods";
import { moveUp, moveDown, cartesianProductOf } from "@/composables/util";

// 当前商品id
export const goodsId = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

export const sku_list = ref([]);

// 初始化规格选项列表
export function initSkuCardList(data) {
  //   sku_card_list.value = data;
  sku_card_list.value = data.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    // map方法会改变原数组
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });

  // console.log(data);
  sku_list.value = data.goodsSkus;
  // console.log(sku_list.value);
}

// 添加规格选项
export const btnLoading = ref(false);
export function addSkuCard() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goodsId.value,
    name: "规格选项",
    order: 50,
    type: 0,
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

// 修改规格选项
export function updateSkuCard(item) {
  // console.log(111);
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then((res) => {
      console.log(res);
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

// 删除规格选项
export function deleteSkuCard(item) {
  item.loading = true;
  deleteGoodsSkusCard(item.id)
    .then((res) => {
      sku_card_list.value = sku_card_list.value.filter((v) => v.id != item.id);
    })
    .catch(() => {
      // item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

// 排序规格选项
export const bodyLoading = ref(false);
export function sortCard(type, index) {
  //   const item = sku_card_list.value.find((item) => item.id == id);
  //   if (type == "up") {
  //     moveUp(sku_card_list.value, index);
  //   } else if (type == "down") {
  //     moveDown(sku_card_list.value, index);
  //   }

  let oList = JSON.parse(JSON.stringify(sku_card_list.value));
  let func = type == "up" ? moveUp : moveDown;
  func(oList, index);
  let sortData = oList.map((item, index) => {
    return {
      id: item.id,
      order: index + 1,
    };
  });

  bodyLoading.value = true;
  sortGoodsSkusCard(sortData)
    .then((res) => {
      func(sku_card_list.value, index);
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

// 设置规格和选项值
export function handleChooseSetGoodsSkusCard(item, data) {
  item.loading = true;
  chooseAndSetGoodsSkusCard(item.id, data)
    .then((res) => {
      // console.log(res);
      // console.log(sku_card_list.value);
      item.id = res.goods_skus_card.id;
      item.name = res.goods_skus_card.name;
      item.text = item.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((v) => {
        v.text = v.value || "属性值";
        return v;
      });
      console.log(sku_card_list.value);
    })
    .catch(() => {})
    .finally(() => {
      item.loading = false;
    });
}

// 初始化规格值
export function initSkuCardItem(id) {
  let tempList = sku_card_list.value.find((item) => item.id == id);
  const inputValue = ref("");
  const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
  const inputVisible = ref(false);
  const InputRef = ref();

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  // 增加新规格值
  const loading = ref(false);
  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    createGoodsSkusCardValue({
      goods_skus_card_id: id,
      name: tempList.name,
      order: 50,
      value: inputValue.value,
    })
      .then((res) => {
        // console.log(res);
        // console.log(tempList.goodsSkusCardValue);
        tempList.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
      })
      .finally(() => {
        loading.value = false;
        inputValue.value = "";
        inputVisible.value = false;
      });
  };

  // 修改规格值
  const handleChange = (value, tag) => {
    // console.log(value, tag);
    loading.value = true;
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id,
      name: tempList.name,
      order: tag.order,
      value: value,
    })
      .then((res) => {
        // console.log(res);
        // console.log(tempList.goodsSkusCardValue);
        tag.value = value;
      })
      .catch(() => {
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
        //
      });
  };
  // 删除规格值
  const handleClose = (tag) => {
    // console.log(tag);
    // dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
    loading.value = true;
    deleteGoodsSkusCardValue(tag.id)
      .then((res) => {
        // console.log(res);
        // console.log(tempList.goodsSkusCardValue);
        tempList.goodsSkusCardValue.splice(
          tempList.goodsSkusCardValue.indexOf(tag),
          1
        );
      })
      .catch(() => {
        // tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
        //
      });
  };
  return {
    loading,
    tempList,
    inputValue,
    dynamicTags,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    handleChange,
  };
}

// 初始化规格选项表格
export function initSkuTable(id) {
  // console.log(sku_card_list.value);

  const skuLabels = computed(() => {
    return sku_card_list.value.filter((e) => e.goodsSkusCardValue.length > 0);
  });
  const tableThs = computed(() => {
    let length = skuLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        rowspan: length > 0 ? 1 : 2,
        width: "",
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });

  // console.log(sku_list.value);
  return {
    // sku_list,
    skuLabels,
    tableThs,
  };
}

// 获取规格表格数据
export function getTableData() {
  setTimeout(() => {
    // console.log(sku_card_list.value);
    if (sku_card_list.value.length == 0) return [];

    let list = [];
    sku_card_list.value.forEach((o) => {
      // console.log(o.goodsSkusCardValue);
      if (o.goodsSkusCardValue?.length > 0) {
        list.push(o.goodsSkusCardValue);
      }
    });

    if (list.length == 0) return [];

    let arr = cartesianProductOf(...list);
    // console.log(list, arr);
    sku_list.value = [];
    sku_list.value = arr.map((item) => {
      return {
        code: "",
        cprice: "",
        goods_id: goodsId.value,
        image: "",
        oprice: "0.00",
        pprice: "0.00",
        skus: item,
        stock: 0,
        volume: 0,
        weight: 0,
      };
    });
  }, 200);
}
