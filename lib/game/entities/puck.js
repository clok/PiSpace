ig.module(
    'game.entities.puck'
)
.requires(
    'game.entities.b2puck',
    'game.entities.particle',
    'game.entities.b2particle',
    'game.entities.onamona'
)
.defines(function(){

    EntityPuck = Box2DPuck.extend({
	
	name: 'puck',	
	size: {x:4, y:4},
	color: 'green',
	prevContact: null,
	
	// Place holder vert arrays for drawing bodies
	verts: new Array,
	b2verts: new Array,

	// Place holders for specific shape designs
	squareVerts: new Array,
	rectVerts: new Array,
	triVerts: new Array,
	polyVerts: new Array,
	
	// Initialize ColorPicker
	picker: new ColorPicker,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),  
	
	init: function( x, y, settings ){
	    // Set verticies first
	    // CW
	    this.squareVerts = [
		[0, 0],
		[this.size.x, 0],
		[this.size.x, this.size.y],
		[0, this.size.y]
	    ];
	    this.rectVerts = [ 
		[0,0], 
		[this.size.x/2, 0], 
		[this.size.x/2, this.size.y * 2], 
		[0, this.size.y * 2] 
	    ];
	    this.polyVerts = [ 
		[this.size.x/4, 0], 
		[this.size.x - this.size.x/4 ,0], 
		[this.size.x, this.size.y/4], 
		[this.size.x, 0.75 * this.size.y], 
		[this.size.x - this.size.x/4, this.size.y], 
		[this.size.x/4, this.size.y], 
		[0, 0.75 * this.size.y], 
		[0, this.size.y/4]
	    ];
	    this.triVerts = [
		[this.size.x/2, -this.size.y/2],
		[this.size.x, this.size.y],
		[0, this.size.y]
	    ];
	    
	    this.setVerts( this.rectVerts );

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
			    if (edge.other.entity.color == 'red'){
				ig.game.MULTI.RED++;
				ig.game.MULTI.BLUE = 1;
				this.prevContact = 'red';
			    } else if (edge.other.entity.color == 'blue'){
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
	    if (p.x < 0.8 || p.x > (ig.system.width - 8) / 10 
		|| p.y < 1.6 || p.y > (ig.system.height - 8) / 10
	       ){
		// Play soundfx
		this.tunnelSound.play();
		
		// Add bonus points to player tha caused tunnel
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
	    if (av > 30) {
		// Surprisingly this is enough for a cool effect
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
	},

	setVerts: function( verts ){
	    // Convert verts to Box2D verts
	    for (var i = 0; i < verts.length; i++){
		this.b2verts[i] = new b2.Vec2( (verts[i][0] - this.size.x/2)/10,
					       (verts[i][1] - this.size.y/2)/10);
	    }

	    // Convert verts to Draw verts
	    for (var i = 0; i < verts.length; i++){
		this.verts[i] = [ (verts[i][0] - this.size.x/2),
				  (verts[i][1] - this.size.y/2)
				];
	    }

	    return;
	},
    });
});