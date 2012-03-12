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
	}
        
    });
    
});