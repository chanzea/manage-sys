<template>
  <div class="ps-draw">
    <div class="actionBtn">
      <Button type="info" @click="taskItemMark" size = "small">提交</Button>
      <Button type="success" @click="taskItemAllotMark" size = "small">下一题</Button>
    </div>
    <!-- <img :src="imgSrc" alt=""> -->
    <div id="toolId" style="position: relative; height: 600px; width: 100%;"></div>
  </div>
</template>

<script>


import { taskItemAllotMark, itemTaskUpload, taskItemMark, tagClassifyList, tagClassifyAdd, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";

import ShapeCanvas from "./js/ShapeCanvas";
export default {
  name: "PsDraw2",
  data() {
    return {
      taskItemList: [],
      imgSrc: null
    };
  },

  created() {
    const taskId = this.$route.query.id;
    const taskItemId = this.$route.query.taskItemId
    this.viewOnly = this.$route.query.viewOnly
    // 当前存在 taskItemId ，返工任务
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotMark()
    }
  },

  mounted() {
    // this.init();
    // this.setData();
  },

  methods: {
    taskItemAllotMark () {
      const taskId = this.$route.query.id
      this.taskItemList = []
      taskItemAllotMark({
        taskId
      }).then( res => {
        const {taskItemList, dataRecordList, userList} = res;

        if(!taskItemList || taskItemList.length == 0){
          this.$Message.warning("没有下一题了");
        }
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src =  BASEURL + dataRecordList[item.dataRecordId].thumbnailUrl
          this.imgUrl = BASEURL + dataRecordList[item.dataRecordId].thumbnailUrl;
          return item
        }) : []
        this.isNext = !!taskItemList;
        console.log()
        if(taskItemList.length > 0) {
          this.init(this.taskItemList[0].src); 
        }
      })
    },

    taskItemMark (next) {
      let markData = {}
      this.taskItemList.forEach(item => {
        markData = {
          taskItemId: item.id,
          markData: JSON.stringify(ShapeCanvas.getData()) 
        }
      })
      const data = {
        taskId: this.$route.query.id,
        markData
      }
      this.convertCanvasToImage(markData.taskItemId);
      taskItemMark(data).then(res => {
        if (next) {
          this.taskItemAllotMark()
        }
      });
    },

    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          item.tag = item.taskData
          return item
        }) : []
        taskItemList && taskItemList.forEach(item => {
          this.reviewInfo = {
            name: item.reviewUserId !== 0 ? userList[item.reviewUserId].userName : '',
            advise: item.reviewAdvise
          }
        })
        this.isNext = !!taskItemList
      })
    },

    init(img) {
      let tool = document.getElementById("toolId");
      ShapeCanvas.init({
        el: tool, // 工具容器,未设置默认时body
        drawEnd() {
          // 绘制一个图形结束触发,编辑标注文字描述确定时触发
          console.log(this.getData());
        }
      });
      ShapeCanvas.setImage(
        img
      );
    },

    setData() {
      ShapeCanvas.setData({"imgSrc":"https://f12.baidu.com/it/u=2661567341,837532549&fm=72","bgColor":"#FFFFFF","items":[{"title":"11","desc":"222","type":"rect","color":"red","children":[],"x":94,"y":57,"cx":0,"cy":0,"cx2":0,"cy2":0,"tx":0,"ty":0,"width":163,"height":93,"r":0,"fill":false}]})
    },

    convertCanvasToImage(itemId,) {
        let canvas = ShapeCanvas.canvas;
        var image = new Image();

        console.log(canvas);

        image.src = canvas.toDataURL("image/png");
        this.imgSrc = image.src;
        let blob = this.dataURItoBlob(image.src);

        let params = new FormData() ; //创建一个form对象,必须是form对象否则后端接受不到数据
          params.append('file', blob, `${itemId}.png`); 
          params.append('taskItemId', itemId);  //append 向form表单添加数据
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          };
          itemTaskUpload(params)
          .then(function(res){
            console.log(res);
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log(image);
        return image;
    },

    getBase64Image(url, callback){
        //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
        var Img = new Image(),
            dataURL='';
        Img.src=url;
        Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
            var canvas = document.createElement("canvas"), //创建canvas元素
                width=Img.width, //确保canvas的尺寸和图片一样
                height=Img.height;
            canvas.width=width;
            canvas.height=height;
            canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
            dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
            callback?callback(dataURL):null; //调用回调函数
        };
    },

    dataURItoBlob(base64Data) {
      var bytes = window.atob(base64Data.split(',')[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
        type: 'image/png'
      });
    }
  }
};
</script>
<style lang="scss" >
.actionBtn{
  margin: 10px 0;
}

