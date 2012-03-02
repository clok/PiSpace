ig.module( 
    'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.puck',
	'game.entities.paddle-cpu',
	'game.entities.paddle-cpu-2',
	'game.entities.paddle-player',
	'game.entities.paddle-player-2',
	
	'game.levels.court',
	'game.levels.court2',
	'game.levels.court3',
	
	'plugins.impact-splash-loader',
	
	'plugins.box2d.game'
	)
.defines(function(){

	BaseGame = ig.Box2DGame.extend({
	    
	    // Load a font
	    font: new ig.Font( 'media/04b03.font.png' ),
	    thegrid:new ig.Image('media/thegrid.png'),
	    
	    // load sounds here
	    bgm1: new ig.Sound( 'media/ost/flowdown.mp3', false ),
	    bgm2: new ig.Sound( 'media/ost/one_step_ahead.mp3', false ),
	    bgm3: new ig.Sound( 'media/ost/sand_trip.mp3', false ),
	    
	    init: function() {
		// sound management keys
		ig.input.bind( ig.KEY.M, 'mute' );
		ig.input.bind( ig.KEY.U, 'unmute' );
		
		// add ost to playlist
		ig.music.add( this.bgm1 );
		ig.music.add( this.bgm2 );
		ig.music.add( this.bgm3 );
		
		// Add grid pattern to menu page
		var bg = new ig.BackgroundMap(62,[[1]],this.thegrid);
		bg.repeat = true;
		this.backgroundMaps.push(bg);
		
		// start playing the ost
		ig.music.play();
	    },
	    
	    update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Listen for player input for sound
		if (ig.input.pressed('mute')){
			ig.music.fadeOut(2);
		} else if (ig.input.pressed('unmute')){
			ig.music.play();
		}
	    },
	    
	});

	// Start a Single Player game versus the AI
	SpGame = BaseGame.extend({
	    
	    // Initialize global scores
	    cpu_score: 0,
	    player_score: 0,
	    
	    init: function() {
		this.parent();
		
		// Initialize your game here; bind keys etc.
		// Player input
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		
		// start playing the ost
		ig.music.play();
		
		// Load the level
		this.loadLevel( LevelCourt );
	    },

	    draw: function() {
		// Draw all entities and backgroundMaps
		// need to have this.parent(); first
		this.parent();
		// Title and scores at the top
		this.font.draw( 'CPU Score: '+this.cpu_score, 2, 2, ig.Font.ALIGN.LEFT);
		this.font.draw('PONG IN SPACE - 1 PLAYER MODE', 240, 2, ig.Font.ALIGN.CENTER);
		this.font.draw('Player Score: '+this.player_score, 480, 2, ig.Font.ALIGN.RIGHT);
	    }
	});
	
	// Load a 2 Player game	
	MpGame = BaseGame.extend({
	    // Initialize player scores
	    player_score: 0,
	    player2_score: 0,    
	    
	    init: function() {
		this.parent();
		
		// Initialize your game here; bind keys etc.
		// Player1 input
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		
		// Player2 input
		ig.input.bind( ig.KEY.W, 'w' );
		ig.input.bind( ig.KEY.S, 's' );
		ig.input.bind( ig.KEY.A, 'a' );
		ig.input.bind( ig.KEY.D, 'd' );
		
		// load the level
		this.loadLevel( LevelCourt2 );
	    },
	    
	    draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		// place score and title at the top
		this.font.draw( 'Red Score: '+this.player2_score, 2, 2, ig.Font.ALIGN.LEFT);
		this.font.draw('PONG IN SPACE - 2 PLAYER MODE', 240, 2, ig.Font.ALIGN.CENTER);
		this.font.draw('Blue Score: '+this.player_score, 480, 2, ig.Font.ALIGN.RIGHT);
	    }
	});

	// Load AI WAR!!!
	SimGame = BaseGame.extend({
	    // initialize scores
	    cpu_score: 0,
	    cpu2_score: 0,    
	    
	    init: function() {
		this.parent();
		
		// Load level
		this.loadLevel( LevelCourt3 );
	    },
	    
	    draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		// Place title and scores on top
		this.font.draw( 'Red Score: '+this.cpu_score, 2, 2, ig.Font.ALIGN.LEFT);
		this.font.draw('PONG IN SPACE - AI WAR', 240, 2, ig.Font.ALIGN.CENTER);
		this.font.draw('Blue Score: '+this.cpu2_score, 480, 2, ig.Font.ALIGN.RIGHT);
		
	    }
	});
	
	// create the title screen
	// Level will be loaded based on player input
	TitleScreen = ig.Game.extend({
		// Init timer val
		introTimer:null,
		// Load initial media
		font: new ig.Font( 'media/04b03.font.png' ),
		logo: new ig.Image ( 'media/bigc.png' ),
		title: new ig.Image ( 'media/title.png' ),
		thegrid:new ig.Image('media/thegrid.png'),
		
		menuText: [
			   '1: 1 Player vs. AI',
			   '2: 2 Player Duel',
			   '3: AI War!',
			   '',
			   'Controls:',
			   'Player 1: up,down,left,right',
			   'Player 2: w,a,s,d',
			   'm/u to stop/start BGM'
			   ],
		
		init: function() {
			// Define inputs to listen for
			ig.input.bind( ig.KEY._1, 'opt1' );
			ig.input.bind( ig.KEY._2, 'opt2' );
			ig.input.bind( ig.KEY._3, 'opt3' );
			
			// Add grid pattern to menu page
			var bg = new ig.BackgroundMap(62,[[1]],this.thegrid);
			bg.repeat = true;
			this.backgroundMaps.push(bg);
			
			// Set timer
			this.introTimer=new ig.Timer(1);
		},
		
		update: function() {
			// If input is pressed, load level for that option
			if(ig.input.pressed('opt1')){
				ig.system.setGame(SpGame);
			} else if(ig.input.pressed('opt2')){
				ig.system.setGame(MpGame);
			} else if(ig.input.pressed('opt3')){
				ig.system.setGame(SimGame);
			}
			
			this.parent();
		},
		
		draw: function(){
			this.parent();
			
			// Timer value
			var d = this.introTimer.delta();
			
			//.draw( targetX, targetY, [sourceX], [sourceY], [width], [height] )
			this.logo.draw( (d*d*-d).limit(0,1).map(1,0,-200,0),0 );
			this.title.draw(( d*d*-d).limit(0,1).map(1,0,1000,64),0 );
			
			// Render text from this.menuText to screen
			var x = ig.system.width / 2;
			var y = ig.system.height - 120;
			
			// flashing text using a Timer
			if(d>0 && (d%1<0.5 || d>2)){
				this.font.draw( 'Press 1, 2 or 3 to Play',120,y,ig.Font.ALIGN.LEFT );
			}
			
			// print out options
			for (var i=0;i<this.menuText.length;i++){
				this.font.draw( this.menuText[i], x, y, ig.Font.ALIGN.LEFT );
				y+=12;
			}
		}
	});

	// Start the Game with 60fps, a resolution of 480x272, scaled
	// up by a factor of 1 and uses the splash screen extension
	ig.main( '#canvas', TitleScreen, 60, 480, 272, 1, ig.ImpactSplashLoader );

});