
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