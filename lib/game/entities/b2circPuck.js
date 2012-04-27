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
	    var ctx = ig.system.context;
	    ctx.strokeStyle = this.color;  //some color
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc( ig.system.getDrawPos( this.pos.x - ig.game.screen.x ),
		     ig.system.getDrawPos( this.pos.y - ig.game.screen.y ),
		     this.radius * ig.system.scale,
		     0, Math.PI * 2 );
	    ctx.stroke();
	    ctx.fill();
	}
        
    });
    
});