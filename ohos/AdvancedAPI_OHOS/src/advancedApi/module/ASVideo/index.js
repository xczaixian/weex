import {
  getFileAssetFromUri,
  isFileUri,
  isSandboxPath,
  getFdFromUriOrSandBoxPath,
  switchInternalToHapSandBox,
  saveMedia
} from '../../util/index'
import fs from '@ohos.file.fs'
import { ErrorCode } from '../../../base/util/ErrorCode'
import { FileioBase } from '../../../base/bridge/fileioBase'
import photoAccessHelper from '@ohos.file.photoAccessHelper'
import fileUri from '@ohos.file.fileuri'


export default class ASViedo {
  getVideoInfo(params) {
    return new Promise(async (resolve, reject) => {
      return reject(['getVideoInfo is not support!'])
    })
  }

  saveVideoToPhotosAlbum(params) {
    return new Promise(async (resolve, reject) => {
      const filePath = params.filePath
    
      if (typeof filePath !== 'string') {
        return reject(['filePath format is not supported.', ErrorCode.PARAMETER_ERROR])
      }
     
      if (isFileUri(filePath)) {
        const uri = filePath
        const fd = getFdFromUriOrSandBoxPath(uri)
        const stat = fs.statSync(fd)
        const size = stat.size
        const buf = new ArrayBuffer(size)
        FileioBase.ohosReadSync(fd, buf)
        const fileAsset = await getFileAssetFromUri(uri)
        const displayName = 'VIDEO_' + new Date().getTime() + '_' + fileAsset.displayName
        // uri = fileUri.getUriFromPath(uri)
        const imageUri = await saveMedia(photoAccessHelper.PhotoType.VIDEO, displayName, uri, buf)
        resolve({ path: imageUri })
        return
      } else if (isSandboxPath(filePath)) {
        let uri = filePath
        if (uri.startsWith('internal://')) {
          uri = switchInternalToHapSandBox(uri)
        }
        if (!fs.accessSync(uri)) {
          reject(['saveVideoToPhotosAlbum fail, src not exist.', ErrorCode.PARAMETER_ERROR])
          return
        }
        const file = fs.openSync(uri, fs.OpenMode.READ_ONLY)
        if (!file) {
          reject(['saveVideoToPhotosAlbum fail, src not exist.', ErrorCode.PARAMETER_ERROR])
          return
        }
        const fd = file.fd

        // 根据文件大小定义空arrayBuffer用来写入文件
        const stat = fs.statSync(uri)

        const size = stat.size

        const buf = new ArrayBuffer(size)

        // 读取传入文件信息到缓冲区
        FileioBase.ohosReadSync(fd, buf)

        // 获取文件显示名
        let displayName = 'VIDEO_' + new Date().getTime() + '_' + filePath.split('/').splice(-1, 1).toString()
        if (!displayName.includes('.')) {
          displayName += '.mp4'
        }
        uri = fileUri.getUriFromPath(uri)
        const imageUri = await saveMedia(photoAccessHelper.PhotoType.VIDEO, displayName, uri, buf)
        resolve({ path: imageUri })
        return
      }
      reject(['filePath format is not supported.', ErrorCode.PARAMETER_ERROR])
    })
  }
}
