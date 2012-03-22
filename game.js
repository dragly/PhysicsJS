var frame = 0;
var grav = 500;
var marker;
var k = 100;

var canvas;
var ctx;

var objects = new Array();
var constraints = new Array();

var h = 0.01;

function Constraint() {
    this.target1 = 0;
    this.target2 = 0;
    this.target1Sticky = false;
    this.distance = 10;
    this.diffx = 0;
    this.diffy = 0;
    this.jacboitmp = new Array();
    this.jacboitmp2 = new Array();
    this.calculateVector = function() {
             this.diffx = this.target1.x - this.target2.x;
             this.diffy = this.target1.y - this.target2.y;
         }
    //    this.func = function(x1,y1,x2,y2) {
    //             var xdiff = x1 - x2;
    //             var ydiff = y1 - y2;
    //             return Math.sqrt(xdiff*xdiff + ydiff*ydiff) - distance;
    //         }

    //    this.jacobi = function(x1,y1,x2,y2,funct) {
    //             jacboitmp[0] = (funct(x1+h,y1,x2,y2) - funct(x1,y1,x2,y2))/h;
    //             jacboitmp[1] = (funct(x1,y1+h,x2,y2) - funct(x1,y1,x2,y2))/h;
    //             jacboitmp[2] = (funct(x1,y1,x2+h,y2) - funct(x1,y1,x2,y2))/h;
    //             jacboitmp[3] = (funct(x1,y1,x2,y2+h) - funct(x1,y1,x2,y2))/h;
    //             return jacboitmp;
    //         }
    //    this.jacobidbl = function(x1,y1,x2,y2,funct) {
    //             jacboitmp2[0] = (jacobi(x1+h,y1,x2,y2,funct) - jacobi(x1,y1,x2,y2,funct))/h;
    //             jacboitmp2[1] = (jacobi(x1,y1+h,x2,y2,funct) - jacobi(x1,y1,x2,y2,funct))/h;
    //             jacboitmp2[2] = (jacobi(x1,y1,x2+h,y2,funct) - jacobi(x1,y1,x2,y2,funct))/h;
    //             jacboitmp2[3] = (jacobi(x1,y1,x2,y2+h,funct) - jacobi(x1,y1,x2,y2,funct))/h;
    //             return jacboitmp2;
    //         }
}

function Ball() {
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.constraints = new Array();
    this.isDragged = false;
    this.accx = 0;
    this.accy = 0;
    this.draw = function(ctx) {
             ctx.fillStyle="#FF0000";
             //    ctx.fillRect(0,y,50,50);
             ctx.beginPath();
             ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
             ctx.closePath();
             ctx.fill();
         }
    this.resetForces = function() {
             this.accx = 0;
             this.accy = 0;
         }
    this.calculateForces = function() {
             this.accy += grav;
//             this.accx = this.accx - this.velx * 0.1;
//             this.accy = this.accy - this.vely * 0.1;
         }

    this.advance = function(dt) {
             if(!this.isDragged) {
                 if(this.y > 400) {
                     this.vely = - this.vely;
                     this.y = 400;
                 }
                 this.velx = this.velx + this.accx * dt;
                 this.vely = this.vely + this.accy * dt;
                 this.x = this.x + this.velx * dt;
                 this.y = this.y + this.vely * dt;
             }
         }
    this.isClicked = function(x,y) {
             var diffx = x - this.x;
             var diffy = y - this.y;
             var distance = Math.sqrt(diffx*diffx + diffy*diffy);
             if(distance < 30)
                 return true;
             else
                 return false;
         }
}

