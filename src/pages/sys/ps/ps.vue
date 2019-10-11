<template>
  <div class="ps-draw">
    <ul @click.capture="setCurrentTab($event)" class="tabs">
      <li data-attr="Rect">画矩形</li>
      <li data-attr="Path" @click="lasso">套索</li>
      <li data-attr="Polyline" @click="polyline('Polyline')">折线</li>
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
      isDrawingLine: false,
      isSelected: false,
      currentTab: "Rect",
      rectConfig: {
        origX: 0,
        origY: 0
      },
      polylinePoints: []
    };
  },
  mounted() {
    const canvas = new fabric.Canvas("canvas", {
      //   isDrawingMode: true,
      selection: true
    });
    // 如果<canvas>标签没设置宽高，可以通过js动态设置
    canvas.setWidth(865);
    canvas.setHeight(629);
    canvas.selectionColor = null;
    canvas.selectionBorderColor = "blue";

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
      console.log(e.target);
      this.selectedObj = e.target;
      this.canvas.setActiveObject(this.selectedObj);
      this.canvas.renderAll();
    });

    canvas.on("selection:cleared", e => {
      this.canvas.renderAll();
    });
    this.canvas = canvas;
    this.addObjectEvent();
  },

  methods: {
    //冒泡
    setCurrentTab: function(e) {
      let target = e.target;
      let _self = this;
      this.currentTab = e.target.dataset.attr;
      console.log("当前工具", this.currentTab);
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
      }
      this.clearEvent();
    },

    addObjectEvent: function() {
      let _self = this;
      this.canvas.on("mouse:down", o => {
        switch (this.currentTab) {
          case "Rect":
            this.drawRectStart(o);
            break;
          case "Polyline":
            this.drawPolylineStart(o);
          default:
            break;
        }
      });
      this.canvas.on("mouse:up", o => {
        switch (this.currentTab) {
          case "Rect":
            this.drawRectUp(o);
            break;
          case "Polyline":
            this.drawPolylineUp(o);
          default:
            break;
        }
      });
      this.canvas.on("mouse:move", o => {
        switch (this.currentTab) {
          case "Rect":
            this.drawRectMove(o);
            break;
          case "Polyline":
            this.drawPolylineMove(o);
          default:
            break;
        }
      });

      this.canvas.on("object:moving", o => {
        switch (this.currentTab) {
          case "Rect":
            this.isDrawing = false;
            break;
          default:
            break;
        }
      });
    },

    clearEvent: function() {
      this.canvas.isDrawingMode = false;
      this.canvas.renderAll();
    },

    //drawRectStart
    drawRectStart: function(object) {
      this.isDrawing = true;
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
        borderColor: "blue",
        cornerColor: "blue",
        borderOpacityWhenMoving: 1,
        borderScaleFactor: 2,
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
      activeObj.set({ stroke: "red" });
      this.canvas.renderAll();
    },

    drawRectUp: function(object) {
      if (this.currentTab != "Rect") return;
      let { origX, origY } = this.rectConfig;
      this.isDrawing = false;
      var pointer = this.canvas.getPointer(object.e);
      var activeObj = this.canvas.getActiveObject();
      if (activeObj.width == 0 || activeObj.height == 0) {
        this.canvas.remove(activeObj);
        return;
      }
    },

    polyline: function(x) {},
    //折线图
    drawPolylineStart: function(object) {
      // console.log(this.currentTab, this.canvas)
      console.log(this.isDrawing);
      var pointer = this.canvas.getPointer(object.e);
      this.polylinePoints.push({ x: pointer.x, y: pointer.y });
      let isRoof = this.polylinePoints[0] || [];
      if (
        this.polylinePoints.length > 1 &&
        Math.abs(isRoof.x - pointer.x) <= 3 &&
        Math.abs(isRoof.y - pointer.y) <= 3
      ) {
        this.isDrawing = false;
        let lines = this.canvas.getObjects().filter(item => {
          return item.type == "line";
        });
        lines.forEach((value, index, ar) => {
          this.canvas.remove(value);
        });
        let polylinePosition = { ...isRoof };
        this.polylinePoints.forEach(item => {
          if (polylinePosition.x > item.x) {
            polylinePosition.x = item.x;
          }
          if (polylinePosition.y > item.y) {
            polylinePosition.y = item.y;
          }
        });
        console.log(this.polylinePoints, isRoof);
        this.polylinePoints
          .slice(0, this.polylinePoints.length - 1)
          .push(isRoof);
          
        var polyline = new fabric.Polygon(this.polylinePoints, {
          left: Math.abs(polylinePosition["x"]),
          top: Math.abs(polylinePosition["y"]),
          strokeWidth: 1,
          dirty: true,
          stroke: "red",
          strokeLineCap: "round",
          strokeLineJoin: "round",
          borderColor: "blue",
          cornerColor: "blue",
          cornerSize: 5,
          borderOpacityWhenMoving: 1,
          borderScaleFactor: 2,
          "stroke-dasharray": 3,
          tool: 3,
          fill: "transparent",
          transparentCorners: false,
          hasBorders: true,
          hasControls: true
        });
        this.canvas.selection = false;
        this.canvas.add(polyline);
        
        this.polylinePoints = [];
        return;
        alert("终点啦");
      } else {
        this.isDrawing = true;
        this.canvas.selection = false;
        let { x, y } = pointer;
        let line = new fabric.Line([x, y, x, y], {
          strokeWidth: 1,
          selectable: false,
          stroke: "red",
          hasControls: false,
          hasBorders: false
        });
        this.canvas.add(line).setActiveObject(line);
      }
    },

    drawPolylineMove: function(o) {
      //   console.log("this.isDrawing", this.isDrawing);
      if (!this.isDrawing) {
        return;
      }
      var pointer = this.canvas.getPointer(o.e);
      //   this.polylinePoints.push({ x: pointer.x, y: pointer.y });
      let line = this.canvas.getActiveObject();
      //   console.log(line);
      line.set({ x2: pointer.x, y2: pointer.y });
      line.setCoords();
      this.canvas.renderAll();
    },

    drawPolylineUp: function(o) {
      //   this.isDrawing = false;
      //   this.polylinePoints = [];
      if (this.isDrawing) {
        return;
      }
      this.canvas.selection = true;
      //   var line = new fabric.Polyline(points, {
      //     left: points["x"],
      //     top: points["y"],
      //     strokeWidth: 2,
      //     stroke: "red",
      //     strokeLineCap: "round",
      //     strokeLineJoin: "round",
      //     fill: null
      //   });
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
      let _self = this;
      var objs = this.canvas.getObjects().map(function(o) {
        o.set("hasBorders", true);
        o.set("hasControls", true);
        o.setCoords();
        return o;
      });
      this.canvas.selection = true;
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
      let final = objects.map(item => {
        let object = {
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
        };
        if (item.type == "path") {
          object.path = item.path;
        }
        return object;
      });

      console.log(JSON.stringify(final));
      console.log(this.canvas.toDatalessJSON());
    },

    loadObject: function() {
      let object = {
        objects: [
          {
            type: "rect",
            angle: 0,
            left: 102,
            top: 64.09,
            originX: "left",
            originY: "top",
            width: 201,
            height: 172,
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1
          },
          {
            type: "rect",
            angle: 0,
            left: 405,
            top: 101.09,
            originX: "left",
            originY: "top",
            width: 193,
            height: 134,
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1
          },
          {
            type: "path",
            angle: 0,
            left: 72.5,
            top: 241.59,
            originX: "left",
            originY: "top",
            width: 0,
            height: 0,
            stroke: "red",
            fill: null,
            strokeWidth: 1,
            path: []
          },
          {
            type: "path",
            angle: 0,
            left: 81.5,
            top: 266.59,
            originX: "left",
            originY: "top",
            width: 141,
            height: 158,
            stroke: "red",
            fill: null,
            strokeWidth: 1,
            path: [
              ["M", 160.001, 425.09375],
              ["Q", 160, 425.09375, 159.5, 425.09375],
              ["Q", 159, 425.09375, 158, 425.09375],
              ["Q", 157, 425.09375, 156, 425.09375],
              ["Q", 155, 425.09375, 154.5, 425.09375],
              ["Q", 154, 425.09375, 153, 425.09375],
              ["Q", 152, 425.09375, 151.5, 425.09375],
              ["Q", 151, 425.09375, 150, 425.09375],
              ["Q", 149, 425.09375, 148.5, 425.09375],
              ["Q", 148, 425.09375, 147.5, 424.59375],
              ["Q", 147, 424.09375, 146.5, 424.09375],
              ["Q", 146, 424.09375, 145.5, 423.59375],
              ["Q", 145, 423.09375, 145, 422.59375],
              ["Q", 145, 422.09375, 144, 421.59375],
              ["Q", 143, 421.09375, 142, 419.59375],
              ["Q", 141, 418.09375, 139.5, 417.09375],
              ["Q", 138, 416.09375, 137, 414.59375],
              ["Q", 136, 413.09375, 135, 412.09375],
              ["Q", 134, 411.09375, 133.5, 410.09375],
              ["Q", 133, 409.09375, 131.5, 408.09375],
              ["Q", 130, 407.09375, 129, 406.09375],
              ["Q", 128, 405.09375, 126.5, 403.59375],
              ["Q", 125, 402.09375, 124.5, 401.09375],
              ["Q", 124, 400.09375, 123, 399.09375],
              ["Q", 122, 398.09375, 121, 397.09375],
              ["Q", 120, 396.09375, 118.5, 394.59375],
              ["Q", 117, 393.09375, 116, 392.09375],
              ["Q", 115, 391.09375, 114, 389.59375],
              ["Q", 113, 388.09375, 111.5, 386.09375],
              ["Q", 110, 384.09375, 108.5, 382.59375],
              ["Q", 107, 381.09375, 106, 379.59375],
              ["Q", 105, 378.09375, 104, 376.59375],
              ["Q", 103, 375.09375, 102, 373.09375],
              ["Q", 101, 371.09375, 100, 369.59375],
              ["Q", 99, 368.09375, 98.5, 366.59375],
              ["Q", 98, 365.09375, 97, 363.09375],
              ["Q", 96, 361.09375, 95.5, 359.09375],
              ["Q", 95, 357.09375, 94.5, 355.59375],
              ["Q", 94, 354.09375, 93, 351.59375],
              ["Q", 92, 349.09375, 91.5, 347.59375],
              ["Q", 91, 346.09375, 90.5, 345.09375],
              ["Q", 90, 344.09375, 89.5, 342.59375],
              ["Q", 89, 341.09375, 88.5, 339.59375],
              ["Q", 88, 338.09375, 87, 335.59375],
              ["Q", 86, 333.09375, 86, 332.09375],
              ["Q", 86, 331.09375, 86, 330.09375],
              ["Q", 86, 329.09375, 85, 327.09375],
              ["Q", 84, 325.09375, 84, 323.59375],
              ["Q", 84, 322.09375, 83.5, 320.09375],
              ["Q", 83, 318.09375, 83, 317.09375],
              ["Q", 83, 316.09375, 82.5, 314.59375],
              ["Q", 82, 313.09375, 82, 311.09375],
              ["Q", 82, 309.09375, 82, 307.59375],
              ["Q", 82, 306.09375, 82, 305.09375],
              ["Q", 82, 304.09375, 82, 302.59375],
              ["Q", 82, 301.09375, 82, 300.09375],
              ["Q", 82, 299.09375, 82, 298.59375],
              ["Q", 82, 298.09375, 82, 297.59375],
              ["Q", 82, 297.09375, 82, 296.59375],
              ["Q", 82, 296.09375, 82, 295.59375],
              ["Q", 82, 295.09375, 82, 294.59375],
              ["Q", 82, 294.09375, 82, 293.59375],
              ["Q", 82, 293.09375, 82.5, 293.09375],
              ["Q", 83, 293.09375, 83.5, 292.59375],
              ["Q", 84, 292.09375, 84.5, 292.09375],
              ["Q", 85, 292.09375, 85.5, 291.59375],
              ["Q", 86, 291.09375, 86.5, 291.09375],
              ["Q", 87, 291.09375, 87, 290.59375],
              ["Q", 87, 290.09375, 87.5, 290.09375],
              ["Q", 88, 290.09375, 88.5, 289.59375],
              ["Q", 89, 289.09375, 89.5, 289.09375],
              ["Q", 90, 289.09375, 91, 288.09375],
              ["Q", 92, 287.09375, 93, 286.59375],
              ["Q", 94, 286.09375, 96, 284.59375],
              ["Q", 98, 283.09375, 99, 282.59375],
              ["Q", 100, 282.09375, 102, 281.09375],
              ["Q", 104, 280.09375, 106, 279.09375],
              ["Q", 108, 278.09375, 110, 277.09375],
              ["Q", 112, 276.09375, 112.5, 275.59375],
              ["Q", 113, 275.09375, 114.5, 274.09375],
              ["Q", 116, 273.09375, 117, 272.59375],
              ["Q", 118, 272.09375, 119.5, 271.59375],
              ["Q", 121, 271.09375, 122, 270.59375],
              ["Q", 123, 270.09375, 124, 270.09375],
              ["Q", 125, 270.09375, 126, 269.59375],
              ["Q", 127, 269.09375, 127.5, 269.09375],
              ["Q", 128, 269.09375, 130, 269.09375],
              ["Q", 132, 269.09375, 133, 268.59375],
              ["Q", 134, 268.09375, 135.5, 268.09375],
              ["Q", 137, 268.09375, 138.5, 268.09375],
              ["Q", 140, 268.09375, 141.5, 267.59375],
              ["Q", 143, 267.09375, 145, 267.09375],
              ["Q", 147, 267.09375, 149, 267.09375],
              ["Q", 151, 267.09375, 153, 267.09375],
              ["Q", 155, 267.09375, 156.5, 267.09375],
              ["Q", 158, 267.09375, 160.5, 267.09375],
              ["Q", 163, 267.09375, 164.5, 267.09375],
              ["Q", 166, 267.09375, 168.5, 267.09375],
              ["Q", 171, 267.09375, 172.5, 267.09375],
              ["Q", 174, 267.09375, 176, 267.59375],
              ["Q", 178, 268.09375, 179.5, 268.09375],
              ["Q", 181, 268.09375, 182.5, 268.59375],
              ["Q", 184, 269.09375, 186, 269.09375],
              ["Q", 188, 269.09375, 189, 269.59375],
              ["Q", 190, 270.09375, 191.5, 270.59375],
              ["Q", 193, 271.09375, 194.5, 271.59375],
              ["Q", 196, 272.09375, 197, 272.59375],
              ["Q", 198, 273.09375, 198.5, 273.09375],
              ["Q", 199, 273.09375, 200, 274.09375],
              ["Q", 201, 275.09375, 202, 275.59375],
              ["Q", 203, 276.09375, 203.5, 276.59375],
              ["Q", 204, 277.09375, 204.5, 277.59375],
              ["Q", 205, 278.09375, 205.5, 278.59375],
              ["Q", 206, 279.09375, 206.5, 279.59375],
              ["Q", 207, 280.09375, 207.5, 280.59375],
              ["Q", 208, 281.09375, 208, 281.59375],
              ["Q", 208, 282.09375, 208.5, 282.59375],
              ["Q", 209, 283.09375, 209.5, 284.09375],
              ["Q", 210, 285.09375, 210, 285.59375],
              ["Q", 210, 286.09375, 211, 287.09375],
              ["Q", 212, 288.09375, 212.5, 289.09375],
              ["Q", 213, 290.09375, 213, 291.09375],
              ["Q", 213, 292.09375, 214, 293.09375],
              ["Q", 215, 294.09375, 215, 295.09375],
              ["Q", 215, 296.09375, 216, 297.59375],
              ["Q", 217, 299.09375, 217, 300.59375],
              ["Q", 217, 302.09375, 217.5, 302.59375],
              ["Q", 218, 303.09375, 218.5, 305.59375],
              ["Q", 219, 308.09375, 219.5, 309.59375],
              ["Q", 220, 311.09375, 220, 312.59375],
              ["Q", 220, 314.09375, 220.5, 316.09375],
              ["Q", 221, 318.09375, 221, 319.59375],
              ["Q", 221, 321.09375, 221.5, 322.09375],
              ["Q", 222, 323.09375, 222, 324.59375],
              ["Q", 222, 326.09375, 222.5, 328.09375],
              ["Q", 223, 330.09375, 223, 331.59375],
              ["Q", 223, 333.09375, 223, 334.59375],
              ["Q", 223, 336.09375, 223, 337.59375],
              ["Q", 223, 339.09375, 223, 340.09375],
              ["Q", 223, 341.09375, 223, 342.59375],
              ["Q", 223, 344.09375, 223, 345.09375],
              ["Q", 223, 346.09375, 223, 347.09375],
              ["Q", 223, 348.09375, 223, 349.09375],
              ["Q", 223, 350.09375, 222.5, 351.09375],
              ["Q", 222, 352.09375, 222, 353.09375],
              ["Q", 222, 354.09375, 221.5, 355.09375],
              ["Q", 221, 356.09375, 221, 356.59375],
              ["Q", 221, 357.09375, 220.5, 358.09375],
              ["Q", 220, 359.09375, 220, 360.09375],
              ["Q", 220, 361.09375, 219, 362.59375],
              ["Q", 218, 364.09375, 218, 364.59375],
              ["Q", 218, 365.09375, 217.5, 366.09375],
              ["Q", 217, 367.09375, 216.5, 367.59375],
              ["Q", 216, 368.09375, 215.5, 369.09375],
              ["Q", 215, 370.09375, 214.5, 371.09375],
              ["Q", 214, 372.09375, 213.5, 372.59375],
              ["Q", 213, 373.09375, 213, 374.09375],
              ["Q", 213, 375.09375, 212, 375.59375],
              ["Q", 211, 376.09375, 210.5, 377.09375],
              ["Q", 210, 378.09375, 209.5, 378.59375],
              ["Q", 209, 379.09375, 208.5, 380.09375],
              ["Q", 208, 381.09375, 207.5, 381.59375],
              ["Q", 207, 382.09375, 206, 383.09375],
              ["Q", 205, 384.09375, 204, 385.09375],
              ["Q", 203, 386.09375, 202.5, 387.09375],
              ["Q", 202, 388.09375, 201, 389.09375],
              ["Q", 200, 390.09375, 199, 391.09375],
              ["Q", 198, 392.09375, 197.5, 393.09375],
              ["Q", 197, 394.09375, 196, 395.09375],
              ["Q", 195, 396.09375, 193.5, 397.59375],
              ["Q", 192, 399.09375, 191, 400.09375],
              ["Q", 190, 401.09375, 189.5, 402.09375],
              ["Q", 189, 403.09375, 187.5, 404.09375],
              ["Q", 186, 405.09375, 185, 406.59375],
              ["Q", 184, 408.09375, 182.5, 409.59375],
              ["Q", 181, 411.09375, 180.5, 411.59375],
              ["Q", 180, 412.09375, 179.5, 412.59375],
              ["Q", 179, 413.09375, 178.5, 413.59375],
              ["Q", 178, 414.09375, 177.5, 415.09375],
              ["Q", 177, 416.09375, 176.5, 416.09375],
              ["Q", 176, 416.09375, 175.5, 416.59375],
              ["Q", 175, 417.09375, 174.5, 417.09375],
              ["Q", 174, 417.09375, 174, 417.59375],
              ["Q", 174, 418.09375, 173.5, 418.09375],
              ["Q", 173, 418.09375, 172.5, 418.59375],
              ["Q", 172, 419.09375, 171.5, 419.09375],
              ["Q", 171, 419.09375, 171, 419.59375],
              ["Q", 171, 420.09375, 170.5, 420.09375],
              ["Q", 170, 420.09375, 169.5, 420.09375],
              ["Q", 169, 420.09375, 169, 420.59375],
              ["Q", 169, 421.09375, 168.5, 421.09375],
              ["Q", 168, 421.09375, 167.5, 421.59375],
              ["Q", 167, 422.09375, 166.5, 422.09375],
              ["Q", 166, 422.09375, 165.5, 422.09375],
              ["Q", 165, 422.09375, 164.5, 422.09375],
              ["Q", 164, 422.09375, 164, 422.59375],
              ["Q", 164, 423.09375, 163.5, 423.09375],
              ["Q", 163, 423.09375, 162.5, 423.09375],
              ["Q", 162, 423.09375, 161.5, 423.09375],
              ["Q", 161, 423.09375, 161, 423.59375],
              ["Q", 161, 424.09375, 160.5, 424.09375],
              ["Q", 160, 424.09375, 159.5, 424.09375],
              ["L", 158.999, 424.09375]
            ]
          }
        ]
      };

      this.canvas.loadFromJSON(
        JSON.stringify(object),
        this.canvas.renderAll.bind(this.canvas)
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs li {
  cursor: pointer;
}
</style>