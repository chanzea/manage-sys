export function renderDeletePop (h, params, text, {confirmFn}) {
  return h('Poptip', {
    props: {
      placement: 'right',
      confirm: true,
      'popper-class': 'delete-pop'
    },
    on: {
      'on-ok': () => {confirmFn(params)}
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