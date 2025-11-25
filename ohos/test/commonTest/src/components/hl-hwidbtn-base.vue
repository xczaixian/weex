<template>
  <BaseSameLayer
    :hosSameLayerArgs="hosSameLayerArgs"
    embedType="hwidbtn"
  ></BaseSameLayer>
</template>

<script>
import BaseSameLayer from "./baseSameLayer.vue";

export default {
  name: "HlHwidbtn",
  components: {
    BaseSameLayer,
  },
  props: {},
  computed: {
    hosSameLayerArgs() {
      return {
        handleOnTap: this.handleOnTap,
      };
    },
  },
  methods: {
    // 自定义拓展其它逻辑
    handleOnTap(res) {
      this.$emit("onTap", res);
    },
  },
};
</script>

<style scoped></style>
