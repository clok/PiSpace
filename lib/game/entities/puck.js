ig.module(
    'game.entities.puck'
)
.requires(
    'plugins.box2d.entity'
)
.defines(function(){

EntityPuck = ig.Box2DEntity.extend({
    
    name: 'puck',    
    
    size: {x:4, y:4},
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
    animSheet: new ig.AnimationSheet( 'media/puck.png', 4, 4 ),
    
    tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),    
    
    init: function( x, y, settings ){
	this.parent( x, y, settings );
        
        this.addAnim( 'idle', 0.1, [0,1,2,3,4,4,4,3,2,1] );
        
        // Set random velocity at start
        this.randomVel(this.body);
        
        this.body.entity = this;
    },

    update: function(){
	this.body.SetXForm(this.body.GetPosition(), 0);
	
	// test velocity of puck to make sure it is moving horizontally
	var vel = this.body.GetLinearVelocity();
	if (vel.x < 1 && vel.x > -1){
	    this.body.SetLinearVelocity(new b2.Vec2(vel.x*3,vel.y));
	}
	
	// Get for puck leaving game space "Tunneling"
	// If found, spawn at random point on map with new velocity
	// Need to investigate "DestroyProxy" in Box2D for this.
	var p = new b2.Vec2(this.body.m_xf.position.x, this.body.m_xf.position.y);
        if (p.x < 0 || p.x > 47 || p.y < 0 || p.y > 27){
            this.randomPos( this.pos );
            this.body.SetXForm(this.pos, 0);
            this.randomVel(this.body);
            this.tunnelSound.play();
        } else {
            // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating 
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
                // Check if the other body for this contact is an entity
                if( edge.other.entity ) {
                    // do something
                }
            }
        }
	this.parent();
    }
    
    });
     
});