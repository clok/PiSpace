ig.module(
    'game.entities.circPuck'
)
.requires(
    'game.entities.b2circPuck',
    'game.entities.particle',
    'game.entities.b2particle',
    'game.entities.onamona',
    'plugins.color-picker'
)
.defines(function(){

    EntityCircPuck = Box2DCircPuck.extend({
	
	name: 'puck',
	color: 'green',
    	radius: 2.5,	
	prevContact: null,

	// Initialize ColorPicker
	picker: new ColorPicker,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),    
	
	init: function( x, y, settings ){
	    this.parent( x, y, settings );
            
            // Set random velocity at start
            this.randomVel(this.body);
            
	    this.body.entity = this;
	},

	update: function(){
            // do update first, then check for special cases
            this.parent();
	    
	    // Iterate over all contact edges for this body. m_contactList is 
	    // a linked list, not an array, hence the "funny" way of iterating 
	    // over it
	    for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
                // Check if the other body for this contact is an entity
                if( edge.other.entity && edge.other.userData != 'particle') {
		    // Check if it is actually touching
		    if (edge.contact.IsTouching()){
			// Check if it is a paddle
			if (edge.other.userData == 'paddle'){
			    // Apply a multiplier
			    if (edge.other.entity.score_color == 'red'){
				ig.game.MULTI.RED++;
				ig.game.MULTI.BLUE = 1;
				this.prevContact = 'red';
			    } else if (edge.other.entity.score_color == 'blue'){
				ig.game.MULTI.BLUE++;
				ig.game.MULTI.RED = 1;
				this.prevContact = 'blue';
			    }
			    // If "this" wall is hit deduct points applying
			    // enemies multiplier
			} else if (edge.other.userData == 'leftWall'){
			    ig.game.SCORE.RED -= 10*ig.game.MULTI.BLUE;
			    ig.game.MULTI.RED = 1;
			} else if (edge.other.userData == 'rightWall'){
			    ig.game.SCORE.BLUE -= 10*ig.game.MULTI.RED;
			    ig.game.MULTI.BLUE = 1;
			}
		    }
		}
	    }

	    // Get for puck leaving game space "Tunneling"
	    // If found, spawn at random point on map with new velocity
	    // Need to investigate "DestroyProxy" in Box2D for this.
            var p = this.body.GetPosition();
	    if (p.x < 0.8 || p.x > (ig.system.width - 8) / 10 || p.y < 1.6 || p.y > (ig.system.height - 8) / 10){
		// Play soundfx
		this.tunnelSound.play();
		
		// Add bonus points to player that caused tunnel
		if (this.prevContact == 'red'){
		    ig.game.SCORE.RED += 1337;
		} else {
		    ig.game.SCORE.BLUE += 1337;
		}
		
		// Range of acceptable values is: 0.8 > x < 47.2 & 1.6 > y < 26.4
		// generate random location and random velocity
		var randPos = {x: Math.random()*45 + 1, y: Math.random()*23 + 2};
		
		// Place puck at new location
		this.body.SetPositionAndAngle( new b2.Vec2(randPos.x, randPos.y), 0);
		
		// Generate a random Velocity
		this.randomVel( this.body );
		
		// Spawn BANNER graphic
		ig.game.spawnEntity( TunnelGib, randPos.x*10, randPos.y*10 );
		
		// Spawn FireGibs
		for (var i = 0; i <= 10; i++){
                    ig.game.spawnEntity( FireGib, randPos.x*10, randPos.y*10 );
		}
		
	    }
	    
	    // Spawn particles based off of angular velocity
	    var av = this.body.GetAngularVelocity();
	    if (av > 0 && av < 1){
		av = 1;
	    } else {
		av = parseInt(av);
	    }
	    for (i = 1; i <= av; i++){
		ig.game.spawnEntity( Box2DFireGib, p.x*10, p.y*10 );
	    }

	    // Set color based on speed
	    var mag = Math.abs(this.body.GetLinearVelocity().Length()) / 100;
	    if (mag > 1){
		mag = this.picker.triColors.length - 1;
	    } else {
		mag = parseInt(mag * 100);
	    }
	    this.color = this.picker.hexToRGBstr( this.picker.triColors[mag] );
	}

    });
});