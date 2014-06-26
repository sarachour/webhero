
/*
Maps are 2D grid with stacked items
*/

Block = function(look){
	this.init = function(look){
		this.geometry = new THREE.BoxGeometry(1,1,1);
		this.tex = assetManager.getTexture("a");
		this.material = new THREE.MeshBasicMaterial({
			//color: 0x00ff00
			map: this.tex,
			side: THREE.DoubleSide
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}
	this.d = function(){
		return this.mesh;
	}
	this.init(look);
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
	this.add = function(category, id, block){
		if(!this.assets.hasOwnProperty(category)){
			this.assets[category] = {};
		}
		this.assets[category][id] = block;
	}
	this.getInstance = function(category, id){
		return this.assets[category][id];
	}
	this.init();
}
assetManager = new AssetManager();
function loadAssets(){
	assetManager.addTexture("a", "assets/textures/test.png");
}

Element = function(blocks){
	//internal coordinate system
	this.init = function(we, he){

	}
	this.init(we,he);
}
Map = function(){
	this.init = function(){
		this.scene = new THREE.Scene();
		this.cube = new Block();
		this.scene.add(this.cube.d());
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
