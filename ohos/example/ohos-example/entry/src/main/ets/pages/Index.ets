/*
 * Copyright (C) 2024. Huawei Device Co., Ltd. All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the Apache-2.0 license.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Apache-2.0 license for more details.
 */

import router from '@ohos.router';
import { ExtWebController, PreRenderUrl, ExtWeb } from 'WebSceneKitHsp';
import window from '@ohos.window';
import { CommonAdapter } from '../commonadapter/CommonAdapter';

@Entry
@Component
struct Index {
  @StorageLink('isOnForeground') isOnForeground: boolean = true;
  commonAdapter: CommonAdapter = new CommonAdapter();

  aboutToAppear(): void {
    // 使用extWeb必须init 初始化api方法
    this.commonAdapter.init();
    ExtWebController.preRenderUrls([
      new PreRenderUrl('resource://rawfile/frameworkTest_web/pages/singlePage2/entry.html', true, false),
      new PreRenderUrl('resource://rawfile/frameworkTest_web/pages/singlePage3/entry.html', false, false),
      new PreRenderUrl('/data/storage/el2/base/haps/entry/files/web.html', true, false),
      new PreRenderUrl('resource://rawfile/frameworkTest_web/pages/index/entry.html?hello=world', false, false),
      new PreRenderUrl('https://www.jd.com/', true, false),
    ]);

    ExtWebController.delayExecute(['BarStyle'])
  }

  onPageShow(): void {
    ExtWebController.preRenderUrls([
      new PreRenderUrl('https://www.taobao.com/', false, false),
    ]);
  }

  build() {
    Row() {
      Column({ space: 10 }) {
        Button("跳转到华为商城，有预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'https://www.vmall.com/',
              }
            })
          })
        Button("跳转到开发者联盟，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'https://developer.huawei.com/consumer/cn/',
              }
            })
          })
        Button("跳转singlePage1，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage1",
              params: {
                url: 'resource://rawfile/frameworkTest_web/pages/singlePage1/entry.html',
              }
            })
          })
        Button("跳转NativePage，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/NativePage"
            })
          })
        Button("跳转mixWebList，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/mixWebList"
            })
          })
        // 模仿native首页包含MixWeb混合类型卡片
        // ExtWeb({ url: "resource://rawfile/frameworkTest_web/pages/mixPage/entry.html", asMixWeb: true, isOnForeground: this.isOnForeground}).height('30%')
        // ExtWeb({ url: "resource://rawfile/frameworkTest_web/pages/mixPage1/entry.html", asMixWeb: true, isOnForeground: this.isOnForeground}).height('30%')
        Button("跳转到CommonTest，有预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'resource://rawfile/frameworkTest_web/pages/index/entry.html',
              }
            })
          })
        Button("跳转到沙箱路径entry/files/web.html，有预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: '/data/storage/el2/base/haps/entry/files/web.html',
              }
            })
          })

        Button("一键登录测试")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'resource://rawfile/frameworkTest_web/pages/loginPageTest/entry.html',
              }
            })
          })

        Button("singlePage2页面预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'resource://rawfile/frameworkTest_web/pages/singlePage2/entry.html',
              }
            })
          })
      }
    }
    .height('100%')
  }
}

