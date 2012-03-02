ig.module(
    'game.entities.paddle-cpu'
)
.requires(
    'game.entities.paddle',
    'game.entities.puck',
    'plugins.box2d.entity'
)
.defines(function(){

EntityPaddleCpu = EntityPaddle.extend({

    // name entity for ease
    name: 'CPU',
    
    // Load sounds
    puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
    paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),

    update: function() {
        var puck = ig.game.getEntitiesByType( EntityPuck )[0];
        
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
        
        // Get for puck leaving game space "Tunneling"
	// Ivar vel = this.body.GetLinearVelocity();f found, spawn at random point on map with new velocity
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
                    ig.game.cpu_score += 100;
                } else {
                    this.paddleSound.play();
                }
            }
        }
        
        // Update Position
        this.body.SetXForm(this.body.GetPosition(), 0);
        
        this.parent();
    }
    
    });
     
});