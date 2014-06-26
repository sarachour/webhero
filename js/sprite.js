/*
Maps are 2D grid with stacked items
*/

Sprite = function(data){
	this.init = function(data){
		if(data.type == "reference"){
			this.texture = data.ref.texture;
			this.material = data.ref.material;
			this.mesh =  data.ref.mesh;
		}
		else if(data.type == "texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.SpriteMaterial({
				map: this.texture
			});
			this.mesh = new THREE.Sprite( this.material );
		}
		else if(data.type == "anim-texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.SpriteMaterial({
				map: this.texture.d()
			});
			this.mesh = new THREE.Sprite( this.material );
		}
	}
	this.instance = function(){
		return new Sprite({type:"reference", ref:this});
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
Block = function(data){
	this.init = function(data){
		
		this.data = data;
		if(data.type == "reference"){
			this.geometry = data.ref.geometry;
			this.material = data.ref.material;
			this.texture = data.ref.texture;
			this.materials = data.ref.materials;
			this.textures = data.ref.textures;
		}
		else if(data.type == "texture"){
			this.geometry = new THREE.BoxGeometry(1,1,1);
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				//color: 0x00ff00
				map: this.texture,
				side: THREE.DoubleSide
			});
		}
		else if(data.type == "multitexture"){
			this.geometry = new THREE.BoxGeometry(1,1,1);
			this.textures = [];
			this.materials = [];
			for(var i=0; i < data.texture.length; i++){
				this.textures[i] = assetManager.getTexture(data.texture[i]);
				this.materials[i] = new THREE.MeshBasicMaterial({
					map: this.textures[i],
					side: THREE.DoubleSide
				});
			}
			this.material = new THREE.MeshFaceMaterial(this.materials);
		}
		else if(data.type == "color"){
			this.geometry = new THREE.BoxGeometry(1,1,1);
			this.material = new THREE.MeshBasicMaterial({
				color: data.color
			});
		}
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}
	this.instance = function(){
		return new Block({type:"reference", ref:this});
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