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
 * 获取用户数据详情
 * @param {Obiect} params 
 */
export async function getUserInfo(params) {
  const data = await api(`/user/get`, 'get', params)
  return data
}

/**
 * 用户注册
 * @param {Obiect} params 
 */
export async function UserRegister(params) {
  const data = await api(`/user/register`, 'POST', params)
  return data
}

/**
 * 用户数据更新
 * @param {Obiect} params 
 */
export async function UserUpdate(params) {
  const data = await api(`/user/update`, 'POST', params)
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

/**
 * 删除用户
 * @param {Obiect} params 
 */
export async function deleteUser(params) {
  const data = await api(`/organization/deleteUser`, 'post', params)
  return data
}


/**
 * 更新结构名称
 * @param {Obiect} params 
 */
export async function organizationUpdate(params) {
  const data = await api(`/organization/update`, 'post', params)
  return data
}

/**
 * 添加新组织
 * @param {Obiect} params 
 */
export async function organizationAdd(params) {
  const data = await api(`/organization/add`, 'post', params)
  return data
}

/**
 * 删除组织
 * @param {Obiect} params 
 */
export async function organizationDelete(params) {
  const data = await api(`/organization/delete`, 'post', params)
  return data
}
