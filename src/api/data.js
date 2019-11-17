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


/**
 * 上传文件
 * @param {Obiect} params 
 */
export async function fileUploadInfo(params) {
  const data = await api(`/file/uploadInfo`, 'POST', params)
  return data
}

/**
 * 上传文件
 * @param {Obiect} params 
 */
export async function fileUpload(params) {
  const data = await api(`/file/upload`, 'POST', params, 'multipart/form-data')
  return data
}

/**
 * 上传文件
 * @param {Obiect} params 
 */
export async function fileMerge(params) {
  const data = await api(`/file/mergeFiles`, 'get', params)
  return data
} 

/**
 * 新建源数据
 * @param {Obiect} params 
 */
export async function dataSetCreate(params) {
  const data = await api(`/dataSet/create`, 'POST', params)
  return data
}

/**
 * 新建源数据
 * @param {Obiect} params 
 */
export async function dataSetDelete(params) {
  const data = await api(`/dataSet/delete`, 'POST', params)
  return data
}

/**
 * 新建源数据
 * @param {Obiect} params 
 */
export async function dataSetUpdate(params) {
  const data = await api(`/dataSet/update`, 'POST', params)
  return data
}

/**
 * 查看源文件
 * @param {Obiect} params 
 */
export async function listDataRecord(params) {
  const data = await api(`/dataSet/listDataRecord`, 'POST', params)
  return data
}
