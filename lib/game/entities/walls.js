ig.module(
    'game.entities.walls'
)
.requires(
    'plugins.box2d.b2static'
)
.defines(function(){
    
    EntityWalls = ig.Box2DStatic.extend({
        name: null,
        size: null,
        
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
        init: function( x, y, settings ){
            this.parent( x, y, settings );
            this.addAnim( 'idle', 1, [0] );
            this.body.entity = this;
        },
        
        createBody: function() {
	    this.parent();
            this.body.userData = this.name;
        }
        
    });

    TopWall = EntityWalls.extend({
       name: 'topWall',
       size: { x: 480, y: 8 },
       
       animSheet: new ig.AnimationSheet( 'media/sprites/topWall.png', 480, 8 ),
       
    });
    
    BottomWall = EntityWalls.extend({
       name: 'bottomWall',
       size: { x: 480, y: 8 },
       
       animSheet: new ig.AnimationSheet( 'media/sprites/topWall.png', 480, 8 ),
       
    });
    
    LeftWall = EntityWalls.extend({
       name: 'leftWall',
       size: { x: 8, y: 272 },
       
       animSheet: new ig.AnimationSheet( 'media/sprites/leftWall.png', 8, 272 ),
       
    });
    
    RightWall = EntityWalls.extend({
       name: 'rightWall',
       size: { x: 8, y: 272 },
       
       animSheet: new ig.AnimationSheet( 'media/sprites/leftWall.png', 8, 272 ),
       
    });
});
