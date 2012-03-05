ig.module(
    'game.entities.paddle'
)
.requires(
    'impact.entity',
    'plugins.box2d.entity'
)
.defines(function(){

    EntityPaddle = ig.Box2DPaddle.extend({
     
        size: {x:8, y:40},
        startPosition: null,
        
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
    
        // Load tileset for animations    
        animSheet: new ig.AnimationSheet( 'media/paddle-red.png', 8, 40 ),
    
        init: function( x, y, settings ){
            this.parent( x, y, settings );

            this.addAnim( 'idle', 0.1, [0] );
            this.addAnim( 'vectorUp', 0.1, [1] );
        
            this.body.entity = this;
        },
        
    });
    
});