// 用户模块api
import { api } from './config.js';

/**
 * 用户登录
 * @param {Obiect} params 用户名，密码，验证码
 */
export async function login(params) {
  const data = await api(`/user/login`, 'post', params)
  return data
}


/**
 * 用户修改密码
 * @param {Obiect} params 用户名，密码，验证码
 */
export async function sendUpdatePassword(params) {
  const data = await api(`/user/sendUpdatePassword`, 'post', params)
  return data
}