ig.module( 
	'plugins.box2d.entity'
)
.requires(
	'impact.entity',
	'plugins.box2d.game'
)
.defines(function(){

// Standard entity for Box2D
ig.Box2DEntity = ig.Entity.extend({
	body: null,
	angle: 0,
	
	init: function( x, y , settings ) {
		this.parent( x, y, settings );
		
		// Only create a box2d body when we are not in Weltmeister
		if( !ig.global.wm ) { 
			this.createBody();
		}
	},
	
	createBody: function() {
		var bodyDef = new b2.BodyDef();
		bodyDef.position.Set(
			(this.pos.x + this.size.x / 2) * b2.SCALE,
			(this.pos.y + this.size.y / 2) * b2.SCALE
		);
		
		// define as 'bullet' to improve collision detection and
		// eliminate tunneling issues
		bodyDef.isBullet = true;		
		
		this.body = ig.world.CreateBody(bodyDef);
		var shapeDef = new b2.PolygonDef();
		
		shapeDef.SetAsBox(
			this.size.x / 2 * b2.SCALE,
			this.size.y / 2 * b2.SCALE
		);
		
		shapeDef.density = 1.0;
		shapeDef.restitution = 1.1;
		shapeDef.friction = 0.0;
		this.body.CreateShape(shapeDef);
		this.body.SetMassFromShapes();
	},
	
	// Helpful to handle generation of random spawn point when
	// object is out of canvas in next frame
	randomPos: function( pos ) {
		this.pos.x = Math.random()*38 + 8;
		this.pos.y = Math.random()*10 + 16;
	},
	
	randomVel: function ( body ) {
		var pOmX = Math.random() < 0.5 ? -1 : 1;
		var pOmY = Math.random() < 0.5 ? -1 : 1;
		this.body.SetLinearVelocity(
					new b2.Vec2(
						pOmX*Math.random()*16,
						pOmY*Math.random()*16
						));		
	},	
	
	update: function() {		
		var p = this.body.GetPosition();
		this.pos = {
			x: (p.x / b2.SCALE - this.size.x / 2),
			y: (p.y / b2.SCALE - this.size.y / 2 )
		};
		this.angle = this.body.GetAngle().round(2);
		
		if( this.currentAnim ) {
			this.currentAnim.update();
			this.currentAnim.angle = this.angle;
		}
	},
	
	kill: function() {
		ig.world.DestroyBody( this.body );
		this.parent();
	}
});

// Puck entity for Box2D
ig.Box2DPuck = ig.Box2DEntity.extend({
	body: null,
	angle: 0,
	
	init: function( x, y , settings ) {
		this.parent( x, y, settings );
		
		// Only create a box2d body when we are not in Weltmeister
		if( !ig.global.wm ) { 
			this.createBody();
		}
	},
	
	createBody: function() {
		var bodyDef = new b2.BodyDef();
		bodyDef.position.Set(
			(this.pos.x + this.size.x / 2) * b2.SCALE,
			(this.pos.y + this.size.y / 2) * b2.SCALE
		);
		
		// define as 'bullet' to improve collision detection and
		// eliminate tunneling issues
		bodyDef.isBullet = true;
		
		this.body = ig.world.CreateBody(bodyDef);
		var shapeDef = new b2.PolygonDef();
		
		shapeDef.SetAsBox(
			this.size.x / 2 * b2.SCALE,
			this.size.y / 2 * b2.SCALE
		);
		
		shapeDef.density = 1.0;
		shapeDef.restitution = 1.1;
		shapeDef.friction = 0.0;
		this.body.CreateShape(shapeDef);
		this.body.SetMassFromShapes();
	}
});

// Paddle entity for Box2D
ig.Box2DPaddle = ig.Box2DEntity.extend({
	body: null,
	angle: 0,
		
	createBody: function() {
		var bodyDef = new b2.BodyDef();
		bodyDef.position.Set(
			(this.pos.x + this.size.x / 2) * b2.SCALE,
			(this.pos.y + this.size.y / 2) * b2.SCALE
		);
		
		// define as 'bullet' to improve collision detection and
		// eliminate tunneling issues
		bodyDef.isBullet = true;		
		
		this.body = ig.world.CreateBody(bodyDef);
		var shapeDef = new b2.PolygonDef();
		
		shapeDef.SetAsBox(
			this.size.x / 2 * b2.SCALE,
			this.size.y / 2 * b2.SCALE
		);
		
		shapeDef.density = 0.1;
		shapeDef.restitution = 0.0;
		shapeDef.friction = 0.0;
		this.body.CreateShape(shapeDef);
		this.body.SetMassFromShapes();
	}
});
	
});