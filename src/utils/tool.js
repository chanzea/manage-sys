

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
