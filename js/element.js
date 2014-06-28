

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
