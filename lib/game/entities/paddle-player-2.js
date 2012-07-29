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
	fuel: 100,
	burn: 1,
	color: 'red',
	score_color: 'red',
	
	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
	
	// rotate the paddle verticies appropriately
	createBody: function() {
	    this.parent();
            this.body.SetAngle(Math.PI);
	},
	
	update: function() {
            
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
	    if (ig.input.state('space')){
		this.burn = 3;
	    } else {
		this.burn = 1;
	    }
	    
	    // Apply user control LAST
	    if (this.fuel > 0){
		if ( ig.input.state('w')){
		    this.vectorUp();
		} else if ( ig.input.state('s')){
		    this.vectorDown();
		}
		
		if ( ig.input.state('a')){
		    this.vectorLeft();
		} else if ( ig.input.state('d')){
		    this.vectorRight();
		}
		
		/*
		if (ig.input.pressed('q')){
		    if (this.body.GetAngle() == 0){
			this.body.SetAngle(Math.PI/2);
		    } else {
			this.body.SetAngle(0);
		    }
		}
		*/
		// update fuel
		ig.game.FUEL.RED = this.fuel;
	    }
	    this.parent();
	    
	}
	
    });
    
});