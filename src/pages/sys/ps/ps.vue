<template>
  <div class="ps-draw">
    <ul>
      <li @click="drawRect('Rect')">画矩形</li>
      <li @click="lasso('Path')">套索</li>
      <li @click="polyline('Polyline')">定点</li>
      <li @click="recall">撤销</li>
      <li ref="undoButton" @click="undo">撤销上次</li>
      <li ref="redoButton" @click="redo">重做</li>
    </ul>
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
      config: {
        canvasState: [],
        currentStateIndex: -1,
        redoStatus: false, //撤销状态
        undoStatus: false, // 重做状态
        undoFinishedStatus: 1,
        redoFinishedStatus: 1,
        undoButton: this.$refs.undo, //得不到  在 mounted 得到
        redoButton: this.$refs.redo
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
      this.selectedObj.hasControls = true;
      this.canvas.renderAll();
      console.log(this.selectedObj);
    });

    this.canvas = canvas;
    // this.canvasDataChange();
  },

  methods: {
    addObjectEvent: function() {
      this.canvas.on("mouse:down", o => {
        this.isDrawing = true;
      });
      this.canvas.on("mouse:up", o => {
        this.isDrawing = false;
      });
      this.canvas.on("mouse:move", o => {
        if (!this.isDrawing) {
          return;
        }
      });
      this.canvas.on("mouse:move", o => {
        if (!this.isDrawing) {
          return;
        }
      });
    },

    clearEvent: function() {
      //   canvas.selection = false;
      this.canvas.remove("mouse:down");
      this.canvas.remove("mouse:move");
      this.canvas.remove("mouse:up");
    },
    //画矩形
    drawRect: function() {
      this.currentTab = "Rect"
      let origX, origY;
      this.canvas.on("mouse:down", o => {
        if(this.currentTab != "Rect") return;
        this.isDrawing = true;
        var pointer = this.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        var rect = new fabric.Rect({
          left: origX,
          top: origY,
          originX: "left",
          originY: "top",
          width: pointer.x - origX,
          height: pointer.y - origY,
          angle: 0,
          stroke: "red",
          strokeWidth: 2,
          fill: "transparent",
          transparentCorners: false,
          hasBorders: false,
        });
        // rect.on("selected", function() {
        // //   this.isDrawing = false;
        //   console.log("selected a rectangle");
        // //   rect.hasControls = true;
        // });
        this.canvas.add(rect).setActiveObject(rect);
      });

      this.canvas.on("mouse:move", o => {
        if(this.currentTab != "Rect") return;
        if (!this.isDrawing) {
          return;
        }
        var pointer = this.canvas.getPointer(o.e);
        var activeObj = this.canvas.getActiveObject();
        if (origX > pointer.x) {
          activeObj.set({ left: Math.abs(pointer.x) });
        }
        if (origY > pointer.y) {
          activeObj.set({ top: Math.abs(pointer.y) });
        }
        activeObj.set({ width: Math.abs(origX - pointer.x) });
        activeObj.set({ height: Math.abs(origY - pointer.y) });
        // activeObj.setCoords();
        // console.log("getCoords",activeObj.getCoords())
        this.canvas.renderAll();
      });
      this.canvas.on("mouse:up", o => {
        if(this.currentTab != "Rect") return;
        this.isDrawing = false;
        var pointer = this.canvas.getPointer(o.e);
        var activeObj = this.canvas.getActiveObject();
        activeObj && activeObj.setCoords();
        if (origX == pointer.x && origY == pointer.y) {
          this.canvas.remove(activeObj);
        }
      });
      this.canvas.on("object:moving", o => {
        if(this.currentTab != "Rect") return;
        this.isDrawing = false;
      });
    },

    //套索工具
    lasso: function() {
      console.log("?/");
      this.currentTab = "Path";
      this.clearEvent();
    },

    //撤销
    recall: function() {
      let lastObject = this.canvas.getObjects().pop();
      this.canvas.remove(lastObject);
    },

    canvasDataChange() {
      let _self = this;
      this.canvas.on("object:modified", function() {
        _self.updateCanvasState();
      });
      this.canvas.on("object:added", function() {
        _self.updateCanvasState();
      });
      this.canvas.on("object:removed", function() {
        _self.updateCanvasState();
      });
      this.canvas.on("object:rotating", function() {
        _self.updateCanvasState();
      });
    },

    undo() {
      let _self = this;
      if (this.config.undoFinishedStatus) {
        if (this.config.currentStateIndex == -1) {
          this.config.undoStatus = false;
        } else {
          if (this.config.canvasState.length >= 1) {
            this.config.undoFinishedStatus = 0;
            if (this.config.currentStateIndex != 0) {
              this.config.undoStatus = true;
              this.canvas.loadFromJSON(
                this.config.canvasState[this.config.currentStateIndex - 1],
                function() {
                  var jsonData = JSON.parse(
                    _self.config.canvasState[_self.config.currentStateIndex - 1]
                  );
                  _self.canvas.renderAll();
                  _self.config.undoStatus = false;
                  _self.config.currentStateIndex -= 1;
                  // _self.config.undoButton.removeAttribute("disabled");
                  // _self.config.undoButton.disabled = false;
                  if (
                    _self.config.currentStateIndex !==
                    _self.config.canvasState.length - 1
                  ) {
                    // _self.config.redoButton.removeAttribute('disabled');
                    // _self.config.redoButton.disabled = false;
                  }
                  _self.config.undoFinishedStatus = 1;
                }
              );
            } else if (_self.config.currentStateIndex == 0) {
              _self.canvas.clear();
              _self.config.undoFinishedStatus = 1;
              // _self.config.undoButton.disabled= "disabled";
              // _self.config.redoButton.removeAttribute('disabled');
              // _self.config.redoButton.disabled = false;
              _self.config.currentStateIndex -= 1;
            }
          }
        }
      }
    },
    redo() {
      let _self = this;
      if (this.config.redoFinishedStatus) {
        if (
          this.config.currentStateIndex == this.config.canvasState.length - 1 &&
          this.config.currentStateIndex != -1
        ) {
          // this.config.redoButton.disabled= true;
        } else {
          if (
            this.config.canvasState.length > this.config.currentStateIndex &&
            this.config.canvasState.length != 0
          ) {
            this.config.redoFinishedStatus = 0;
            this.config.redoStatus = true;
            this.canvas.loadFromJSON(
              this.config.canvasState[this.config.currentStateIndex + 1],
              function() {
                var jsonData = JSON.parse(
                  _self.config.canvasState[_self.config.currentStateIndex + 1]
                );
                _self.canvas.renderAll();
                _self.config.redoStatus = false;
                _self.config.currentStateIndex += 1;
                if (_self.config.currentStateIndex != -1) {
                  //    _self.config.redoButton.disabled = false;
                }
                _self.config.redoFinishedStatus = 1;
                if (
                  _self.config.currentStateIndex ==
                    _self.config.canvasState.length - 1 &&
                  _self.config.currentStateIndex != -1
                ) {
                  // _self.config.redoButton.disabled= true;
                }
              }
            );
          }
        }
      }
    },
    updateCanvasState() {
      var _self = this;
      if (
        _self.config.undoStatus == false &&
        _self.config.redoStatus == false
      ) {
        var jsonData = _self.$store.state.fabricObj.canvas.toJSON();
        var canvasAsJson = JSON.stringify(jsonData);
        if (
          _self.config.currentStateIndex <
          _self.config.canvasState.length - 1
        ) {
          var indexToBeInserted = _self.config.currentStateIndex + 1;
          _self.config.canvasState[indexToBeInserted] = canvasAsJson;
          var numberOfElementsToRetain = indexToBeInserted + 1;
          _self.config.canvasState = _self.config.canvasState.splice(
            0,
            numberOfElementsToRetain
          );
        } else {
          _self.config.canvasState.push(canvasAsJson);
        }
        _self.config.currentStateIndex = _self.config.canvasState.length - 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>