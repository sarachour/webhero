

Actor = function(asset){
	this.init = function(asset){
		this.asset = {};
		this.asset.name = asset;
		this.asset.data = null;

	}
	this.init(asset);
}


//assign to a block. Has passive effects if the actor is on it.
Terrain = function(asset){
	this.init = function(asset){
		this.prototype.init();
		this.asset.data = assetManager.getBlock(this.asset.name);
	}

	this.init(asset);
}
Terrain.prototype = Actor;

//something that may be picked up, dropped, in inventory.

Item = function(asset){
	this.init = function(asset){
		this.prototype.init(asset);
		this.asset.data = assetManager.getSprite(this.asset.name);
	}
	this.init(asset);
}
Item.prototype = Actor;

//assign to a player. maintains player health, mana, stats spells, ect.
Player = function(asset){
	this.init = function(asset){
		this.health = 100;
		this.mana = 100;
	}


	this.init(asset);
}

