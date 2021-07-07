<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
import BetterScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import ObserveImage from "@better-scroll/observe-image";

BetterScroll.use(ObserveImage);
BetterScroll.use(Pullup);

export default {
  props: {
    //传入的probeType不写固定，根据组件需求再写
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    //1.创建bScroll对象
    this.scroll = new BetterScroll(this.$refs.wrapper, {
      click: true,
      observeImage: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });
    //2.监听滚动位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        this.$emit("scroll", position);
      });
    }
    //3.监听下拉事件
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>

<style>
</style>