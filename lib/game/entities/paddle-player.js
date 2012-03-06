ig.module(
    'game.entities.paddle-player'
)
.requires(
    'game.entities.paddle',
    'plugins.box2d.entity',
    'game.entities.particle'
)
.defines(function(){

    EntityPaddlePlayer = EntityPaddle.extend({

	// name entity for ease
	name: 'Player',
	startPosition: { x: 452, y: 130 },

	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin2.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
	
	// Load specific anim tileset for Player Paddle
	animSheet: new ig.AnimationSheet( 'media/sprites/paddle-blue.png', 8, 40 ),

	update: function() {
            
            // Apply user control
            if ( ig.input.state('up')){
		this.body.ApplyForce( new b2.Vec2(0,-18), this.body.GetPosition() );
            } else if ( ig.input.state('down')){
		this.body.ApplyForce( new b2.Vec2(0,18), this.body.GetPosition() );
            }
            
            if ( ig.input.state('left')){
		this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
            } else if ( ig.input.state('right')){
		this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
            }
            
            // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity ) {
                    if (edge.other.entity.size.x == 4 && edge.other.entity.size.y == 4){
			
			// play sound for puck contact
			this.puckSound.play();
			
			// Add to score
			ig.game.player_score += 100;
			
			// Take the vel.x values to consider relative "force of impact" and gen particles
			// accordingly.  Use 1/3 ratio for sanity.
			var n = ((Math.abs(this.body.GetLinearVelocity().x) + Math.abs(edge.other.entity.vel.x))/3).round();
			if (n > 30) {
                            n = 30;
			}
			for (var i=0;i<=n;i++){
                            ig.game.spawnEntity( FireGib, edge.other.entity.pos.x, edge.other.entity.pos.y );
			}
                    } else {
			this.paddleSound.play();
                    }
		}
            }
            
            //this.tunnelCheck();
            
            // Apply user control LAST
            if ( ig.input.state('up')){
		this.body.ApplyForce( new b2.Vec2(0,-18), this.body.GetPosition() );
            } else if ( ig.input.state('down')){
		this.body.ApplyForce( new b2.Vec2(0,18), this.body.GetPosition() );
            }
            
            if ( ig.input.state('left')){
		this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
            } else if ( ig.input.state('right')){
		this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
            }
            
            this.parent();
	},
	/*
	  kill: function( startPos ){
          this.parent();
          // Spawn NEW Paddle
          ig.game.spawnEntity( EntityPaddlePlayer, startPos.x, startPos.y );
	  }
	*/
    });
    
});