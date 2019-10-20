// 用户模块api
import { api } from './config.js';


/**
 * 获取任务列表
 * @param {Obiect} params 
 */
export async function getTaskList(params) {
  const data = await api(`/task/list`, 'post', params)
  return data
}

/**
 * 添加新任务
 * @param {Obiect} params 
 */
export async function taskAdd(params) {
  const data = await api(`/task/add`, 'post', params)
  return data
}

/**
 * 删除任务
 * @param {Obiect} params 
 */
export async function taskDelete(params) {
  const data = await api(`/task/delete`, 'post', params)
  return data
}
