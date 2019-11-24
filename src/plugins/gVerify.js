/* eslint-disable */
import Vue from 'vue';

	/** 生成字母数组**/
function getAllLetter() {
  const letterStr = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
  return letterStr.split(',');
};

	/** 生成一个随机数**/
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

	/** 生成一个随机色**/
function randomColor(min, max) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

/** 初始化方法**/
function _init() {
  const con = document.getElementById(this.options.id);
  const canvas = document.createElement('canvas');
  this.options.width = con.offsetWidth > 0 ? con.offsetWidth : '100';
  this.options.height = con.offsetHeight > 0 ? con.offsetHeight : '30';
  canvas.id = this.options.canvasId;
  canvas.width = this.options.width;
  canvas.height = this.options.height;
  canvas.style.cursor = 'pointer';
  canvas.innerHTML = '您的浏览器版本不支持canvas';
  con.appendChild(canvas);
  const parent = this;
  canvas.onclick = function() {
    parent.refresh();
  };
};

/** 生成验证码**/
function refresh() {
  this.options.code = '';
  const canvas = document.getElementById(this.options.canvasId);
  let ctx, txtArr;

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  } else {
    return;
  }

  ctx.textBaseline = 'middle';

  ctx.fillStyle = randomColor(180, 240);
  ctx.fillRect(0, 0, this.options.width, this.options.height);

  if (this.options.type === 'blend') { // 判断验证码类型
    txtArr = this.options.numArr.concat(this.options.letterArr);
  } else if (this.options.type === 'number') {
    txtArr = this.options.numArr;
  } else {
    txtArr = this.options.letterArr;
  }

  for (let i = 1; i <= 4; i++) {
    const txt = txtArr[randomNum(0, txtArr.length)];
    this.options.code += txt;
    ctx.font = randomNum(this.options.height, this.options.height) + 'px SimHei'; // 随机生成字体大小
    ctx.fillStyle = randomColor(50, 160); // 随机生成字体颜色
    ctx.shadowOffsetX = randomNum(-3, 3);
    ctx.shadowOffsetY = randomNum(-3, 3);
    ctx.shadowBlur = randomNum(-3, 3);
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    const x = this.options.width / 5 * i;
    const y = this.options.height / 2;
    const deg = randomNum(-30, 30);
            /** 设置旋转角度和坐标原点**/
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 0, 0);
            /** 恢复旋转角度和坐标原点**/
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
        /** 绘制干扰线**/
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
    ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
    ctx.stroke();
  }
        /** 绘制干扰点**/
  for (let i = 0; i < this.options.width / 4; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
};

		/** 验证验证码**/
function validate(code) {
  const codes = code.toLowerCase();
  const v_code = this.options.code.toLowerCase();
  if (codes === v_code) {
    return true;
  } else {
    // this.refresh();
    return false;
  }
}

function gverify(options) { // 创建一个图形验证码对象，接收options对象为参数
  this.options = { // 默认options参数值
    id: '', // 容器Id
    canvasId: 'verifyCanvas', // canvas的ID
    width: '100', // 默认canvas宽度
    height: '30', // 默认canvas高度
    type: 'blend', // 图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
    code: ''
  };

  if (Object.prototype.toString.call(options) === '[object Object]') { // 判断传入参数类型
    for (const i in options) { // 根据传入的参数，修改默认参数值
      this.options[i] = options[i];
    }
  } else {
    this.options.id = options;
  }

  this.options.numArr = '0,1,2,3,4,5,6,7,8,9'.split(',');
  this.options.letterArr = getAllLetter();

  this._init();
  this.refresh();
}

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  Vue.prototype.$verify = {
    _init,
    refresh,
    validate,
    gverify
  };
  Vue.$verify = Vue.prototype.$verify;
}

export default plugin;
