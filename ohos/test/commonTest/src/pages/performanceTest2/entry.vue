<template>
  <div class="full-page">
    <list class="list-wrap" :show-scrollbar="false">
      <cell v-for="(item, index) in Array.from({ length: 100 })" :key="index" :item="item" :index="index">
        <image draggable="true" :src="imageList[index % imageList.length]" style="width: 700px; height: 300px; object-fit: fill;" />
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
      imageList: [
        "https://www-file.huawei.com/-/media/corp2020/home/banner/11/hc2024-cn2.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/banner/11/hwcloud-828-2024-m.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/banner/11/hc2024-cn-m2.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/matebook-gt-14-768-2.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/ai-6g-bridge.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/matepad-pro-12-2-768.jpg",
        "https://www-file.huawei.com/-/media/corp2020/abouthuawei/what_we_offer.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/jiaotongyinhang-768.jpg",
        "https://www-file.huawei.com/-/media/corp2020/abouthuawei/corporate-information/annual-report-20221202-cn.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/sbanner/3/white-headed-langur-cn-m.jpg",
        "https://www-file.huawei.com/-/media/corp2020/abouthuawei/corporate-information/corp-info-banner.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/middle-east-leading-5ga-era.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/5g-a-ict-opportunities.jpg",
        "https://www-file.huawei.com/-/media/corp2020/event/list/huawei-connect-2024-list-5.jpg",
        "https://www-file.huawei.com/-/media/corp2020/abouthuawei/banner-2-mb-cn.jpg",
        "https://www-file.huawei.com/-/media/corp2020/home/box/12/uniondigital-bank-philipine-768.jpg",
        "https://www-file.huawei.com/-/media/corp2020/event/2024/5g-core-summit/5g-core-list.jpg",
        "https://www-file.huawei.com/-/media/corp2020/banner/corporate-governance-pc.jpg",
        "https://www-file.huawei.com/-/media/corp2020/banner/corporate-governance-m.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/publications/202401/2/10-list-1.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/publications/202401/2/5-list.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/publications/202303/cover/5-2-huawei-ict-competition-award-winner-huawei-cover.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/publications/202401/2/6-list-0.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/home/views/xuzhijun-1.jpg",
        "https://www-file.huawei.com/-/media/corp2020/huaweitech/thrive-with-digital-cn.jpg",
        "https://www-file.huawei.com/-/media/corporate/images/about-huawei/headquarters-f1.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/home/banner3/mb-banner-zh.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/videos/has24-analyst-viewpoint/4-800-500.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/trends/1/5g-mines-800.jpg",
        "https://www-file.huawei.com/-/media/corp2020/technologies/future-technologies/3/itu-r-list.jpg"
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
  