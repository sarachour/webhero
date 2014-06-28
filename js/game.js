/*
Level
*/
function generateLevel(w,h){
	var tiles = [
		["grass"], 
		["clay", "grass"],
		["clay"]];
	var sprite = ["redTulip", "fire"];
	var level = {width: w, height: h, map:{}};
	var maxy = 1;
	var nsprites=0;
	for(var i=0; i < w; i++){
		for(var j=0; j<h; j++){
			var prob= Math.random();
			if(prob > 0.9) y = 3;
			else if(prob > 0.7) y = 2;
			else y=1;
			for(var k=0; k < y; k++){
				var blkidx = Math.floor(Math.random()*tiles[k].length);
				var key = i+","+k+","+j;
				var val = {x:i, y:k, z:j, type:"block", name:tiles[k][blkidx]};
				level.map[key] = val;
			}
			if(Math.random() > 0.7){
				var blkidx = Math.floor(Math.random()*sprite.length);
				var key = i+","+k+","+j;
				var val = {x:i, y:k, z:j, type:"sprite", name:sprite[blkidx]};
				level.map[key] = val;
				nsprites++;
			}
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

		var directionalLight = new THREE.DirectionalLight( 0xfffeee, 1 );
		directionalLight.position.set( 1, 1, 0.5 ).normalize();
		this.scene.add( directionalLight );

		var directionalLight = new THREE.DirectionalLight( 0xffffee, 1 );
		directionalLight.position.set( -1, 1, -0.5 ).normalize();
		this.scene.add( directionalLight );

		this.load(generateLevel(50,50));
	}
	this.load = function(level){
		this.w = level.width;
		this.h = level.height;
		var k = function(x,y,z){
			return (x+","+y+","+z);
		}
		for(var id in level.map){
			var cell = level.map[id];
			if(cell.type == "block"){
				var x = cell.x;
				var y=  cell.y;
				var z = cell.z;
				var px = level.map.hasOwnProperty(k(x+1, y, z)) && level.map[k(x+1,y,z)].type == "block";
				var nx = level.map.hasOwnProperty(k(x-1, y, z)) && level.map[k(x-1,y,z)].type == "block";
				var py = level.map.hasOwnProperty(k(x, y+1, z)) && level.map[k(x,y+1,z)].type == "block";
				var ny = level.map.hasOwnProperty(k(x, y-1, z)) && level.map[k(x,y-1,z)].type == "block";
				var pz = level.map.hasOwnProperty(k(x, y, z+1)) && level.map[k(x,y,z+1)].type == "block";
				var nz = level.map.hasOwnProperty(k(x, y, z-1)) && level.map[k(x,y,z-1)].type == "block";
				var elem = assetManager.getBlock(cell.name)
							.translate(x,y,z)
							.neighbors(px, nx, py, ny, pz, nz)
							.commit();
			}
			else if(cell.type == "sprite"){
				var elem = assetManager.getSprite(cell.name)
							.translate(cell.x,cell.y,cell.z);
				this.scene.add(elem.d());
			}
		}
		this.scene.add(Block.prototype.d());
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

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		d.appendChild( this.stats.domElement );

		var that = this;
		function render(time) {
			requestAnimationFrame(render);
			if(time > that.intervals.animation.curr){
				that.animate();
				that.intervals.animation.curr += that.intervals.animation.step;
			}
			that.stats.update();
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
