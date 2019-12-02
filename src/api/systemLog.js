import { api } from './config.js';

/**
 * 获取系统日志数据
 * @param {Obiect} params 
 */
export async function getSystemLogList(params) {
    const data = await api(`/systemLog/list`, 'POST', params)
    return data
}

/**
 * 获取任务日志数据
 * @param {Obiect} params 
 */
export async function getSystemLogListTask(params) {
    const data = await api(`/systemLog/listTask`, 'POST', params)
    return data
}

/**
 * 获取系统操作类型列表
 * @param {Obiect} params 
 */
export async function getListActionType(params) {
    const data = await api(`/systemLog/listActionType`, 'POST', params)
    return data
}


/**
 * 获取系统操作类型列表
 * @param {Obiect} params 
 */
export async function getListTaskActionType(params) {
    const data = await api(`/systemLog/listTaskActionType`, 'POST', params)
    return data
}





