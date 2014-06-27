/*
Maps are 2D grid with stacked items
*/

AnimatedTexture = function(x,y,texture){
	this.init = function(x,y, url){
		this.cell = {x:x, y:y};
		this.animations = {};
		this.texture = new THREE.ImageUtils.loadTexture( url );
		this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping; 
		this.texture.repeat.set( 1.0/this.cell.x, 1.0/this.cell.y);
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.current = {name: null, index: null};

	}
	this.add = function(name, type, data, repeat, reverse){
		var entry = {};
		var that = this;

		entry.type = type;
		entry.repeat = repeat;
		entry.reverse = reverse;
		if(entry.reverse){
			entry.doNext = function(e, i){
				if(i == 0 && !e.repeat) return false;
				else return true;
			}
			entry.next = function(e, i){
				i=(i-1+e.nframes)%e.nframes;
				return i;
			}
		}
		else{
			entry.doNext = function(e, i){
				if(i == e.nframes-1 && !e.repeat) return false;
				else return true;
			}
			entry.next = function(e, i){
				i=(i+1)%e.nframes;
				return i;
			}
		}
		if(type == "column"){
			entry.offx = data; entry.nframes = this.cell.y;
			entry.update = function(e, i){
				that.texture.offset.x = e.offx/that.cell.x;
				that.texture.offset.y = i/that.cell.y; 
			}
		}
		else if(type == "row"){
			entry.offy = data; entry.nframes = this.cell.x;
			entry.update = function(e, i){
				that.texture.offset.x = i/that.cell.x;
				that.texture.offset.y = e.offy/that.cell.y; 
			}
		}
		else {

		}
		this.animations[name] = entry;
		return this;
	}
	this.set = function(name){
		var e = this.animations[name];
		this.current.name = name;
		this.current.index = 0;
		e.update(e, this.current.index);
	}
	this.update = function(){
		if(this.current.name != null){
			var i = this.current.index;
			var e = this.animations[this.current.name];
			if(e.doNext(e,i)){
				this.current.index = e.next(e,i);
				e.update(e, i);
			}
		}
	}

	this.d = function(){
		return this.texture
	}
	this.init(x,y, texture);
}


Sprite = function(data){
	this.init = function(data){
		if(data.type == "reference"){
			this.texture = data.ref.texture;
			this.material = data.ref.material;
			this.mesh =  new THREE.Sprite( this.material );
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
	this.getHeight = function(){
		return 1;
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

Skybox = function(tex){
	this.init = function(tex){
		this.texture = assetManager.getTexture(tex);
		this.uniforms = {
			texture: {type: 't', value: this.texture}
		}
		
		this.material = new THREE.ShaderMaterial({
			fragmentShader: document.getElementById('sky-fragment').textContent,
			vertexShader : document.getElementById('sky-vertex').textContent,
			uniforms: this.uniforms
		})
		/*
		this.material = new THREE.MeshBasicMaterial({
				//color: 0x00ff00
				map: this.texture,
				//side: THREE.DoubleSide
		});
		*/
		//this.geometry = new THREE.SphereGeometry(1000,10,10);
		this.geometry = new THREE.BoxGeometry(1000,1000,1000,1,1,1);
		this.mesh = new THREE.Mesh (this.geometry, this.material );
		this.mesh.scale.set(-1,1,1);
		this.mesh.eulerOrder = "XZY";
		this.mesh.renderDepth = 1000.0;
		
	}
	this.d = function(){
		return this.mesh;
	}
	this.init(tex);
}