ig.module(
    'game.entities.paddle'
)
.requires(
    'impact.entity',
    'plugins.box2d.entity',
    'game.entities.particle',
    'game.entities.onamona'
)
.defines(function(){

    EntityPaddle = ig.Box2DPaddle.extend({
	
        size: {x:8, y:40},
        startPosition: null,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
	
        // Load tileset for animations    
        animSheet: new ig.AnimationSheet( 'media/sprites/paddle-red.png', 8, 40 ),
	
        tunnelSound: new ig.Sound( 'media/soundfx/Continue.mp3' ),
        
        init: function( x, y, settings ){
            // do initial Box2D entity stuff first
            this.parent( x, y, settings );
            
            // add animation tils for directions
            this.addAnim( 'idle', 0.1, [0] );
            this.addAnim( 'vectorUp', 0.1, [1] );
            
            // Timer for ai scaling
            this.aiTimer = new ig.Timer();
            
            // Set velocity to Zero at startup
            // Needed for respawn
            this.body.SetLinearVelocity( new b2.Vec2(0,0) );
            
            this.body.entity = this;
        },
        
        update: function() {
            // Don't allow angle to change on paddle 
            this.angle = 0;
            this.body.SetAngularVelocity(0);
            
            // moved SetXForm to here to avoid destruction glitches
            this.body.SetXForm(this.body.GetPosition(), 0);
            this.parent();
        },
        
        // POTENTIALLY WORHTLESS!
        /*
        tunnelCheck: function() {
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
		ig.game.spawnEntity( TunnelGib, this.startPosition.x - 90, this.startPosition.y + this.size/2 );
		
		// Spawn FireGibs
		for (var i=0;i<=10;i++){
                    ig.game.spawnEntity( FireGib, this.startPosition.x, this.startPosition.y + this.size/2);
		}
		
                // Set the Paddle back to it's start position
		this.body.SetXForm(new  b2.Vec2(this.startPosition.x, this.startPosition.y), 0);
		// Remove previous Paddle
		//this.kill( this.startPosition );
            }
            
        }
        */
        
    });
    
});