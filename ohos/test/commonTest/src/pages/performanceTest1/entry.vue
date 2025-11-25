<template>
  <div class="full-page">
    <list class="list-wrap" :show-scrollbar="false">
      <cell 
        v-for="(item, index) in ls" 
        :key="index"
        :item="item"
        :index="index"
      >
          <div :style="{ backgroundColor: itemList[index % 10], height: '100px'}" class="item">
              <text :style="{ color: itemList[(index + 1) % 10], fontSize: '20px'}">
                  {{index}}
              </text>
          </div>
      </cell>
    </list>
  </div>
</template>

<script>
import screenMixin from '@/mixin/screenMixin';

const stream = weex.requireModule('stream');

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
      newsList: [''],
      ls: Array.from({length: 1000})
    };
  },
  async created() {
    this.setScreen({
      isOpen: true,
      showStatusMsg: true,
      statusMsgColor: 0,
    });
    let str = ''
    let reqParams = {
      method: 'get',
      url: "https://httpbin.org/range/5000",
      headers: {
      },
      timeout: 30000,
    };
    stream.fetch(reqParams, (ret) => {
      let list = ret.data.split("")
      this.newsList = ['']
      let count = '';
      while (list.length) {
        const data = list.pop()
        if (count.length >= 4) {
          count = count + data
          this.newsList.push(count)
          count = ''
        } else {
          count = count + data
        }
      }
    })
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
