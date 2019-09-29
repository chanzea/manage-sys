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