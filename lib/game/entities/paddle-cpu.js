ig.module(
    'game.entities.paddle-cpu'
)
.requires(
    'game.entities.paddle',
    'game.entities.particle'
)
.defines(function(){

    EntityPaddleCpu = EntityPaddle.extend({

	// name entity for ease
	name: 'CPU',
	startPosition: { x: 26, y: 130 },
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

            var pucks = ig.game.getEntitiesByType( EntityPuck );
            var puck = pucks[0];

            // if the puck exists and the positon value defined, then the
            // AI should react, else, do nothing
            if (this.fuel > 0){
		// "AI" HAH! lulz....
		if( puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2) {
		    this.vectorDown();
		} else if (puck.pos.y - puck.size.y/2 < this.pos.y - this.size.y/2){
		    this.vectorUp();
		}

		// Attack the puck!
		var pVel = puck.body.GetLinearVelocity();
		if (Math.abs(pVel.x) < 3) {
		    if (puck.pos.x > this.pos.x){
			this.burn = 4;
			this.vectorRight();
			this.burn = 1;
		    } else if (puck.pos.x < this.pos.x) {
			this.burn = 4;
			this.vectorLeft();
			this.burn = 1;
		    }
		} else if (Math.abs(pVel.x) < 5.0 && puck.pos.x < ig.system.width / 2) {
		    if (puck.pos.x > this.pos.x){
			this.burn = 4;
			this.vectorRight();
			this.burn = 1;
		    } else if (puck.pos.x < this.pos.x) {
			this.burn = 4;
			this.vectorLeft();
			this.burn = 1;
		    }
		} else {
		    // "AI" doesn't move too far away froom left wall
		    var p = this.body.GetPosition();
		    if(p.x < 3) {
			this.vectorRight();
		    } else if (p.x > 5) {
			this.vectorLeft();
		    }
		}
		
		// update fuel
		ig.game.FUEL.RED = this.fuel;
            }
            
	    if (this.fuel < 2 && this.aiTimer.delta() < 0){
	        this.aiTimer.reset();
	    }
	    
            this.parent();
	}
	
    });
    
});