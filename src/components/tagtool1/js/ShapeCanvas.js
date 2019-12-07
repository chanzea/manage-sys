import pointImg from '../assets/img/point.png'
import rectImg from '../assets/img/rect.png'
import penImg from '../assets/img/pen.png'
import lassoImg from '../assets/img/lasso.png'
import polygonImg from '../assets/img/polygon2.png'
import repairImg from '../assets/img/repair.png'
import rotateImg from '../assets/img/rotate.png'
import handImg from '../assets/img/hand.png'
import zoomImg from '../assets/img/zoom.png'
import zoominImg from '../assets/img/zoomout.png'
import zoomoutImg from '../assets/img/zoomin.png'
import lassocursor from '../assets/img/cursor-lasso.png'
import pencursor from '../assets/img/cursor-pen.png'
import tagImg from '../assets/img/tag.png'

import ShapeSet from './ShapeSet'
import ShapeDraw from './ShapeDraw'
import ShapePath from './ShapePath'
import ShapeEdit from './ShapeEdit'
import ShapeColorPicker from './ShapeColorPicker'
import ShapeContextmenu from './ShapeContextmenu'
import ShapeInfo from './ShapeInfo'


let ShapeCanvas = {
  canvas: document.createElement('canvas'),
  graph: document.createElement("canvas"),
  tools: [
    {
      type: 'point',
      src: pointImg,
      title: '选择(S)',
      shortcut: 83
    },
    {
      type: 'rect',
      src: rectImg,
      title: '矩形标注(M)',
      shortcut: 82
    },
    {
      type: 'polygon',
      src: polygonImg,
      title: '多边形标注(G)',
      shortcut: 71
    },
    {
      type: 'lasso',
      src: lassoImg,
      title: '套索标注(L)',
      shortcut: 76
    },
    {
      type: 'repair',
      src: repairImg,
      title: '修复选择区(J)',
      shortcut: 74
    },
    {
      type: '--',
      src: ''
    },
    {
      type: 'pen',
      src: penImg,
      title: '修复选择区(P)',
      shortcut: 80
    },
    {
      type: '--',
      src: ''
    },
    {
      type: "rotate",
      src: rotateImg,
      title: "旋转(T)"
    },
    {
      type: "hand",
      src: handImg,
      title: "移动(M)",
      shortcut: 77
    }, {
      type: "zoom",
      src: zoomImg,
      title: "缩放(Z)",
      shortcut: 90,
      children: [{
        type: "zoomin",
        title: "放大",
        src: zoominImg,
        selected: !0
      }, {
        type: "zoomout",
        title: "缩小",
        src: zoomoutImg
      }]
    },
    {
      type: "--",
      src: ""
    },
    {
      type: "fColor",
      title: "前景色(F)",
      shortcut: 70
    },
    {
      type: "bColor",
      title: "背景色(B)",
      shortcut: 66
    },
    {
      type: "--",
      src: ""
    },
    {
      type: "tag",
      title: "标记信息(I)",
      src: tagImg,
      shortcut: 73
    }
  ],
  tool: 'point',
  menu: [{
    type: "moveBack",
    title: "移动到后面",
    shortcut: 83
  }],
  color: 'red',
  bgColor: "#FFFFFF",
  editColor: "#00A8FF",
  context: null,
  shapeSet: null,
  accuracy: 4,
  colorPicker: null,
  info: null,
  scale: 1,
  angle: 0,
  zoomScale: 1,
  keyFlag: true,
  imgSrc:'',
  drawEnd: null,
  init(option) {
    option = option || {}
    this.el = option.el || document.body
    this.width = option.width || document.documentElement.clientWidth
    this.height = option.height || document.documentElement.clientHeight
    this.canvas.width = this.width - 38
    this.canvas.height = this.height - 30
    this.el.className = this.cn('wrap')
    this.drawEnd = option.drawEnd || function(){}

    this.context = this.canvas.getContext('2d')
    this.wrap = this.ce('div')
    this.wrap.className = this.cn('canvas')

    this.wrap.appendChild(this.graph)
    this.wrap.appendChild(this.canvas)
    this.el.appendChild(this.wrap)
    this.toolbarInit()

    this.shapeSet = new ShapeSet()
    this.shapeSet.onChange = (v, n) => {
      this.dataChange(v, n)
    }

    this.Contextmenu = new ShapeContextmenu({
      data: [],
      cancel: () => {
        this.keyFlag = true
      },
      confirm: (t) => {
        this.keyFlag = true
        this.endSetEdit(t)
        this.shapeSet.trigger()
      }
    })
    this.Contextmenu.init()
    this.colorPicker = new ShapeColorPicker({
      el: this.el,
      color: this.color,
      cancel: () => {
        this.keyFlag = true
      },
      confirm: (t, o) => {
        this.keyFlag = true 
        "fColor" === o ? this.color = t : this.bgColor = t
        this.setToolbar()
      }
    })
    this.colorPicker.init()

    this.info = new ShapeInfo({
      el: this.el,
      cancel: () => {
        this.keyFlag = true
      },
      confirm: (t, i) => {
        this.keyFlag = true
        this.saveInfo(t, i)
      }
    })
    this.info.init()

    this.canvas.addEventListener('mousedown', (e) => {
      this.mousedown(e)
    }, false)
    this.canvas.addEventListener('mousemove', (e) => {
      this.mousemove(e)
    }, false)
    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseup(e)
    }, false)
    this.canvas.addEventListener('mouseout', (e) => {
      this.mouseout(e)
    }, false)
    this.canvas.addEventListener('click', (e) => {
      this.click(e)
    }, false)
    this.canvas.addEventListener("mousewheel", (e) => {
      this.mousewheel(e)
    }, false)
    this.canvas.addEventListener("DOMMouseScroll", (e) => {
      this.mousewheel(e)
    }, false)
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      this.contextmenu(e)
    }, false)
    document.addEventListener("keydown", (e) => {
      this.keyDown(e)
    }, false)

  },
  ce(tag) {
    return document.createElement(tag)
  },
  cn(name) {
    return 'll-' + name
  },
  toolbarInit() {
    this.status = this.ce('div')
    this.toolbar = this.ce('div')
    this.status.className = this.cn('status')
    this.toolbar.className = this.cn('tools')
    this.setToolbar()
    this.el.appendChild(this.status)
    this.el.appendChild(this.toolbar)
  },
  setToolbar() {
    this.toolbar.innerHTML = ''
    this.tools.forEach(item => {
      if (item.type === '--') {
        let hr = this.ce('hr')
        this.toolbar.appendChild(hr)
      } else {
        let btn = this.ce('button')
        let img = this.ce('img')

        if ("fColor" === item.type || "bColor" === item.type) {
          img = this.ce('span')
          img.style.backgroundColor = "fColor" === item.type ? this.color : this.bgColor
        } else {
          img.src = item.src
        }
        if (this.tool === item.type) {
          btn.className = 'selected'
        }
        btn.title = item.title
        btn.tool = item.type
        btn.addEventListener('click', (e) => {
          this.toolbarClick(e)
        }, false)
        btn.addEventListener('dblclick', (e) => {
          this.toolbarDblclick(e)
        }, false)
        btn.appendChild(img)
        this.toolbar.appendChild(btn)
      }
    })
    this.setStatus()
  },
  setStatus() {
    var t = this;
    this.status.innerHTML = "";
    var e = this.tools.filter(function (e) {
      return e.type === t.tool
    });
    if (e = e.length > 0 ? e[0] : null) {
      var o = this.ce("button"),
        i = this.ce("img");
      if (i.src = e.src,
        o.title = e.title,
        o.tool = e.type,
        o.className = "disabled",
        o.appendChild(i),
        this.status.appendChild(o),
        e.children && e.children.length > 0) {
        var s = e.children.some(function (e) {
          return t.statusType === e.type
        });
        e.children.forEach(function (e) {
          var o = t.ce("button"),
            i = t.ce("img");
          i.src = e.src,
            s ? o.className = t.statusType === e.type ? "selected" : "" : (o.className = e.selected ? "selected" : "",
              e.selected && (t.statusType = e.type)),
            o.title = e.title,
            o.tool = e.type,
            o.addEventListener("mousedown", function (e) {
              t.statusClick(e)
            }, !1),
            o.appendChild(i),
            t.status.appendChild(o)
        })
      }
    }
    if (this.editItem) {
      let span = t.ce("span")
      span.innerHTML = this.editItem.title.length === 0 ? '未设置标注名' : this.editItem.title
      t.status.appendChild(span)
      let em = t.ce("em")
      em.innerHTML = this.editItem.desc.length === 0 ? '' : this.editItem.desc
      t.status.appendChild(em)
    } else {
      let span = t.ce("span")
      span.innerHTML = '未选择任何标记'
      t.status.appendChild(span)
    }

  },
  toolbarClick(t) {
    // let tool = e.currentTarget.tool
    // this.tool = tool
    // this.setToolbar()
    var e = "string" == typeof t ? t : t.currentTarget.tool; -
    1 === ["fColor", "bColor", "rotate", "tag"].indexOf(e) ? (this.tool = e, this.keyFlag = true,
        this.setCursor(e)) : this.keyFlag = false, this.toolhandleClick(e),
      this.setToolbar(t)
  },
  toolbarDblclick: function (t) {
    "zoom" === t.currentTarget.tool && (this.zoomScale = 1,
      this.zoomSize(1))
  },
  statusClick: function(t) {
    var e = t.currentTarget.tool;
    this.statusType = e,
    this.setStatus()
  },
  mousedown(e) {
    this.downX = e.offsetX
    this.downY = e.offsetY
    this.downClientX = e.clientX
    this.downClientY = e.clientY
    this.addShape('down', e)
  },
  mousemove(e) {
    this.moveX = e.offsetX
    this.moveY = e.offsetY
    this.moveClientX = e.clientX
    this.moveClientY = e.clientY
    this.addShape('move', e)
  },
  mouseup(e) {
    this.upX = e.offsetX
    this.upY = e.offsetY
    this.downClientX = e.clientX
    this.downClientY = e.clientY
    this.addShape('up', e)
  },
  mouseout(e) {
    this.outX = e.offsetX
    this.outY = e.offsetY
    this.downClientX = e.clientX
    this.downClientY = e.clientY
    this.addShape('out', e)
  },
  click(e) {
    this.clickX = e.offsetX
    this.clickY = e.offsetY
    this.addShape('click')
  },
  mousewheel: function (t) {
    var e = 0;
    if (t.wheelDelta ? e = t.wheelDelta > 0 ? 1 : -1 : t.detail && (e = t.detail < 0 ? 1 : -1),
      e && "zoom" === this.tool) {
      this.canvas.style.cursor = "default",
        this.downX = t.offsetX,
        this.downY = t.offsetY;
      var o = this.zoomScale;
      1 === e ? this.zoomScale += .1 : this.zoomScale -= .1,
        this.zoomSize(o)
    }
  },
  keyDown: function (t) {
    var e = t.which || t.keyCode;
    if (!this.keyFlag) {
      return
    }
    if (90 === e && t.ctrlKey)
      this.revoke();
    else if (89 === e && t.ctrlKey)
      this.redo();
    else if (46 === e)
      this.shapeSet.delete();
    else {
      var o = this.tools.filter(function (t) {
        return t.shortcut === e
      });
      o.length > 0 && this.toolbarClick(o[0].type)
    }
  },
  contextmenu: function (t) {
    this.keyFlag = true
    var e = this;
    if ("point" === this.tool) {
      var o = this.shapeSet.items.slice(),
        i = [];
      o.reverse().forEach(function (t, o) {
          t.contain(e.moveX, e.moveY, e.zoomScale) && i.push({
            title: "",
            item: t
          })
        }),
        i.length > 0 && this.Contextmenu.show(t, i)
    }
  },
  getTool() {
    let t = this.tools.filter(item => {
      return item.type === this.tool
    })
    if (t.length > 0) {
      return t[0]
    } else {
      return null
    }
  },
  addShape(t, e) {
    let tool = this.getTool()
    if (tool && tool.type) {
      this[tool.type] && this[tool.type](t, e)
    }
  },
  rect: function (t) {
    if ("down" === t)
      this.draw = !0,
      this.shapeSet.item = new ShapePath({
        type: this.tool,
        color: this.color
      });
    else if ("move" === t)
      !0 === this.draw && (this.shapeSet.item.rect(this.downX / this.zoomScale, this.downY / this.zoomScale, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
        this.shapeSet.trigger());
    else {
      if (!0 === this.draw) {
        var e = this.shapeSet.item;
        this.shapeSet.items.push(e),
          this.shapeSet.item = null,
          this.endSetEdit(e),
          this.shapeSet.addHistory(),
          this.shapeSet.trigger()
      }
      this.draw = !1
    }
  },
  polygon: function (t) {
    if ("down" === t) {
      var e, o;
      this.draw = !0,
        this.shapeSet.item = this.shapeSet.item || new ShapePath({
          type: this.tool,
          color: this.color
        }),
        this.shapeSet.temp = new ShapePath({
          type: "line",
          color: this.editColor
        });
      var i = this.shapeSet.item.children;
      i.length > 0 && (o = i[i.length - 1]);
      var s = new ShapePath({
        type: "line",
        color: this.color,
        parent: this.shapeSet.item
      });
      if (i.length > 2 && (e = i[0]),
        o)
        if (e && Math.abs(e.x - this.downX / this.zoomScale) < this.accuracy && Math.abs(e.y - this.downY / this.zoomScale) < this.accuracy) {
          s.line(o.tx, o.ty, e.x, e.y),
            this.shapeSet.item.addChild(s);
          var n = this.shapeSet.item;
          n.children.shift(),
            this.shapeSet.items.push(n),
            this.shapeSet.item = null,
            this.shapeSet.temp = null,
            this.endSetEdit(n),
            this.shapeSet.addHistory(),
            this.shapeSet.trigger()
        } else
          s.line(o.tx, o.ty, this.downX / this.zoomScale, this.downY / this.zoomScale),
          this.shapeSet.item.addChild(s),
          this.shapeSet.addHistory();
      else
        s.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.downX / this.zoomScale, this.downY / this.zoomScale),
        this.shapeSet.item.addChild(s);
      this.shapeSet.trigger()
    } else
      "move" === t ? this.shapeSet.temp && (this.shapeSet.temp.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
        this.shapeSet.trigger()) : this.draw = !1
  },
  lasso: function (t) {
    if ("down" === t) {
      this.draw = !0,
        this.shapeSet.item = new ShapePath({
          type: this.tool,
          color: this.color
        }),
        this.shapeSet.temp = new ShapePath({
          type: "line",
          color: this.color
        });
      var e = new ShapePath({
        type: "line",
        color: this.color,
        parent: this.shapeSet.item
      });
      e.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.downX / this.zoomScale, this.downY / this.zoomScale),
        this.shapeSet.item.addChild(e),
        this.shapeSet.trigger(),
        this._x = this.downX,
        this._y = this.downY
    } else if ("move" === t) {
      if (this.draw) {
        if (!(Math.abs(this.moveX - this._x) > 3 || Math.abs(this.moveY - this._y) > 3))
          return;
        var o;
        this._x = this.moveX,
          this._y = this.moveY;
        var i = this.shapeSet.item.children;
        i.length > 0 && (o = i[i.length - 1]);
        var s = new ShapePath({
          type: "line",
          color: this.color,
          parent: this.shapeSet.item
        });
        o ? (s.line(o.tx, o.ty, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
            this.shapeSet.item.addChild(s)) : (s.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
            this.shapeSet.item.addChild(s)),
          this.shapeSet.trigger()
      }
    } else if ("up" === t) {
      var n;
      if (this.draw) {
        var h = this.shapeSet.item.children;
        if (h.length > 2 && (n = h[1]),
          n) {
          var r = h[h.length - 1],
            a = new ShapePath({
              type: "line",
              color: this.color,
              parent: this.shapeSet.item
            });
          a.line(r.tx, r.ty, this.upX / this.zoomScale, this.upY / this.zoomScale),
            this.shapeSet.item.addChild(a);
          var c = new ShapePath({
            type: "line",
            color: this.color,
            parent: this.shapeSet.item
          });
          c.line(this.upX / this.zoomScale, this.upY / this.zoomScale, n.x, n.y),
            this.shapeSet.item.addChild(c);
          var l = this.shapeSet.item;
          l.children.shift(),
            this.shapeSet.items.push(l),
            this.shapeSet.item = null,
            this.shapeSet.temp = null,
            this.endSetEdit(l),
            this.shapeSet.addHistory(),
            this.shapeSet.trigger()
        }
      }
      this.draw = !1
    }
  },
  repair: function (t, e) {
    if ("down" === t) {
      this.draw = !0,
        this.shapeSet.item = new ShapePath({
          type: this.tool,
          color: this.color
        }),
        this.shapeSet.temp = new ShapePath({
          type: "line",
          color: this.color
        });
      var o = new ShapePath({
        type: "line",
        color: this.color,
        parent: this.shapeSet.item
      });
      o.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.downX / this.zoomScale, this.downY / this.zoomScale),
        this.shapeSet.item.addChild(o),
        this.shapeSet.trigger(),
        this._x = this.downX,
        this._y = this.downY
    } else if ("move" === t) {
      if (this.draw) {
        if (!(Math.abs(this.moveX - this._x) > 3 || Math.abs(this.moveY - this._y) > 3))
          return;
        var i;
        this._x = this.moveX,
          this._y = this.moveY;
        var s = this.shapeSet.item.children;
        s.length > 0 && (i = s[s.length - 1]);
        var n = new ShapePath({
          type: "line",
          color: this.color,
          parent: this.shapeSet.item
        });
        i ? (n.line(i.tx, i.ty, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
            this.shapeSet.item.addChild(n)) : (n.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
            this.shapeSet.item.addChild(n)),
          this.shapeSet.trigger()
      }
    } else if ("up" === t) {
      var h;
      if (this.draw) {
        var r = this.shapeSet.item.children;
        if (r.length > 2 && (h = r[1]),
          h) {
          var a = r[r.length - 1],
            c = new ShapePath({
              type: "line",
              color: this.color,
              parent: this.shapeSet.item
            });
          c.line(a.tx, a.ty, this.upX / this.zoomScale, this.upY / this.zoomScale),
            this.shapeSet.item.addChild(c);
          var l = new ShapePath({
            type: "line",
            color: this.color,
            parent: this.shapeSet.item
          });
          l.line(this.upX / this.zoomScale, this.upY / this.zoomScale, h.x, h.y),
            this.shapeSet.item.addChild(l);
          var d = this.shapeSet.item;
          if (d.children.shift(),
            this.editItem && (e.altKey || e.shiftKey)) {
            var A = e.shiftKey;
            this.editItem.repair(d, A)
          } else
            this.shapeSet.items.push(d),
            this.endSetEdit(d);
          this.shapeSet.item = null,
            this.shapeSet.temp = null,
            this.shapeSet.addHistory(),
            this.shapeSet.trigger()
        }
      }
      this.draw = !1
    }
  },
  point: function (t, e) {
    var o = this;
    if (!("click" === t || e.button > 1))
      if ("down" === t) {
        var i = this.shapeSet.edits;
        this.drawEdit = null,
          Array.isArray(i) && i.forEach(function (t, e) {
            t.contain(o.moveX, o.moveY, o.zoomScale) && (o.drawEdit = e)
          })
      } else if ("move" === t)
      if (this.drawEdit | 0 === this.drawEdit)
        this.alter(),
        this.shapeSet.trigger();
      else {
        var s = this.shapeSet.items.slice(),
          n = this.shapeSet.edits,
          h = !1;
        s.reverse().forEach(function (t, e) {
            t.contain(o.moveX, o.moveY, o.zoomScale) && !h ? (h = !0,
              t.over = !0) : t.over = !1
          }),
          this.shapeSet.items = s.reverse(),
          this.setStyle(10),
          Array.isArray(n) && n.forEach(function (t, e) {
            t.contain(o.moveX, o.moveY, o.zoomScale) ? (t.over = !0,
              o.setStyle(e)) : t.over = !1
          }),
          this.shapeSet.trigger()
      }
    else if ("up" === t)
      if (this.drawEdit | 0 === this.drawEdit)
        this.oldItem = this.editItem.clone(),
        this.drawEdit = null;
      else {
        var r = this.shapeSet.items.slice(),
          a = !1;
        this.shapeSet.edits = [],
          this.editItem = null,
          r.reverse().forEach(function (t, e) {
            t.contain(o.moveX, o.moveY, o.zoomScale) && !a ? (a = !0,
              o.endSetEdit(t,1)) : (t.selected = !1,o.setStatus())
          }),
          this.shapeSet.items = r.reverse(),
          this.shapeSet.trigger()
      }
    else
      "out" === t && this.drawEdit | 0 === this.drawEdit && (this.oldItem = this.editItem.clone(),
        this.drawEdit = null)
  },
  pen: function (t) {
    if ("down" === t) {
      var e;
      this.draw = !0,
        this.shapeSet.item = this.shapeSet.item || new ShapePath({
          type: this.tool,
          color: this.color
        }),
        this.shapeSet.temp = new ShapePath({
          type: "line",
          color: this.editColor
        });
      var o = this.shapeSet.item.children;
      o.length > 0 && (e = o[o.length - 1]);
      var i = new ShapePath({
        type: "line",
        color: this.color,
        parent: this.shapeSet.item
      });
      o.length > 0 && (this.curve = !0),
        o.length > 2 && o[0],
        e ? (i.line(e.tx, e.ty, this.downX / this.zoomScale, this.downY / this.zoomScale),
          this.shapeSet.item.addChild(i)) : (i.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.downX / this.zoomScale, this.downY / this.zoomScale),
          this.shapeSet.item.addChild(i)),
        this.shapeSet.addHistory(),
        this.shapeSet.trigger()
    } else if ("move" === t)
      if (this.curve) {
        var s = this.shapeSet.item.children,
          n = s[s.length - 1],
          h = 2 * n.tx - this.moveX / this.zoomScale,
          r = 2 * n.ty - this.moveY / this.zoomScale;
        n.curve(n.x, n.y, n.tx, n.ty, h, r),
          this.shapeSet.item.setBounds(),
          this.shapeSet.temp.line(h, r, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
          this.shapeSet.trigger()
      } else
        this.shapeSet.temp && (this.shapeSet.temp.line(this.downX / this.zoomScale, this.downY / this.zoomScale, this.moveX / this.zoomScale, this.moveY / this.zoomScale),
          this.shapeSet.trigger());
    else {
      if (this.draw && "up" === t) {
        var a, c, l = this.shapeSet.item.children;
        l.length > 0 && (c = l[l.length - 1]);
        var d = new ShapePath({
          type: "line",
          color: this.color,
          parent: this.shapeSet.item
        });
        if (l.length > 0 && (this.curve = !0),
          l.length > 2 && (a = l[0]),
          c && a && Math.abs(a.x - this.downX / this.zoomScale) < this.accuracy && Math.abs(a.y - this.downY / this.zoomScale) < this.accuracy) {
          d.line(c.tx, c.ty, a.x, a.y),
            this.shapeSet.item.addChild(d);
          var A = this.shapeSet.item;
          A.children.shift(),
            this.shapeSet.items.push(A),
            this.shapeSet.item = null,
            this.shapeSet.temp = null,
            this.endSetEdit(A),
            this.shapeSet.addHistory(),
            this.shapeSet.trigger(),
            this.curve = !1
        }
      }
      this.draw = !1,
        this.curve = !1
    }
  },
  zoom: function (t) {
    if (this.canvas.style.cursor = "zoomin" === this.statusType ? "zoom-in" : "zoom-out",
      "down" === t) {
      var e = this.zoomScale;
      "zoomin" === this.statusType ? this.zoomScale += .1 : this.zoomScale -= .1,
        this.zoomSize(e)
    }
  },
  hand: function (t) {
    this.transform3D = this.transform3D || {
        x: 0,
        y: 0,
        z: 0
      },
      1 !== this.zoomScale && ("down" === t ? (this.drag = !0,
        this.handLeft = this.transform3D.x,
        this.handTop = this.transform3D.y) : "move" === t ? this.drag && this.handMove() : this.drag = !1)
  },
  rotate: function () {
    this.angle += 90,
      this.angle = this.angle >= 360 ? 0 : this.angle,
      this.setCanvas()
  },
  fitRect: function (t, e, o, i) {
    return {
      x: Math.min(t, o),
      y: Math.min(e, i),
      width: Math.abs(o - t),
      height: Math.abs(i - e)
    }
  },
  fitPen: function (t, e, o, i, s, n, h, r) {
    return {
      x1: t,
      y1: e,
      cpx1: o,
      cpy1: i,
      cpx2: s,
      cpy2: n,
      x2: h,
      y2: r
    }
  },
  dataChange: function () {
    var t = this,
      e = this.shapeSet.items,
      o = this.shapeSet.item,
      i = this.shapeSet.temp,
      s = this.shapeSet.edits;
    this.canvas.style.display = "none",
      ShapeDraw.zoomScale = this.zoomScale,
      ShapeDraw.clear(this.context),
      e.forEach(function (e) {
        ShapeDraw.draw(t.context, e)
      }),
      ShapeDraw.draw(this.context, o),
      ShapeDraw.draw(this.context, i),
      Array.isArray(s) && s.forEach(function (e) {
        ShapeDraw.draw(t.context, e)
      }),
      this.canvas.style.display = ""
  },
  setCursor: function (t) {
    var e = "default";
    switch (t) {
      case "hand":
        e = "grab";
        break;
      case "rect":
      case "polygon":
        e = "crosshair";
        break;
      case "lasso":
        e = "url(".concat(lassocursor, ") 8 21,auto");
        break;
      case "pen":
        e = "url(".concat(pencursor, ") 1 22,auto")
    }
    this.canvas.style.cursor = e
  },
  setStyle: function (t) {
    var e = {
        0: "nw-resize",
        1: "n-resize",
        2: "ne-resize",
        3: "w-resize",
        4: "e-resize",
        5: "sw-resize",
        6: "s-resize",
        7: "se-resize",
        8: "crosshair",
        9: "pointer",
        10: "default"
      },
      o = this.editItem && this.editItem.type;
    if (o) {
      var i = t;
      90 !== this.angle && 270 !== this.angle || (i = 0 === t || 1 === t || 4 === t || 5 === t ? t + 2 : t - 2),
        this.canvas.style.cursor = "rect" === o ? e[i] : e[10]
    } else
      this.canvas.style.cursor = e[t]
  },
  alter: function () {
    this.shapeSet.edits = ShapeEdit.alter({
      edits: this.shapeSet.edits,
      item: this.editItem,
      oldItem: this.oldItem,
      index: this.drawEdit,
      moveX: this.moveX,
      moveY: this.moveY,
      downX: this.downX,
      downY: this.downY,
      upX: this.upX,
      upY: this.upY,
      zoomScale: this.zoomScale
    })
  },
  toolhandleClick: function (t) {
    switch (t) {
      case "fColor":
        this.colorPicker.show(this.color, t);
        break;
      case "bColor":
        this.colorPicker.show(this.bgColor, t);
        break;
      case "rotate":
        this.rotate()
        break;
      case "tag":
        this.setInfo()
        break;
    }
  },
  computeSize: function () {
    this.canvas.width = this.width,
      this.canvas.height = this.height,
      this.graph.width = this.width,
      this.graph.height = this.height
  },
  setImage: function (src,fun) {
    var e = this,
      o = new Image;
    o.onload = function () {
        e.img = o;
        var t = ShapeDraw.fitSize(o.width, o.height, e.wrap.offsetWidth, e.wrap.offsetHeight);
        e.width = t.w,
          e.height = t.h,
          e.scale = t.w / o.width,
          e.computeSize(),
          e.graph.getContext("2d").drawImage(o, 0, 0, o.width, o.height, 0, 0, t.w, t.h),
          e.imgSrc = src
        fun && fun();
        e.zoomScale = 1;
        e.zoomSize(1);
      },
      o.src = src
  },
  zoomSize: function (t) {
    this.zoomScale <= 1 && (this.zoomScale = 1);
    var e = this.downX,
      o = this.downY,
      i = this.width * this.zoomScale,
      s = this.height * this.zoomScale;
    this.canvas.width = i,
      this.canvas.height = s,
      this.graph.width = i,
      this.graph.height = s,
      this.transform3D = this.transform3D || {
        x: 0,
        y: 0,
        z: 0
      };
    var n = Math.abs(this.transform3D.x),
      h = Math.abs(this.transform3D.y);
    n = isNaN(n) ? 0 : n,
      h = isNaN(h) ? 0 : h;
    var r = Math.round(e / t),
      a = Math.round(o / t),
      c = -r * (this.zoomScale - t) - n,
      l = -a * (this.zoomScale - t) - h;
    this.zoomScale <= 1 ? (this.transform3D.x = 0,
      this.transform3D.y = 0) : (c = c > 0 ? 0 : c,
      l = l > 0 ? 0 : l,
      this.transform3D.x = c,
      this.transform3D.y = l);
    var d = this.graph.getContext("2d"),
      A = this.img;
    d.drawImage(A, 0, 0, A.width, A.height, 0, 0, i, s),
      this.dataChange(),
      this.setCanvas()
  },
  handMove: function () {
    var t = this.moveClientX - this.downClientX,
      e = this.moveClientY - this.downClientY,
      o = Math.round(this.handLeft + t),
      i = Math.round(this.handTop + e);
    o > 0 ? o = 0 : o + this.canvas.width < this.width && (o = this.width - this.canvas.width),
      i > 0 ? i = 0 : i + this.canvas.height < this.height && (i = this.height - this.canvas.height),
      this.transform3D = this.transform3D || {
        x: 0,
        y: 0,
        z: 0
      },
      this.transform3D.x = o,
      this.transform3D.y = i,
      this.setCanvas()
  },
  endSetEdit: function (t, flag) {
    ShapeEdit.shape && (ShapeEdit.shape.selected = !1),
      this.shapeSet.edits = ShapeEdit.setEdit(t),
      this.editItem = t,
      this.oldItem = t.clone(),
      t.selected = !0,
      this.setStatus();
    if(!flag){
      this.drawEnd && this.drawEnd()
    }
  },
  setCanvas: function () {
    var t = "";
    this.transform3D && (t += "translate3d(" + this.transform3D.x + "px," + this.transform3D.y + "px,0)"),
      t += " rotateZ(" + this.angle + "deg)";
    var e = 1;
    this.width > this.height && this.angle / 90 % 2 == 1 && (e = this.height / this.width),
      t += " scale(" + e + ")",
      this.canvas.style.transform = t,
      this.graph.style.transform = t
  },
  revoke: function () {
    this.shapeSet.revoke()
  },
  redo: function () {
    this.shapeSet.redo()
  },
  setInfo() {
    if (this.editItem) {
      let t = this.editItem.title
      let i = this.editItem.desc
      this.info.show(t, i)
    }
  },
  saveInfo(t, i) {
    this.editItem.title = t
    this.editItem.desc = i
    this.setStatus()
    this.drawEnd && this.drawEnd()
  },
  setData(data) {
    this.imgSrc = data.imgSrc
    this.bgColor = data.bgColor
    this.setImage(data.imgSrc,()=>{
      this.shapeSet.items = []
      data.items.forEach(item => {
        let sp = new ShapePath()
        sp.setAttr(item, this.zoomScale)
        this.shapeSet.items.push(sp)
      })
      this.shapeSet.addHistory()
      this.shapeSet.trigger()
    })
  },
  getData() {
    let reData = {}
    reData.imgSrc = this.imgSrc
    reData.bgColor = this.bgColor
    reData.items = this.shapeSet.getData()
    return reData
  }
}

export default ShapeCanvas