
AssetManager = function(){
	this.init = function(){
		this.assets = {};
		this.assets.textures = {};
		this.assets.blocks = {};
		this.assets.sprites = {};
		this.assets.elements = {};

	}
	this.animation = function(){

	}
	this.addAnimatedTexture = function(id, xtiles, ytiles, anims, url){
		this.assets.textures[id] = new AnimatedTexture(xtiles, ytiles, anims, url);
		return this.assets.textures[id];
	}

	/*
	this.addSkyboxTexture = function(id, posx, negx, posy, negy, posz, negz){
		var urls = [posx, negx, posy, negy, posz, negz];
		var tex = new THREE.ImageUtils.loadTextureCube(urls);
		this.assets.textures[id] = tex;
		return this.assets.textures[id];
	}
	*/
	this.addTexture = function(id, url){
		var tex=  new THREE.ImageUtils.loadTexture( url );
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping; 
		tex.repeat.set( 1, 1 );
		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearMipMapLinearFilter;
		this.assets.textures[id] = tex;
		return this.assets.textures[id];
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
		.add("burn", "column", 0, true, true)
		.set("burn");
	assetManager.addTexture("redTulip", "assets/sprites/flower_tulip_red.png");
	assetManager.addTexture("sky", "assets/skybox/sky.png")
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
	/*
	assetManager.addBlock("grass", new Block({
		type: "multitexture",
		texture: ["grass_s", "grass_s", "grass_t", "grass_s", "grass_s", "grass_s"]
	}));
	*/
	assetManager.addBlock("grass", new Block({
		type: "texture",
		texture: "grass_t"
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