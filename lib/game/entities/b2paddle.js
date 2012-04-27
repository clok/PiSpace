ig.module( 
	'game.entities.b2paddle'
)
.requires(
        'plugins.box2d.b2entity'
)
.defines(function(){

    Box2DPaddle = ig.Box2DEntity.extend({
	body: null,

	createBody: function() {
	    this.parent();
            
	    // define as 'bullet' to improve collision detection and
	    // eliminate tunneling issues
	    this.body.SetBullet(true);
            this.body.SetAngle(0);
	    this.body.SetFixedRotation(true);
	    this.body.userData = 'paddle';
	    
	    // CreateFixture2( var shapedef, density )
	    this.body.m_fixtureList.SetDensity(0.1);
	    this.body.m_fixtureList.SetRestitution(0.0);
	    this.body.m_fixtureList.SetFriction(0.0);
	},
	
	// Draw using HTML5 Canvas methods to achieve older look
	draw: function() {
	    var ctx = ig.system.context;
	    var s = ig.system.scale;
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    var sizeX = this.size.x * s;
	    var sizeY = this.size.y * s;
	    
            //ctx.fillStyle = this.color;
            //ctx.fillRect( x, y, sizeX, sizeY);
	    ctx.strokeStyle = this.color;
	    ctx.strokeRect(x,y,sizeX,sizeY);
            this.parent();
	    ctx.restore();
	    
	    /*
	    // Draw more complex shapes
	    // TODO
	    ctx.strokeStyle = this.color;
	    ctx.beginPath();
	    ctx.moveTo(x,y);
	    for (var i = 1; i < this.verts.length; i++){
		ctx.lineTo(x + this.verts[i][0],y + this.verts[i][1]);
	    }
	    ctx.closePath();
	    ctx.stroke();  
	    this.parent();
	    ctx.restore();
	    */
	},

    });


});