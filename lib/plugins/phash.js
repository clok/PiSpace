ig.module(
    'plugins.phash'
)
.requires(
    'impact.impact'
)
.defines(function(){
    /*
      Hash Table implementation to have Perl style hash behavior in 
      JavaScript and ImpactJS
      
      Implementation inspired by Mojavelinux, Inc.
      http://www.mojavelinux.com/articles/javascript_hashes.html

      As the author of the article above notes, there are many libraries
      out there that are bery well tested and more robustly implemented,
      like say jQuery.js! Also noted is that a JavaScript object is basically
      a hashTable with most of these properties already built in. All that
      said, the goal of this plugin is to provide a clean and concise Perl
      style Hash implementation for the ImpactJS architecture.
     */
    pHash = ig.Class.extend({
	len: 0,
	items: new Object(),

	/*
	  init Function:
	  Will be called by Impact on a "new"
	  If no object provided, will create an empty pHash object.
	  Input Object should have normail JavaScript Object structure:
	  example: { item1: value1, item2: value2, item3: value3 }
	*/
	init: function(obj){
	    for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
		    this.items[p] = obj[p];
		    this.len++;
		}
	    }
	},

	/*
	  set Function:
	  Will check if key already exists
	  if so, overwrite
	  if not, create new item and increment length
	*/
	set: function(key, val){
	    var prev = undefined;
	    if (this.has(key)){
		prev = this.items[key];
	    } else {
		this.len++;
	    }
	    this.items[key] = val;
	    return prev;
	},

	/*
	  get Function:
	  Will check if key exists
	  if so, return value
	  if not, return undefined
	*/
	get: function(key){
	    return this.has(key) ? this.items[key] : undefined;
	},

	/*
	  has Function:
	  Using the built in "hasOwnProperty" method,
	  retrun bool if key exists in pHash
	*/
	has: function(key){
	    return this.items.hasOwnProperty(key);
	},

	/*
	  pop Function:
	  Will check if key exists
	  if so, retain value, detele original copy and return value
	  if not, return undefined
	*/
	pop: function(key){
	    if (this.has(key)){
		prev = this.items[key];
		this.len--;
		delete this.items[key];
		return prev;
	    } else {
		return undefined;
	    }
	},

	/*
	  keys Function:
	  return an array of all unique keys in pHash
	*/
	keys: function(){
	    var keys = new Array();
	    for (var k in this.items){
		if (this.has(k)){
		    keys.push(k);
		}
	    }
	    return keys;
	},

	/*
	  values Function:
	  return an array of all values in pHash
	*/
	values: function(){
	    var values = new Array;
	    for (var k in this.items){
		if (this.has(k)){
		    values.push(this.items[k]);
		}
	    }
	    return values;
	},

	/*
	  each Function:
	  Will iterate across key-value pairs and execute the input function
	  Example:
	  printKV = function(k, v){ console.log(k + " " + v); }
	  pHash1.each(printKV);
	  
	  Output:
	  key1 value1
	  key2 value2
	  key3 value3
	*/
	each: function(fxn){
	    for (var k in this.items){
		if (this.has(k)){
		    fxn(k, this.items[k]);
		}
	    }
	},
	
	/*
	  clear Function:
	  Quick and dirty null of pHash
	 */
	clear: function(){
	    this.items = new Object;
	    this.len = 0;
	}
    })
});