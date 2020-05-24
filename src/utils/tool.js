

 export function renderDeletePop (h, text, {confirmFn}) {
  return h('Poptip', {
    props: {
      placement: 'right',
      confirm: true,
      'popper-class': 'delete-pop'
    },
    on: {
      'on-ok': () => {confirmFn && confirmFn()}
    }
  }, [
    h('div', {
      slot: 'title'
    },[
      h('span', text)
    ]),
    h('span', {
      class: 'opt-item'
    }, '删除')
  ])
}

// 会话存储
export function saveMessage(key, value) {
  sessionStorage.setItem(key, value)
}

// 从缓存获取
export function getMessage(key) {
  return sessionStorage.getItem(key)
}


export const TASKTYPE = {
  '1': {
    label: '分类任务',
    type: 'Classify'
  }, 
  '2': {
    label: '检测框标注',
    type: 'Mark'
  },
  '3': {
    label: '图片剔除任务',
    type: 'RejectPic'
  },
  '4': {
    label: '文件夹剔除任务',
    type: 'RejectFolder'
  },
  '5': {
    label: '分割任务',
    type: 'Lasso'
  }
}