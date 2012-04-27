ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    
    //'impact.debug.debug',
    
    'game.entities.b2particle',
    'game.entities.onamona',
    'game.entities.puck',
    'game.entities.circPuck',
    'game.entities.walls',
    'game.entities.paddle-cpu',
    'game.entities.paddle-cpu-2',
    'game.entities.paddle-player',
    'game.entities.paddle-player-2',

    'game.levels.title',
    
    'plugins.impact-splash-loader',
    'plugins.box2d.game'
)
.defines(function(){

    if( ig.ua.mobile ) {
	// Disable sound for all mobile devices
	ig.Sound.enabled = false;
    }
    
    // Investigating Sound ERROR.  Sound off for now
    ig.Sound.enabled = false;
    
    PiSpace = ig.Box2DGame.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	// Load images for title screen
	thegrid:new ig.Image('media/thegrid.png'),
	logo: new ig.Image ( 'media/bigc.png' ),
	title: new ig.Image ( 'media/title.png' ),

	// Init menu timer val
	introTimer: null,
	fireTimer: null,

	// load sounds here
	bgm1: new ig.Sound( 'media/ost/flowdown.mp3', false ),
	
	// Use Mode to determine game state
	mode: 0,
	menu: null,
	menuText: [
	    '1: 1 Player vs. AI',
	    '2: 2 Player Duel',
	    '3: AI War!',
	    '',
	    'Controls:',
	    'Player 1: up,down,left,right',
	    'Player 2: w,a,s,d',
	    'ESC: Reset to Title Screen',
	    'm/u to stop/start BGM'
	],
	building: true,
	hud: 16,
	
	// Work on color gradiant.  want JET
	colors: [
	    '0,256,0',
	    '155,206,51',
	    '155,206,0',
	    '206,155,0',
	    '206,100,51',
	    '256,0,0'
	],
	
	// Initialize global scores
	SCORE: { RED: 0, BLUE: 0 },
	
	// Initialize global fuel values
	FUEL: { RED: 100, BLUE: 100 },
	
	// Initialize score multipliers
	MULTI: { RED: 1, BLUE: 1 },
	
	init: function() {
	    // sound management keys
	    ig.input.bind( ig.KEY.M, 'mute' );
	    ig.input.bind( ig.KEY.U, 'unmute' );
	    
	    // Menu access
	    ig.input.bind(ig.KEY.ESC,'menu');
	    
	    // Player 1  Input
	    ig.input.bind( ig.KEY.UP_ARROW, 'up' );
	    ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
	    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
	    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
	    ig.input.bind( ig.KEY.SHIFT, 'rotate' );
	    ig.input.bind( ig.KEY.CTRL, 'boost' );

	    // Player 2 input
	    ig.input.bind( ig.KEY.W, 'w' );
	    ig.input.bind( ig.KEY.S, 's' );
	    ig.input.bind( ig.KEY.A, 'a' );
	    ig.input.bind( ig.KEY.D, 'd' );
	    ig.input.bind( ig.KEY.Q, 'q' );
	    ig.input.bind( ig.KEY.SPACE, 'space' );
	    
	    // Define inputs to listen for on Menu
	    ig.input.bind( ig.KEY._1, 'opt1' );
	    ig.input.bind( ig.KEY._2, 'opt2' );
	    ig.input.bind( ig.KEY._3, 'opt3' );

	    // add ost to playlist
	    ig.music.add( this.bgm1 );
	    
	    // Set timer for flashing text
	    this.introTimer = new ig.Timer(1);
	    
	    // Set timer for fireworks
	    this.fireTimer = new ig.Timer(1);

	    // add ost to playlist
	    ig.music.add( this.bgm1 );

	    // start playing the ost
	    ig.music.play();
	    
	    // if mobile, set to AI War!
	    if( ig.ua.mobile ) {
		this.mode = PiSpace.MODE.AI;		
	    }
	    
	    // Load the level
	    this.loadLevel( LevelTitle );
	    /*
	    // Add grid pattern to menu page
	    var bg = new ig.BackgroundMap(62,[[1]],this.thegrid);
	    bg.repeat = true;
	    this.backgroundMaps.push(bg);
	    */
	},
	
	update: function() {
	    this.parent(); 
	    
	    // Listen for player input for sound
	    if (ig.input.pressed('mute')){
		ig.music.fadeOut(2);
	    } else if (ig.input.pressed('unmute')){
		ig.music.play();
	    }
	    
	    if ( !ig.ua.mobile ){
		if (this.mode == PiSpace.MODE.TITLE) {
		    // If input is pressed, load level for that option
		    if(ig.input.pressed('opt1')){
			this.clearScreen();
			this.buildSPGame();
		    } else if(ig.input.pressed('opt2')){
			this.clearScreen();
			this.buildMPGame();
		    } else if(ig.input.pressed('opt3')){
			this.clearScreen();
			this.buildAIGame();
		    }

		    // Set random postion for Fireworks
		    var randPos = {x: Math.random()*450 + 10, y: Math.random()*230 + 20};
		    
		    // Use timer to spawn fireworks every second
		    if ( this.fireTimer.delta() > 0 ){
			for (var i = 0; i <= 100; i++){
			    ig.game.spawnEntity( FireGib, randPos.x, randPos.y );
			}
			this.fireTimer.reset();
		    }
		} else {
		    if (ig.input.pressed('menu')){
			this.clearScreen();
			this.mode = PiSpace.MODE.TITLE;
		    }
		}
	    } else if (this.building == true){
		this.buildAIGame();
		this.building = false;
	    }
	},
	
	// Start a Single Player game versus the AI
	buildSPGame: function(){
	    // Set game mode to Single Player
	    this.mode = PiSpace.MODE.SP;
	    
	    // Set values to default
	    this.SCORE.RED = 0;
	    this.SCORE.BLUE = 0;
	    this.FUEL.RED = 100;
	    this.FUEL.BLUE = 100;
	    
	    // Build game world
	    ig.game.spawnEntity( TopWall, 0, this.hud );
	    ig.game.spawnEntity( BottomWall, 0, ig.system.height - 8 );
	    ig.game.spawnEntity( LeftWall, 0, this.hud );
	    ig.game.spawnEntity( RightWall, ig.system.width - 8 , this.hud );
	    ig.game.spawnEntity( EntityPaddlePlayer, ig.system.width - 24, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityPaddleCpu, 16, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityCircPuck, ig.system.width / 2, ig.system.height / 2 + 16 );
	    return;
	},
	
	// Start a Single Player game versus the AI
	buildMPGame: function(){
	    // Set mode to 2-Player
	    this.mode = PiSpace.MODE.MP;
	    
	    // Set values to default
	    this.SCORE.RED = 0;
	    this.SCORE.BLUE = 0;
	    this.FUEL.RED = 100;
	    this.FUEL.BLUE = 100;
	    
	    // Build game world
	    ig.game.spawnEntity( TopWall, 0, this.hud );
	    ig.game.spawnEntity( BottomWall, 0, ig.system.height - 8 );
	    ig.game.spawnEntity( LeftWall, 0, this.hud );
	    ig.game.spawnEntity( RightWall, ig.system.width - 8 , this.hud );
	    ig.game.spawnEntity( EntityPaddlePlayer, ig.system.width - 16, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityPaddlePlayer2, 16, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityCircPuck, ig.system.width / 2, ig.system.height / 2 + 16 );
	    return;
	},
	
	// Start a Single Player game versus the AI
	buildAIGame: function(){
	    // set mode to AI War!
	    this.mode = PiSpace.MODE.AI;
	    
	    // Set values to default
	    this.SCORE.RED = 0;
	    this.SCORE.BLUE = 0;
	    this.FUEL.RED = 100;
	    this.FUEL.BLUE = 100;
	    
	    // Build game world
	    ig.game.spawnEntity( TopWall, 0, this.hud );
	    ig.game.spawnEntity( BottomWall, 0, ig.system.height - 8 );
	    ig.game.spawnEntity( LeftWall, 0, this.hud );
	    ig.game.spawnEntity( RightWall, ig.system.width - 8 , this.hud );
	    ig.game.spawnEntity( EntityPaddleCpu2, ig.system.width - 16, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityPaddleCpu, 16, ig.system.height / 2 + 16 );
	    ig.game.spawnEntity( EntityCircPuck, ig.system.width / 2, ig.system.height / 2 + 16 );
	    return;
	},
	
	clearScreen: function(){
	    for (var j = 0; j < ig.game.entities.length; j++){
		ig.game.entities[j].kill();
	    }
	},
	
	draw: function(){
	    // do parent first, so next stuff will render on top.
	    this.parent();
	    
	    var redInfo = { val: this.FUEL.RED,
			    loc: { x: 21 * ig.system.scale,
				    y: 10 * ig.system.scale }
			};
	    var blueInfo = { val: this.FUEL.BLUE,
			     loc: { x: (ig.system.width - 42) * ig.system.scale,
				    y: 10 * ig.system.scale }
			};
	    
	    if (this.mode == PiSpace.MODE.TITLE){
		/*
		// draw background grid
		for(var i=0;i<this.backgroundMaps.length;i++){
		this.backgroundMaps[i].draw();
		}
		*/
		// Timer value
		var d = this.introTimer.delta();
		
		//.draw( targetX, targetY, [sourceX], [sourceY], [width], [height] )
		this.logo.draw( (d*d*-d).limit(0,1).map(1,0,-200,0),0 );
		this.title.draw(( d*d*-d).limit(0,1).map(1,0,1000,64),0 );
		
		// Render text from this.menuText to screen
		var x = ig.system.width / 2;
		var y = ig.system.height - 120;
		
		// flashing text using a Timer for only 2 seconds.
		if(d>0 && (d%1<0.5 || d>2)){
		    this.font.draw( 'Press 1, 2 or 3 to Play',120,y,ig.Font.ALIGN.LEFT );
		}
		
		// print out options
		for (var i=0;i<this.menuText.length;i++){
		    this.font.draw( this.menuText[i], x, y, ig.Font.ALIGN.LEFT );
		    y+=12;
		}
	    } else {
		if (this.mode == PiSpace.MODE.SP){
		    // Title and scores at the top
		    this.font.draw( 'CPU Score: '+this.SCORE.RED, 2, 2, ig.Font.ALIGN.LEFT );
		
		    // Draw RED player text
		    this.font.draw( 'HEAT', 2, 10, ig.Font.ALIGN.LEFT );
		
		    this.font.draw('PONG IN SPACE - 1 PLAYER MODE', 240, 2, ig.Font.ALIGN.CENTER );
		    this.font.draw('Player Score: '+this.SCORE.BLUE, 480, 2, ig.Font.ALIGN.RIGHT );
		
		    // Draw BLUE player text
		    this.font.draw('HEAT', (ig.system.width - 43) * ig.system.scale, 10 * ig.system.scale, ig.Font.ALIGN.RIGHT);
		} else if (this.mode == PiSpace.MODE.MP) {
		    // place score and title at the top
		    this.font.draw( 'Red Score: '+this.SCORE.RED, 2, 2, ig.Font.ALIGN.LEFT);
		
		    // Draw RED player text
		    this.font.draw( 'HEAT', 2, 10, ig.Font.ALIGN.LEFT );
		
		    this.font.draw( 'PONG IN SPACE - 2 PLAYER MODE', 240, 2, ig.Font.ALIGN.CENTER) ;
		    this.font.draw( 'Blue Score: '+this.SCORE.BLUE, 480, 2, ig.Font.ALIGN.RIGHT );
		
		    // Draw BLUE player text
		    this.font.draw('HEAT', (ig.system.width - 43) * ig.system.scale, 10 * ig.system.scale, ig.Font.ALIGN.RIGHT );
		} else if (this.mode == PiSpace.MODE.AI) {
		    // Place title and scores on top
		    this.font.draw( 'Red Score: '+this.SCORE.RED, 2, 2, ig.Font.ALIGN.LEFT );

		    // Draw RED player text
		    this.font.draw( 'HEAT', 2, 10, ig.Font.ALIGN.LEFT );

		    this.font.draw( 'PONG IN SPACE - AI WAR', 240, 2, ig.Font.ALIGN.CENTER );
		    this.font.draw( 'Blue Score: '+this.SCORE.BLUE, 480, 2, ig.Font.ALIGN.RIGHT );
		
		    // Draw BLUE player text
		    this.font.draw( 'HEAT', (ig.system.width - 43) * ig.system.scale, 10 * ig.system.scale, ig.Font.ALIGN.RIGHT );
		}
	    	
		// draw an update for the HEAT Bars
		this.drawHeatBar( redInfo );
		this.drawHeatBar( blueInfo );
	    }
	},
	
	drawHeatBar: function ( info ){
	    var per = 1 - info.val / 100;
	    
	    // Change color based on value
	    if (per < 0.15 ) {
		ig.system.context.fillStyle = 'rgba(' + this.colors[0] + ',0.9)';
	    } else if ( per < 0.35 ){
		ig.system.context.fillStyle = 'rgba(' + this.colors[1] + ',0.9)';
	    } else if (per < 0.5 ){
		ig.system.context.fillStyle = 'rgba(' + this.colors[2] + ',0.9)'
	    } else if ( per < 0.65 ){
		ig.system.context.fillStyle = 'rgba(' + this.colors[3] + ',0.9)'
	    } else if ( per < 0.8 ){
		ig.system.context.fillStyle = 'rgba(' + this.colors[4] + ',0.9)'
	    } else {
		ig.system.context.fillStyle = 'rgba(' + this.colors[5] + ',0.9)'
	    }
	    
	    // draw heat bar
	    ig.system.context.fillRect( info.loc.x, info.loc.y, (40 * ig.system.scale) * per, 5 * ig.system.scale);
	}
	
    });

    PiSpace.MODE={
	TITLE: 0,
	SP: 1,
	MP: 2,
	AI: 3,
	GAME_OVER: 4,
	PAUSE: 5
    };

    // Start the Game with 60fps, a resolution of 480x272, scaled
    // up by a factor of 1 and uses the splash screen extension
    ig.main( '#canvas', PiSpace, 60, 480, 280, 1, ig.ImpactSplashLoader );

});