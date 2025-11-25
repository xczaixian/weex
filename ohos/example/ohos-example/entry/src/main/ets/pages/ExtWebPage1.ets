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

import { ExtWeb } from 'WebSceneKitHsp';
import router from '@ohos.router';
import { RouterStorage } from 'WebSceneKitHsp'
import { GlobalRouter } from 'WebSceneKitHsp/src/main/ets/webrouterservice/globalrouter/GlobalRouter';

interface routerParam {
  url: string
}

@Entry
@Component
struct ExtWebPage1 {
  @StorageLink('isOnForeground') isOnForeground: boolean = true;
  url: string = "";
  aboutToAppear() {
    if (router.getParams()) {
      this.url = (router.getParams() as routerParam).url;
    }
  }

  onDidBuild() {

  }

  build() {
    NavDestination() {
      Column({ space: 10 }) {
        Button("跳转watchElements，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: 'resource://rawfile/frameworkTest_web/pages/watchElements/entry.html',
              }
            })
          })
        Button("跳转空白页，无预渲染")
          .width('100%')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            router.pushUrl({
              url: "pages/ExtWebPage",
              params: {
                url: '',
              }
            })
          })
        ExtWeb({ url: this.url, asMixWeb: false, isOnForeground: this.isOnForeground })
      }.height('100%')
    }
  }
}
