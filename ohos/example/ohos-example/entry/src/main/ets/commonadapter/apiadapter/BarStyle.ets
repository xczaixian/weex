import { window } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { ApiOptions } from 'WebSceneKitHsp';

const windowClass: window.Window = AppStorage.get("windowClass") as window.Window;

export class BarStyle {
  // 获取主窗口的方式
  setBarStyle(options: ApiOptions) {
    // ...
    let sysBarProps:window.SystemBarProperties = JSON.parse(options.args);
    windowClass.setWindowSystemBarProperties(sysBarProps).catch((err: BusinessError) => {
      let errCode: number = err.code;
      if (errCode) {
        console.error('[StaticUtils] Failed to set the system bar properties. Cause: ' + JSON.stringify(err));
        return;
      }
      console.info('[StaticUtils] Succeeded in setting the system bar properties.');
    });
  }
}



