var frame = 0;
var grav = 500;
var marker;
var k = 100;

var canvas;
var ctx;

var objects = new Array();
var constraints = new Array();

function Constraint() {
    this.target1 = 0;
    this.target2 = 0;
    this.target1Sticky = false;
    this.distance = 10;
    this.diffx = 0;
    this.diffy = 0;
    this.calculateVector = function() {
        this.diffx = this.target1.x - this.target2.x;
        this.diffy = this.target1.y - this.target2.y;
    }
}

function Ball() {
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.constraints = new Array();
    this.isDragged = false;
    this.draw = function(ctx) {
             ctx.fillStyle="#FF0000";
             //    ctx.fillRect(0,y,50,50);
             ctx.beginPath();
             ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
             ctx.closePath();
             ctx.fill();
         }
    this.advance = function(dt) {
        if(!this.isDragged) {
            var accx = 0;
            var accy = 0;
            accy += grav;
            accx = accx - this.velx * 0.1;
            accy = accy - this.vely * 0.1;
            if(this.y > 400) {
                accy = accy - 100*this.y;
            }
            this.velx = this.velx + accx * dt;
            this.vely = this.vely + accy * dt;
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
            marker.x = 50;
            marker.y = 100;
            objects.push(marker);
            // initialize stage
            var ball = new Ball();
            ball.x = 90;
            ball.y = 100;
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
            constraint.distance = 40;
            constraint.calculateVector();
//            constraint.target1Sticky = true;
            constraints.push(constraint);

            var constraint2 = new Constraint();
            constraint2.target1 = ball;
            constraint2.target2 = ball2;
            constraint2.distance = 80;
            constraint2.calculateVector();
            constraints.push(constraint2);
            // start animations
            animate();
        };

function animate(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    var dt = 0.01;
    var object;
    var i;
    // update
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.advance(dt);
    }
    // fix constraints
    var worstConstraint = 1;
    var mu = 2; // TODO calculate using mass
    var iteration = 0;
    while(worstConstraint > 10e-5 && iteration < 1000) {
        worstConstraint = 0;
        for(i = 0; i < constraints.length; i++) {
            var constraint = constraints[i];
            var diffx = constraint.target1.x - constraint.target2.x;
            var diffy = constraint.target1.y - constraint.target2.y;
            var distsq = diffx*diffx + diffy*diffy;
            var dist = Math.sqrt(distsq);
//            console.log(dist);
            var constForcex = (constraint.distance*constraint.distance - distsq)/(diffx * constraint.diffx + diffy*constraint.diffy) * diffx;
            var constForcey = (constraint.distance*constraint.distance - distsq)/(diffx * constraint.diffx + diffy*constraint.diffy) * diffy;
//            var constForcex = -0.1*k * (dist - constraint.distance) * diffx / dist;
//            var constForcey = -0.1*k * (dist - constraint.distance) * diffy / dist;
//            constraint.target1.velx = constraint.target1.velx - constForcex * dt;
//            constraint.target1.vely = constraint.target1.vely + constForcey * dt;
            if(!constraint.target1Sticky) {
                constraint.target1.x = constraint.target1.x + constForcex * dt;
                constraint.target1.y = constraint.target1.y + constForcey * dt;
            }
            constraint.target2.x = constraint.target2.x - constForcex * dt;
            constraint.target2.y = constraint.target2.y - constForcey * dt;
//            constraint.target1.x = constraint.target1.x + constraint.target1.velx * dt;
//            constraint.target1.y = constraint.target1.y + constraint.target1.vely * dt;
//            constraint.target2.x = constraint.target2.x + constraint.target2.velx * dt;
//            constraint.target2.y = constraint.target2.y + constraint.target2.vely * dt;
            if(Math.abs(Math.sqrt(distsq) - constraint.distance) > worstConstraint) {
                worstConstraint = Math.abs(Math.sqrt(distsq) - constraint.distance);
            }
        }
        iteration++;
    }

    // clear
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
