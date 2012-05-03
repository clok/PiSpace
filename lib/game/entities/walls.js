ig.module(
    'game.entities.walls'
)
.requires(
    'plugins.box2d.b2static',
    'plugins.color-picker'
)
.defines(function(){
    
    EntityWalls = ig.Box2DStatic.extend({
        name: null,
        size: null,
        picker: new ColorPicker,
	iter: 0,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
        createBody: function() {
	    this.parent();
            this.body.userData = this.name;
	    this.picker.colors = this.picker.genHexArray( 0xFFFFFF, 0xFF0000, 10 );
        },
	
	// Draw using HTML5 Canvas methods to achieve older look
	draw: function() {
	    // Get context
	    var ctx = ig.system.context;

	    // Get SCALE
	    var s = ig.system.scale;

	    // Get location of entity
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    
	    // Get Size of BOX entity
	    var sizeX = this.size.x * s;
	    var sizeY = this.size.y * s;
	    
	    // Set fill Color
	    ctx.fillStyle = this.color;
	    
	    // Fill entity as rectangle based of location and size
	    ctx.fillRect( x, y, sizeX, sizeY );
	}

    });

    TopWall = EntityWalls.extend({
	name: 'topWall',
	size: { x: 480, y: 8 },
	color: 'white',
    });
    
    BottomWall = EntityWalls.extend({
	name: 'bottomWall',
	size: { x: 480, y: 8 },
	color: 'white',
    });
    
    LeftWall = EntityWalls.extend({
	name: 'leftWall',
	color: 'white',
	size: { x: 8, y: 272 },

	/* TODO: Change colors based on Contact
	update: function() {
	    for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
		// Check if the other body for this contact is an entity
		if( edge.other.entity && edge.other.userData != 'particle') {
		    // Check if it is actually touching
		    if (edge.contact.IsTouching()){
			// Check if it is the puck
			if (edge.other.userData == 'puck'){
			    if (this.iter < this.picker.colors.length){
				this.iter++;
			    } else {
				this.iter = 0;
			    }
			    this.color = this.picker.colors[this.iter];
			}
		    }
		}
	    }
	    
	    this.parent();
	}
	*/

    });
    
    RightWall = EntityWalls.extend({
	name: 'rightWall',
	color: 'white',
	size: { x: 8, y: 272 },
    });
});
