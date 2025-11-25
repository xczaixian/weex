<template>
  <list
    class="list-wrap"
    virtual="true"
    @scroll="onScroll"
    estimatedItemSize="100"
    bufferScale="1"
  >
    <div ref="list">
      <div ref="content">
        <cell
          class="list-cell"
          v-for="item in originalData"
          :key="item.id"
          ref="items"
          :style="{
            height: (multiple ? item.height * multiple : item.height) + 'px',
          }"
        >
          <text class="itemContent">{{ item.value }}</text>
        </cell>
      </div>
    </div>
  </list>
</template>

    
<script>
export default {
  data() {
    return {
      isVirtual: true,
      originalData: new Array(1000).fill({}).map((item, index) => ({
        id: index,
        value: `item ${index + 1}`,
        height: 100,
      })),
    };
  },
  methods: {
    onScroll(e) {
      console.log("visibleData is", this.visibleData);
    //   console.log("log_list !!!!!!!!!!!!!!!!!!!!!!!!!!!!", e);
    },
  },
};
</script>

    
<style>
.itemContent {
  text-align: center;
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

.item {
  width: 750px;
  height: 50px;
  background-color: red;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}
</style>
