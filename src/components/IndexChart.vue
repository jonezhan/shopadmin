<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getStatistics3 } from "@/api/index";
import { useResizeObserver } from "@vueuse/core";
import * as echarts from "echarts";

const tagList = [
  { text: "近1个月", value: "month" },
  { text: "近1周", value: "week" },
  { text: "近24小时", value: "hour" },
];
const checked = ref("hour");
function onChange(item) {
  checked.value = item.value;
  paintEchart(); // 每次都会发起请求，也许可以优化
}

var myChart = null;

onMounted(() => {
  var chartDom = document.getElementById("echart");
  if (chartDom) {
    myChart = echarts.init(chartDom);

    paintEchart();
  }
});

// echarts图表绘制
function paintEchart() {
  function paint({ x: xData, y: yData }) {
    var option;

    option = {
      xAxis: {
        type: "category",
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: yData,
          type: "bar",
        },
      ],
    };
    myChart.hideLoading();

    option && myChart.setOption(option);
  }
  // 图标渲染前的等待状态
  myChart.showLoading();
  getStatistics3(checked.value).then((res) => {
    // console.log(res);
    paint(res);
  });
}

// 监听页面尺寸变化，动态改变echarts图表宽度
const el = ref(null);
useResizeObserver(el, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  //   text.value = `width: ${width}, height: ${height}`;
  //   console.log(width, height);
  if (myChart) {
    myChart.resize();
  }
});

// 组件卸载前，销毁echarts元素
onBeforeUnmount(() => {
  if (myChart) {
    echarts.dispose(myChart);
  }
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            class="mx-2"
            :checked="checked === item.value"
            @click="onChange(item)"
            v-for="(item, index) in tagList"
            :key="index"
          >
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <div ref="el" id="echart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>
