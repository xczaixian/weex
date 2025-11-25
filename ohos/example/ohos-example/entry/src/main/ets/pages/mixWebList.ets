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
import { GlobalRouter } from 'WebSceneKitHsp/src/main/ets/webrouterservice/globalrouter/GlobalRouter';
import { PageModelController } from 'WebSceneKitHsp';

interface routerParam {
  url: string
}

@Entry
@Component
export struct mixWebPage {
  @StorageLink('isOnForeground') isOnForeground: boolean = true;
  @State navPathStack: NavPathStack | undefined = undefined;
  @State urlLists: Array<string> = [
    'resource://rawfile/frameworkTest_web/pages/mixPage/entry.html',
    'resource://rawfile/frameworkTest_web/pages/mixPage1/entry.html'
  ]
  aboutToAppear() {
    this.navPathStack = new NavPathStack();
    PageModelController.getInstance().addToPageStackArray(this.navPathStack);
  }

  onBackPress(): boolean | void {
    return GlobalRouter.getInstance().onBackPress(1, true, 0)
  }

  build() {
    NavDestination() {
      Column({ space: 10 }) {
        ForEach(this.urlLists, (url: string) => {
          ExtWeb({ url, asMixWeb: true, isOnForeground: this.isOnForeground}).height('30%')
        })
        Button('修改卡片内容为singlePage')
          .onClick(() => {
            this.urlLists = [
              'resource://rawfile/frameworkTest_web/pages/singlePage1/entry.html',
              'resource://rawfile/frameworkTest_web/pages/singlePage2/entry.html'
            ]
          })
      }.height('100%')
    }
  }
}