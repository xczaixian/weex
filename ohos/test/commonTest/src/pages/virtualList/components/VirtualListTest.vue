<template>
  <scroller
    ref="list"
    class="infinite-list-container"
    @scroll="scrollEvent"
    :style="{ height: screenHeight + 'px' }"
  >
    <div class="infinite-list-phantom" ref="phantom"></div>
    <div class="infinite-list" ref="content">
      <div
        ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: item.height * multiple + 'px' }"
      >
        <slot ref="slot" :value="item.value"></slot>
      </div>
    </div>
  </scroller>
</template>

<script>
import screenMixin from "@/mixin/screenMixin";
export default {
  mixins: [screenMixin],
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => [],
    },
    // //预估高度
    estimatedItemSize: {
      type: Number,
    },
    //缓冲区比例
    bufferScale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //起始索引
      start: 0,
      //结束索引
      end: null,
      // weex中height的px和rem转换倍数
      multiple:
        75 / window.document.documentElement.style.fontSize.replace("px", ""),
      // 存储列表项渲染后每一项的高度以及位置信息
      positions: [],
      // requestAnimationFrame 控制参数
      ticking: false,
    };
  },
  computed: {
    //可显示的列表项数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    //获取真实显示列表数据
    visibleData() {
      let start = this.start - this.aboveCount;
      let end = this.end + this.belowCount;
      return this.listData.slice(start, end);
    },
    // 可视区上方渲染条数
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount);
    },
    // 可视区下方渲染条数
    belowCount() {
      return Math.min(
        this.listData.length - this.end,
        this.bufferScale * this.visibleCount
      );
    },
  },
  created() {
    this.estimatedItemSize = this.estimatedItemSize * this.multiple;
    this.initPositions();
  },
  mounted() {
    this.screenHeight = window.innerHeight * this.multiple;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      //获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize();
      //更新列表总高度
      let height = this.positions[this.positions.length - 1].bottom;
      this.$refs.list.style.height = height/75 + "rem";
      //更新真实偏移量
      this.setStartOffset();
    });
  },
  destroyed(){
    console.log('entry destroyed!!!!!!!!!!VirtuaiList')
  },

  methods: {
    scrollEvent(val) {

      if (!this.ticking) {
        requestAnimationFrame(() => {
          //   当前滚动位置
          let scrollTop = -val.contentOffset.y * this.multiple;
          //此时的开始索引
          this.start = this.getStartIndex(scrollTop);
          //此时的结束索引
          this.end = this.start + this.visibleCount;
          //   console.log("start/end---->", this.start, this.end);
          //此时的偏移量
          this.setStartOffset();
          this.ticking = false;
        });
        this.ticking = true;
      }
    },
    // 初始化 positions
    initPositions() {
      this.positions = this.listData.map((item, index) => {
        return {
          index,
          height: this.estimatedItemSize,
          top: index * this.estimatedItemSize,
          bottom: (index + 1) * this.estimatedItemSize,
        };
      });
    },

    //获取列表项的当前尺寸
    updateItemsSize() {
      let nodes = this.$refs.items;
      nodes.forEach((node) => {
        let rect = node.getBoundingClientRect();
        let height = rect.height * this.multiple;
        let index = +node.id.slice(1);
        let oldHeight = this.positions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          this.positions[index].height = height;
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }
      });
    },
    //获取当前的偏移量
    setStartOffset() {
      let startOffset;
      if (this.start >= 1) {
        let size =
          this.positions[this.start].top -
          (this.positions[this.start - this.aboveCount]
            ? this.positions[this.start - this.aboveCount].top
            : 0);
        startOffset = this.positions[this.start - 1].bottom - size;
      } else {
        startOffset = 0;
      }
      this.$refs.content.style.transform = `translate3d(0,${
        startOffset / 75
      }rem,0)`;
    },
    //获取列表起始索引
    getStartIndex(scrollTop = 0) {
      //二分法查找
      return this.binarySearch(this.positions, scrollTop);
    },
    //二分法查找
    binarySearch(list, value) {
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;
      while (start <= end) {
        let midIndex = parseInt((start + end) / 2);
        let midValue = list[midIndex].bottom;
        if (midValue === value) {
          return midIndex + 1;
        } else if (midValue < value) {
          start = midIndex + 1;
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
    },
  },
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
  text-align: center;
}
</style>