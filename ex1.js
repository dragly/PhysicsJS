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

ExSimulator.prototype.animate = function() {
            // clear
            this.ctx.fillStyle = "rgba(255,255,255,0.8)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            var m = 4;
            var M = 10;
            var g = 800;
            var l = 100;

            var phi = this.phi;
            var x = this.x;
            var velx = this.velx;
            var velphi = this.velphi;

            this.t += this.dt;

            // calculate the forces
            this.accphi = (-(M+m)*g*Math.sin(phi) - m*velphi*velphi*l*Math.cos(phi)*Math.sin(phi))/(l*(M+m) + l*m*(Math.cos(phi)*Math.cos(phi)));
//            this.accphi = -(M+m)*g*phi/((M+2*m)*l);
            this.accx = (m*velphi*velphi*l*Math.sin(phi) - m*this.accphi*l*Math.cos(phi))/(M+m);
//            this.accx = -m*l*this.accphi/(M+m);
//            console.log(this.accphi + " " + this.accphi2);
            this.velx += this.accx * this.dt;
            this.velphi += this.accphi * this.dt;

            var omega = Math.sqrt(((M+m)*g)/(l*(M+2*m)));
            var t = this.t;

            this.x += this.velx * this.dt;
            this.x2 = (-l*m*0.1/(M+m))*(Math.cos(omega*t) - Math.cos(0) + Math.sin(0)*(t - 0)) + 40*(t - 0) + 100;
            var diff = Math.round((this.x - this.x2)*100)/100;
            this.ctx.fillStyle="rgba(0,0,0,1)";
            this.ctx.fillText("Diff: " + diff, 10,10);
            this.phi += this.velphi * this.dt;

            if(this.x > this.canvas.width) {
                this.x = 0;
            }

            // drawing positions
            var cartx = this.x;
            var carty = 200-150;

            var ballx = this.x + Math.sin(phi) * l;
            var bally = 200 - Math.cos(phi) * l;

            // draw cart
            this.ctx.fillStyle="rgba(0,200,100,1)";
            this.ctx.strokeStyle="rgba(0,200,100,1)";
            this.ctx.fillRect(cartx - 50, this.canvas.height - carty - 25, 100, 50);
            // draw wheels
            this.ctx.beginPath();
            this.ctx.arc(cartx - 25, this.canvas.height - (carty - 40), 10, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cartx + 25, this.canvas.height - (carty - 40), 10, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
            // draw pole
            this.ctx.beginPath();
            this.ctx.moveTo(cartx, this.canvas.height - (carty));
            this.ctx.lineTo(cartx, this.canvas.height - (carty + 150));
            this.ctx.lineTo(ballx, this.canvas.height - (bally));
//            this.ctx.closePath();
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

            simulator.x = 100;
            simulator.phi = 0.1;
            simulator.velx = 40;
            simulator.velphi = 0.;
            simulator.animate();
        };
