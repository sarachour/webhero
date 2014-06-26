
/*
Maps are 2D grid with stacked items
*/

Block = function(data){
	this.init = function(data){
		this.geometry = new THREE.BoxGeometry(1,1,1);
		this.data = data;
		if(data.hasOwnProperty("texture")){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				//color: 0x00ff00
				map: this.texture,
				side: THREE.DoubleSide
			});
		}
		else if(data.hasOwnProperty("color")){
			this.material = new THREE.MeshBasicMaterial({
				color: data.color
			});
		}
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}
	this.instance = function(){
		return new Block(this.data);
	}
	this.translate = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.mesh.position.set(x,y,z);
	}
	this.d = function(){
		return this.mesh;
	}
	this.init(data);
}
AssetManager = function(){
	this.init = function(){
		this.assets = {};
		this.assets.blocks = {};
		this.assets.sounds = {};
		this.assets.elements = {};
		this.assets.npcs = {};
		this.assets.monsters = {};
		this.assets.textures = {};
		this.assets.materials = {};
	}
	this.addTexture = function(id, url){
		var tex=  new THREE.ImageUtils.loadTexture( url );
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping; 
		tex.repeat.set( 1, 1 );
		this.assets.textures[id] = tex;
	}
	this.getTexture = function(id){
		if(this.assets.textures.hasOwnProperty(id)){
			return this.assets.textures[id];
		}
		else{
			console.err("No Texture");
			return null;
		}
	}
	this.addBlock = function(id, blk){
		this.assets.blocks[id] = blk;
	}
	this.getBlock = function(id){
		return this.assets.blocks[id];
	}
	this.addElement = function(id, entity){
		this.assets.elements[id] = entity;
	}
	this.getElement = function(id, element){
		return this.assets.elements[id];
	}
	this.init();
}
assetManager = new AssetManager();
function loadAssets(){
	//add texture
	assetManager.addTexture("lava1", "assets/textures/test.png");

	//add block
	assetManager.addBlock("lava-block", new Block({
		texture: "lava1", //
		fast: true
	}));
	assetManager.addBlock("green-block", new Block({
		color: 0x00ff00, //
		fast: true
	}));

	//add Entity
	assetManager.addElement("green-stick", new Element([
			{name: "lava-block", x:0, y:0, z:0},
			{name: "green-block", x:0, y:1, z:0},
			{name: "green-block", x:0, y:2, z:0},
		]))
}

Element = function(blocks){
	//internal coordinate system
	this.init = function(b){
		this.x = this.y = this.z = 0;
		this.group = new THREE.Object3D();
		this.block = b;
		for(var i =0; i < blocks.length; i++){
			var model = assetManager.getBlock(b[i].name).instance();
			model.translate(b[i].x, b[i].y, b[i].z);
			this.block[i].model = model;
			this.group.add(model.d());
			//this.group = model;
		}
	}
	this.instance = function(){
		return new Element(this.block);
	}
	this.translate = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.group.position.set(x,y,z);
	}
	this.d = function(){
		return this.group;
	}
	this.init(blocks);
}
Map = function(){
	this.init = function(){
		this.scene = new THREE.Scene();
		this.w = 10;
		this.h = 10;
		var g = assetManager.getElement("green-stick");
		var g2 = assetManager.getBlock("lava-block");
		g2.translate(2,0,0);
		g.translate(-1,0,0);
		this.scene.add(g.d());
		this.scene.add(g2.d());
	}
	this.d = function(){
		return this.scene;
	}
	this.init();
}
Player = function (){

}
Camera = function(w,h){
	this.init = function(w,h){
		this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
		this.camera.position.z = 5;
		this.camera.position.y = 1;


	}
	this.d = function(){
		return this.camera;
	}
	this.init(w,h);
}
Controls = function(){

}
Renderer = function(d,sc, cam, w,h){
	this.init = function(d,sc,cam,w,h){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(w,h);
		this.scene = sc;
		this.camera = cam;
		d.appendChild(this.renderer.domElement);
		var that = this;
		function render() {
			requestAnimationFrame(render);
			that.renderer.render(that.scene, that.camera);
		}
		render();
	}
	

	this.init(d,sc,cam,w,h);
}
Game = function(d,w,h){
	this.init = function(d,w,h){
		this.player = new Player();
		this.camera = new Camera(w,h);
		this.controls = new Controls();
		this.map = new Map();
		this.renderer = new Renderer(d,this.map.d(), this.camera.d(), w,h);
	}
	this.render = function(canv){

	}
	console.log(d,w,h);
	this.init(d,w,h);
}
document.addEventListener('DOMContentLoaded', function() {
	loadAssets();
	game = new Game(document.body, 600, 400);

	chrome.runtime.onMessage.addListener(function(msg, sender) {
	    if ((msg.from === 'content') && (msg.subject === 'send_level')) {
	        console.log(msg);
	    }
	});
})
