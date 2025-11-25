import { ApiOptions } from './apimodel/ApiOptions';

export class ChannelMessage {
  private static instance: ChannelMessage;
  private postMesssageFunction: Map<string, Function> = new Map();
  public onMessageFunction: Map<string, Map<number, Function>> = new Map()

  public static getInstance(): ChannelMessage {
    if (!ChannelMessage.instance) {
      ChannelMessage.instance = new ChannelMessage();
    }
    return ChannelMessage.instance;
  }

  //发送信息 postMessage
  public channelPostMessage(options: ApiOptions) {
    const messageOptions: messageOptions = JSON.parse(options.args)
    let onMessageFuns: Map<number, Function> | undefined =
      ChannelMessage.getInstance().onMessageFunction.get(messageOptions.type)
    if (onMessageFuns) {
      Array.from(onMessageFuns.values()).forEach(callbackFun => {
        callbackFun(messageOptions.data)
      })
    }
    ChannelMessage.getInstance().postMesssageFunction.set(messageOptions.type, options.completeCb)
  }

  //监听信息 onmessage
  public channelOnMessage(options: ApiOptions) {
    const onmessageOptions: messageOptions = JSON.parse(options.args)
    let onMessageFuns: Map<number, Function> | undefined =
      ChannelMessage.getInstance().onMessageFunction.get(onmessageOptions.type)
    if (onMessageFuns) {
      onMessageFuns.set(options.webId as number, options.completeCb)
      ChannelMessage.getInstance().onMessageFunction.set(onmessageOptions.type, onMessageFuns)
    } else {
      onMessageFuns = new Map()
      onMessageFuns.set(options.webId as number, options.completeCb)
      ChannelMessage.getInstance().onMessageFunction.set(onmessageOptions.type, onMessageFuns)
    }
  }

  public runpostMessageCallback(options: ApiOptions) {
    let runcallbackParams: runcallbackParams = JSON.parse(options.args)
    const callbackFun = ChannelMessage.getInstance().postMesssageFunction.get(runcallbackParams.type) as Function
    callbackFun(runcallbackParams.params)
  }

  public channelCloseMessage(options: ApiOptions) {
    let closeParams: closeParams = JSON.parse(options.args)
    ChannelMessage.getInstance().postMesssageFunction.delete(closeParams.type)
    ChannelMessage.getInstance().onMessageFunction.delete(closeParams.type)
  }
}

interface messageOptions {
  type: string,
  data: object,
  callback: boolean
}

interface runcallbackParams {
  type: string,
  params: object,
}

interface closeParams {
  type: string,
}

