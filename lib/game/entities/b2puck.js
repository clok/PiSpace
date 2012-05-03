ig.module( 
    'game.entities.b2puck'
)
.requires(
    'plugins.box2d.b2entity'
)
.defines(function(){

    Box2DPuck = ig.Box2DEntity.extend({
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
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    
	    // Get Size of BOX entity
	    var sizeX = this.size.x * s;
	    var sizeY = this.size.y * s;
	    
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
	    ctx.rotate(this.angle * (Math.PI/180));
	    ctx.fillStyle = this.color;
	    ctx.fillRect( 0, 0, sizeX, sizeY );
	    ctx.restore();
	    */
	    
	    // Set fill Color
	    ctx.fillStyle = this.color;
	    
	    // Fill entity as rectangle based of location and size
	    ctx.fillRect( x, y, sizeX, sizeY );
	}
        
    });
    
});