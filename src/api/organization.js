// 组织模块api
import { api } from './config.js';

/**
 * 获取组织数据
 * @param {Obiect} params 
 */
export async function orgainzationList(params) {
  const data = await api(`/organization/list`, 'POST', params)
  return data
}
