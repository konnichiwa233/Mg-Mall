<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <ul>
        <li v-for="(item, index) in $store.state.cartList" :key="index">
          {{ item }}
        </li>
      </ul>
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <!-- <goods-list ref="recommend" :goods="recommends" /> -->
    </scroll>

    <detail-bottom-bar class="bottom-bar" @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <toast :message="message" v-show="show" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
// import GoodsList from "@/components/content/goods/GoodsList";
import DetailBottomBar from "./childComps/DetailBottomBar";
import BackTop from "@/components/content/backTop/BackTop";
import Toast from "@/components/common/toast/Toast";

import Scroll from "@/components/common/scroll/Scroll";

import { debounce } from "@/common/utils.js";
import { itemListenerMiXin } from "@/common/mixin.js";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "@/network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    // GoodsList,
    DetailBottomBar,
    BackTop,
    Toast,

    Scroll,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
      message: "",
      show: false,
    };
  },
  created() {
    //1.保存iid
    this.iid = this.$route.params.iid;

    //2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      //2.1获取顶部图片轮播数据
      this.topImages = data.itemInfo.topImages;
      //2.2获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //2.3获取店铺信息
      this.shop = new Shop(data.shopInfo);
      //2.4获取商品详情数据
      this.detailInfo = data.detailInfo;
      //2.5获取商品参数数据
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //2.6获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    //3.获取推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    this.$nextTick(() => {
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
        this.themeTopYs.push(Number.MAX_VALUE); // 存入最大值，用于边界条件判断
      }, 200);
    });
  },
  mounted() {},
  mixins: [itemListenerMiXin],
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },

  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      const positionY = -position.y;
      // console.log(position);
      const length = this.themeTopYs.length;
      for (let i = 0; i < this.themeTopYs.length; i++) {
        /* if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        )  */
        //有MAX_VALUE，无限大边界，就不用做上面复杂的判断了
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i; // 用于避免重复记录i的次数
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      this.isShowBackTop = -position.y > 300;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    addToCart() {
      //1.获取商品需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品加入购物车
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product).then((res) => {
        this.message = res;
        this.show = true;

        setTimeout(() => {
          this.show = false;
        }, 1500);
        // console.log(res);
      });

      //3.添加购物车成功
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  height: 100vh;
  z-index: 1;
  background-color: #fff;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 55px);
  background-color: #fff;
}

.bottom-bar {
  position: relative;
}
</style>