ig.module(
    'game.entities.paddle-player'
)
.requires(
    'game.entities.paddle',
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
            
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
	    // update score
	    ig.game.player_score = this.score;
	    
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
	}
	
    });
    
});