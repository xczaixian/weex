<template>
    <div class="wrapper"
    @viewappear="onviewappear"
    @viewdisappear="onviewdisappear"
    ><text class="nav">mixPage2页面</text>
      <div>
        <text class="btn" @click="jumpPage('singlePage1')">push(singlePage1)</text>
        <text class="btn" @click="jumpPage('singlePage6')">push(singlePage6)</text>
        <text class="btn" @click="navigatorPop()">pop</text>
      </div>
      </div>
</template>

<script>
import { pushPage } from "@/utils/index.js";
    export default {
        data() {
            return {

            }
        },
        methods: {
            jumpPage(page, params = {}) {
                let newParams = params;
                pushPage(page, newParams);
            },
            onviewappear() {
                console.log('onviewAppear mixPage2 ...')
            },
            onviewdisappear() {
                console.log('onviewDisappear mixPage2 ...')
            },
            navigatorPop() {
              const navigator = weex.requireModule('navigator');
              navigator.pop({
              animated: "true"
              }, event => {
                console.log('callback: ', JSON.stringify(event))
              });
            },
        }
    }
</script>

<style lang="less" scoped>
.wrapper {
//   justify-content: center;
  // padding: 40px;
  height: 200px!important;
}
.nav {
  color: rgb(255, 60, 0);
  font-size: 40px;
}
.scroller {
  position: absolute;
  // left: 50px;
  // right: 50px;
  top: 0px;
  bottom: 0px;
  padding: 100px;
  background-color: #cbf7ff;
  // width: 650px;
}
.btn {
  width: 500px;
  padding: 20px;
//   margin: 20px auto 0;
  border-radius: 10px;
  color: #6d7dff;
  text-align: center;
  font-size: 32px;
  border-style: solid;
  border-color: #6d7dff;
  border-width: 1px;
  opacity: 1;
}
.btn-group {
  border-width: 1px;
  border-style: solid;
  border-color: blue;
  border-radius: 10px;
  width: 540px;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
}
.font-title {
  color: #333333;
  font-size: 28px;
  line-height: 30px;
}
</style>