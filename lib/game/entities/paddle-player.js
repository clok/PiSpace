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
	fuel: 100,
	burn: 1,
	
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
	    
	    if (ig.input.state('boost')){
		this.burn = 3;
	    } else {
		this.burn = 1;
	    }
	    
	    // Apply user control LAST
            if ( ig.input.state('up')){
		this.vectorUp();
            } else if ( ig.input.state('down')){
		this.vectorDown();
            }
            
            if ( ig.input.state('left')){
		this.vectorLeft();
            } else if ( ig.input.state('right')){
		this.vectorRight();
            }
	    
	    if (ig.input.pressed('rotate')){
		if (this.body.GetAngle() == 0){
		    this.body.SetAngle(Math.PI/2);
		} else {
		    this.body.SetAngle(0);
		}
	    }
	    
            this.parent();
	}
	
    });
    
});