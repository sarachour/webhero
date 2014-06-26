
Map = function(){
	this.init = function(){
		this.scene = new THREE.Scene();
	}

	this.init();
}
Player = function (){

}
Camera = function(w,h){
	this.init = function(w,h){
		this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);

	}

	this.init();
}
Controls = function(){

}
Renderer = function(d,w,h){
	this.init = function(d,w,h){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(w,h);
		d.appendChild(this.renderer.domElement);
	}

	this.init(d,w,h);
}
Game = function(d,w,h){
	this.init = function(d,w,h){
		this.player = new Player();
		this.camera = new Camera(w,h);
		this.controls = new Controls();
		this.renderer = new Renderer(d,w,h);
		this.map = new Map();
	}
	this.render = function(canv){

	}
	console.log(d,w,h);
	this.init(d,w,h);
}
document.addEventListener('DOMContentLoaded', function() {
	game = new Game(document.body, 600,400);

	chrome.runtime.onMessage.addListener(function(msg, sender) {
	    if ((msg.from === 'content') && (msg.subject === 'send_level')) {
	        console.log(msg);
	    }
	});
})
