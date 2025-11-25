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
// import { ExtWeb, LocalUpdateManagerInstance, UpdateConfig } from 'WebSceneKit/Index';
import { ExtWeb, LocalUpdateManagerInstance, UpdateConfig } from 'WebSceneKitHsp/Index';
import { emitter } from '@kit.BasicServicesKit'
import { EmitterID } from '../commonadapter/apimodel/EmitterCommon'

@Entry
@Component
struct Second {
  @State message: string = '此Native页由Weex页面跳转而来, 1017'
  url: string = "";

  onBackPress(): boolean | void {
    router.back({
      url: '',
      params: { isLoading: false }
    })
    emitter.emit({ eventId: EmitterID.EVENT_JUMP_NATIVE_ID }, {
      data: {
        nativeStatus: 'finish'
      }
    })
    return true;
  }

  aboutToAppear() {
    if (router.getParams()) {
      this.url = (router.getParams() as routerParam).url;
    }
  }

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(10)
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
          })
        Button('extWeb')
        ExtWeb({ url: "resource://rawfile/hybrid1.html", asMixWeb: false})
      }
      .width('100%')
    }
    .height('100%')
  }
}

interface routerParam {
  url: string
}