


var Block = function(data){
	this.init = function(data){
		this.data = data;
		if(data.type == "reference"){
			this.texture = data.ref.texture;
			this.color = data.ref.color;
			this.material = data.ref.material;
			this.x = data.ref.x;
			this.y = data.ref.y;
			this.z = data.ref.z;
			this.cull = data.ref.cull;
			this.shade = data.ref.shade;
			this.mesh = new THREE.Mesh();
			this.mesh.position.set(this.x,this.y,this.z);
			this.mesh.updateMatrix();
			return;
		}
		var key = data.type + ":" + (data.type == "texture" ? data.texture : data.color);
		if(data.type == "texture"){
			this.addMaterial(key, data.texture);
			this.material = [key,key,key,key,key,key];
		}
		if(data.type == "multitexture"){
			for(var i=0; i < data.texture.length; i++){
				this.addMaterial(key, data.texture[i]);
			}
			this.material = data.textures;
		}
		this.mesh = new THREE.Mesh();
		this.material = [key,key,key,key,key,key];
		this.cull = {py:false, 
						  pz:false, 
						  nz:false, 
						  nx:false, 
						  px:false, 
						  ny:false};

		this.shade = {
			py: {v00 : false, v01 : false, v10 : false, v11 : false},
			px: {v00 : false, v01 : false, v10 : false, v11 : false},
			nx: {v00 : false, v01 : false, v10 : false, v11 : false},
			pz: {v00 : false, v01 : false, v10 : false, v11 : false},
			nz: {v00 : false, v01 : false, v10 : false, v11 : false}
		}
	}
	this.gcull = function(px, nx, py, ny, pz, nz){
		this.cull.py = py;
		this.cull.px = px;
		this.cull.pz = pz;
		this.cull.ny = ny;
		this.cull.nx = nx;
		this.cull.nz = nz;
		return this;
	}
	this.gshade = function(face, v00, v01, v10, v11){
		this.shade[face].v00 = v00;
		this.shade[face].v10 = v10;
		this.shade[face].v11 = v11;
		this.shade[face].v01 = v01;
		return this;
	}
	this.instance = function(){
		return new Block({type:"reference", ref:this});
	}
	this.getHeight = function(){
		return 1;
	}
	this.commit = function(){
		var key = this.key; var that = this;
		var shadeMe = function(dummy, key){
			var colors = dummy.geometry.faces[ 0 ].vertexColors;
			colors[ 0 ] = that.shade[key].v00 ? that.shadow : that.light; //a == 0
			colors[ 1 ] = that.shade[key].v01 ? that.shadow : that.light; //b == 0
			colors[ 2 ] = that.shade[key].v10 ? that.shadow : that.light; //d == 0

			var colors = dummy.geometry.faces[ 1 ].vertexColors;
			colors[ 0 ] = that.shade[key].v01 ? that.shadow : that.light; //b==0
			colors[ 1 ] = that.shade[key].v11 ? that.shadow : that.light; //c==0
			colors[ 2 ] = that.shade[key].v10 ? that.shadow : that.light; //d==0
		}
		if(!this.cull.py){
			this.mesh.materialIndex = this.materials.types[this.material[0]];
			this.mesh.geometry = this.faces.pyGeometry;
			shadeMe(this.mesh, "py");
			this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.mesh.materialIndex);
		}
		if(!this.cull.px){
			this.mesh.materialIndex = this.materials.types[this.material[1]];
			this.mesh.geometry = this.faces.pxGeometry;
			shadeMe(this.mesh, "px");
			this.geometry.merge( this.mesh.geometry, this.mesh.matrix, this.mesh.materialIndex);
		}
		if(!this.cull.pz){
			this.mesh.materialIndex = this.materials.types[this.material[2]];
			this.mesh.geometry = this.faces.pzGeometry;
			shadeMe(this.mesh, "pz");
			this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.mesh.materialIndex);
		}
		if(!this.cull.nx){
			this.mesh.materialIndex = this.materials.types[this.material[3]];
			this.mesh.geometry = this.faces.nxGeometry;
			shadeMe(this.mesh, "nx");
			this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.mesh.materialIndex);
		}
		if(!this.cull.nz){
			this.mesh.materialIndex = this.materials.types[this.material[4]];
			this.mesh.geometry = this.faces.nzGeometry;
			shadeMe(this.mesh, "nz");
			this.geometry.merge( this.mesh.geometry, this.mesh.matrix, this.mesh.materialIndex);
		}
		return this;
	}
	this.translate = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.mesh.position.set(this.x,this.y,this.z);
		this.mesh.updateMatrix();
		return this;
	}
	this.init(data);
}

function init(OBJCLASS){
	var light = new THREE.Color( 0xffffff );
	var shadow = new THREE.Color( 0x505050 );
	//var shadow = new THREE.Color( 0xFF2020 );
	var matrix = new THREE.Matrix4();


	var pxGeometry = new THREE.PlaneGeometry( 1, 1 );
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1.0;
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1.0;
	pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1.0;
	pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	pxGeometry.applyMatrix( matrix.makeTranslation( 0.5, 0, 0 ) );

	var nxGeometry = new THREE.PlaneGeometry( 1, 1 );
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1.0;
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1.0;
	nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1.0;
	nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
	nxGeometry.applyMatrix( matrix.makeTranslation( - 0.5, 0, 0 ) );

	var pyGeometry = new THREE.PlaneGeometry( 1, 1 );
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	pyGeometry.applyMatrix( matrix.makeTranslation( 0, 0.5, 0 ) );

	var py2Geometry = new THREE.PlaneGeometry( 1, 1 );
	py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 1.0;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 1.0;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 1.0;
	py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeTranslation( 0,0.5, 0 ) );

	var pzGeometry = new THREE.PlaneGeometry( 1, 1 );
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1.0;
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1.0;
	pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1.0;
	pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 0.5 ) );

	var nzGeometry = new THREE.PlaneGeometry( 1, 1 );
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1.0;
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1.0;
	nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1.0;
	nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
	nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 0.5 ) );

	OBJCLASS.prototype = {};
	OBJCLASS.prototype.light = light;
	OBJCLASS.prototype.shadow = shadow;
	
	OBJCLASS.prototype.d = function(){
		var material = new THREE.MeshFaceMaterial(OBJCLASS.prototype.materials.arr);
		return new THREE.Mesh(OBJCLASS.prototype.geometry, material);
	}
	OBJCLASS.prototype.faces = {
		nzGeometry: nzGeometry,
		pzGeometry: pzGeometry,
		py2Geometry: py2Geometry,
		pyGeometry: pyGeometry,
		nxGeometry: nxGeometry,
		pxGeometry: pxGeometry
	}
	OBJCLASS.prototype.shader = {
		light: light,
		shadow: shadow
	}
	OBJCLASS.prototype.addMaterial = function(key, tex){
		if(!this.materials.types.hasOwnProperty(key)){
			this.materials.types[key] = this.materials.arr.length;
			var mat = new THREE.MeshLambertMaterial( { 
				map: assetManager.getTexture(tex), 
				ambient: 0xbbbbbb, 
				vertexColors: THREE.VertexColors,
				shading: THREE.SmoothShading
			});
			this.materials.arr.push(mat);
		}
		return this.materials.types[key];
	}
	OBJCLASS.prototype.materials = {types:{}, arr:[]};
	OBJCLASS.prototype.geometry = new THREE.Geometry();
};
init(Block);