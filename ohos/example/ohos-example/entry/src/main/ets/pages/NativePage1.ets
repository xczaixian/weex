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

import { ExtWeb, PageModelController } from 'WebSceneKitHsp';
import router from '@ohos.router';
import { GlobalRouter } from 'WebSceneKitHsp/src/main/ets/webrouterservice/globalrouter/GlobalRouter';

interface routerParam {
  url: string
}

@Entry
@Component
struct NativePage1 {
  @StorageLink('isOnForeground') isOnForeground: boolean = true;
  @State navPathStack: NavPathStack | undefined = undefined;
  url: string = "";
  aboutToAppear() {
    if (router.getParams()) {
      this.url = (router.getParams() as routerParam).url;
    }
    this.navPathStack = new NavPathStack();
    PageModelController.getInstance().addToPageStackArray(this.navPathStack);
  }

  onBackPress(): boolean | void {
    return GlobalRouter.getInstance().onBackPress(1, true, 0);
  }

  build() {
    Navigation(this.navPathStack) {
      Column({ space: 10 }) {
        TextInput({ placeholder: 'search...' })
          .width('90%')
          .height(40)
          .backgroundColor('#FFFFFF')
          .margin({ top: 8 })
        ExtWeb({ url: "resource://rawfile/frameworkTest_web/pages/mixPage2/entry.html", asMixWeb: true, isOnForeground: this.isOnForeground}).height('30%')
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
      }
    }
  }
}
