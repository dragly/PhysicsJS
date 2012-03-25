var frame = 0;
var grav = 80;
var marker;
var k = 100;

var canvas;
var ctx;

var objects = new Array();
var constraints = new Array();

var h = 0.01;
var dt = 0.001;
var springDamp = 0.00001;

// potential
// TODO Use squared distances / loose the sqrt
// TODO Add energy by clicking on nothing

var potscale = 7;

var falloff = 1000;
var eqmin = 30;
var eqmax = 80;

// y = e^(-ax) ( bx^2 - cx + d)

// a
var invfactor = 0.000001*falloff*falloff*falloff*falloff;
// d
var corestrength = 1500;
// c
var distfactor = corestrength * (eqmax*eqmax - eqmin * eqmin) / (eqmin*eqmax*eqmax - eqmax * eqmin * eqmin);
// b
var distsqfactor = (distfactor * eqmin - corestrength) / (eqmin*eqmin);

console.log("(" + invfactor + "/x^4)(" + distsqfactor + "x^2 - " + distfactor + "x + " + corestrength + " )");

function Ball() {
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.fillStyle = "rgba(255,0,0,1)";
    this.constraints = new Array();
    this.isDragged = false;
    this.draw = function(ctx) {
             ctx.fillStyle=this.fillStyle;
             //    ctx.fillRect(0,y,50,50);
             ctx.beginPath();
             ctx.arc(this.x, this.y, 5, 0, Math.PI*2, true);
             ctx.closePath();
             ctx.fill();
         }
    this.advance = function(dt) {
        if(!this.isDragged) {
            var accx = 0;
            var accy = 0;
            accy += grav;
            // damping
            accx = accx - this.velx * 0.2;
            accy = accy - this.vely * 0.2;
            if(this.y > ctx.canvas.height - 10) {
                this.vely = -this.vely;
                this.y = ctx.canvas.height - 10;
            }
            if(this.x > ctx.canvas.width - 10) {
                this.velx = -this.velx;
                this.x = ctx.canvas.width - 10;
            }
            if(this.x < 10) {
                this.velx = -this.velx;
                this.x = 10;
            }
            if(this.y < 10) {
                this.vely = -this.vely;
                this.y = 10;
            }
            for(i in objects) {
                var object = objects[i];
                if(object != this) {
                    var diffx = this.x - object.x;
                    var diffy = this.y - object.y;
                    var distsquared = diffx * diffx + diffy*diffy
                    if(distsquared < 40000) {
                        var distance = Math.sqrt(distsquared);
                        var force = potscale * invfactor / (distsquared*distsquared) *(distsqfactor*distsquared - distfactor* distance + corestrength);
                        if(force > 500) {
                            force = 500;
                        }

                        accx += force * diffx / distance;
                        accy += force * diffy / distance;
                    }
                }
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
        if(distance < 10)
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
//            objects.push(marker);
            // initialize stage
            for(var i = 0; i < 150; i++) {
                var ball = new Ball();
                ball.x = Math.floor(Math.random()*ctx.canvas.width);
                ball.y = Math.floor(Math.random()*ctx.canvas.height);
                ball.fillStyle = "rgba(" + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + ",1)";
                objects.push(ball);
            }
//            var ball2 = new Ball();
//            ball2.x = 90;
//            ball2.y = 180;
//            ball2.vely = 0;
//            ball2.velx = 0;
//            objects.push(ball2);

            // start animations
            animate();
        };

function animate(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    var object;
    var i;
    // update
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.advance(dt);
    }
    // fix constraints


    // clear
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        object.draw(ctx);
    }

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
    var hasDrag = false;
    for(var i in objects) {
        var object = objects[i];
        console.log(object.x);
        if(object.isClicked(x,y) && !hasDrag) {
            isDragging = object;
            object.isDragged = true;
            hasDrag= true;
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
