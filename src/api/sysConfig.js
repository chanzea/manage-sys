// 用户模块api
import { api } from './config.js';

/**
 * 获取树型数据
 * @param {Obiect} params 
 */
export async function getListTree(params) {
    const data = await api(`/permission/list`, 'post', params);
    console.log(data)
    return data
}

/**
 * 更新权限
 * @param {Obiect} params 
 */
export async function permissonUpdate(params) {
    const data = await api(`/permission/update`, 'post', params)
    return data
}

/**
 * 添加新权限
 * @param {Obiect} params 
 */
export async function permissonAdd(params) {
    const data = await api(`/permission/add`, 'post', params)
    return data
}

/**
 * 删除权限
 * @param {Obiect} params 
 */
export async function permissonDelete(params) {
    const data = await api(`/permission/delete`, 'post', params)
    return data
}