 var Paramter = function(){

    this.flag = false,  //
    this.type = 'line', //
    this.point = [],    //
    this.lineWidth =1,      //
    this.lineStyle = [0,0],   //
    this.lineColor = 'rbga(0,0,0,1)', //
    this.fillColor = 'rbga(0,0,0,1)',  //
    this.ctn = undefined                  //

}

Paramter.prototype.setValue = function(key,value){
    for(var i in this){
        if(this.hasOwnProperty(i)){
            if(i===key){
                this[i] = value;
                return;
            }
        };
    }
}

Paramter.prototype.getValue = function(key){
    return this[key]
}
Paramter.prototype.addKey = function(key,val){
    this[key] = val;
}
Paramter.prototype.removeKey = function(key){
    this[key] = undefined;
}
var para = new Paramter();




var canvasWrite = new fabric.Canvas('canvas',{
    allowTouchScrolling:false,
    isDrawingMode : false
});
canvasWrite.on('mouse:down',function(e){
    if(para.type!='line') return;
    var _point = [];
    _point.push({
        x:e.e.x,
        y:e.e.y
    });
    para.setValue('point',_point);
    para.setValue('flag',true);
});

canvasWrite.on('mouse:move',function(e){
    if(!para.flag) return;
    canvasWrite.clear()
    var _point = para.point;
    _point.push({
        x:e.e.x,
        y:e.e.y
    });
    para.setValue('point',_point);
    var line = new fabric.Polyline(_point,{
        left:_point[0]['x'],
        top:_point[0]['y'],
        strokeWidth : para.getValue('lineWidth'),
        stroke : para.getValue('lineColor'),
        strokeLineCap:'round',
        strokeLineJoin:'round',
        fill:null
    });
    canvasWrite.add(line)
});

canvasWrite.on('mouse:up',function(e){
    para.setValue('point',[]);
    para.setValue('flag',false);
});