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
 * 下线任务
 * @param {Obiect} params 
 */
export async function taskOffline(params) {
    const data = await api(`/task/offline`, 'post', params)
    return data
}

/**
 * 上线任务
 * @param {Obiect} params 
 */
export async function taskOnline(params) {
    const data = await api(`/task/online`, 'post', params)
    return data
}


//任务领取
export async function allotMark(params) {
    const data = await api(`/taskItem/allotMark`, 'post', params)
    return data
}

//题库列表
export async function taskItemList(params) {
    const data = await api(`/taskItem/list`, 'post', params)
    return data
}

//领取任务
export async function taskItemAllotMark(params) {
    const data = await api(`/taskItem/allotMark`, 'post', params)
    return data
}


//任务题目分类标注
export async function taskItemMarklist(params) {
    const data = await api(`/taskItem/markList`, 'post', params)
    return data
}


//分类标签列举
export async function tagClassifyList(params) {
    const data = await api(`/tag/classify/list`, 'get', params)
    return data
}

//提交剔除图片
export async function taskItemMark(params) {
    const data = await api(`/taskItem/mark`, 'post', params)
    return data
}

//获取文件夹图片
export async function getFolderPic(params) {
    const data = await api(`/dataSet/listDataRecord`, 'post', params)
    return data
}
//审核领取
export async function taskItemAllotReview(params) {
    const data = await api(`/taskItem/allotReview`, 'post', params)
    return data
}

//提交审核结果
export async function taskItemReview(params) {
    const data = await api(`/taskItem/review`, 'post', params)
    return data
}


export async function tagClassifyAdd(params) {
    const data = await api(`/tag/classify/add`, 'post', params)
    return data
}

export async function taskItemDetail(params) {
    const data = await api(`/taskItem/detail`, 'post', params)
    return data
}