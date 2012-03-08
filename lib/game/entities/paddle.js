ig.module(
    'game.entities.paddle'
)
.requires(
    'game.entities.b2paddle',
    'game.entities.particle'
)
.defines(function(){

    EntityPaddle = Box2DPaddle.extend({
	
        size: {x:8, y:40},
        startPosition: null,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
	
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
            this.aiTimer = new ig.Timer();
            
            // Set velocity to Zero at startup
            // Needed for respawn
            this.body.SetLinearVelocity( new b2.Vec2(0,0) );
            
            this.body.entity = this;
        },
	
	checkCollisions: function() {
	    // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity ) {
		    // Check if it is actually touching
		    if (edge.contact.IsTouching()){
			// Check if it is the puck
			if (edge.other.entity.size.x == 4 && edge.other.entity.size.y == 4){
			    
			    // play sound for puck contact
			    this.puckSound.play();
			    
			    // Add to score
			    ig.game.player_score += 100;
			    
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
			} else {
			    // assume it is a paddle
			    this.paddleSound.play();
			    return;
			}
		    }
		}
            }
	    return;
	}
        
        // POTENTIALLY WORHTLESS!
        /*
        tunnelCheck: function() {
            // Keep Paddle from leaving game space "Tunneling"
            // If found, spawn at start point on map
            // Need to investigate "DestroyProxy" in Box2D for this.
            var p = this.body.GetPosition();
            if (((p.x - this.size.x/20) < 0.6)
		|| ((p.x + this.size.x/20) > 47.3)
		|| ((p.y - this.size.y/20) < 1.5)
		|| ((p.y + this.size.y/20) > 26.5)
               ){
		// Play soundfx
		this.tunnelSound.play();
		
		// Spawn BANNER graphic
		ig.game.spawnEntity( TunnelGib, this.startPosition.x - 90, this.startPosition.y + this.size/2 );
		
		// Spawn FireGibs
		for (var i=0;i<=10;i++){
                    ig.game.spawnEntity( FireGib, this.startPosition.x, this.startPosition.y + this.size/2);
		}
		
                // Set the Paddle back to it's start position
		this.body.SetPositionAndAngle(new  b2.Vec2(this.startPosition.x, this.startPosition.y), 0);
		// Remove previous Paddle
		//this.kill( this.startPosition );
            }
            
        }
        */
        
    });
    
});