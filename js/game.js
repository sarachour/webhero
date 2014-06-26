
/*
Maps are 2D grid with stacked items
*/
Block = function(){
	this.init = function(){
		this.geometry = new THREE.BoxGeometry(1,1,1);
		this.material = new THREE.MeshBasicMaterial({
			color: 0x00ff00
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}
	this.d = function(){
		return this.mesh;
	}
	this.init();
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
	game = new Game(document.body, 600, 400);

	chrome.runtime.onMessage.addListener(function(msg, sender) {
	    if ((msg.from === 'content') && (msg.subject === 'send_level')) {
	        console.log(msg);
	    }
	});
})
