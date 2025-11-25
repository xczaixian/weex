import { authentication } from '@kit.AccountKit'
import { util } from '@kit.ArkTS'
import { ApiOptions } from './apimodel/ApiOptions'
import { ResultStr, WeexProxyResult } from './apimodel/WeexResult';

export class AccountAPI {
  quickLoginAnonymousPhone(options: ApiOptions) {
    const completeCb = options.completeCb;
    let authReq = new authentication.HuaweiIDProvider().createAuthorizationWithHuaweiIDRequest()
    authReq.scopes = ['quickLoginAnonymousPhone']
    authReq.permissions = ['idtoken']
    authReq.forceAuthorization = true
    authReq.state = util.generateRandomUUID()
    authReq.idTokenSignAlgorithm = authentication.IdTokenSignAlgorithm.PS256

    try {
      let controller = new authentication.AuthenticationController()
      controller.executeRequest(authReq, (error, data) => {
        if (error) {
          console.error((`[AccountAPI ERROR] ${JSON.stringify(error)}`))
          completeCb(new WeexProxyResult(ResultStr.FAIL, JSON.stringify(error)))
        }
        console.log(`[AccountAPI REQ] ${JSON.stringify(data)}`)
        completeCb(new WeexProxyResult(ResultStr.SUCCESS, JSON.stringify(data)))
      })
    } catch (error) {
      console.error((`[AccountAPI TRY ERROR] ${JSON.stringify(error)}`))
      completeCb(new WeexProxyResult(ResultStr.FAIL, JSON.stringify(error)))
    }
  }
}