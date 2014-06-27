


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
			this.mesh = new THREE.Mesh();
			this.mesh.position.set(this.x,this.y,this.z);
			this.mesh.updateMatrix();
			return;
		}
		var key = data.type + ":" + (data.type == "texture" ? data.texture : data.color);
		if(!this.materials.types.hasOwnProperty(key)){
			this.materials.types[key] = this.materials.arr.length;
			var mat = new THREE.MeshLambertMaterial( { 
				map: assetManager.getTexture(data.texture), 
				ambient: 0xbbbbbb, 
				vertexColors: THREE.VertexColors,
				shading: THREE.SmoothShading
			});
			this.materials.arr.push(mat);
		}
		this.mesh = new THREE.Mesh();
		this.material = key;
	}
	this.instance = function(){
		return new Block({type:"reference", ref:this});
	}
	this.getHeight = function(){
		return 1;
	}
	this.commit = function(){
		var key = this.key;
		this.mesh.materialIndex = this.materials.types[this.material];
		this.mesh.geometry = this.faces.pyGeometry;
		this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.mesh.materialIndex);
		this.mesh.geometry = this.faces.pxGeometry;
		this.geometry.merge( this.mesh.geometry, this.mesh.matrix, this.materialIndex);
		this.mesh.geometry = this.faces.pzGeometry;
		this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.materialIndex);
		this.mesh.geometry = this.faces.nxGeometry;
		this.geometry.merge( this.mesh.geometry, this.mesh.matrix , this.materialIndex);
		this.mesh.geometry = this.faces.nzGeometry;
		this.geometry.merge( this.mesh.geometry, this.mesh.matrix, this.materialIndex);
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
	var matrix = new THREE.Matrix4();


	var pxGeometry = new THREE.PlaneGeometry( 1, 1 );
	pxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	pxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	pxGeometry.applyMatrix( matrix.makeTranslation( 0.5, 0, 0 ) );

	var nxGeometry = new THREE.PlaneGeometry( 1, 1 );
	nxGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	nxGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
	nxGeometry.applyMatrix( matrix.makeTranslation( - 0.5, 0, 0 ) );

	var pyGeometry = new THREE.PlaneGeometry( 1, 1 );
	pyGeometry.faces[ 0 ].vertexColors.push( light, light, light );
	pyGeometry.faces[ 1 ].vertexColors.push( light, light, light );
	pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	pyGeometry.applyMatrix( matrix.makeTranslation( 0, 0.5, 0 ) );

	var py2Geometry = new THREE.PlaneGeometry( 1, 1 );
	py2Geometry.faces[ 0 ].vertexColors.push( light, light, light );
	py2Geometry.faces[ 1 ].vertexColors.push( light, light, light );
	py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
	py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
	py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
	py2Geometry.applyMatrix( matrix.makeTranslation( 0,0.5, 0 ) );

	var pzGeometry = new THREE.PlaneGeometry( 1, 1 );
	pzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	pzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 0.5 ) );

	var nzGeometry = new THREE.PlaneGeometry( 1, 1 );
	nzGeometry.faces[ 0 ].vertexColors.push( light, shadow, light );
	nzGeometry.faces[ 1 ].vertexColors.push( shadow, shadow, light );
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
	nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
	nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
	nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 0.5 ) );

	OBJCLASS.prototype = {};
	OBJCLASS.prototype.d = function(){
		console.log(OBJCLASS.prototype.materials.arr);
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
	OBJCLASS.prototype.materials = {types:{}, arr:[]};
	OBJCLASS.prototype.geometry = new THREE.Geometry();
	console.log(OBJCLASS);
};
init(Block);