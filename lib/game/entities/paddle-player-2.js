ig.module(
    'game.entities.paddle-player-2'
)
.requires(
    'game.entities.paddle',
    'game.entities.particle'
)
.defines(function(){

    EntityPaddlePlayer2 = EntityPaddle.extend({

	// name entity for ease
	name: 'Player2',
	startPostion: { x: 26, y: 130 },
	
	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
	
	update: function() {
            
            // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity ) {
                    if (edge.other.entity.size.x == 4 && edge.other.entity.size.y == 4){
			this.puckSound.play();
			ig.game.player2_score += 100;
			// Take the vel.x values to consider relative "force of impact" and gen particles
			// accordingly.  Use 1/3 ratio for sanity.
			var num = ((Math.abs(this.body.GetLinearVelocity().x) + Math.abs(edge.other.entity.vel.x))/3).round();
			if (num > 30) {
                            num = 30;
			}
			for (var i=0;i<=num;i++){
                            ig.game.spawnEntity( FireGib, edge.other.entity.pos.x, edge.other.entity.pos.y );
			}
                    } else {
			this.paddleSound.play();
                    }
		}
            }
	    
            // Apply user control
            if ( ig.input.state('w')){
		this.body.ApplyForce( new b2.Vec2(0,-18), this.body.GetPosition() );
            } else if ( ig.input.state('s')){
		this.body.ApplyForce( new b2.Vec2(0,18), this.body.GetPosition() );
            }
            
            if ( ig.input.state('a')){
		this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
            } else if ( ig.input.state('d')){
		this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
            }
	    
	    this.parent();
	    
	},
	/*
	kill: function( startPos ){
	    this.parent();
	    // Spawn NEW Paddle
	    ig.game.spawnEntity( EntityPaddlePlayer2, startPos.x, startPos.y );
	}
	*/
    });
    
});