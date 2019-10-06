<template>
  <div class="ps-draw">
    <ul @click.capture="setCurrentTab($event)" class="tabs">
      <li data-attr="Rect">画矩形</li>
      <li data-attr="Path">套索</li>
      <!-- <li @click="polyline('Polyline')">定点</li> -->
      <li data-attr="select" @click="selectObject('select')">选中</li>
      <li data-attr="Rect" @click="recall">撤销</li>
    </ul>
    <Button type="success" @click="getObjectJson">提交</Button>
    <canvas id="canvas" width="350" height="200"></canvas>
  </div>
</template>

<script>
// var fabric = require('fabric');
import { fabric } from "fabric";
export default {
  name: "PsDraw",
  data() {
    return {
      width: 700,
      height: 200,
      canvas: null,
      isDrawing: false,
      isSelected: false,
      currentTab: "Rect",
      rectConfig: {
        origX: 0,
        origY: 0
      }
    };
  },
  mounted() {
    const canvas = new fabric.Canvas("canvas", {
      //   isDrawingMode: true,
      //   selection: true
    });
    // 如果<canvas>标签没设置宽高，可以通过js动态设置
    canvas.setWidth(865);
    canvas.setHeight(629);

    fabric.Image.fromURL(
      "http://n1.itc.cn/img8/wb/smccloud/2015/04/02/142795342517946153.JPEG",
      img => {
        img.set({
          // 通过scale来设置图片大小，这里设置和画布一样大
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height
        });
        // 设置背景
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        canvas.renderAll();
      }
    );

    // card.on
    canvas.on("selection:created", e => {
      // 选中图层事件触发时，动态更新赋值
      this.selectedObj = e.target;
      console.log(this.selectedObj);
      //   this.selectedObj.hasControls = true;
      //   this.selectedObj.hasBorders = true;
      //   this.canvas.renderAll();
    });

    this.canvas = canvas;
    this.loadObject();
    // this.canvasDataChange();
    this.addObjectEvent();
  },

  methods: {
    //冒泡
    setCurrentTab: function(e) {
      let target = e.target;
      this.currentTab = e.target.dataset.attr;

      if (this.currentTab == "Rect") {
        var objs = this.canvas.getObjects().map(function(o) {
          if (o.aCoords) {
            o.set("hasBorders", false);
            o.set("hasControls", false);
            o.selectable = false;
            o.setCoords();
          }
          return o;
        });
        this.canvas.renderAll();
        console.log("不选选中", objs);
      }

      this.clearEvent();
    },

    addObjectEvent: function() {
      let _self = this;
      this.canvas.on("mouse:down", o => {
        this.isDrawing = true;
        switch (this.currentTab) {
          case "Rect":
            this.drawRectStart(o);
            break;

          default:
            break;
        }
      });
      this.canvas.on("mouse:up", o => {
        this.isDrawing = false;
        switch (this.currentTab) {
          case "Rect":
            this.drawRectUp(o);
            break;

          default:
            break;
        }
      });
      this.canvas.on("mouse:move", o => {
        if (!this.isDrawing) {
          return;
        }
        switch (this.currentTab) {
          case "Rect":
            this.drawRectMove(o);
            break;

          default:
            break;
        }
      });

      this.canvas.on("object:moving", o => {
        this.isDrawing = false;
      });
    },

    clearEvent: function() {
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll();
    },

    //drawRectStart
    drawRectStart: function(object) {
      var pointer = this.canvas.getPointer(object.e);
      this.rectConfig.origX = pointer.x;
      this.rectConfig.origY = pointer.y;
      let { origX, origY } = this.rectConfig;
      var rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: "left",
        originY: "top",
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        cornerSize: 5,
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
        transparentCorners: false,
        hasBorders: false,
        hasControls: false
      });
      this.canvas.add(rect).setActiveObject(rect);
    },

    drawRectMove: function(object) {
      if (!this.isDrawing) {
        return;
      }
      let { origX, origY } = this.rectConfig;
      var pointer = this.canvas.getPointer(object.e);
      var activeObj = this.canvas.getActiveObject();
      if (origX > pointer.x) {
        activeObj.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        activeObj.set({ top: Math.abs(pointer.y) });
      }
      activeObj.set({ width: Math.abs(origX - pointer.x) });
      activeObj.set({ height: Math.abs(origY - pointer.y) });
      this.canvas.renderAll();
    },

    drawRectUp: function(object) {
      if (this.currentTab != "Rect") return;
      let { origX, origY } = this.rectConfig;
      this.isDrawing = false;
      var pointer = this.canvas.getPointer(object.e);
      var activeObj = this.canvas.getActiveObject();
      // this.canvas.renderAll();
      if (origX == pointer.x && origY == pointer.y) {
        this.canvas.remove(activeObj);
        return;
      }
    },

    //套索工具
    lasso: function() {
      console.log("?/");
      //   this.currentTab = "Path";
      this.clearEvent();
      this.freeDrawConfig({
        isDrawingMode: true,
        color: "red",
        drawWidth: 1
      });
    },

    freeDrawConfig(options) {
      options = Object.assign({ color: "#b2b2b2", drawWidth: 2 }, options);
      this.canvas.isDrawingMode = options.isDrawingMode;
      this.canvas.freeDrawingBrush.color = options.color; // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = options.drawWidth;
      this.canvas.renderAll();
    },

    //选中对象
    selectObject: function(dd) {
      var objs = this.canvas.getObjects().map(function(o) {
        o.aCoords && o.set("hasBorders", true);
        o.aCoords && o.set("hasControls", true);
        if (o.aCoords) {
          o.selectable = true;
          o.set("hasBorders", true);
          o.set("hasControls", true);
          o.setCoords();
        }
        return o;
      });
      console.log("选中", objs);
      this.canvas.renderAll();
    },

    //撤销
    recall: function() {
      let lastObject = this.canvas.getObjects().pop();
      this.canvas.remove(lastObject);
    },

    //toJson
    getObjectJson: function() {
        console.log(this.canvas.toJSON());
        let objects = this.canvas.toJSON().objects;
        let final = objects.map( item => {
            return {
                type: item.type,
                angle: item.angle,
                left: item.left,
                top: item.top,
                originX: "left",
                originY: "top",
                width: item.width,
                height: item.height,
                cornerSize: item.cornerSize,
                stroke: item.stroke,
                fill: item.fill,
                strokeWidth: item.strokeWidth,
                transparentCorners: item.transparentCorners,
                hasBorders: item.hasControls,
                hasControls: item.hasControls
            }
        })

        console.log(JSON.stringify( final))
    },

    loadObject: function() {
        let object = {
            objects: [{"type":"rect","angle":0,"left":102,"top":64.09,"originX":"left","originY":"top","width":201,"height":172,"stroke":"red","fill":"transparent","strokeWidth":1},{"type":"rect","angle":0,"left":405,"top":101.09,"originX":"left","originY":"top","width":193,"height":134,"stroke":"red","fill":"transparent","strokeWidth":1}] 
        };

        this.canvas.loadFromJSON(JSON.stringify(object), this.canvas.renderAll.bind(this.canvas));
    }

  }
};
</script>
<style lang="scss" scoped>
.tabs li {
  cursor: pointer;
}
</style>