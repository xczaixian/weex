<template>
    <div class="full-page">
      <list class="list-wrap" :show-scrollbar="false">
        <cell 
          v-for="(item, index) in Array.from({length: 3})" 
          :key="index"
          :item="item"
          :index="index"
        >
          <hl-web
            class="common-style"
            style="width: 100%; height:500px; padding: 20px"
            :src="webSrcList[index % 3]"
          ></hl-web>
        </cell>
      </list>
    </div>
  </template>
  
  <script>
  import screenMixin from '@/mixin/screenMixin';
  
  export default {
    mixins: [screenMixin],
    data() {
      return {
        itemList: [
          'red',
          'green',
          'blue',
          'yellow',
          'purple',
          'orange',
          'pink',
          'black',
          'white',
          'gray',
        ],
        webSrcList: [
          'https://wap.sogou.com/',
          'https://m.baidu.com/',
          'https://m.so.com/',
        ]
      };
    },
    created() {
      this.setScreen({
        isOpen: true,
        showStatusMsg: true,
        statusMsgColor: 0,
      });
    },
    methods: {
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
  </style>
  