
    var roof = null;
    var roofPoints = [];
    var lines = [];
    var lineCounter = 0;
    var drawingObject = {};
    drawingObject.type = "";
    drawingObject.background = "";
    drawingObject.border = "";

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    

    $("#poly").click(function () {
        if (drawingObject.type == "roof") {
            drawingObject.type = "";
            lines.forEach(function(value, index, ar){
                 canvas.remove(value);
            });
            //canvas.remove(lines[lineCounter - 1]);
            roof = makeRoof(roofPoints);
            canvas.add(roof);
            canvas.renderAll();
        } else {
            drawingObject.type = "roof"; // roof type
        }
    });


    // canvas Drawing
var canvas = new fabric.Canvas('canvas-tools');
    var x = 0;
    var y = 0;
    
    fabric.util.addListener(window,'dblclick', function(){ 
            drawingObject.type = "";
            lines.forEach(function(value, index, ar){
                 canvas.remove(value);
            });
            //canvas.remove(lines[lineCounter - 1]);
            roof = makeRoof(roofPoints);
            canvas.add(roof);
            canvas.renderAll();
      
        console.log("double click");
        //clear arrays
         roofPoints = [];
         lines = [];
         lineCounter = 0;
        
    });

    canvas.on('mouse:down', function (options) {
        if (drawingObject.type == "roof") {
            canvas.selection = false;
            setStartingPoint(options); // set x,y
            roofPoints.push(new Point(x, y));
            var points = [x, y, x, y];
            lines.push(new fabric.Line(points, {
                strokeWidth: 3,
                selectable: false,
                stroke: 'red'
            }).setOriginX(x).setOriginY(y));
            canvas.add(lines[lineCounter]);
            lineCounter++;
            canvas.on('mouse:up', function (options) {
                canvas.selection = true;
            });
        }
    });
    canvas.on('mouse:move', function (options) {
        if (lines[0] !== null && lines[0] !== undefined && drawingObject.type == "roof") {
            setStartingPoint(options);
            lines[lineCounter - 1].set({
                x2: x,
                y2: y
            });
            canvas.renderAll();
        }
    });

    function setStartingPoint(options) {
        var offset = $('#canvas-tools').offset();
        x = options.e.pageX - offset.left;
        y = options.e.pageY - offset.top;
    }

    function makeRoof(roofPoints) {

        var left = findLeftPaddingForRoof(roofPoints);
        var top = findTopPaddingForRoof(roofPoints);
        roofPoints.push(new Point(roofPoints[0].x,roofPoints[0].y))
        var roof = new fabric.Polyline(roofPoints, {
        fill: 'rgba(0,0,0,0)',
        stroke:'#58c'
        });
        roof.set({
            
            left: left,
            top: top,
           
        });


        return roof;
    }

    function findTopPaddingForRoof(roofPoints) {
        var result = 999999;
        for (var f = 0; f < lineCounter; f++) {
            if (roofPoints[f].y < result) {
                result = roofPoints[f].y;
            }
        }
        return Math.abs(result);
    }

    function findLeftPaddingForRoof(roofPoints) {
        var result = 999999;
        for (var i = 0; i < lineCounter; i++) {
            if (roofPoints[i].x < result) {
                result = roofPoints[i].x;
            }
        }
        return Math.abs(result);
    }