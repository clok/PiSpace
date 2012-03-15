ig.module(
    'game.entities.paddle'
)
.requires(
    'game.entities.b2paddle',
    'game.entities.particle',
    'game.entities.b2particle'
)
.defines(function(){

    EntityPaddle = Box2DPaddle.extend({
	
        size: {x:8, y:40},
        startPosition: null,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
	
	aiTimer: null,
	gibTimer: null,
	fuelTimer: null,
	fuel: 100,
	burn: 1,
	color: 'red',
	
        // Load tileset for animations    
        animSheet: new ig.AnimationSheet( 'media/sprites/paddle-red.png', 8, 40 ),
	
        tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),
        
        init: function( x, y, settings ){
            // do initial Box2D entity stuff first
            this.parent( x, y, settings );
            
            // add animation tils for directions
            this.addAnim( 'idle', 0.1, [0] );
            this.addAnim( 'vectorUp', 0.1, [1] );
            
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
	
	vectorLeft: function(){
	    this.body.ApplyImpulse( new b2.Vec2(-0.25*this.burn,0), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( BlueFireGib, this.pos.x + 8, this.pos.y + Math.random()*40 );
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorRight: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0.2*this.burn,0), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x, this.pos.y + Math.random()*40 );
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorUp: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0,-0.2*this.burn), this.body.GetPosition() );
	    if (this.burn > 1){
		ig.game.spawnEntity( Box2DBlueFireGib, this.pos.x + Math.random()*8, this.pos.y + 40);
		this.fuel -= this.burn;
	    }
	    return;
	},
	
	vectorDown: function(){
	    this.body.ApplyImpulse( new b2.Vec2(0,0.2*this.burn), this.body.GetPosition() );
	    if (this.burn > 1){
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
			    var n = ((Math.abs(this.body.GetLinearVelocity().x) + Math.abs(edge.other.GetLinearVelocity().x))/3).round();
			    if (n > 30) {
				n = 30;
			    }
			    for (var i=0;i<=n;i++){
				ig.game.spawnEntity( FireGib, edge.other.entity.pos.x, edge.other.entity.pos.y );
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