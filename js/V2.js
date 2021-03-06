/** @author William J.D. **/

/*
HTML5 base code
Copyright (C) 2012 William James Dyce

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* 
A simple 2D Vector class, with accessors and mutators to ensure that the cached
norm value is only updated when needed, but is always correct when required.
*/

/// CLASS ATTRIBUTES/FUNCTION
V2.ORIGIN = new V2(0, 0);

/// INSTANCE ATTRIBUTES/METHODS
function V2(init_x, init_y)
{
  /* ATTRIBUTES 
    var a = x; 
  */
  
  // receiver 
  var obj = this, typ = V2;
  
  // true attributes
  var x, y, 		// real: coordinates
      norm; 		// real: the length of the vector, cached for speed
  
  /* SUBROUTINES 
  var f = function(p1, ... ) { } 
  */
  
  var recalculateNorm = function()
  {
    // value is cached to avoid calculating too many inverses and square-roots
    norm = (x == 0) ? Math.abs(y) 
		    : ((y == 0) ? Math.abs(x) : Math.sqrt(x*x + y*y));
  }
    
    
  /* METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  // getters
  obj.x = function() { return x; }
  obj.y = function() { return y; }
  
  obj.norm = function()
  {
    if(norm < 0)
      recalculateNorm();
    return norm;
  }
  
  obj.norm2 = function()
  {
    if(norm < 0)
      return (x*x + y*y);
    else
      return (norm*norm);
  }
  
  // setters
  obj.setXY = function(new_x, new_y)
  {
    x = new_x;
    y = new_y;
    norm = -1.0;
    return obj;
  }
  obj.setX = function(new_x)
  {
    obj.setXY(new_x, y);
    return obj;
  }
  obj.setY = function(new_y)
  {
    obj.setXY(x, new_y);
    return obj;
  }
  obj.fromV2 = function(v)
  {
    obj.setXY(v.x(), v.y());
    return obj;
  }
  obj.setFromTo = function(v, w)
  {
    if(v.x() == w.x() && v.y() == w.y())
      obj.setXY(Math.random(), Math.random());
    else
      obj.setXY(w.x()-v.x(), w.y()-v.y());
    return obj;
  }
  
  obj.setNorm = function(new_norm)
  {
    if(new_norm <= 0.0)
      x = y = norm = 0.0;
    else
    {
      obj.normalise();
      x *= new_norm;
      y *= new_norm;
      norm = new_norm;
    }
    return obj;
  }
  
  // modification
  obj.floor = function()
  {
    x = Math.floor(x);
    y = Math.floor(y);
    return obj;
  }
  
  obj.ninety_left = function()
  {
    obj.setXY(y, -x);
    return obj;
  }
  obj.ninety_right = function()
  {
    obj.setXY(-y, x);
    return obj;
  }
  
  obj.addX = function(amount)
  {
    obj.setXY(x + amount, y);
    return obj;
  }
  obj.addY = function(amount)
  {
    obj.setXY(x, y + amount);
    return obj;
  }
  obj.addXY = function(amount_x, amount_y)
  {
    obj.setXY(x + amount_x, y + amount_y);
    return obj;
  }
  obj.addV2 = function(v)
  {
    obj.setXY(x + v.x(), y + v.y());
    return obj;
  }
  obj.subV2 = function(v)
  {
    obj.setXY(x - v.x(), y - v.y());
    return obj;
  }  
  obj.scale = function(amount)
  {
    x *= amount;
    y *= amount;
    norm *= amount;
    return obj;
  }
  
  obj.addNorm = function(amount)
  {
    obj.setNorm(norm + amount);
    return obj;
  }
  
  obj.normalise = function()
  {
    if(norm == 0)
      return;
    else if(norm < 0)
      recalculateNorm();
    
    var norm_inv = 1.0 / norm;
    x *= norm_inv;
    y *= norm_inv;
    
    var old_norm = norm;
    norm = norm_inv = 1.0;
    angle_up_to_date = false;
    
    return old_norm;
  }
  
  obj.addAngle = function(theta)
  {
    var cos_theta = Math.cos(theta),
	sin_theta = Math.sin(theta);
    obj.setXY(x*cos_theta - y*sin_theta, x*sin_theta + y*cos_theta);
    return obj;
  }
  
  // get a scaled copy of the vector
  obj.scalecpy = function(amount)
  {
    return (new V2()).fromV2(obj).scale(amount);
  }
  
  // mathematics
  obj.dot = function(v)
  {
    return x*v.x() + y*v.y;
  } 
  obj.det = function(v)
  {
    return x*v.y() - y*v.x();
  }
  obj.dist2 = function(v)
  {
    var dx = v.x()-x, dy = v.y()-y;
    return dx*dx + dy*dy;
  }
  obj.coline = function(v)
  {
    // cosine of 0 is 1, so v1 and v2 are colinear if v1.v2 = 1*|v1|*|v2|
    return (obj.dot(v) == obj.norm()*v.norm());
  }
  
  // printing, for debugging
  obj.toString = function()
  {
    return ('(' + x + ',' + y + ')');
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  x = (init_x || 0.0);
  y = (init_y || 0.0);
  norm = -1.0;
  return obj;
}