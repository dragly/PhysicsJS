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
            this.ctx.arc(this.x, this.ctx.canvas.height - this.y, 10, 0, Math.PI*2, true);
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
