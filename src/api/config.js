import axios from 'axios';
const BASEURL = 'http://118.24.124.177:8099' //api地址

export const api = (url, method, data) => {
  url = BASEURL + url
  const query = method === 'get' ? 'params' : 'data'
  const obj = {
    url,
    method,
    headers: {'Content-Type': 'application/json;charset=UTF-8'}
  }
  obj[query] = data
  return new Promise((resolve, reject) => {
    axios(obj).then(res => {
      console.log('res', res)
      resolve(res)
      // if (res.status === 200) {
      //   const { data } = res
      //   resolve(data)
      // }
    }).catch(err => {
      console.log('err', err)
      reject(err)
    })
  })
}