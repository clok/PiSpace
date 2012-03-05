ig.module(
    'game.entities.puck'
)
.requires(
    'plugins.box2d.entity',
    'game.entities.particle',
    'game.entities.onamona'
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
        // do update first, then check for special cases
        this.parent();
        
	this.body.SetXForm(this.body.GetPosition(), 0);
	
	// Get for puck leaving game space "Tunneling"
	// If found, spawn at random point on map with new velocity
	// Need to investigate "DestroyProxy" in Box2D for this.
        var p = this.body.GetPosition();
        if (p.x < 0.8 || p.x > 47.2 || p.y < 1.6 || p.y > 26.4){
            
            // Remove previous puck
            this.kill();
            
            // Play soundfx
            this.tunnelSound.play();
            
            // Range of acceptable values is: 0.8 > x < 47.2 & 1.6 > y < 26.4
	    // generate random location and random velocity
            var randPos = {x: Math.random()*45 + 1, y: Math.random()*23 + 2};

            // Spawn BANNER graphic
            ig.game.spawnEntity( TunnelGib, randPos.x*10, randPos.y*10 );
            
            // Spawn NEW puck
            ig.game.spawnEntity( EntityPuck, randPos.x*10, randPos.y*10 );
            
            // Spawn FireGibs
            for (var i=0;i<=10;i++){
                ig.game.spawnEntity( FireGib, randPos.x*10, randPos.y*10 );
            }
            
        } else {
            // Iterate over all contact edges for this body. m_contactList is 
            // a linked list, not an array, hence the "funny" way of iterating 
            // over it
            for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
                // Check if the other body for this contact is an entity
                if( edge.other.entity ) {
                    //ig.game.spawnEntity(FireGib,this.pos.x,this.pos.y);
                }
            }
        }
    }
    
    });

});