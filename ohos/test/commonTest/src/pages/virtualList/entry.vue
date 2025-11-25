<template>
  <div>
    <div id="list" ref="container">
      <virtual-list-test
        :list-data="listData"
        :estimatedItemSize="100"
        :bufferScale="1"
        v-slot="slotProps"
      >
        <!-- items -->
        {{ slotProps.value }}
      </virtual-list-test>
    </div>
  </div>
</template>

<script>
import VirtualListTest from "./components/VirtualListTest.vue";
const weexModule = weex.requireModule("weexModule");

export default {
  data() {
    return {
      listData: new Array(1000).fill({}).map((item, index) => ({
        id: index,
        value: `item ${index + 1}`,
        height: Math.floor(Math.random() * 101) + 50,
      })),
      observer: null,
    };
  },
  beforeCreate() {
    console.log("entry beforeCreate!!!!!!!!!!!!");
  },
  created() {
    console.log("entry created!!!!!!!!!!!!");
  },
  mounted() {
    console.log("entry mounted!!!!!!!!!!!!")
  },
  components: {
    VirtualListTest,
  },
  methods: {
    handleDestroy() {
      console.log("entry handleDestroy!!!!!!!!!!!!");
    },
    fanhui() {
      navigator.pop({}, () => {});
    },
    naviveDestroyed() {
      console.log("entry naviveDestroyed!!!!!!!!!!!!");
    },
    setBarStyle() {
      console.log("entry setBarStyle!!!!!!!!");
      weexModule.callNative("BarStyle", {
        statusBarContentColor: "#00FF00",
        statusBarColor: "#E5FFFFFF",
      });
    },
  },
};
</script>
<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#list {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
