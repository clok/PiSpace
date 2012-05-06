ig.module( 
    'game.entities.b2puck'
)
.requires(
    //'plugins.box2d.b2entity',
    'plugins.box2d.b2poly'
)
.defines(function(){

    Box2DPuck = ig.Box2DPoly.extend({
	body: null,
	
	createBody: function() {
            this.parent();
	    
	    // define as 'bullet' to improve collision detection and
	    // eliminate tunneling issues
	    this.body.SetBullet(true);
	    this.body.SetAngularDamping(0.1);
	    this.body.userData = 'puck';
	    
	    // Let's make the puck MUCH MUCH lighter than the paddle
	    // and a little more bouncy
	    this.body.m_fixtureList.SetDensity(0.0001);
	    this.body.m_fixtureList.SetRestitution(1.1);
	    this.body.m_fixtureList.SetFriction(0.0);
	},
	
	// Draw using HTML5 Canvas methods to achieve retro look
	draw: function() {
	    // Get context
	    var ctx = ig.system.context;

	    // Get SCALE
	    var s = ig.system.scale;

	    // Get location of entity
	    var x = (this.pos.x - ig.game.screen.x + this.size.x/2) * s;
	    var y = (this.pos.y - ig.game.screen.y + this.size.y/2) * s;
	    
	    /* 
	       ISSUE #10: Contex rotates from ULC (0,0) location that you
	       translate too.  Box2D rotates at the CoM||LocalCenter.
	       
	       In order to rotate the object using direct canvas rednering
	       we must do the following:
	       1 - save the context
	       2 - move to a location on the canvas (translate)
	       3 - perform our rendering
	       4 - restore the context
	    */
	    // ISSUE #2 Draw complex shapes - DONE
	    // ISSUE #10 Rotate objects on canvas - DONE

	    // Save current context
	    ctx.save();

	    // Move canvas context to LocalCenter of object
	    ctx.translate( x, y );
	    
	    // Rotate object accordingly
	    ctx.rotate(this.angle);

	    // Set Stroke Color
	    ctx.fillStyle = this.color;
	    
	    // Begin drawing path
	    ctx.beginPath();

	    // Move to starting point
	    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
	    
	    // Iterate over vertices to draw shape by drawing lines from
	    // left to right
	    for (var i = 1; i < this.verts.length; i++){
		ctx.lineTo(this.verts[i][0], this.verts[i][1]);
	    }

	    // End drawing path
	    ctx.closePath();

	    // stroke the path with color
	    ctx.fill();  

	    // restore canvas to previous state with new data
	    ctx.restore();
	}
	
    });
    
});