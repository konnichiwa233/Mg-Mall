import { debounce } from "./utils";
import BackTop from "@/components/content/backTop/BackTop";

export const itemListenerMiXin = {
    data() {
        return {
            itemImgListener: null
        }
    },


    mouted() {
        //1.图片加载完成的事件监听
        const refresh = debounce(this.$refs.scroll.refresh, 200);

        //对监听的事件进行保存
        this.itemImgListener = () => {
            //重新计算 BetterScroll
            refresh();
        };
        this.$bus.$on("itemImageLoad", this.itemImgListener);
    }
}
