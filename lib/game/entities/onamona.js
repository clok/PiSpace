ig.module(
    'game.entities.onamona'
).requires(
    'impact.entity'
).defines(function(){
    
    /*
      Class to display banner style words as particles.
      first try will use sprites.
    */
    EntityOnamona = ig.Entity.extend({
	offset: { x:0, y:0 },
	minBounceVelocity: 0,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	lifetime: 1,
	fadetime: 0.5,
	
	init: function ( x , y, settings ){
	    this.parent( x, y, settings );
            this.currentAnim = this.anims.idle.rewind();
	    this.idleTimer = new ig.Timer();
	},
	
        update: function (){
	    if(this.idleTimer.delta() > this.lifetime){
		this.kill();
		return;
	    }
	    this.currentAnim.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
	    this.parent();
	}
	
    });
    
    TunnelGib = EntityOnamona.extend({
        size: { x: 79, y: 9 },
        friction:{ x: 0, y: 0 },
        vel: { x: 0, y: 0 },
	gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/sprites/tunnel_letters.png',79,9),
        
        init:function( x, y, settings ){
	    this.addAnim( 'idle', 0.11, [0,1,2,3,4,5,6,7,8] );
	    this.parent( x, y, settings );
	}
    });    
});