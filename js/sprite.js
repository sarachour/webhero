/*
Maps are 2D grid with stacked items
*/



Sprite = function(data){
	this.init = function(data){
		if(data.type == "reference"){
			this.texture = data.ref.texture;
			this.material = data.ref.material;
			this.geometry = data.ref.geometry;
			this.geometry2 = data.ref.geometry2;
			this.mesh =  new THREE.Mesh(this.geometry, this.material );
		}
		else if(data.type == "texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				map: this.texture,
				transparent: true,
				side: THREE.DoubleSide
			});

			var matrix = new THREE.Matrix4();
			this.geometry = new THREE.PlaneGeometry(1,1);
			this.geometry2 = new THREE.PlaneGeometry(1,1);
			this.geometry2.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
			this.geometry.merge(this.geometry2);
			this.mesh = new THREE.Sprite( this.geometry, this.material );
		}
		else if(data.type == "anim-texture"){
			this.texture = assetManager.getTexture(data.texture);
			this.material = new THREE.MeshBasicMaterial({
				map: this.texture.d(),
				transparent: true,
				side: THREE.DoubleSide
			});
			var matrix = new THREE.Matrix4();
			this.geometry = new THREE.PlaneGeometry(1,1);
			this.geometry2 = new THREE.PlaneGeometry(1,1);
			this.geometry2.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
			this.geometry.merge(this.geometry2);
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
