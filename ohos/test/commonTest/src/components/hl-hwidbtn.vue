<template>
  <div>
    <embed class="embed-element" :id="embedId" type="native/hwidbtn" />
  </div>
</template>

<script>
const weexModule = weex.requireModule("weexModule");

export default {
  name: "HlHwidbtn",
  props: {},
  data() {
    return {
      embedId: `hwidbtn_${Math.floor(Math.random() * 100000)}_${Date.now()}`, // 生成embed元素的唯一ID
      isTransferScheduled: false, // 添加一个标志来检查是否已经安排了transferPropsAndListeners的调用
    };
  },
  created() {
    this.transferPropsAndListeners(); // 组件创建时调用
  },
  methods: {
    transferPropsAndListeners() {
      // 构建一个包含所需信息的对象
      const args = {
        onTap: this.handleOnTap,
        stateEffect: this.stateEffect,
      };
      // 调用JSbridge方法，传递属性和监听方法到原生组件
      native.transferSameLayerArgs(args);
    },
    scheduleTransfer() {
      if (!this.isTransferScheduled) {
        this.isTransferScheduled = true;
        this.$nextTick(() => {
          this.transferPropsAndListeners();
          this.isTransferScheduled = false;
        });
      }
    },
    handleOnTap(res) {
      this.$emit("onTap", res);
    },
  },
  watch: {},
};
</script>

<style scoped>
.embed-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
