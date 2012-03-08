ig.module(
    'game.entities.b2particle'
)
.requires(
    'plugins.box2d.b2entity'
)
.defines(function(){

EntityBox2DParticle = ig.Box2DEntity.extend({
    
    size: { x:1, y:1 },
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
    animSheet: new ig.AnimationSheet( 'media/sprites/burnpix.png', 1, 1 ),
    
    lifetime: 1.0,
    fadetime: 0.5,
    friction:{ x:0, y:0 },
    vel: null,
    idleTimer: null,
    gravityFactor: 0,
    
    init: function( x, y, settings ){
	this.parent( x, y, settings );
        
        this.addAnim( 'idle', 0.1, [0,1,2,3] );
        
        this.currentAnim.flip.x = (Math.random()>0.5);
        this.currentAnim.flip.y = (Math.random()>0.5);
	this.currentAnim.gotoRandomFrame();
	this.idleTimer = new ig.Timer();
        
        this.body.entity = this;
    },

    body: null,
	
    createBody: function() {
	this.parent();
        /*
        // define as 'bullet' to improve collision detection and
        // eliminate tunneling issues
        this.body.SetBullet(true);
        this.body.SetAngularDamping(0.1);
	*/
        this.body.m_fixtureList.SetDensity(0.000001);
        this.body.m_fixtureList.SetRestitution(1.0);
        this.body.m_fixtureList.SetFriction(0.0);
    },
    
    update: function(){
        if(this.idleTimer.delta()>this.lifetime){
            this.kill();
            return;
	}
        this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime-this.fadetime,this.lifetime,1,0);
        this.parent();
    }
    
});

Box2DFireGib = EntityBox2DParticle.extend({
        lifetime: 1.0,
        fadetime: 0.5,
        friction:{ x:0, y:0 },
        
        animSheet: new ig.AnimationSheet('media/sprites/burnpix.png',1,1),
        
        init:function( x, y, settings ){
	    // add ember animation
	    this.addAnim( 'idle', 0.3, [0,1,2,3] );
            
	    // send to parent
	    this.parent( x, y, settings );
            
            // update random velocity
            this.body.SetLinearVelocity( new b2.Vec2((Math.random() < 0.5 ? -1 : 1)*Math.random()*2,
						     (Math.random() < 0.5 ? -1 : 1)*Math.random()*2));
        
	}
    });

});