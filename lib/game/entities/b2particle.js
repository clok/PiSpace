ig.module(
    'game.entities.b2particle'
)
.requires(
    'plugins.box2d.b2entity',
    'plugins.color-picker'
)
.defines(function(){

    EntityBox2DParticle = ig.Box2DEntity.extend({
	
	size: { x:1, y:1 },
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	lifetime: 1.0,
	fadetime: 0.5,
	friction:{ x:0, y:0 },
	vel: null,
	idleTimer: null,
	gravityFactor: 0,

	// Initialize ColorPicker
	picker: new ColorPicker,
	
	init: function( x, y, settings ){
	    this.parent( x, y, settings );
            
            this.idleTimer = new ig.Timer();
            
            this.body.entity = this;
	},

	body: null,
	
	createBody: function() {
	    var bodyDef = new b2.BodyDef();
	    bodyDef.position.Set(
		(this.pos.x + this.size.x / 2) * b2.SCALE,
		(this.pos.y + this.size.y / 2) * b2.SCALE
	    );
	    
	    bodyDef.type = b2.Body.b2_dynamicBody;
	    
	    this.body = ig.world.CreateBody(bodyDef);
	    this.body.userData = 'particle';
	    
            var shapeDef = new b2.PolygonShape();
	    shapeDef.SetAsBox(
		this.size.x / 2 * b2.SCALE,
		this.size.y / 2 * b2.SCALE
	    );
	    
	    // CreateFixture2( var shapedef, density )
	    this.body.CreateFixture2(shapeDef, 0.000001);
	    this.body.m_fixtureList.SetRestitution(0.3);
            this.body.m_fixtureList.SetFriction(0.0);
	},
	
	update: function(){
	    // check if particle has exsisted past lifetime
	    // if so, remove particle
            if(this.idleTimer.delta()>this.lifetime){
		this.kill();
		return;
	    }

	    // fade the particle effect using the aplha blend
	    this.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
            
            this.parent();
	},
	
	draw: function() {
	    var ctx = ig.system.context;
	    var s = ig.system.scale;
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    var id = ctx.createImageData( s, s );
	    var rgba = this.picker.hexToRGBA( this.picker.colors[parseInt(Math.random()*100-1)] );
	    var d  = id.data;
	    d[0] = rgba[0];
	    d[1] = rgba[1];
	    d[2] = rgba[2];
	    if (this.alpha > 1) {
		d[3] = rgba[3];
	    } else {
		d[3] = rgba[3] * this.alpha;
	    }
	    ctx.putImageData( id, x , y );
	    ctx.restore();
	}

    });

    Box2DFireGib = EntityBox2DParticle.extend({
        lifetime: 1.0,
        fadetime: 0.5,
        friction:{ x:0, y:0 },
        
        init:function( x, y, settings ){
	    // send to parent
	    this.parent( x, y, settings );
            
            // update random velocity
            this.body.SetLinearVelocity( new b2.Vec2((Math.random() < 0.5 ? -1 : 1)*Math.random()*2,
						     (Math.random() < 0.5 ? -1 : 1)*Math.random()*2));

	    // generate color gradient for FireGib
	    this.picker.colors = this.picker.genMultiHexArray( [0xFFFF00, 0xFF4500, 0xFF0000], 50);
	}
    });

    Box2DBlueFireGib = EntityBox2DParticle.extend({
        lifetime: 0.3,
        fadetime: 0.15,
        friction:{ x:0, y:0 },
        
        init:function( x, y, settings ){
	    // send to parent
	    this.parent( x, y, settings );
            
            // update random velocity
            this.body.SetLinearVelocity( new b2.Vec2((Math.random() < 0.5 ? -1 : 1)*Math.random()*2,
						     (Math.random() < 0.5 ? -1 : 1)*Math.random()*2));

	    // generate color gradient for BlueFireGib
	    this.picker.colors = this.picker.genHexArray( 0xFFFFFF, 0x0000FF, 100 );
	}
    });
    
});