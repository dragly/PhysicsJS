var simulator;

window.onload = function(){
            simulator = new Simulator();
            for(var i = 0; i < 20; i++) {
                var ball = new Ball(simulator);
                ball.x = Math.floor(Math.random()*simulator.ctx.canvas.width);
                ball.y = Math.floor(Math.random()*simulator.ctx.canvas.height);
                ball.fillStyle = "rgba(" + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + ",1)";
                simulator.objects.push(ball);
                ball.resetForces();
            }
        };

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

function Simulator() {
    this.dt = 0.005;
    this.objects = new Array();
    this.mousePos = new Array();
    this.a = 10;
    this.isDragging = 0;

    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    // Set up mouse data
    this.canvas.addEventListener("mousemove",this.canvasMouseMove);
    this.canvas.addEventListener("mousedown",this.canvasMouseDown);
    this.canvas.addEventListener("mouseup",this.canvasMouseUp);

    // Add items to scene
    //            objects.push(marker);
    // initialize stage

    this.animate();
}

Simulator.prototype.animate = function() {
            var object;
            var i;
            // clear
            this.ctx.fillStyle = "rgba(0,0,0,0.8)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // Reset forces
            for(i = 0; i < this.objects.length; i++) {
                object = this.objects[i];
                object.resetForces();
            }
            // calculate forces
            for(i = 0; i < this.objects.length; i++) {
                object = this.objects[i];
                object.calculateForces();
            }
            // advance
            for(i = 0; i < this.objects.length; i++) {
                object = this.objects[i];
                if(!object.isDragged) {
                    object.velx = object.velx + object.accx * this.dt;
                    object.vely = object.vely + object.accy * this.dt;
                    object.x = object.x + object.velx * this.dt;
                    object.y = object.y + object.vely * this.dt;
                }
            }

            // draw
            for(i = 0; i < this.objects.length; i++) {
                object = this.objects[i];
                object.draw();
            }

            // request new frame
            window.requestAnimFrame(function(){
                                        simulator.animate();
                                    });
        }

// TODO Figure out why mouse events cannot access simulator through this-pointer...

Simulator.prototype.canvasMouseMove = function(e) {
            simulator.getCursorPosition(e);
            var x = simulator.mousePos[0];
            var y = simulator.mousePos[1];
            if(simulator.isDragging !== 0) {
                simulator.isDragging.x = x;
                simulator.isDragging.y = y;
                simulator.isDragging.velx = 0;
                simulator.isDragging.vely = 0;
            }
        }

Simulator.prototype.canvasMouseUp = function(e) {
            simulator.getCursorPosition(e);
            var x = simulator.mousePos[0];
            var y = simulator.mousePos[1];
            simulator.isDragging.isDragged = false;
            simulator.isDragging = 0;
        }

Simulator.prototype.canvasMouseDown = function(e) {
            simulator.getCursorPosition(e);
            var x = simulator.mousePos[0];
            var y = simulator.mousePos[1];
            var hasDrag = false;
            for(var i in simulator.objects) {
                var object = simulator.objects[i];
                if(object.isClicked(x,y) && !hasDrag) {
                    simulator.isDragging = object;
                    object.isDragged = true;
                    hasDrag= true;
                }
            }
            if(!hasDrag) {
                var ball = new Ball(simulator);
                ball.x = x;
                ball.y = y;
                ball.fillStyle = "rgba(" + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + ",1)";
                simulator.objects.push(ball);
            }
        }

Simulator.prototype.getCursorPosition = function(e) {
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
            x -= simulator.canvas.offsetLeft;
            y -= simulator.canvas.offsetTop;

            simulator.mousePos[0] = x;
            simulator.mousePos[1] = y;
        }

