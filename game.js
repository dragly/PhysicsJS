var frame = 0;
var grav = 500;
var marker;
var k = 10000;

var objects = new Array();

function Ball() {
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.constraint = 0;
    this.constraintDistance = 0;
    this.draw = function(ctx) {
             ctx.fillStyle="#FF0000";
             //    ctx.fillRect(0,y,50,50);
             ctx.beginPath();
             ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
             ctx.closePath();
             ctx.fill();
         }
}

window.onload = function(){
            marker = new Ball();
            marker.x = 50;
            marker.y = 100;
            // initialize stage
            var ball = new Ball();
            ball.x = 90;
            ball.y = 100;
            ball.vely = 0;
            ball.velx = 0;
            ball.constraint = marker;
            ball.constraintDistance = 40;
            objects.push(ball);
            var ball2 = new Ball();
            ball2.x = 90;
            ball2.y = 180;
            ball2.vely = 0;
            ball2.velx = 0;
            ball2.constraint = ball;
            ball2.constraintDistance = 80;
            objects.push(ball2);
            // start animations
            animate();
        };

function animate(){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var dt = 0.01;
    var object;
    var i;
    // update
    for(i = 0; i < objects.length; i++) {
        object = objects[i];
        var diffx = object.x - object.constraint.x;
        var diffy = object.y - object.constraint.y;
        var length = Math.sqrt(diffx*diffx + diffy*diffy);
        var displacement = length - object.constraintDistance;
//        console.log(displacement);
        var springx = diffx / length;
        var springy = diffy / length;
        var accx = - k * displacement * springx;
        var accy = grav - (k * displacement * springy);
        accx = accx - object.velx * 0.1;
        accy = accy - object.vely * 0.1;
        object.velx = object.velx + accx * dt;
        object.vely = object.vely + accy * dt;
        object.x = object.x + object.velx * dt;
        object.y = object.y + object.vely * dt;
        if(object.y > 400) {
            object.y = 400;
            object.vely = -object.vely;
        }
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
