<template>
  <div class="goods-item" @click="itemClick">
    <img :src="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsItem: {
      type: Object,
      default() {
        return [];
      },
    },
  },
  methods: {
    imageLoad() {
      this.$bus.$emit("itemImageLoad");

      /* if (this.$route.path.indexOf("./home") !== -1) {
        this.$bus.$emit("homeItemImageLoad");
      } else if (this.$route.path.indexOf("/detail")) {
        this.$bus.$emit("detailItemImageLoad");
      } */
    },
    itemClick() {
      this.$router.push("/detail" + this.goodsItem.iid);
    },
  },
  computed: {
    showImage() {
      return (
        this.goodsItem.image || this.goodsItem.img || this.goodsItem.show.img
        // return this.goodsItem.image || this.goodsItem.show.img;
      );
    },
  },
};
</script>

<style>
.goods-item {
  position: relative;
  padding-bottom: 40px;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
}
.goods-info {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
}
.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
.goods-info .price {
  color: var(--color-high-text);
  padding-right: 20px;
}
.goods-info .collect {
  position: relative;
}
.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>