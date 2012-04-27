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
	
        createBody: function() {
	    this.parent();
            this.body.userData = this.name;
        },
	
	// Draw using HTML5 Canvas methods to achieve older look
	draw: function() {
	    var ctx = ig.system.context;
	    var s = ig.system.scale;
	    var x = (this.pos.x - ig.game.screen.x) * s;
	    var y = (this.pos.y - ig.game.screen.y) * s;
            ctx.fillStyle = this.color;
            ctx.fillRect( x, y, this.size.x * s, this.size.y * s);
            this.parent();
	    ctx.restore();
	},
        
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
    });
    
    RightWall = EntityWalls.extend({
       name: 'rightWall',
       color: 'white',
       size: { x: 8, y: 272 },
    });
});
