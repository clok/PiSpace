ig.module( 
	'game.entities.b2paddle'
)
.requires(
        'plugins.box2d.b2entity'
)
.defines(function(){

    Box2DPaddle = ig.Box2DEntity.extend({
	body: null,
	
	createBody: function() {
	    this.parent();
            
	    // define as 'bullet' to improve collision detection and
	    // eliminate tunneling issues
	    this.body.SetBullet(true);
            this.body.SetAngle(0);
	    this.body.SetFixedRotation(true);
	    
	    // CreateFixture2( var shapedef, density )
	    this.body.m_fixtureList.SetDensity(0.1);
	    this.body.m_fixtureList.SetRestitution(0.0);
	    this.body.m_fixtureList.SetFriction(0.0);
	},
	
    });


});