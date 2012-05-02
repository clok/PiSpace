ig.module(
    'game.entities.particle'
).requires(
    'impact.entity'
).defines(function(){
    
    EntityParticle = ig.Entity.extend({
	// single pixel sprites
	size: { x:1, y:1 },
		
	// Initialize ColorPicker
	picker: new ColorPicker,

	// particle will collide but not effect other entities
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.LITE,
	
	// default particle lifetime & fadetime
	lifetime: 5,
	fadetime: 1,
	alpha: 255,

	// particles will bounce off other entities when it collides
	minBounceVelocity: 0,
	bounciness: 1.0,
	friction: { x:0, y:0 },

	init:function( x, y, settings ){
	    this.parent( x, y, settings );
	    
	    // take velocity and add randomness to vel
	    var vx = this.vel.x;
	    var vy = this.vel.y;
	    this.vel.x = (Math.random()*2-1)*vx;
	    this.vel.y = (Math.random()*2-1)*vy;
	    
	    // init timer for fadetime
	    this.idleTimer = new ig.Timer();
	},
	
        update: function() {
	    // check if particle has exsisted past lifetime
	    // if so, remove particle
	    if(this.idleTimer.delta() > this.lifetime){
		this.kill();
		return;
	    }
	    
	    // fade the particle effect using the aplha blend
	    this.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
	    
	    this.parent();
	},

	draw: function() {
	    var ctx = ig.system.context;
	    var s = ig.system.scale;
	    var x = this.pos.x * s - ig.game.screen.x * s;
	    var y = this.pos.y * s - ig.game.screen.y * s;
	    var id = ctx.createImageData( 1, 1 );
	    var rgba = this.picker.hexToRGBA( this.picker.colors[parseInt(Math.random()*100-1)] );
	    var d  = id.data;
	    d[0] = rgba[0];
	    d[1] = rgba[1];
	    d[2] = rgba[2];
	    if (this.alpha > 1) {
		d[3] = rgba[3];
	    } else {
		d[3] = rgba[3] * this.alpha;
	    }
	    ctx.putImageData( id, x, y );
	    ctx.restore();
	}
	
    });
    
    FireGib = EntityParticle.extend({
	// shorter lifetime
        lifetime: 1.0,
        fadetime: 0.75,
	
	// velocity value to be set
        vel: null,
	
	gravityFactor: 0,
	
	// bounce a little less
	bounciness: 0.6,
	        
        init:function( x, y, settings ){
	    // update random velocity to create starburst effect
	    this.vel = { x: (Math.random() < 0.5 ? -1 : 1)*Math.random()*100,
			 y: (Math.random() < 0.5 ? -1 : 1)*Math.random()*100 };
	    
	    // send to parent
	    this.parent( x, y, settings );

	    // generate color gradient for FireGib
	    this.picker.colors = this.picker.genMultiHexArray( [0xFFFF00, 0xFF4500, 0xFF0000], 50);
	}
    });
    
    BlueFireGib = EntityParticle.extend({
	// shorter lifetime
        lifetime: 0.3,
        fadetime: 0.15,
	
	// velocity value to be set
        vel: null,
	
	gravityFactor: 0,
	
	// bounce a little less
	bounciness: 0.6,
	        
        init:function( x, y, settings ){
	    // update random velocity to create starburst effect
	    this.vel = { x: (Math.random() < 0.5 ? -1 : 1)*Math.random()*20,
			 y: (Math.random() < 0.5 ? -1 : 1)*Math.random()*20 };
	    
	    // send to parent
	    this.parent( x, y, settings );
	    
	    // generate color gradient for BlueFireGib
	    this.picker.colors = this.picker.genHexArray( 0xFFFFFF, 0x0000FF, 100 );
	}
    });
    
});