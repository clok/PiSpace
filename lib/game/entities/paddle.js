ig.module(
    'game.entities.paddle'
)
.requires(
    'game.entities.b2paddle',
    'game.entities.particle',
    'game.entities.b2particle',
    'plugins.phash'
)
.defines(function(){

    EntityPaddle = Box2DPaddle.extend({
	
        size: {x:8, y:40},
        startPosition: null,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
	
	// Place holder vert arrays for drawing bodies
	verts: new Array,
	b2verts: new Array,

	// Inirialize Verts pHash
	vertHash: new pHash,

	// Place holders for specific shape designs
	rtTriVerts: new Array,
	ltTriVerts: new Array,
	rectPadVerts: new Array,
	emeraldVerts: new Array,
	rtDiaVerts: new Array,
	ltDiaVerts: new Array,
	rtPhaseVerts: new Array,
	ltPhaseVerts: new Array,
	
	aiTimer: null,
	gibTimer: null,
	fuelTimer: null,
	fuel: 100,
	burn: 1,
	color: 'red',
	
        tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),
        
        init: function( x, y, settings ){
	    // Initialize Verts Hash
	    this.setVerts();
	    
	    // Set verticies first
	    this.updateVerts( this.vertHash.get( 'phase' ) );
	    
            // do initial Box2D entity stuff first
            this.parent( x, y, settings );
            
            // Timer for ai scaling
            this.aiTimer = new ig.Timer(1);
            
	    // Timer for ai scaling
            this.fuelTimer = new ig.Timer();
	    
            // Set velocity to Zero at startup
            // Needed for respawn
            this.body.SetLinearVelocity( new b2.Vec2(0,0) );
	    
	    // Set timer for limiting FireGibs
	    this.gibTimer = new ig.Timer(1);
            
	    // Self reference to contain ImpactJS data in Box2D reference
            this.body.entity = this;
        },
	
	update: function(){
	    if (this.fuelTimer.delta() > 0.05 && this.fuel < 100){
		this.fuel += 2;
		this.fuelTimer.reset();
	    }
	    
	    this.parent();
	},
	
	updateVerts: function( verts ){
	    // Convert verts to Box2D verts
	    for (var i = 0; i < verts.length; i++){
		this.b2verts[i] = new b2.Vec2( (verts[i][0] - this.size.x/2)/10,
					       (verts[i][1] - this.size.y/2)/10
					     );
	    }

	    // Convert verts to Draw verts
	    for (var i = 0; i < verts.length; i++){
		this.verts[i] = [ (verts[i][0] - this.size.x/2),
				  (verts[i][1] - this.size.y/2)
				];
	    }

	    return;
	},

	setVerts: function(){
	    // Set verticies first
	    // CW
	    this.vertHash.set( 'rectangle', [ 
		[0,0], 
		[this.size.x,0], 
		[this.size.x,this.size.y], 
		[0,this.size.y] 
	    ]);
	    this.vertHash.set( 'emerald', [ 
		[this.size.x/4, 0], 
		[this.size.x - this.size.x/4 ,0], 
		[this.size.x, this.size.y/6], 
		[this.size.x, 5 * (this.size.y/6)], 
		[this.size.x - this.size.x/4, this.size.y], 
		[this.size.x/4, this.size.y], 
		[0, 5 * (this.size.y/6)], 
		[0, this.size.y/6]
	    ]);
	    this.vertHash.set( 'triangle', [
		[this.size.x,0], 
		[this.size.x,this.size.y], 
		[-1 * this.size.x,this.size.y/2]
	    ]);
	    this.vertHash.set( 'diamond', [
		[this.size.x/2, 0],
		[1.25 * this.size.x , this.size.y/2],
		[this.size.x/2, this.size.y],
		[-0.75 * this.size.x, this.size.y/2]
	    ]);
	    this.vertHash.set( 'phase', [ 
		[this.size.x/2, 0],
		[this.size.x, 0],
		[this.size.x, this.size.y],
		[this.size.x/2, this.size.y],
		[-0.5*this.size.x, 2 * this.size.y/3],
		[-0.5*this.size.x, this.size.y/3]
	    ]);
	},

	// ISSUE #15: boost particles orientation bug

	vectorLeft: function(){
	    this.body.ApplyImpulse( new b2.Vec2(-0.25*this.burn,0), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + 8, this.pos.y + Math.random()*40 );
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + 8, this.pos.y + Math.random()*40 );
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorRight: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0.2*this.burn,0), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x, this.pos.y + Math.random()*40 );
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x, this.pos.y + Math.random()*40 );
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorUp: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0,-0.2*this.burn), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + Math.random()*8, this.pos.y + 40);
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + Math.random()*8, this.pos.y + 40);
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorDown: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0,0.2*this.burn), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + Math.random()*8, this.pos.y );
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + Math.random()*8, this.pos.y );
		this.fuel -= this.burn;

	    }
	    return;
	},
	
	checkCollisions: function() {
	    // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity && edge.other.userData != 'particle') {
		    // Check if it is actually touching
		    if (edge.contact.IsTouching()){
			// Check if it is the puck
			if (edge.other.userData == 'puck'){
			    
			    // Update Score using Multiplier and boost status
			    if (this.color == 'red'){
				ig.game.SCORE.RED += 10*ig.game.MULTI.RED*this.burn;
			    } else if (this.color == 'blue'){
				ig.game.SCORE.BLUE += 10*ig.game.MULTI.BLUE*this.burn;
			    }
			    
			    // play sound for puck contact
			    this.puckSound.play();
			    
			    // Take the vel.x values to consider relative "force of impact" and gen particles
			    // accordingly.  Use 1/3 ratio for sanity.
			    var n = ((Math.abs(this.body.GetLinearVelocity().Length())) / 3).round();
			    if (n > 30) {
				n = 30;
			    }
			    for (var i=0;i<=n;i++){
				ig.game.spawnEntity( Box2DFireGib, edge.other.entity.pos.x, edge.other.entity.pos.y );
			    }
			    return;
			} else if(edge.other.userData == 'paddle') {
			    // check for a paddle
			    this.paddleSound.play();
			    return;
			}
		    }
		}
            }
	    return;
	}
        
    });
    
});