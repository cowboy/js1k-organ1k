/*
 * Organ1k: JS1k contest entry - 8/10/2010
 * http://benalman.com/code/projects/js1k-organ1k/organ1k.html
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// The code is in a closure with vars explicitly declared for minification
// purposes (I use YUI). After the code is minified, I remove the closure
// and any unnecessary var declarations, because they're not needed here.

/*! REMOVE >> */(function(){
var w,
    h,
    origin_x,
    origin_y,
    max_radius,
    tmp,
    tmp2,
    x,
    y,
    r,
    a,
    i,
    blip_min_size,
    blip_max_size,
    blip_scale,
    theta,
    blip_current,
    math_mode,
    dir,
    cycle_speed,
    delay_speed,
    last_n,/*! << REMOVE, ALSO REMOVE FOLLOWING COMMA >> */
    
    // Keep the following var declarations.
    d = document,
    si = setInterval,
    s = d.body.style,
    C = d.getElementById('c'),
    c = C.getContext('2d'),
    M = Math,
    pi = M.PI,
    pi_over_180 = pi / 180,
    min = M.min,
    sin = M.sin,
    cos = M.cos,
    rnd = M.random,
    
    num_colors = 8,
    num_items = 32,
    max_blips = 300,
    
    colors = 'f001fa01ff0107010ff100f14081e8e'.split(1),
    
    items = [],
    blips = [];
    
    blip_current = math_mode = last_n = s.margin = 0;
    cycle_speed = delay_speed = 2;
    blip_min_size = 3;
    blip_max_size = 8;
    theta = rnd() * 360;
    dir = rnd() < 0.5 ? 1 : -1;

s.overflow = 'hidden';

// "int main(void)"
si(function(){
  // Set these values in each iteration to allow the window to be resized.
  w = C.width = innerWidth;
  h = C.height = innerHeight;
  max_radius = min( origin_x = w / 2, origin_y = h / 2 );
  blip_scale = max_radius / 400;
  max_radius -= 20 * blip_scale;
  
  // Do some math!
  if ( math_mode <= 1 ) {
    // Circle.
    theta -= cycle_speed * dir * 4;
    
    x = sin( theta * pi_over_180 ) * max_radius;
    y = cos( theta * pi_over_180 ) * max_radius;
    
  } else {
    // Spiro.
    theta -= cycle_speed * dir * 2;
    
    r = M.abs( x = sin( theta * pi_over_180 ) * max_radius );
    a = M.atan2( 0, x ) + ( theta * pi_over_180 / math_mode );
    
    x = r * cos( a );
    y = r * sin( a );
  }
  
  // Update items.
  for ( i = 0; i < num_items; i++ ) {
    tmp = items[i] = items[i] || { x: 0, y: 0 };
    
    tmp2 = items[ i - 1 ];
    
    tmp.x = i ? tmp.x + ( tmp2.x - tmp.x ) / delay_speed : x;
    tmp.y = i ? tmp.y + ( tmp2.y - tmp.y ) / delay_speed : y;
  }
  
  // Add (or replace) new blips.
  for ( i = 0; i < num_colors; i++ ) {
    tmp = items[ ~~( i * ( num_items - 1 ) / ( num_colors - 1 ) ) ];
    
    blips[ blip_current++ % max_blips ] = {
      s: 1,
      d: 1,
      c: colors[i],
      x: tmp.x,
      y: tmp.y
    };
  }
  
  // BG fill
  c.fillRect( i = 0, 0, w, h );
  
  // Draw items
  /*
  for ( i = num_items; i; i-- ) {
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc( origin_x + items[i-1].x, origin_y + items[i-1].y, 5, 0, pi * 2, 0 );
    c.fill();
  }
  */
  
  // Draw blips.
  while ( tmp = blips[i++] ) {
    
    // Pulse the blip.
    tmp.s += tmp.d;
    tmp.d = tmp.s >= blip_max_size ? -1
          : tmp.s <= blip_min_size ? 1
          : tmp.d;
    
    // Draw the blip.
    c.fillStyle = '#' + tmp.c;
    c.beginPath();
    c.arc( origin_x + tmp.x, origin_y + tmp.y, tmp.s * blip_scale, 0, pi * 2, 0 );
    c.fill();
  }
  
}, 30);

// Automated random mode changer.
si(function( n, r1 ){ // define vars here to keep YUI from munging to aa, ab!
  
  // This random value drives most of the following modes.
  r1 = rnd();
  
  // Change a mode, as long as it's not the last mode changed.
  while ( last_n == ~~( n = rnd() * 6 ) ) {};
  last_n = ~~n;
  
  if ( n < 0.5 ) {
    // Change directions.
    dir = -dir;
    
  } else if ( n < 2 ) {
    // Cycle colors.
    colors.push( colors.shift() );
    
  } else if ( n < 3 ) {
    // Change the overall pattern / shape.
    math_mode = r1 * 7;
    
  } else if ( n < 4 ) {
    // Change the rotational velocity.
    cycle_speed = r1 * 8 + 1;
    
  } else if ( n < 5 ) {
    // Change the "tightness".
    delay_speed = r1 * 3 + 1;
    
  } else {
    // Change blip pulse sizes.
    blip_max_size = r1 * 10 + 6;
    blip_min_size = min( blip_max_size - 4, rnd() * 5 + 2 );
  }
  
}, 1024) // "tongue in cheek"
/*! REMOVE >> */

/*

var dbg = d.createElement('div');
d.body.appendChild(dbg);
dbg.style.position = 'absolute';
dbg.style.top = 0;
dbg.style.left = 0;
dbg.style.color = '#fff';

si(function(){
  dbg.innerHTML = [
    'dir : ' + dir,
    'math_mode : ' + parseInt( math_mode * 100 ) / 100,
    'cycle_speed : ' + parseInt( cycle_speed * 100 ) / 100,
    'delay_speed : ' + parseInt( delay_speed * 100 ) / 100,
    'blip_max_size : ' + parseInt( blip_max_size * 100 ) / 100,
    'blip_min_size : ' + parseInt( blip_min_size * 100 ) / 100
  ].join('<br>');
}, 15);

*/

})();/*! << REMOVE */
