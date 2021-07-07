<template>
  <div class="toast" v-show="false">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.toast {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  padding: 8px 10px;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  border-radius: 15px;
}
</style>