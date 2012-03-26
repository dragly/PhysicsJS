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

window.onload = function(){
            simulator = new Simulator();
            simulator.init();
            for(var i = 0; i < 20; i++) {
                var ball = new Ball(simulator);
                ball.x = Math.floor(Math.random()*simulator.ctx.canvas.width);
                ball.y = Math.floor(Math.random()*simulator.ctx.canvas.height);
                ball.fillStyle = "rgba(" + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + "," + Math.floor(100 + Math.random()*150) + ",1)";
                simulator.objects.push(ball);
            }
            simulator.animate();
        };
