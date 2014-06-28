/*
Maps are 2D grid with stacked items
*/



Sprite = function(data){
	this.init = function(data){
		if(data.type == "reference"){
			this.texture = data.ref.texture;
			this.material = data.ref.material;
			this.geometry = data.ref.geometry;
			this.mesh =  new THREE.Mesh(this.geometry, this.material );
		}
		else if(data.type == "texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				map: this.texture,
				transparent: true,
				side: THREE.DoubleSide
			});
			this.geometry = new THREE.PlaneGeometry(1,1);
			this.mesh = new THREE.Sprite( this.geometry, this.material );
		}
		else if(data.type == "anim-texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				map: this.texture.d(),
				transparent: true,
				side: THREE.DoubleSide
			});
			this.geometry = new THREE.PlaneGeometry(1,1);
			this.mesh = new THREE.Sprite(this.geometry, this.material );
		}
	}
	this.getHeight = function(){
		return 1;
	}
	this.instance = function(){
		return new Sprite({type:"reference", ref:this});
	}
	this.translate = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.mesh.position.set(x,y,z);
		return this;
	}
	this.d = function(){
		return this.mesh;
	}
	this.init(data);
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
