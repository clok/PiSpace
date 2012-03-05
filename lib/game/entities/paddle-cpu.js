ig.module(
    'game.entities.paddle-cpu'
)
.requires(
    'game.entities.paddle',
    'plugins.box2d.entity',
    'game.entities.particle',
    'game.entities.onamona'
)
.defines(function(){

EntityPaddleCpu = EntityPaddle.extend({

    // name entity for ease
    name: 'CPU',
    
    // Load sounds
    puckSound: new ig.Sound( 'media/soundfx/Pickup_Coin6.mp3' ),
    paddleSound: new ig.Sound( 'media/soundfx/Hit_Hurt.mp3' ),
    tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),

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
                    } else if (num == 0){
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
        
        // Update Position
        this.body.SetXForm(this.body.GetPosition(), 0);
        
        this.body.SetXForm(this.body.GetPosition(), 0);
	
        // Keep Paddle from leaving game space "Tunneling"
        // If found, spawn at start point on map
        // Need to investigate "DestroyProxy" in Box2D for this.
        var p = this.body.GetPosition();
        if (((p.x - this.size.x/20) < 0.6)
            || ((p.x + this.size.x/20) > 47.3)
            || ((p.y - this.size.y/20) < 1.5)
            || ((p.y + this.size.y/20) > 26.5)
            ){
            // Play soundfx
            this.tunnelSound.play();
            
            // Spawn BANNER graphic
            ig.game.spawnEntity( TunnelGib, 26, 130 );
            
            // Spawn NEW Paddle
            //ig.game.spawnEntity( EntityPaddlePlayer, randPos.x*10, randPos.y*10 );
            ig.game.spawnEntity( EntityPaddleCpu, 26, 130 );
            
            // Spawn FireGibs
            for (var i=0;i<=10;i++){
                ig.game.spawnEntity( FireGib, 26, 130 );
            }
            // Remove previous Paddle
            this.kill();
            this.parent();
        }
        
        this.parent();
    }
    
    });
    
});