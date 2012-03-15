ig.module(
    'game.entities.paddle-cpu-2'
)
.requires(
    'game.entities.paddle',
    'game.entities.particle'
)
.defines(function(){

    EntityPaddleCpu2 = EntityPaddle.extend({

	// name entity for ease
	name: 'CPU2',
	startPosition: { x: 452, y: 130 },
        fuel: 100,
	burn: 1,
	color: 'blue',
	
	// Load sounds
	puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin2.mp3' ),
	paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
	
	// Load specific anim tileset for Player Paddle
	animSheet: new ig.AnimationSheet( 'media/sprites/paddle-blue.png', 8, 40 ),
	
	update: function() {
	    
	    // Check for collisions, react & return
	    this.checkCollisions();
	    
	    var puck = ig.game.getEntityByName( 'puck' );
	    
	    // if the puck exists and the positon value defined, then the
            // AI should react, else, do nothing
            if (this.fuel > 0){
		// "AI" HAH! lulz....
		if( puck.pos.y + puck.size.y/2 > this.pos.y + this.size.y/2) {
		    this.body.ApplyForce( new b2.Vec2(0,20), this.body.GetPosition() );
		} else {
		    this.body.ApplyForce( new b2.Vec2(0,-20), this.body.GetPosition() );
		    //this.currentAnim = this.anims.vectorUp.rewind();
		}
		
		// Attack the puck!
		var pVel = puck.body.GetLinearVelocity();
		if (Math.abs(pVel.x) < 3) {
		    if (puck.pos.x > this.pos.x){
			this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
		    } else if (puck.pos.x < this.pos.x) {
			this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
		    }
		} else if (Math.abs(pVel.x) < 4.5 && puck.pos.x > ig.system.width / 2) {
		    if (puck.pos.x > this.pos.x){
			this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
		    } else if (puck.pos.x < this.pos.x) {
			this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
		    }
		} else {
		    // "AI" doesn't move too far away froom right wall
		    var p = this.body.GetPosition();
		    if(p.x < 43) {
			this.body.ApplyForce( new b2.Vec2(5,0), this.body.GetPosition() );
		    } else if (p.x > 45) {
			this.body.ApplyForce( new b2.Vec2(-5,0), this.body.GetPosition() );
		    }
		}
		
		// update fuel
		ig.game.FUEL.BLUE = this.fuel;
	    }
	    
	    if (this.fuel < 2 && this.aiTimer.delta() < 0){
	        this.aiTimer.reset();
	    }
	    
	    this.parent();
	    
	}
	
    });
    
});