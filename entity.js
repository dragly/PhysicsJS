

function Entity() {
    this.simulator = 0;
    this.ctx = 0;
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.accx = 0;
    this.accy = 0;
    this.constraints = new Array();
    this.isDragged = false;
    this.accx = 0;
    this.accy = 0;
}

Entity.prototype.init = function(simulator) {
            this.simulator = simulator;
            this.ctx = simulator.ctx;
        }

Entity.prototype.draw = function() {
            this.ctx.fillStyle="rgba(0,200,100,1)";
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
Entity.prototype.resetForces = function() {
            this.accx = 0;
            this.accy = 0;
        }

Entity.prototype.calculateForces = function() {

        }

Entity.prototype.isClicked = function(x,y) {
            var diffx = x - this.x;
            var diffy = y - this.y;
            var distance = Math.sqrt(diffx*diffx + diffy*diffy);
            if(distance < 10)
                return true;
            else
                return false;
        }
