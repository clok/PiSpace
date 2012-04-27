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
	color: 'blue',
	score_color: 'blue',
	
	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin2.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
	
	update: function() {
	    
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
	    if (ig.input.state('boost')){
		this.burn = 4;
	    } else {
		this.burn = 1;
	    }
	    
	    // Apply user control LAST
	    if (this.fuel > 0){
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
		
		/*
		if (ig.input.pressed('rotate')){
		    if (this.body.GetAngle() == 0){
			this.body.SetAngle(Math.PI/2);
		    } else {
			this.body.SetAngle(0);
		    }
		}
		*/
		// update fuel
		ig.game.FUEL.BLUE = this.fuel;
	    }
            this.parent();
	    
	}
	
    });
    
});