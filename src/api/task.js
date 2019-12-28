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

//结算列表
export async function getTaskSettleList(params) {
    const data = await api(`/task/settle`, 'post', params)
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

//标注标签列举
export async function tagMarkList(params) {
    const data = await api(`/tag/mark/list`, 'get', params)
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

// 添加标签
export async function tagClassifyAdd(params) {
    const data = await api(`/tag/classify/add`, 'post', params)
    return data
}

//添加标注标签
export async function tagMarkAdd(params) {
    const data = await api(`/tag/mark/add`, 'post', params)
    return data
}

// 获取题目详情
export async function taskItemDetail(params) {
    const data = await api(`/taskItem/detail`, 'post', params)
    return data
}

// 获取任务详情
export async function taskDetail(params) {
    const data = await api(`/task/get`, 'post', params)
    return data
}


// 更新任务
export async function taskUpdate(params) {
    const data = await api(`/task/update`, 'post', params)
    return data
}


//标注任务
export async function itemTaskUpload(params) {
    const data = await api(`/taskItem/uploadMarkPic`, 'post', params, "multipart/form-data")
    return data
}

//任务下载
export async function taskDownload(params) {
    const data = await api(`/task/download`, 'get', params, "application/x-www-form-urlencoded; charset=UTF-8")
    return data
}


//任务监控
export async function getRealTimeMonitor(params) {
    const data = await api(`/monitor/realTimeMonitor`, 'get', params)
    return data
}

//获取历史监控
export async function getHistoryMonitor(params) {
    const data = await api(`/monitor/historyMonitor`, 'POST', params)
    return data
}