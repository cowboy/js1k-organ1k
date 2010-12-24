/*
 * Organ1k-Xmas: JS1k Xmas contest entry - 12/23/2010
 * http://benalman.com/code/projects/js1k-organ1k/organ1k.html
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Normally, you can signify to the JavaScript parser that an immediately
// invoked function is being defined as a function expression by wrapping it
// in parens. Since I don't care about the return value of the function, it
// can still be  invoked immediately, just as long as I prefix it with a unary
// operator, like ! ~ + -.
with(Math)with(a)!function(char_scale,txt,colors){
  /*
  // Passing a single var into the closure nets us two bytes of savings, but
  // since any more than that doesn't help, it's not worth doing for (cough)
  // readability concerns. Note that passing *all* variables into the closure
  // would net an additional 4 bytes, but that's not an option here, since
  // some of the vars are initialized based on other vars' values. It is an
  // option, however, in the function passed into setInterval further down.
  
  (function(){var a=document,b=Math,c=1;e()})()
  (function(a){var b=Math,c=1;e()})(document) // Two bytes saved.
  (function(a,b){var c=1;e()})(document,Math) // No additional byte savings.
  (function(a,b,c){e()})(document,Math,1)     // Not an option in this case.
  
  */
  var width,
      height,
      origin_x,
      origin_y,
      x,
      y,
      
      style = b.style,
      
      // 32 is not only the number of items, but close enough to fps (33) and
      // 1e3/fps (30) to be reused, saving a byte or two.
      thirty_two = 32, //fps = 33,
      
      // 360 is not only used for some of the math but is close enough to the
      // blip_scale divisor of 400 to be reused there as well, saving a byte.
      three_sixty = 360,
      
      /*
      // Since all Math methods are static, another variable can be set to
      // reference Math, allowing a compressor to munge that variable name down
      // to a single character, saving bytes. You can see that due to the
      // "a=Math," assignment adding 7 bytes but each "a" replacing "Math"
      // saving 3 bytes, when used three or more times, there's a net savings.
      
      // Before (minified + munged):
      a=Math.min,b=Math.sin,c=Math.cos
      
      // After (minified + munged):
      a=Math,b=a.min,c=a.sin,d=a.cos
      
      // Note that it's only worthwhile to do this for methods that will be
      // used enough times to justify the byte-cost of their assignment. For
      // example, becase the Math.min "min" method name is 3 characters long,
      // it would need to be used 3+ times to save bytes (2 times is a wash).
      // Because the Math.random "random" method name is 6 characters long,
      // using it just twice saves bytes.
      
      // Before (minified + munged):
      a.min();a.min();a.min()
      a.random();a.random()
      
      // After (minified + munged):
      b=a.min;b();b();b()
      b=a.random;b();b()
      
      // Also note that this only works for static methods. If the method is
      // an instance/prototyped method that uses `this` internally, you would
      // need to save bytes through strings and [] property access. First, the
      // invalid approach:
      
      // Before (minified + munged):
      a=document,x=a.getElementById('x'),y=a.getElementById('y')
      
      // After (minified + munged):
      a=document.getElementById,x=a('x'),y=a('y')  // Error!
      
      // This is a legitimate way to approach byte reduction in this scenario.
      // You don't see as large a byte savings, but it actually works, which
      // is a pretty huge plus.
      
      // Before (minified + munged):
      a=document,x=a.getElementById('x'),y=a.getElementById('y')
      
      // After (minified + munged):
      a=document,b='getElementById',x=a[b]('x'),y=a[b]('y')
      
      */
      
      // Now that I'm using `with(Math)`, the preceding comments are no longer
      // relevant... but they're still interesting!
      rnd = random,
      
      // Due to the way the math and circle drawing is done (and the
      // aforementioned three_sixty variable), it saves bytes to have a
      // reference to pi * 2 instead of just pi.
      pi2 = PI * 2,
      pi_over_180 = pi2 / three_sixty,
      
      frame = 0,
      blip_current = 0,
      math_mode = 0,
      last_n = 0,
      
      /*
      // Because assignment operators have right-to-left associativity, it can
      // save bytes to initializing multple variables simultaneously.
      
      // Before (minified + munged):
      a=obj,b=0;a.prop=0
      
      // After (minified + munged):
      a=obj,b=a.prop=0
      
      */
      color_idx = style.margin = 0,
      
      cycle_speed = 2,
      delay_speed = 2,
      
      blip_min_size = 3,
      blip_max_size = 6,
      
      since_moved = thirty_two, // fps,
      
      items = [],
      blips = [],
      
      /*
      // Due to the overhead in using quotes and commas in an array literal,
      // if that array has 6+ items, it saves bytes to split a string instead.
      // Note that two further bytes can be saved by joining/splitting the
      // string on a number.
      
      // Before (minified + munged):
      ['aa','bb','cc','dd','ee','ff']
      
      // After (minified + munged):
      'aa bb cc dd ee ff'.split(' ')
      
      // Joined/split on a number:
      'aa1bb1cc1dd1ee1ff'.split(1)
      
      // Also, if each item is a single character, splitting on '' saves bytes
      // if the array has 4+ items.
      
      // Before (minified + munged):
      ['a','b','c','d']
      
      // After (minified + munged):
      'abcd'.split('')
      
      */
      
      // These variables had to be removed due to byte considerations. While
      // hard-coding values is impractical from a readability/maintainance
      // standpoint, it can make the resulting code smaller.
      
      // num_items = 32,
      // num_colors = colors.length,
      
      theta = rnd(
        
        /*
        // While assigning a variable or invoking a function inside the parens
        // of a nullary function is ugly, it saves a byte, so I do it A LOT.
        // Also note that expressions passed as function arguments will be
        // evaluated before the function is invoked, so a(b=1) is equivalent to
        // b=1;a(), NOT a();b=1, just like a(b()) is equivalent to b();a(), NOT
        // a();b().
        
        // Before (minified + munged):
        b=1;a()
        b();a()
        
        // After (minified + munged):
        a(b=1)
        a(b())
        
        // Also note that this can be used, arguably, more legitimately to save
        // bytes assigning variables when the value being assigned is also
        // being passed in as a function argument.
        
        // Before (minified + munged):
        b=0;a(0)
        
        // After (minified + munged):
        a(b=0)
        
        */
        style.overflow = 'hidden'
        
      ) * three_sixty,
      
      dir = rnd(
        
        // Allow user to "take control" by moving the mouse.
        onmousemove = function(event){
          since_moved = 0;
          x = event.clientX - origin_x;
          y = event.clientY - origin_y;
        }
      
      ) < 0.5 ? 1 : -1;
      
  // "int main(void)"
  //
  // Note that due to the Firefox "lateness" argument, the first argument to
  // the function passed to both setInterval and setTimeout might be a
  // a seemingly random number. Fortunately, the first argument here is always
  // overridden, so this is a non-issue. See this article for more info:
  // http://benalman.com/news/2009/07/the-mysterious-firefox-settime/
  setInterval(function(max_radius,blip_scale,i,tmp,tmp2){
    
    // Automated random mode changer.
    if ( !( ++frame % thirty_two /* fps */ ) ) {
      
      // For a while loop whose logic is contained entirely in the parens,
      // the empty {} can be replaced with ; (at least in the specified
      // browsers, as well as IE9).
      
      // Change the mode, as long as it's not the last mode changed.
      while ( last_n == ~~( tmp = rnd( tmp2 = rnd() ) * 5 ) );
      last_n = ~~tmp;
      
      /*
      // Note that this ternary structure uses significantly less bytes than
      // the comparable if/else structure, and due to operator precedence and
      // the fact that there's only one statement per condition, assignments
      // can be made without any extra parens.
      
      // Before (minified + munged):
      if(a){b=1}else if(c){d=2}else{e=3}
      if(a)b=1;else if(c)d=2;else e=3
      
      // After (minified + munged):
      a?b=1:c?d=2:e=3
      
      // Also note that since YUI compressor won't remove the leading 0 in 0.5
      // (and will actually add it back in if you remove it), this is adjusted
      // in minify.sh post-minification.
      */
      // Change directions.
      tmp < 0.4 ? dir = -dir
      // Cycle colors.
      : tmp < 2 ? color_idx++
      // Change the overall pattern / shape.
      : tmp < 3 ? math_mode = tmp2 * 7
      // Change the rotational velocity.
      : tmp < 4 ? cycle_speed = tmp2 * 8 + 1
      // Change the "tightness".
      : delay_speed = tmp2 * 3 + 2
    }
    
    // Set these values in each iteration to allow the window to be resized.
    width = c.width = innerWidth;
    height = c.height = innerHeight;
    max_radius = min( origin_x = width / 2, origin_y = height / 2 );
    blip_scale = max_radius / three_sixty * 4; // 400;
    max_radius -= 6 * blip_scale;
    
    // Only override mouse movement generated x/y if mouse hasn't moved within
    // the last second.
    if ( ++since_moved > thirty_two /* fps */ ) {
      
      // Let's do some math!
      if ( math_mode < 1 ) {
        // Circle.
        theta -= cycle_speed * dir * 4;
        
        x = sin( theta * pi_over_180 ) * max_radius;
        y = cos( theta * pi_over_180 ) * max_radius;
        
      } else {
        // Spiro.
        theta -= cycle_speed * dir * 2;
        
        tmp = abs( x = sin( theta * pi_over_180 ) * max_radius );
        
        x = tmp * cos( tmp2 = atan2( 0, x ) + theta * pi_over_180 / math_mode );
        y = tmp * sin( tmp2 );
      }
      
    }
    /*
    // If the counter var is already being used inside the for loop, one byte
    // can be saved by incrementing it the last time it's used in the loop,
    // instead of explicitly inside the for's parens. Reverse-for loops can
    // actually be even smaller, but the internal application logic in place
    // precludes their use here.
    
    // Before (minified + munged):
    for(i=0;i<a;i++){b(i);c(i)}
    
    // After (minified + munged):
    for(i=0;i<a;){b(i);c(i++)}
    
    */
    // Update items. The 0th item x/y coordinates are set to the point the
    // previous "math" code computed, then, just like "mouse trails," each
    // subsequent item is moved to somewhere in between its current position
    // and its just-set predecessor's position. Un-comment the "Draw items"
    // section to see these items displayed in white.
    for ( i = 0; i < thirty_two /* num_colors * 4 */; ) {
      
      // This is a very byte-conscious way to set a variable to an array item,
      // initializing the item if it hasn't already been initialized. The
      // performance hit incurred by assigning an item to itself (once it's
      // already been initialized) is negligible.
      tmp = items[i] = items[i] || { x: 0, y: 0 };
      
      tmp2 = items[ i - 1 ];
      
      tmp.x = i ? tmp.x + ( tmp2.x - tmp.x ) / delay_speed : x;
      tmp.y = i++ ? tmp.y + ( tmp2.y - tmp.y ) / delay_speed : y;
    }
    
    // Add new (or replace existing) blips.
    //for ( i = 0; tmp = items[ ~~( i * ( num_items - 1 ) / ( num_colors - 1 ) ) ]; ) {
    for ( i = 0; tmp = items[ i * 4 ]; ) {
      
      blips[ blip_current++ % three_sixty /* ( num_colors * 45 ) */ ] = {
        s: 1,
        d: 1,
        c: colors[ ( color_idx + i++ ) % 8 /* num_colors */ ],
        x: tmp.x,
        y: tmp.y
      };
    }
    
    // BG fill.
    fillRect( i = 0, 0, width, height );
    
    // Draw blips.
    while ( tmp = blips[i++] ) {
      
      // Pulse the blip.
      tmp2 = tmp.s += tmp.d;
      tmp.d = tmp2 > blip_max_size ? -1
            : tmp2 < blip_min_size ? 1
            : tmp.d;
      
      // Draw the blip.
      fillStyle = '#' + tmp.c;
      font = tmp2 * blip_scale * char_scale + 'px Arial';
      textAlign = 'center';
      textBaseline = 'middle';
      
      fillText( txt[ i % txt.length ], origin_x + tmp.x, origin_y + tmp.y );
    }
    
  }, thirty_two /* 1e3 / fps */ )

// Since YUI compressor adds a trailing ; to its output and wraps `with` blocks in {},
// this is adjusted in minify.sh post-minification.
}( 1.5, '\u2605\u2736\u2606\u2739\u2735\u2727\u2738', 'f001a001700140010f010a010701040'.split(1) )