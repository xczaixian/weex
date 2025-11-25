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

import { WebNodeController } from './WebNodeController';
import web_webview from '@ohos.web.webview';
import { BuilderNode } from '@ohos.arkui.node';
import { BuilderData } from '../common/entity/BuilderData';
import { MixWebBuilder } from './MixWebBuilder';
import { Constant } from '../common/constant/Constant';
import { WebManager } from './WebManager';
import { RouterStorage } from '../globalrouter/RouterStorage';
import { UrlUtil } from '../common/util/UrlUtil';
import { ExtWebController } from '../../ExtWebController';
import { PageModelController } from '../pagemanager/PageModelController';
import { ViewAppear } from '../../adapterservice/api/ViewAppear';
import { Constants } from '../../adapterservice/constants/Constants';

export interface mixPageModule {
  mixWebId: number,
  webNodeController: WebNodeController
}

export class MixWebManager {
  private static instance: MixWebManager;
  private preRenderUsedMap: Map<string, BuilderNode<BuilderData[]>> = new Map();
  private mixWebControllerArray: Array<mixPageModule> = new Array();
  private mixWebBindArray: Array<Array<mixPageModule>> = new Array();
  private mixWebUsedMap: Map<number, BuilderNode<BuilderData[]>> = new Map();
  private currentMixWebId: number = Constant.MIX_WEB_START_WEB_ID;
  private preRenderStartId: number = Constant.PRERENDER_MIX_WEB_START_WEB_ID;

  public static getInstance(): MixWebManager {
    if (!MixWebManager.instance) {
      MixWebManager.instance = new MixWebManager();
    }
    return MixWebManager.instance;
  }

  private syncData(url: string, webId: number, controller: web_webview.WebviewController) {
    WebManager.getInstance().webControllerMap.set(webId, controller);
    RouterStorage.getInstance().addUrlNode(UrlUtil.addFakeDomain(url), webId);
  }

  private createBuilderNode(url: string, webIndex: number, uiContext: UIContext): BuilderNode<BuilderData[]>  {
    let controller: web_webview.WebviewController = new web_webview.WebviewController();
    let builderNode: BuilderNode<BuilderData[]> = new BuilderNode(uiContext!);
    builderNode.build(wrapBuilder<BuilderData[]>(MixWebBuilder), { url, controller: controller, webId: webIndex });
    this.mixWebUsedMap.set(webIndex, builderNode);
    this.syncData(url, webIndex, controller);
    return builderNode;
  }

  public createPreRenderWebInstance(uiContext: UIContext, preRenderUrls: Array<string>) {
    if (preRenderUrls.length <= 0) {
      return;
    }
    for (const url of preRenderUrls) {
      const deletedFakeDomainUrl = UrlUtil.getUrlTemplate(url);
      if (this.preRenderUsedMap.has(deletedFakeDomainUrl)) {
        continue; // 如果url已经有预渲染了，跳过, 避免重复预渲染
      }
      const builderNode = this.createBuilderNode(url, this.preRenderStartId, uiContext);
      this.preRenderUsedMap.set(deletedFakeDomainUrl, builderNode);
      this.preRenderStartId++;
    }
  }

  public getMixPageWebID(): number {
    let lastPage = this.mixWebControllerArray[this.mixWebControllerArray.length - 1];
    if (lastPage) {
      return lastPage.mixWebId
    } else {
      return 0
    }
  }

  public getCurrentMixWeb() {
    let nativePageId: number = PageModelController.getInstance().getPageStackArrayLen() - 1;
    if (this.mixWebBindArray[nativePageId]) {
      return this.mixWebBindArray[nativePageId];
    } else {
      return undefined;
    }
  }

  public getWebNodeController(url: string): WebNodeController {
    if (!ExtWebController.uiContext) {
      throw Error('ExtWebController.init must call first');
    }
    const webNodeController = new WebNodeController();
    const deletedFakeDomainUrl = UrlUtil.getUrlTemplate(url);
    let builderNode: BuilderNode<BuilderData[]> | undefined = undefined;
    if (this.preRenderUsedMap.has(deletedFakeDomainUrl)) {
      builderNode = this.preRenderUsedMap.get(deletedFakeDomainUrl)!;
    } else {
      let mixPage: mixPageModule = { mixWebId: this.currentMixWebId, webNodeController: webNodeController };
      this.mixWebControllerArray.push(mixPage);
      let nativePageId: number = PageModelController.getInstance().getPageStackArrayLen() - 1;
      if (this.mixWebBindArray[nativePageId]) {
        this.mixWebBindArray[nativePageId].push(mixPage);
      } else {
        this.mixWebBindArray[nativePageId] = [mixPage];
      }
      builderNode = this.createBuilderNode(url, this.currentMixWebId++, ExtWebController.uiContext);
    }
    webNodeController.init(builderNode);
    webNodeController.add();
    return webNodeController;
  }

  public freeWeb(url: string, webId: number) {
    // 预渲染的常驻内存
    if (!this.preRenderUsedMap.has(url)) {
      this.currentMixWebId--;
    }
    WebManager.getInstance().webControllerMap.delete(webId);
    RouterStorage.getInstance().deleteUrlNode(1, url);
  }

  public freeMixWeb(webId: number) {
    WebManager.getInstance().webControllerMap.delete(webId);
    const buildNode = this.mixWebUsedMap.get(webId);
    buildNode?.dispose();
    this.mixWebControllerArray = this.mixWebControllerArray.filter((mixPage) => mixPage.mixWebId !== webId);
    let nativePageId: number = PageModelController.getInstance().getPageStackArrayLen() - 1;
    this.mixWebBindArray[nativePageId] = this.mixWebBindArray[nativePageId].filter((mixPage) => mixPage.mixWebId !== webId);
  }
}