.ll {
  &-wrap {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    user-select: none;
  }

  &-status {
    position: absolute;
    background: #313343;
    height: 32px;
    left: 0;
    right: 0;
    top: 0;
    box-sizing: border-box;
    border-bottom: 1px solid #252525;

    &>button {
      text-align: center;
      white-space: nowrap;
      background-color: rgba(0, 0, 0, 0);
      position: relative;
      border-radius: 3px;
      margin: 2px 3px 1px 3px;
      padding: 4px 4px;
      border: 0;
      outline: 0;
      vertical-align: middle;
      &:hover {
        background: #000000;
      }

      &:disabled {
        background: rgba(0, 0, 0, 0.2);
      }

      &:disabled img {
        opacity: 0.75;
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        opacity: 0.75;
        filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.45));
      }

      &.selected {
        background: #000000;
      }

      &.disabled {
        background-color: rgba(0, 0, 0, 0);
        // margin-right: 2em;
        margin-left: 5px;
      }

      &>span {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }
    &>span {
      line-height: unit(28/16);
      vertical-align: middle;
      color: #fff;
      padding-left: 1em;
      border-left: 1px solid #252525;
    }
    &>em {
      font-size: 14px;
      line-height: unit(28/14);
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.6);
      padding-left: 1em;
    }
  }

  &-tools {
    position: absolute;
    background: #313343;
    width: 34px;
    text-align: center;
    left: 0;
    top: 32px;
    padding: 2px;
    bottom: 0;

    &>hr {
      border: 0;
      height: 1px;
      background: #252525;
      margin: 2px 0;
    }

    &>button {
      text-align: center;
      white-space: nowrap;
      background-color: rgba(0, 0, 0, 0);
      position: relative;
      border-radius: 3px;
      margin: 2px 3px 1px 3px;
      padding: 4px 4px;
      border: 0;
      outline: 0;

      &:hover {
        background: rgba(0, 0, 0, 1);
      }

      &:disabled {
        background: rgba(0, 0, 0, .2);

        img {
          opacity: 0.75;
        }
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        opacity: 0.75;
        filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.45));
      }

      &.selected {
        background: rgba(0, 0, 0, 1);
      }

      span {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }
  }

  &-canvas {
    position: absolute;
    left: 38px;
    top: 30px;
    bottom: 0;
    right: 0;
    overflow: hidden;

    canvas {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  &-color-picker {
    position: absolute;
    width: 490px;
    top: 40px;
    left: 48px;
    padding: 6px;
    background-color: #313343;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0);
    }

    &__input {
      position: absolute;
      width: 200px;
      right: 6px;
      top: 6px;
      font-size: 12px;
      overflow: hidden;

      &-view {
        height: 30px;
      }

      &-rgb {
        padding-top: 10px;
        font-size: 12px;

        label {
          color: #ffffff;
          padding: 5px;
        }

        input {
          background-color: #000000;
          color: #ffffff;
          border-radius: 3px;
          border: 0;
          padding: 5px;
          width: 30px;
        }
      }

      &-hex {
        padding-top: 10px;
        font-size: 12px;

        label {
          color: #ffffff;
          padding: 5px;
        }

        input {
          background-color: #000000;
          color: #ffffff;
          border-radius: 3px;
          border: 0;
          padding: 5px;
          width: 78px;
          text-transform: Uppercase;
        }
      }

      &-com {
        padding: 10px 5px 5px;

        span {
          display: inline-block;
          height: 18px;
          width: 18px;
          margin-right: 1px;
          border: 1px solid #000000;
        }
      }

      &-btn {
        padding: 10px 5px 5px;

        button {
          font-size: 14px;
          width: 100%;
          border-style: solid;
          border-width: 0;
          background-color: #606060;
          border-top-width: 1px;
          border-top-color: rgba(255, 255, 255, 0.25);
          border-bottom-width: 1px;
          border-bottom-color: rgba(0, 0, 0, 0.6);
          overflow: hidden;
          padding: 2px 5px 3px 5px;
          border-radius: 3px;
          color: #d5d5d5;
          -webkit-appearance: none;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.45);

          &:hover {
            background-color: #6a6a6a;
          }

          &:first-child {
            margin-bottom: 5px;
          }
        }
      }
    }
  }

  &-menu {
    position: absolute;
    background-color: #fff;
    min-width: 10em;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    color: #000000;
    cursor: pointer;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0);
    }

    &>div {
      padding: 0.5em 1em 0.5em 0.7em;

      &:hover {
        background-color: #bee6ff;
      }
    }
  }

  &-info {
    position: absolute;
    width: 261px;
    top: 40px;
    left: 48px;
    padding: 6px;
    background-color: #313343;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0);
    }

    &-item {
      padding-top: 10px;
      font-size: 12px;

      label {
        color: #ffffff;
        padding: 5px;
        vertical-align: top;
      }

      input {
        background-color: #000000;
        color: #ffffff;
        border-radius: 3px;
        border: 0;
        padding: 5px;
        width: 200px;
      }
      textarea {
        background-color: #000000;
        color: #ffffff;
        border-radius: 3px;
        border: 0;
        padding: 5px;
        width: 200px;
        height: 60px;
      }
    }

    &-btn {
      padding: 10px 5px 5px;
      text-align: right;
      button {
        font-size: 14px;
        width: 80px;
        border-style: solid;
        border-width: 0;
        background-color: #606060;
        border-top-width: 1px;
        border-top-color: rgba(255, 255, 255, 0.25);
        border-bottom-width: 1px;
        border-bottom-color: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        padding: 2px 5px 3px 5px;
        border-radius: 3px;
        color: #d5d5d5;
        -webkit-appearance: none;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.45);

        &:hover {
          background-color: #6a6a6a;
        }

        &:first-child {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>