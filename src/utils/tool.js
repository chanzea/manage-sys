

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
