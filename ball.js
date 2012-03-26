var frame = 0;
var grav = 100;
var k = 100;
var drawForces = true;


var h = 0.01;
var springDamp = 0.00001;

ForceType = {
    Smooth: "smooth",
    Rigid: "rigid",
    LennardJones: "LennardJones",
    Springs: "springs"
}

var forceType = ForceType.Springs;

// potential
// TODO Use squared distances / loose the sqrt
// TODO Add energy by clicking on nothing

var potscale = 7;

var falloff = 500;
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

function Ball(simulator) {
    this.init(simulator);
    this.fillStyle = "rgba(255,0,0,1)";
}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
            this.ctx.fillStyle=this.fillStyle;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 5, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }

Ball.prototype.calculateForces = function() {
            this.accy += grav;
            // damping
            this.accx = this.accx - this.velx * 1;
            this.accy = this.accy - this.vely * 1;
            if(this.y > this.ctx.canvas.height - 10) {
                this.vely = -this.vely;
                this.y = this.ctx.canvas.height - 10;
            }
            if(this.x > this.ctx.canvas.width - 10) {
                this.velx = -this.velx;
                this.x = this.ctx.canvas.width - 10;
            }
            if(this.x < 10) {
                this.velx = -this.velx;
                this.x = 10;
            }
            if(this.y < 10) {
                this.vely = -this.vely;
                this.y = 10;
            }
            for(i in this.simulator.objects) {
                var object = this.simulator.objects[i];
                if(object !== this) {
                    var diffx = this.x - object.x;
                    var diffy = this.y - object.y;
                    var distsquared = diffx * diffx + diffy*diffy
                    var distance = -1;
                    var force = 0;
                    if(forceType === ForceType.Smooth) {
                        if(distsquared < 40000) {
                            distance = Math.sqrt(distsquared);
                            force = potscale * invfactor / (distsquared*distsquared) *(distsqfactor*distsquared - distfactor* distance + corestrength);
                            if(force > 500) {
                                force = 500;
                            }

                            this.accx += force * diffx / distance;
                            this.accy += force * diffy / distance;
                        }
                    } else if(forceType === ForceType.Rigid) {
                        var repulsion = 5000;
                        var attraction = 3;
                        if(distsquared < 300*300) {
                            distance = Math.sqrt(distsquared);
                            if(distance < 0.5) {
                                force = repulsion/0.5;
                            } else if(distance < 60) {
                                force = repulsion;
                            } else if(distance < 90) {
                                if(drawForces) {
                                    this.ctx.strokeStyle = "rgba(100,100,100,1)";
                                    this.ctx.beginPath();
                                    this.ctx.moveTo(this.x, this.y);
                                    this.ctx.lineTo(object.x, object.y);
                                    this.ctx.stroke();
                                }
                                force = -attraction*distsquared;
                            } else if(distance < 300) {
                                force = 100;
                            }
                            this.accx += force * diffx / distance;
                            this.accy += force * diffy / distance;
                        }

                    } else if(forceType === ForceType.LennardJones) {
                        var attraction = 10;
                        if(distsquared < 200*200) {
                            distance = Math.sqrt(distsquared);
                            if(distance < 100) {
                                force = 6e8/(distsquared*distsquared*distsquared*distsquared*distsquared*distsquared) - 1/(distsquared*distsquared*distsquared);
                                force *= 1e13;
                                if(Math.abs(force) > 100000) {
                                    force = force / Math.abs(force) * 100000;
                                }
                            } else if(distance < 200) {
                                force = 10000 / distance;
                            }
                            this.accx += force * diffx / distance;
                            this.accy += force * diffy / distance;
                        }
                    } else if(forceType === ForceType.Springs) {
                        var equilibrium = 30;
                        var springconstant = 3000;
                        if(distsquared < (equilibrium*1.25)*(equilibrium*1.25)) { // enable springs close to equilibrium
                            this.ctx.strokeStyle = "rgba(100,100,100,1)";
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.x, this.y);
                            this.ctx.lineTo(object.x, object.y);
                            this.ctx.stroke();
                            distance = Math.sqrt(distsquared);
                            var displacement = distance - equilibrium;
                            if(distance < equilibrium * 0.7) { // avoid getting stuck in the middle
                                force = - 2*springconstant   * displacement;
                            } else {
                                force = - springconstant * displacement;
                            }

                            force += 1e4/(distsquared*distsquared*distsquared);
                            this.accx += force * diffx / distance;
                            this.accy += force * diffy / distance;
                        }
                    }
                }
            }
        }

