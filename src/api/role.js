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
 * 删除角色
 * @param {Obiect} params 
 */
export async function delRole(params) {
  const data = await api(`/role/delete`, 'post', params)
  return data
}

/**
 * 新增角色
 * @param {Obiect} params 
 */
export async function addRole(params) {
  const data = await api(`/role/add`, 'post', params)
  return data
}



/**
 * 获取配置角色权限列表
 * @param {Obiect} params 
 */
export async function getRoleListPermission(params) {
  const data = await api(`/role/listPermission`, 'post', params)
  return data
}


/**
 * 添加角色新权限
 * @param {Obiect} params 
 */
export async function roleAddPermission(params) {
  const data = await api(`/role/addPermission`, 'post', params)
  return data
}
