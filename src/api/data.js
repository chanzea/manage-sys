// 源数据模块api
import { api } from './config.js';

/**
 * 获取树型数据
 * @param {Obiect} params 
 */
export async function getDatasetList(params) {
  const data = await api(`/dataSet/list`, 'POST', params)
  return data
}
