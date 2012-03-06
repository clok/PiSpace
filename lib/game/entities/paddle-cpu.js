ig.module(
    'game.entities.paddle-cpu'
)
.requires(
    'game.entities.paddle',
    'plugins.box2d.entity',
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
            
            // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity ) {
                    if (edge.other.entity.size.x == 4 && edge.other.entity.size.y == 4){
			this.puckSound.play();
			ig.game.cpu_score += 100;
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
		} else if (Math.abs(pVel.x) < 4.5 && puck.pos.x < ig.system.width / 2) {
		    if (puck.pos.x > this.pos.x){
			this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
		    } else if (puck.pos.x < this.pos.x) {
			this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
		    }
		} else {
		    // "AI" doesn't move too far away froom left wall
		    var p = this.body.GetPosition();
		    if(p.x < 3) {
			this.body.ApplyForce( new b2.Vec2(5,0), this.body.GetPosition() );
		    } else if (p.x > 5) {
			this.body.ApplyForce( new b2.Vec2(-5,0), this.body.GetPosition() );
		    }
		}
            }
            //this.aiTimer.reset();
            //}
            
            this.parent();
	},
        /*
        kill: function( startPos ){
            this.parent();
            // Spawn NEW Paddle
            ig.game.spawnEntity( EntityPaddleCpu, startPos.x, startPos.y );
        }
        */
    });
    
});