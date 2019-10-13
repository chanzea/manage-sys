import axios from 'axios';
export const BASEURL = 'http://118.24.124.177:8099' //api地址

export const api = (url, method, data = {}) => {
  const tokenId = localStorage.getItem('tokenId')
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
      'Content-Type': 'application/json;charset=UTF-8',
      'tokenId': tokenId
    }
  }
  obj[query] = data
  return new Promise((resolve, reject) => {
    axios(obj).then(res => {
      const { data } = res
      if (data.code === 'SUCCESS') {
        resolve(data.data)
      } else {
        copyIview.Modal.warning({
          title: '提示',
          content: data.message || '系统错误',
          okText: '确定'
        })
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