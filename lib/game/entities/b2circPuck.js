ig.module( 
    'game.entities.b2circPuck'
)
.requires(
    'plugins.box2d.b2circle'
)
.defines(function(){

    Box2DCircPuck = ig.Box2DCircle.extend({
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

	// Draw using HTML5 Canvas methods to achieve older look
	draw: function(){
	    // Get context
	    var ctx = ig.system.context;
	    
	    // Get SCALE
	    var s = ig.system.scale;
	    
	    // Get location of entity
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    /* 
	       ISSUE #10: Contex rotates from ULC (0,0) location that you
	       translate too.  Box2D rotates at the CoM||LocalCenter.
	    
	    
	      In order to rotate the object using direct canvas rednering
	      we must do the following:
	      1 - save the context
	      2 - move to a location on the canvas (translate)
	      3 - perform our rendering
	      4 - restore the context
	    
	    ctx.save();
	    ctx.translate( x, y );
	    if (this.angle != 0) console.log(this.angle);
	    ctx.rotate(this.angle * (Math.PI/180));
	    ctx.strokeStyle = this.color;
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc( 0, 0,
		     this.radius * s,
		     0, Math.PI * 2 );
	    */
	    
	    // Set the fill color
	    ctx.fillStyle = this.color;

	    // Start drawing the path
	    ctx.beginPath();
	    
	    // Draw a complete circle
	    ctx.arc( x, y,
		     this.radius * s,
		     0, Math.PI * 2 );

	    // Fill the circle that was just drawn
	    ctx.fill();
	}
        
    });
    
});