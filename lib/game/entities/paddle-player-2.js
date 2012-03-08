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
            
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
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
	    
	}
	
    });
    
});