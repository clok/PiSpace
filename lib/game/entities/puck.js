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
	
	// Get for puck leaving game space "Tunneling"
	// If found, spawn at random point on map with new velocity
	// Need to investigate "DestroyProxy" in Box2D for this.
        var p = this.body.GetPosition();
        if (p.x < 0.8 || p.x > 47.2 || p.y < 1.6 || p.y > 26.4){
            this.randomPos( this.body );
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