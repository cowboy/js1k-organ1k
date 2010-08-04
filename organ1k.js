/*
 * Organ1k: JS1k contest entry - 8/04/2010
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
    x_mid,
    y_mid,
    max_radius,
    tmp,
    tmp2,
    deg,
    x,
    y,
    r,
    a,
    i,
    remnant_min_size,
    remnant_max_size,
    current,
    remnant_current,
    math_mode,
    dir,
    cycle_speed,
    delay_speed,
    last_n,/*! << REMOVE, ALSO REMOVE FOLLOWING COMMA >> */
    
    // Keep the following var declarations.
    W = this,
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
    pow = M.pow,
    rnd = M.random,
    
    //num_items = 32,
    //max_remnants = 300,
    
    remnant_colors = 'f001fa01ff0107010ff100f14081e8e'.split(1),
    
    items = [],
    remnants = [];
    
    current = remnant_current = math_mode = last_n = s.margin = 0;
    dir = cycle_speed = delay_speed = 1;
    remnant_min_size = 3;
    remnant_max_size = 8;

s.overflow = 'hidden';

// "int main(void)"
si(function(){
  // Set these values in each iteration to allow the window to be resized.
  w = C.width = W.innerWidth;
  h = C.height = W.innerHeight;
  max_radius = min( x_mid = w / 2, y_mid = h / 2 ) - ( remnant_max_size * 2 );
  
  // Update items.
  //for ( i = 0; i <= num_items; i++ ) {
  for ( i = 0; i < 33; i++ ) {
    tmp = items[i] || ( items[i] = {
      x: x_mid,
      y: y_mid
    } );
    
    if ( i ) {
      tmp2 = items[ i - 1 ];
      tmp.x += ( tmp2.x - tmp.x ) / ( delay_speed + 1 );
      tmp.y += ( tmp2.y - tmp.y ) / ( delay_speed + 1 );
    }
  }
  
  // Do some math!
  if ( math_mode <= 1 ) {
    // Circle.
    current -= cycle_speed * dir * 4;
    
    x = sin( deg = current * pi_over_180 ) * max_radius;
    y = cos( deg ) * max_radius;
    
  } else {
    // Spiro.
    current -= cycle_speed * dir * 2;
    
    x = sin( deg = current * pi_over_180 ) * max_radius;
    
    r = M.sqrt( pow( x, 2 ) + pow( y = 0, 2 ) );
    a = M.atan2( y, x ) + ( deg / math_mode );// [ 2, -5, 1.5, 7, 4 ][ ~~math_mode - 1 ] );
    
    x = r * cos( a );
    y = r * sin( a );
  }
  
  items[0].x = x_mid + x;
  items[0].y = y_mid + y;
  
  //for ( i = 0, len = remnant_colors.length; i < len; i++ ) {
  //  tmp = items[ ~~( num_items / ( len - 1 ) * i ) ];
  for ( i = 0; i < 8; i++ ) {
    tmp = items[ 4 * i ];
    
    //remnants[ remnant_current++ % max_remnants ] = {
    remnants[ remnant_current++ % 300 ] = {
      s: 1,
      d: 1,
      c: remnant_colors[i],
      x: tmp.x,
      y: tmp.y
    };
  }
  
  // BG fill
  c.fillRect( i = 0, 0, w, h );
  
  // Draw "circle" remnants.
  while ( tmp = remnants[i++] ) {
    
    // Pulse the circle.
    tmp.s += tmp.d;
    tmp.d = tmp.s >= remnant_max_size ? -1
          : tmp.s <= remnant_min_size ? 1
          : tmp.d;
    
    // Draw the circle.
    c.fillStyle = '#' + tmp.c;
    c.beginPath();
    c.arc( tmp.x, tmp.y, tmp.s, 0, pi * 2, false );
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
    remnant_colors.push( remnant_colors.shift() );
    
  } else if ( n < 3 ) {
    // Change the overall pattern / shape.
    math_mode = r1 * 7;
    
  } else if ( n < 4 ) {
    // Change the rotational velocity.
    cycle_speed = r1 * 8 + 1;
    
  } else if ( n < 5 ) {
    // Change the "tightness".
    delay_speed = r1 * 3;
    
  } else {
    // Change remnant pulse sizes.
    remnant_max_size = r1 * 10 + 6;
    remnant_min_size = min( remnant_max_size - 4, rnd() * 5 + 2 );
  }
  
}, 1024) // "tounge in cheek"
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
    'remnant_max_size : ' + parseInt( remnant_max_size * 100 ) / 100,
    'remnant_min_size : ' + parseInt( remnant_min_size * 100 ) / 100
  ].join('<br>');
}, 15);

*/

})();/*! << REMOVE */
