AnimatedTexture = function(x,y,texture){
	this.init = function(x,y, url){
		this.cell = {x:x, y:y};
		this.animations = {};
		this.texture = new THREE.ImageUtils.loadTexture( url );;
		console.log(texture);
		this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping; 
		this.texture.repeat.set( 1.0/this.cell.x, 1.0/this.cell.y);
		//this.texture.repeat.set(1,1);
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.current = {animation: null, index: null};

	}
	this.add = function(name, type, data, repeat){
		var entry = {};
		var that = this;

		entry.type = type;
		entry.repeat = repeat;
		entry.doNext = function(e, i){
			if(i == e.nframes-1 && !e.repeat) return false;
			else return true;
		}
		entry.next = function(e, i){
			i=(i+1)%e.nframes;
			return i;
		}

		if(type == "col"){
			entry.offx = data;
			entry.nframes = this.cell.y;
			entry.update = function(e, i){
				that.texture.offset.x = e.offx/that.cell.x;
				that.texture.offset.y = i/that.cell.y; 
			}

		}
		else if(type == "row"){

		}
		else {

		}
		this.animations[name] = entry;
		return this;
	}
	this.set = function(name){
		var e = this.animations[name];
		this.current.animation = name;
		this.current.index = 0;
		e.update(e, this.current.index);
	}
	this.update = function(){
		var e = this.animations[this.current.animation];
		if(e.doNext()){
			this.current.index = e.next();
			e.update(e, this.current.index);
		}
	}

	this.d = function(){
		return this.texture
	}
	this.init(x,y, texture);
}

AssetManager = function(){
	this.init = function(){
		this.assets = {};
		this.assets.textures = {};
		this.assets.blocks = {};
		this.assets.sprites = {};
		this.assets.elements = {};

	}
	this.addAnimatedTexture = function(id, xtiles, ytiles, anims, url){
		this.assets.textures[id] = new AnimatedTexture(xtiles, ytiles, anims, url);
		return this.assets.textures[id];
	}
	this.addTexture = function(id, url){
		var tex=  new THREE.ImageUtils.loadTexture( url );
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping; 
		tex.repeat.set( 1, 1 );
		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearMipMapLinearFilter;
		this.assets.textures[id] = tex;
	}
	this.getTexture = function(id){
		if(this.assets.textures.hasOwnProperty(id)){
			return this.assets.textures[id];
		}
		else{
			console.log("No Texture:",id);
			return null;
		}
	}
	this.addSprite = function(id, spr){
		this.assets.sprites[id] = spr;
	}
	this.getSprite = function(id, spr){
		return this.assets.sprites[id].instance();
	}
	this.addBlock = function(id, blk){
		this.assets.blocks[id] = blk;
	}
	this.getBlock = function(id){
		return this.assets.blocks[id].instance();
	}
	this.addElement = function(id, entity){
		this.assets.elements[id] = entity;
	}
	this.getElement = function(id, element){
		return this.assets.elements[id].instance();
	}
	this.init();
}
function loadAssets(){
	//add texture
	assetManager.addTexture("clay", "assets/blocks/clay.png");
	assetManager.addTexture("brick", "assets/blocks/brick.png");
	assetManager.addTexture("bedrock", "assets/blocks/bedrock.png");
	assetManager.addTexture("grass_s", "assets/blocks/grass_side.png");
	assetManager.addTexture("grass_t", "assets/blocks/grass_top.png");
	assetManager.addTexture("rose", "assets/sprites/flower_rose.png");
	assetManager.addAnimatedTexture("fire",1,32,"assets/sprites/fire.png")
		.add("burn", "column", 0, true);
	assetManager.addTexture("redTulip", "assets/sprites/flower_tulip_red.png");
	//add block
	assetManager.addBlock("clay", new Block({
		type: "texture",
		texture: "clay"
	}));
	assetManager.addBlock("brick", new Block({
		type: "texture",
		texture: "brick"
	}));
	assetManager.addBlock("bedrock", new Block({
		type: "texture",
		texture: "bedrock"
	}));
	assetManager.addBlock("grass", new Block({
		type: "multitexture",
		texture: ["grass_s", "grass_s", "grass_t", "grass_s", "grass_s", "grass_s"]
	}));

	assetManager.addSprite("redTulip", new Sprite({
		type: "texture",
		texture: "redTulip"
	}))
	assetManager.addSprite("rose", new Sprite({
		type: "texture",
		texture: "rose"
	}))
	assetManager.addSprite("fire", new Sprite({
		type: "anim-texture",
		texture: "fire"
	}))
	//add Entity
	assetManager.addElement("rock-pillar", new Element([
		{name: "clay", x:0, y:0, z:0},
		{name: "bedrock", x:0, y:1, z:0},
		{name: "bedrock", x:0, y:2, z:0},
	]));
}

assetManager = new AssetManager();
loadAssets();