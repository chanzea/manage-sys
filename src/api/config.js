import axios from 'axios';
export const BASEURL = 'http://118.24.124.177:8099' //api地址
import {
  saveMessage,
  getMessage
} from './../utils/tool.js'


export const api = (url, method, data = {}, contentType = 'application/json;charset=UTF-8') => {
  const tokenId = getMessage('tokenId')
  // token失效，应回到登录页
  if (!tokenId) {
    return;
  }
  url = BASEURL + url
  const query = method === 'get' ? 'params' : 'data'
  const obj = {
    url,
    method,
    headers: {
      'Content-Type': contentType,
      'tokenId': tokenId
    }
  }
  obj[query] = data
  return new Promise((resolve, reject) => {
    axios(obj).then(res => {
      const { data } = res
      if (data.code === 'SUCCESS') {
        resolve(data.data ? data.data : data)
      } else if (data.code === 'user.token_error') {
        saveMessage('tokenId', '')
        copyIview.Modal.warning({
          title: '提示',
          content: '请重新登录',
          okText: '确定',
          onOk: () => {
            window.location.reload(); //刷新页面
          }
        })
      } else {
        copyIview.Modal.warning({
          title: '提示',
          content: data.message || '系统错误',
          okText: '确定',
        })
        reject()
      }
    }).catch(err => {
      console.log('err', err)
      copyIview.Modal.warning({
        title: '提示',
        content: '系统错误',
        okText: '确定'
      })
      reject(err)
    })
  })
}