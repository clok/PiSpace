ig.module(
    'game.entities.paddle-player-2'
)
.requires(
    'game.entities.paddle',
    'plugins.box2d.entity'
)
.defines(function(){

EntityPaddlePlayer2 = EntityPaddle.extend({

    // name entity for ease
    name: 'Player2',

    // Load sounds
    puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
    paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
    
    update: function() {
        
        // Apply user control
        if ( ig.input.state('w')){
            this.body.ApplyForce( new b2.Vec2(0,-18), this.body.GetPosition() );
        } else if ( ig.input.state('s')){
            this.body.ApplyForce( new b2.Vec2(0,18), this.body.GetPosition() );
        }
        
        if ( ig.input.state('a')){
            this.body.ApplyForce( new b2.Vec2(-10,0), this.body.GetPosition() );
        } else if ( ig.input.state('d')){
            this.body.ApplyForce( new b2.Vec2(10,0), this.body.GetPosition() );
        }
        
        // Get for puck leaving game space "Tunneling"
	// If found, spawn at random point on map with new velocity
	// Need to investigate "DestroyProxy" in Box2D for this.
	var local = new b2.Vec2(this.body.m_xf.position.x, this.body.m_xf.position.y);
        if (local.x < 0 || local.y < 0){
            // get new position
            local.x = 0;
            local.y = 0;
            // update new position in game world
            this.body.SetXForm(local, 0);
        } else if (local.x > 47 || local.y > 27) {
            // get new position
            local.x = 47;
            local.y = 27;
            // update new position in game world
            this.body.SetXForm(local, 0);
        }
        
        // Iterate over all contact edges for this body. m_contactList is 
        // a linked list, not an array, hence the "funny" way of iterating
        // over it
        for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
            // Check if the other body for this contact is an entity
            if( edge.other.entity ) {
                if (edge.other.entity.size.x == 4 && edge.other.entity.size.y == 4){
                    this.puckSound.play();
                    ig.game.player2_score += 100;
                } else {
                    this.paddleSound.play();
                }
            }
        }
        
        // Update position
        this.body.SetXForm(this.body.GetPosition(), 0);        
        
        this.parent();
    }
    
    });
     
});