ig.module(
    'plugins.color-picker'
)
.requires(
    
)
.defines(function(){
    /*
      Initialize object with a default 10 color array fading from
      White to Red and with a Tri-Color array from Green to Yellow
      to Red gradient with 10 steps between each source color.
    */
    ColorPicker = function(){
	// Generate default Colors Array with White to Red in 10 steps
	this.colors = this.genHexArray( 0xFFFFFF, 0xFF0000, 10 );
	
	// Generate default triColors Array with Green to Yellow to Red
	this.triColors = this.genMultiHexArray( [0x00FF00, 0xFFFF00, 0xFF0000], 50 );
		
	return;
    }

    /*
      Select a color between color 1 (hc1) and color 2 (hc2)
      based on an input ratio that denotes the point in the 
      gradient color should be selected from.
    */
    ColorPicker.prototype.pickHex = function( hc1, hc2, ratio ){
	if (ratio > 1) ratio = 1;
        
	// Break hc1 into RGB components
	var r = hc1 >> 16;
	var g = hc1 >> 8 & 0xFF;
	var b = hc1 & 0xFF;

	// RGB Delta between hc1 and hc2
	var rd = (hc2 >> 16) - r;
	var gd = (hc2 >> 8 & 0xFF) - g;
	var bd = (hc2 & 0xFF) - b;
	
	// Calculate new color and add it to the array
        var rethCol = ((r+rd*ratio)<<16 | (g+gd*ratio)<<8 | (b+bd*ratio)).toString(16);
	
	// Check that the converted hex string is properly "0" front loaded
	while (rethCol.length < 6) {
	    rethCol = '0' + rethCol;
        }
	
        return rethCol;
    }
    
    /*
      Select n=steps colors between color 1 (hc1) and color 2 (hc2)
      and populate a return array.
    */
    ColorPicker.prototype.genHexArray = function( hc1, hc2, steps ){
	var colorArray = new Array;
	
	// Place source color in as first element
	colorArray[0] = hc1.toString(16);
	
	// Break hc1 into RGB components
	var r = hc1 >> 16;
	var g = hc1 >> 8 & 0xFF;
	var b = hc1 & 0xFF;

	// RGB Delta between hc1 and hc2
	var rd = (hc2 >> 16) - r;
	var gd = (hc2 >> 8 & 0xFF) - g;
	var bd = (hc2 & 0xFF) - b;
	
	// smoother gradient
	steps++;

	// Determine new colors
	for (var i = 1; i < steps; i++){
	    // Where are we on the gradient?
            var ratio = i/steps;
            
            // Calculate new color and add it to the array
            colorArray[i] = ((r+rd*ratio)<<16 | (g+gd*ratio)<<8 | (b+bd*ratio)).toString(16);
	}

	// Tack on the last color to complete the gradient
	colorArray.push( hc2.toString(16) );

	// Test that all hex color codes are properly front loaded
	for (var j = 0; j < colorArray.length; j++){
	    while (colorArray[j].length < 6) {
		colorArray[j] = '0' + colorArray[j];
            }
	}
	
	return colorArray;
    }

    /*
      genMultiHexArray will take an input array of any number of hex colors
      and the number of steps to create a smooth gradient fade between the
      colors in sequence.

      Example: input = [0x00FF00, 0xFFFF00, 0xFF0000] with steps = 10
      will produce a Green to Yellow to Red gradient with 10 steps between
      each source color. Total of 23 color codes.
    */
    ColorPicker.prototype.genMultiHexArray = function ( input, steps ){
	var multiColor = new Array;
	
	// Find each sequential pair to compare
	for(var i = 0; i < input.length - 1; i++){
	    // Set hex colors
	    var hc1 = input[i];
	    var hc2 = input[i+1];
	    
	    // Save first color
	    multiColor.push( hc1.toString(16) );
	    
	    // Break hc1 into RGB components
	    var r = hc1 >> 16;
	    var g = hc1 >> 8 & 0xFF;
	    var b = hc1 & 0xFF;
	    
	    // Determine RGB differences between hc1 and hc2
	    var rd = (hc2 >> 16)-r;
	    var gd = (hc2 >> 8 & 0xFF)-g;
	    var bd = (hc2 & 0xFF)-b;
	    
	    // Determine new colors
	    for (var j = 1; j < steps; j++){
		// Where are we on the gradient?
		var ratio = j/steps;
		// Calculate new color and add it to the array
		multiColor.push( ((r+rd*ratio)<<16 | (g+gd*ratio)<<8 | (b+bd*ratio)).toString(16) );
	    }
	}
	
	// Add the last color to the end of the array.
	multiColor.push( input[input.length - 1].toString(16) );

	// Test that all hex color codes are properly front loaded
	for (var k = 0; k < multiColor.length; k++){
	    while (multiColor[k].length < 6) {
		multiColor[k] = '0' + multiColor[k];
            }
	}
	
	// Return the new array of colors.
	return multiColor;
    }

    // function will return an array with [r,g,b,a] set to
    // appropriate values.
    ColorPicker.prototype.hexToRGBA = function ( hex ) {
	// Break hc1 into RGB components
	var d = new Array;
	// R
	d[0] = parseInt(hex.substring(0,2),16);
	// G
	d[1] = parseInt(hex.substring(2,4),16);
	// B
	d[2] = parseInt(hex.substring(4,6),16);
	// Alpha
	d[3] = 255;

	return d;
    }

    // Function will return a 'rgb( r,g,b )' string set to the
    // appropriate values.
    ColorPicker.prototype.hexToRGBstr = function ( hex ) {
	// Break hc1 into RGB components
	return "rgb( "+parseInt(hex.substring(0,2),16)+", "+parseInt(hex.substring(2,4),16)+", "+parseInt(hex.substring(4,6),16)+" )";
    }

    // Useful for checking front padding of a hex color code
    ColorPicker.prototype.frontPad = function ( hex ) {
        while (hex.length < 6) {
	    hex = '0' + hex;
        }
        return hex;
    } 
});