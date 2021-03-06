import ShapePath from './ShapePath'

const ShapeEdit = {
  shape: null,
  setEdit: function (t, e) {
    return this.shape = t,
      this[t.type] && this[t.type](t, e)
  },
  rect: function (t, e) {
    for (var o = 0, i = [], s = t.x, n = t.y, h = t.width, r = t.height; o < 9; o++)
      if (4 !== o) {
        var a, c, l, d;
        l = (a = s + o % 3 * h / 2 - 2) + 4,
          d = (c = n + Math.floor(o / 3) * r / 2 - 2) + 4;
        var A = new ShapePath({
          type: "rect",
          fill: !0,
          handle: !0,
          selected: !0,
          edit: !0
        });
        A.rect(a, c, l, d),
          i.push(A)
      }
    return i
  },
  polygon: function (t, e) {
    var o = t.children,
      i = [];
    return o.forEach(function (t, e) {
        var o, s, n, h;
        n = (o = t.x - 2) + 4,
          h = (s = t.y - 2) + 4;
        var r = new ShapePath({
          type: "rect",
          fill: !0,
          handle: !0,
          selected: !0,
          bindIndex: e,
          edit: !0
        });
        if (r.rect(o, s, n, h),
          i.push(r),
          "curve" === t.type) {
          var a = new ShapePath({
            type: "arc",
            fill: !0,
            handle: !0,
            bindIndex: e,
            edit: !0
          });
          a.arc(t.cx, t.cy, 2),
            i.push(a);
          var c = new ShapePath({
            type: "line",
            fill: !0,
            handle: !0,
            bindIndex: e,
            edit: !0
          });
          c.line(t.tx, t.ty, t.cx, t.cy),
            i.push(c)
        }
      }),
      i
  },
  pen: function (t) {
    return this.polygon(t)
  },
  alter: function (t) {
    var e;
    return this[e = (t = t || {}).item.type + "Alter"] && this[e](t)
  },
  rectAlter: function (t) {
    var e = t.item,
      o = t.oldItem,
      i = t.index,
      s = (t.moveX - t.downX) / t.zoomScale,
      n = (t.moveY - t.downY) / t.zoomScale,
      h = o.x,
      r = o.y,
      a = o.width,
      c = o.height;
    switch (i) {
      case 7:
        a += s,
          c += n;
        break;
      case 6:
        c += n;
        break;
      case 5:
        h += s,
          a -= s,
          c += n;
        break;
      case 4:
        a += s;
        break;
      case 3:
        h += s,
          a -= s;
        break;
      case 2:
        r += n,
          a += s,
          c -= n;
        break;
      case 1:
        r += n,
          c -= n;
        break;
      case 0:
        h += s,
          r += n,
          a -= s,
          c -= n
    }
    return e.rect(h, r, h + a, r + c),
      this.setEdit(e, !0)
  },
  polygonAlter: function (t) {
    var e = t.item,
      o = t.moveX / t.zoomScale,
      i = t.moveY / t.zoomScale,
      s = t.index,
      n = e.children[s],
      h = s - 1 < 0 ? e.children.length - 1 : s - 1,
      r = e.children[h];
    return n.x = o,
      n.y = i,
      r.tx = o,
      r.ty = i,
      e.setBounds(),
      this.setEdit(e, !0)
  },
  penAlter: function (t) {
    var e = t.edits,
      o = t.item,
      i = t.moveX / t.zoomScale,
      s = t.moveY / t.zoomScale,
      n = e[t.index],
      h = n.bindIndex,
      r = o.children[h],
      a = h - 1 < 0 ? o.children.length - 1 : h - 1,
      c = o.children[a];
    return o.children.forEach(function (t, e) {
        t.selected = e === h
      }),
      "arc" === n.type ? (r.cx = i,
        r.cy = s) : "rect" === n.type && ("curve" === c.type && (c.cx = c.cx + i - c.tx,
          c.cy = c.cy + s - c.ty),
        r.x = i,
        r.y = s,
        c.tx = i,
        c.ty = s),
      o.setBounds(),
      this.setEdit(o, !0)
  }
}
export default ShapeEdit