window.onload = function(){
            canvas = document.getElementById("myCanvas");
            ctx = canvas.getContext("2d");
            // Set up mouse data
            canvas.addEventListener("mousemove",canvasMouseMove);
            canvas.addEventListener("mousedown",canvasMouseDown);
            canvas.addEventListener("mouseup",canvasMouseUp);
            
            // Add items to scene
            marker = new Ball();
            marker.x = 0;
            marker.y = 0;
            objects.push(marker);
            // initialize stage
            var ball = new Ball();
            ball.x = 200;
            ball.y = 0;
            ball.vely = 0;
            ball.velx = 0;
            objects.push(ball);
            var ball2 = new Ball();
            ball2.x = 90;
            ball2.y = 180;
            ball2.vely = 0;
            ball2.velx = 0;
            objects.push(ball2);

            var constraint = new Constraint();
            constraint.target1 = marker;
            constraint.target2 = ball;
            constraint.distance = 200;
            constraint.calculateVector();
            //            constraint.target1Sticky = true;
            constraints.push(constraint);

            //            var constraint2 = new Constraint();
            //            constraint2.target1 = ball;
            //            constraint2.target2 = ball2;
            //            constraint2.distance = 80;
            //            constraint2.calculateVector();
            //            constraints.push(constraint2);
            // start animations
            animate();
        };

function animate(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    var dt = 0.01;
    var object;
    var i;
    // reset and calculate forces
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.resetForces();
        object.calculateForces();
    }
    // calculate constraint forces
    for(i in constraints) {
        var constraint = constraints[i];
        var vel1x = constraint.target1.velx;
        var vel1y = constraint.target1.vely;
        var vel2x = constraint.target2.velx;
        var vel2y = constraint.target2.vely;
        var pos1x = constraint.target1.x;
        var pos1y = constraint.target1.y;
        var pos2x = constraint.target2.x;
        var pos2y = constraint.target2.y;
        var diffx = pos1x - pos2x;
        var diffy = pos1y - pos2y;
        var distsquared = diffx*diffx + diffy*diffy;
        var dist = Math.sqrt(distsquared);
        var force = -(vel1x*vel1x + vel1y*vel1y - vel2x*vel2x - vel2y*vel2y) / (distsquared);
        var forcex = 0;
        var forcey = 0;
        if(dist != 0) {
            forcex = force*diffx;
            forcey = force*diffy;
        }
//        var force = (- (constraint.target1.accx * pos1x + constraint.target1.accy * pos1y) - (vel1x * vel1x + vel1y * vel1y)) / (pos1x * pos1x + pos1y*pos1y);
//        force -= 0.1 * (pos1x * pos1x + pos1y * pos1y - 10000);
//        force -= 0.1 * (1/2 * (vel1x * pos1x + vel1y * pos1y));
//        var forcex = pos1x * force;
//        var forcey = pos1y * force;
        var offset = dist - constraint.distance;
        var springf = 100* offset;
//        forcex += -springf * diffx / dist;
//        forcey += -springf * diffy / dist;
        constraint.target1.accx += forcex;
        constraint.target1.accy += forcey;
        constraint.target2.accx -= forcex;
        constraint.target2.accy -= forcey;
    }
    // advance ahead
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.advance(dt);
    }

    // clear
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle="#00FF00";
    //    ctx.fillRect(0,y,50,50);
    ctx.beginPath();
    ctx.arc(0, 0, 200, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    // draw
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.draw(ctx);
    }
    marker.draw(ctx);

    // request new frame
    requestAnimFrame(function(){
                         animate();
                     });
    frame++;
}

window.requestAnimFrame = (function(callback){
                               return window.requestAnimationFrame ||
                                       window.webkitRequestAnimationFrame ||
                                       window.mozRequestAnimationFrame ||
                                       window.oRequestAnimationFrame ||
                                       window.msRequestAnimationFrame ||
                                       function(callback){
                                   window.setTimeout(callback, 1000 / 100);
                               };
                           })();

var isDragging = 0;

function canvasMouseMove(e) {
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    if(isDragging != 0) {
        isDragging.x = x;
        isDragging.y = y;
        isDragging.velx = 0;
        isDragging.vely = 0;
    }
}

function canvasMouseUp(e) {
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    isDragging.isDragged = false;
    isDragging = 0;
}

function canvasMouseDown(e) {
    getCursorPosition(e);
    var x = mousePos[0];
    var y = mousePos[1];
    for(var i in objects) {
        var object = objects[i];
        console.log(object.x);
        if(object.isClicked(x,y)) {
            isDragging = object;
            object.isDragged = true;
        }
    }
}

var mousePos = new Array();
function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    mousePos[0] = x;
    mousePos[1] = y;
}
