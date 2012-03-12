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
	
	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
        
	update: function() {
            
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
	    // update score
	    ig.game.cpu_score = this.score;
	    
            //var test = this.aiTimer.delta()%2;
            //if (this.aiTimer.delta()%2 > 0.01){
            var puck = ig.game.getEntityByName( 'puck' );
            
            // if the puck exists and the positon value defined, then the
            // AI should react, else, do nothing
            if (puck === undefined){
		console.log("puck position is undefined" );
	    } else {
		// "AI" HAH! lulz....
		if( puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2) {
		    //this.body.ApplyForce( new b2.Vec2(0,20), this.body.GetPosition() );
		    this.vectorDown();
		} else {
		    //this.body.ApplyForce( new b2.Vec2(0,-20), this.body.GetPosition() );
		    //this.currentAnim = this.anims.vectorUp.rewind();
		    this.vectorUp();
		}

		// Attack the puck!
		var pVel = puck.body.GetLinearVelocity();
		if (Math.abs(pVel.x) < 3) {
		    if (puck.pos.x > this.pos.x){
			//this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
			this.vectorRight();
		    } else if (puck.pos.x < this.pos.x) {
			//this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
			this.vectorLeft();
		    }
		} else if (Math.abs(pVel.x) < 4.5 && puck.pos.x < ig.system.width / 2) {
		    if (puck.pos.x > this.pos.x){
			//this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
			this.vectorRight();
		    } else if (puck.pos.x < this.pos.x) {
			//this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
			this.vectorLeft();
		    }
		} else {
		    // "AI" doesn't move too far away froom left wall
		    var p = this.body.GetPosition();
		    if(p.x < 3) {
			//this.body.ApplyForce( new b2.Vec2(5,0), this.body.GetPosition() );
			this.vectorRight();
		    } else if (p.x > 5) {
			//this.body.ApplyForce( new b2.Vec2(-5,0), this.body.GetPosition() );
			this.vectorLeft();
		    }
		}
            }
            //this.aiTimer.reset();
            //}
            
            this.parent();
	}
	
    });
    
});