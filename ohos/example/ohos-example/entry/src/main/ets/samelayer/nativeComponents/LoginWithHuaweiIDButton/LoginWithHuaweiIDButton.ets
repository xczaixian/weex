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

import { LoginWithHuaweiIDButtonParams } from '../../interfaces/SameLayer';
import { loginComponentManager, LoginWithHuaweiIDButton as NativeButton } from '@kit.AccountKit';
import { BusinessError } from '@ohos.base';
import { promptAction } from '@kit.ArkUI'

// 错误处理
function dealAllError(error: BusinessError): void {
  promptAction.showToast({
    message: `error: ${JSON.stringify(error)}`,
    duration: 3000
  })
  console.log('[LoginWithHWIDButton]', `Failed to login, errorCode=${error.code}, errorMsg=${error.message}`);
}


@Component
export struct LoginWithHuaweiIDButton {
  @ObjectLink params: LoginWithHuaweiIDButtonParams

  controller: loginComponentManager.LoginWithHuaweiIDButtonController = new loginComponentManager.LoginWithHuaweiIDButtonController();

  aboutToAppear() {
    this.controller
      .setAgreementStatus(loginComponentManager.AgreementStatus.ACCEPTED)
      .onClickLoginWithHuaweiIDButton((error: BusinessError, response: loginComponentManager.HuaweiIDCredential) => {
        if (error) {
          dealAllError(error);
          return;
        }
        if (response) {
          // 获取到Authorization Code
          const authorizationCode = response.authorizationCode;
          promptAction.showToast({
            message: `response: ${JSON.stringify(response)}`,
            duration: 3000
          })
          console.log(`[LoginWithHWIDButton]', 'Succeed in getting response: ${response}, authorizationCode: ${authorizationCode}`);
          return;
        }
      })
      .onClickEvent((error: BusinessError, clickEvent: loginComponentManager.ClickEvent) => {
        if (error) {
          dealAllError(error);
          return;
        }
        promptAction.showToast({
          message: `clickEvent: ${JSON.stringify(clickEvent)}`,
          duration: 3000
        })
        console.log('[LoginWithHWIDButton]', `onClickEvent clickEvent: ${clickEvent}`);
      });
  }

  build() {
    Column() {
      NativeButton({
        params: {
          style: loginComponentManager.Style.BUTTON_RED
        },
        controller: this.controller
      })
        .height(40)
        .width('90%')
        .margin({
          top: 0
        })
    }
      .justifyContent(FlexAlign.Center)
      .constraintSize({ minHeight: 40 })
  }
}

@Builder
export function NativeLoginWithHuaweiIDButtonBuilder(params: LoginWithHuaweiIDButtonParams) {
  LoginWithHuaweiIDButton({ params: params })
}
