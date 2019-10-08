// 组织模块api
import { api } from './config.js';
/**
 * 更新结构名称
 * @param {Obiect} params 
 */
export async function organizationUpdate(params) {
  const data = await api(`/organization/update`, 'post', params)
  return data
}

