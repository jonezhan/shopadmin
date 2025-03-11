<template>
  <div class="card-father relative">
    <div class="page-group">
      <i class="fold-page" :class="{ foldbg: statusText != '领取中' }"></i>
      <span
        class="page"
        :class="statusText == '领取中' ? 'pgactive' : 'pginactive'"
        >{{ type == 0 ? "满减券" : "折扣券" }}</span
      >
    </div>
    <section
      class="card border"
      :class="statusText == '领取中' ? 'active' : 'inactive'"
    >
      <div class="card-left">
        {{ Math.ceil(value) == value ? Math.ceil(value) : value }}
        <span>{{ type == 0 ? "元" : "折" }}</span>
      </div>
      <div class="card-right">
        <p class="card-info font-bold text-md">{{ name }}</p>
        <small class="card-time"> {{ start_time }} ~ {{ end_time }} </small>
      </div>
      <div class="ribbon">{{ statusText }}</div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  statusText: String,
  name: String,
  start_time: String,
  end_time: String,
  type: Number,
  value: String,
  min_price: String,
});
</script>

<style scoped>
.card-father {
  width: 380px;
  /* height: 200px; */
}
.card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  /* margin: 100px; */
  /* resize: horizontal; */
  overflow: hidden;
  /* transform: scale(2); */
  width: 380px;
  /* min-width: 320px; */
  /*下面是生成的样式*/
  -webkit-mask-image: radial-gradient(
      circle at 88px 4px,
      transparent 4px,
      red 4.5px
    ),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  -webkit-mask-size: 100%, 2px 4px;
  /* linear-gradient(transparent 25%, red 0, red 75%, transparent 0);
  -webkit-mask-size: 100%, 2px 8px; */
  -webkit-mask-repeat: repeat, repeat-y;
  -webkit-mask-position: 0 -4px, 87px;
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
}

.page-group {
  z-index: 1;
  /* border: 1px solid red; */
  position: absolute;
  top: 5px;
  left: -2px;
  width: 80px;
  /* height: 50px; */
  max-width: 120px;
}
.page-group .fold-page {
  display: block;
  width: 2px;
  height: 5px;
  background: #db0113;
  transform: skewY(-40deg);
  position: absolute;
  top: -1px;
  left: 0;
  z-index: 0;
}
.page-group .foldbg {
  @apply bg-gray-300;
}
.page-group .page {
  position: absolute;
  z-index: 1;
  display: block;
  padding: 0 8px;
  height: 16px;
  line-height: 16px;
  /* background: linear-gradient(137deg, #ff5b5b 0%, #db0113 100%); */
  border-radius: 0 20px 20px 0;
  color: #fff;
  text-align: center;
  font-size: 10px;
  overflow: hidden;
}
.pgactive {
  background: linear-gradient(137deg, #ff5b5b 0%, #db0113 100%);
}
.pginactive {
  @apply bg-gray-300;
}
.ribbon {
  /* overflow: hidden; */
  width: 80px;
  height: 18px;
  line-height: 18px;
  /* background: #dd0d1f; */
  position: absolute;
  right: -20px;
  top: 10px;
  transform: rotateZ(45deg);
  text-align: center;
  color: #fff;
  font-size: 10px;
}

.card-left {
  /* @apply font-bold  */
  width: 88px;
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  /* color: #f22424; */
}
.card-left span {
  font-size: 10px;
}
.card-right {
  padding: 16px 12px;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.card-info {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  /* color: rgba(33, 32, 44, 0.9); */
}
.card-time {
  font-size: 12px;
  line-height: 16px;
  font-weight: normal;
  margin-top: 6px;
}
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
  & .card-info {
    color: rgba(33, 32, 44, 0.9);
  }
  & .ribbon {
    background: #dd0d1f;
  }
}
.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
  & .ribbon {
    @apply bg-gray-300;
  }
}
</style>
