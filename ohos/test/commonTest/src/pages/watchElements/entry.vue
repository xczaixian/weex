<template>
  <div class="full-page" @viewappear="onviewappear"
      @viewdisappear="onviewdisappear">
    <!-- <list class="list-wrap" :show-scrollbar="false" :paging-enabled="true">
      <cell
        class="section"
        v-for="(item, index) in videoList"
        v-dynamic-monitoring="[videoList]"
        :key="index"
        :item="item"
        :index="index"
        @touchstart="onTouchstart(index, item)"
        @appear="onAppear(event, index, item)"
        @disappear="onDisappear(event, index, item)"
      >
        <div
          :style="{ backgroundColor: item, height: fullHeight + 'px' }"
          class="item"
        ></div>
      </cell>
    </list>
    <div v-dynamic-monitoring="[videoList]"></div> -->
    <list class="list-wrap">
      <cell class="list-cell" v-for="(item, index) in lists" :key="index">
        <text
          class="list-text"
          :item="item"
          :index="index"
          v-dynamic-monitoring="[lists]"
          @touchstart="onstart(item, index)"
          >{{ `${item}--${index}` }}</text
        >
      </cell>
    </list>
    <button class="btn" @click="addInfo">添加数据</button>
  </div>
</template>

<script>
import screenMixin from "@/mixin/screenMixin";

export default {
  mixins: [screenMixin],
  data() {
    return {
      videoList: [],
      changeInfo: "",
      itemList: [
        "red",
        "green",
        "blue",
        "yellow",
        "purple",
        "orange",
        "pink",
        "black",
        "white",
        "gray",
      ],
      lists: [
        "pretty",
        "large",
        "big",
        "small",
        "tall",
        "short",
        "long",
        "handsome",
        "plain",
        "quaint",
        "clean",
        "elegant",
        "easy",
        "angry",
        "crazy",
        "helpful",
        "mushy",
        "odd",
        "unsightly",
        "adorable",
        "important",
        "inexpensive",
        "cheap",
        "expensive",
        "fancy",
      ],
    };
  },
  created() {
    this.setScreen({
      isOpen: true,
      showStatusMsg: true,
      statusMsgColor: 0,
    });
    setTimeout(() => {
      this.getVideoList();
    }, 300);
  },
  methods: {
    onAppear(ext, item, index) {
      console.log(item, index, "显示了", ext);
    },
    onDisappear(ext, item, index) {
      console.log(item, index, "隐藏了", ext);
    },
    onviewappear() {
      console.log('onviewAppear watchElements ...')
    },
    onviewdisappear() {
      console.log('onviewDisappear watchElements ...')
    },
    onTouchstart(item, index) {
      console.log(item, index, "click了");
    },
    onstart(item, index) {
      console.log(`${item}---${index}`);
    },
    getVideoList() {
      this.videoList = [
        "red",
        "green",
        "blue",
        "yellow",
        "purple",
        "orange",
        "pink",
        "black",
        "white",
        "gray",
      ];
    },
    addInfo() {
      console.log("button anniu");
      this.lists.push(
        ...[
          "pretty",
          "large",
          "big",
          "small",
          "tall",
          "short",
          "long",
          "handsome",
          "plain",
          "quaint",
          "clean",
          "elegant",
          "easy",
          "angry",
          "crazy",
          "helpful",
          "mushy",
          "odd",
          "unsightly",
          "adorable",
          "important",
          "inexpensive",
          "cheap",
          "expensive",
          "fancy",
        ]
      );
    },
  },
  watch: {
    changeInfo: {
      handle: 'format'
    },
    lists(value) {
      if (value) {
        this.$nextTick(() => {
          console.log("list添加了25条数据");
        });
      }
    },
    // lists: function (value) {
    //     if (value) {
    //         this.$nextTick(() => {
    //             console.log("list添加了25条数据")
    //         })
    //     }
    // }
  },
};
</script>

<style scoped>
.list-wrap {
  width: 750px;
  flex: 1;
}

.item {
  width: 750px;
}

.btn {
  width: 500px;
  padding: 20px;
  margin: 20px auto 0;
  border-radius: 10px;
  color: #6d7dff;
  text-align: center;
  font-size: 32px;
  border-style: solid;
  border-color: #6d7dff;
  border-width: 1px;
  opacity: 1;
}

.list-wrap {
  width: 750px;
  flex: 1;
  background-color: aliceblue;
}

.list-cell {
  width: 100%;
  margin-bottom: 20px;
}

.list-text {
  width: 750px;
  height: 50px;
  background-color: red;
}
</style>
