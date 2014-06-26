

Map = function(){
	this.init = function(){
		this.scene = new THREE.Scene();
		this.w = 10;
		this.h = 10;
		var g = assetManager.getSprite("fire");
		var g2 = assetManager.getBlock("grass");
		var f = assetManager.getSprite("redTulip");
		g2.translate(2,0,0);
		g.translate(-1,0,0);
		f.translate(1,0,0);
		this.scene.add(g.d());
		this.scene.add(g2.d());
		this.scene.add(f.d());
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
