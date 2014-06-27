/*
Level
*/
function generateLevel(w,h){
	var tiles = [
		["grass"], 
		["clay", "bedrock"],
		["bedrock"]];
	var sprite = ["redTulip", "fire"];
	var level = {width: w, height: h, map:[]};
	var maxy = 1;
	var nsprites=0;
	for(var i=0; i < w; i++){
		for(var j=0; j<h; j++){
			var coord = {loc:{x:i, z:j}, cells:[]};
			var prob= Math.random();
			if(prob > 0.9) y = 3;
			else if(prob > 0.7) y = 2;
			else y=1;
			for(var k=0; k < y; k++){
				var blkidx = Math.floor(Math.random()*tiles[k].length);
				var cell = {type:"block", name:tiles[k][blkidx]};
				coord.cells.push(cell);
			}
			if(Math.random() > 0.7){
				var blkidx = Math.floor(Math.random()*sprite.length);
				coord.cells.push({type:"sprite", name:sprite[blkidx]});
				nsprites++;
			}
			level.map.push(coord);
		}
	}
	console.log("inserted sprites: ", nsprites)
	return level;
}
Map = function(level){
	this.init = function(level){
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2( 0xffffff, 0.15 );
		this.skybox = new Skybox("sky");
		this.scene.add(this.skybox.d());
		this.load(generateLevel(10,10));
	}
	this.load = function(level){
		this.w = level.width;
		this.h = level.height;
		for(var k=0; k < level.map.length; k++){
			var coord = level.map[k];
			var x = coord.loc.x;
			var z = coord.loc.z;
			var y = 0;
			for(var j=0; j < coord.cells.length; j++){
				var cell = coord.cells[j];
				if(cell.type == "block"){
					var elem = assetManager.getBlock(cell.name).translate(x,y,z);
				}
				else if(cell.type == "sprite"){
					var elem = assetManager.getSprite(cell.name).translate(x,y,z);
				}
				this.scene.add(elem.d());
				y += elem.getHeight();
			}
		}
	}
	this.d = function(){
		return this.scene;
	}
	this.init(level);
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
Controls = function(camera){
	this.init = function(camera){
		this.controls = new THREE.FirstPersonControls( camera.d() );
		this.camera = camera;
		this.controls.movementSpeed = 0.6;
		this.controls.lookSpeed = 0.065;
		this.controls.lookVertical = true;
	}
	this.d = function(){
		return this.controls;
	}
	this.init(camera);
}
Renderer = function(d,sc, cam,cont, w,h){
	this.animate = function(){

	}
	this.addAnimation = function(cbk){
		var oldAnimate = this.animate;
		this.animate = function(){
			cbk();
			oldAnimate();
		}
	}
	this.init = function(d,sc,cam,cont,w,h){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(w,h);
		this.scene = sc;
		this.camera = cam;
		this.controls = cont;
		this.clock = new THREE.Clock();
		this.intervals = {animation: {step:1000/12, curr:0}};
		d.appendChild(this.renderer.domElement);
		var that = this;
		function render(time) {
			requestAnimationFrame(render);
			if(time > that.intervals.animation.curr){
				that.animate();
				that.intervals.animation.curr += that.intervals.animation.step;
			}
			that.controls.d().update( that.clock.getDelta() );
			that.renderer.render(that.scene.d(), that.camera.d());
		}
		render();
	}
	

	this.init(d,sc,cam,cont,w,h);
}
Game = function(d,w,h){
	this.init = function(d,w,h){
		this.player = new Player();
		this.camera = new Camera(w,h);
		this.controls = new Controls(this.camera);
		this.map = new Map();
		this.renderer = new Renderer(d,this.map, this.camera, this.controls, w,h);

	}
	this.init(d,w,h);
}
document.addEventListener('DOMContentLoaded', function() {
	loadAssets();
	//game = new Game(document.body, 600, 400);
	game = new Game(document.body, window.innerWidth, window.innerHeight);
	game.renderer.addAnimation(function(){
		assetManager.getTexture("fire").update();
	});

	chrome.runtime.onMessage.addListener(function(msg, sender) {
	    if ((msg.from === 'content') && (msg.subject === 'send_level')) {
	        console.log(msg);
	    }
	});
})
