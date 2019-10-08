// 用户模块api
import { api } from './config.js';

/**
 * 获取树型数据
 * @param {Obiect} params 
 */
export async function getListTree(params) {
  const data = await api(`/organization/listTree`, 'get', params)
  return data
}

/**
 * 获取用户数据
 * @param {Obiect} params 
 */
export async function getUserList(params) {
  const data = await api(`/user/list`, 'post', params)
  return data
}

/**
 * 获取角色列表
 * @param {Obiect} params 
 */
export async function getRoleList(params) {
  const data = await api(`/role/list`, 'post', params)
  return data
}


