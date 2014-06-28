
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
				map: this.texture
				//side: THREE.DoubleSide
		});
		*/
		//this.geometry = new THREE.SphereGeometry(1000,10,10);
		this.geometry = new THREE.BoxGeometry(1000,1000,1000,1,1,1);
		this.mesh = new THREE.Mesh (this.geometry, this.material );
		this.mesh.scale.set(-1,1,1);
		this.mesh.rotation.order = "XZY";
		this.mesh.renderDepth = 1000.0;
		
	}
	this.d = function(){
		return this.mesh;
	}
	this.init(tex);
}