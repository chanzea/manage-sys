// 系统模块api
import { api } from './config.js';

/**
 * 获取角色管理列表
 * @param {Obiect} params 
 */
export async function getRoleList(params) {
  const data = await api(`/role/list`, 'get', params)
  return data
}

/**
 * 获取配置角色列表
 * @param {Obiect} params 
 */
export async function getRoleListPermission(params) {
  const data = await api(`/role/listPermission`, 'post', params)
  return data
}
