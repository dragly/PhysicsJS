/*
    Copyright 2012 Svenn-Arne Dragly

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function ExSimulator() {
}

ExSimulator.prototype = new Simulator();
ExSimulator.prototype.constructor = ExSimulator;

var l = 300;
var omega = 1;
var phi0 = Math.PI/2 - 0.01;

ExSimulator.prototype.animate = function() {
            // clear
            this.ctx.fillStyle = "rgba(255,255,255,0.8)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            var m = 4;
            var M = 10;
            var g = 800;

            this.t += this.dt;

            var phi = this.phi;
            var s = this.s;
            var vels = this.vels;
            var velphi = this.velphi;
            var t = this.t;

            // calculate the forces
//            this.accphi = (-2*m*velphi*vels - g*velphi*Math.cos(phi))/s;
//            this.accphi = -(M+m)*g*phi/((M+2*m)*l);
            this.accs = velphi*velphi*s - g*Math.sin(phi);
//            this.accx = -m*l*this.accphi/(M+m);
//            console.log(this.accphi + " " + this.accphi2);
            this.vels += this.accs * this.dt;
//            this.velphi += this.accphi * this.dt;

            this.s += this.vels * this.dt;
            var c1 = (l/2 + g/(4*(omega*omega)) * (Math.cos(phi0) - Math.sin(phi0)));
            var c2 = (l/2 - g/(4*(omega*omega)) * (Math.cos(phi0) + Math.sin(phi0)));
            var s2 = c1 * Math.exp(omega*t) + c2 * Math.exp(-omega*t) + g/(2*omega*omega)*Math.sin(phi0 - omega*t);
//            this.s = s2;
            this.phi += this.velphi * this.dt;
//            this.phi = phi0 - omega*t;

            if(this.s < 0) {
                this.s = 0;
            }
            if(this.phi < 0) {
                this.phi = 0;
                this.velphi = 0;
            }

            // drawing positions
            var cartx = 400-(this.s+50)*Math.cos(phi);
            var carty = (this.s+50)*Math.sin(phi);

            var ballx = 400 - 300*Math.cos(phi);
            var bally = 300*Math.sin(phi);

            var diff = Math.round((this.s - s2)*100)/100;
            this.ctx.fillStyle="rgba(0,0,0,1)";
            this.ctx.fillText("s: " + Math.round(cartx) + "," + Math.round(carty), 10,10);
            this.ctx.fillText("Diff: " + diff, 10,40);

            // draw cart
            this.ctx.fillStyle="rgba(0,200,100,1)";
            this.ctx.strokeStyle="rgba(0,200,100,1)";
            this.ctx.save();
            this.ctx.translate(cartx,this.canvas.height - carty);
            this.ctx.rotate(phi);
            this.ctx.fillRect(0, -50, 100, 50);
            this.ctx.restore();
            // draw pole
            this.ctx.beginPath();
            this.ctx.moveTo(400, this.canvas.height - (0));
            this.ctx.lineTo(ballx, this.canvas.height - (bally));
            this.ctx.stroke();
            // draw ball
            this.ctx.beginPath();
            this.ctx.arc(ballx, this.canvas.height - bally, 10, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();


            this.requestAnimFrame();
        }

window.onload = function(){

            simulator = new ExSimulator();
            simulator.init();

            simulator.t = 0;

            simulator.dt = 0.005;

            simulator.s = l;
            simulator.phi = phi0;
            simulator.vels = 0;
            simulator.velphi = -omega;
            simulator.animate();
        };
