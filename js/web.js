console.log(document);

 WebTools = function(){
	this.init = function(){

	}
	/*
	Global Properties:
	record global frequency-based css properties [prop: value: freq]
	  (background-color), (fg-color)
	record css-style based css properties [style : values]
	*/
	this.build = function(){
		//global properties.
		$("*").each(function(i,b){
			console.log(b);
			console.log($(b).css("background-color"));
		})
		
	}


	this.send = function(){
		chrome.runtime.sendMessage({
		    from:    'content',
		    subject: 'send_level'
		});
	}
	this.init();

}
webTools = new WebTools;
webTools.build();
webTools.init();

/*
Color Scheme: Css File
   - color frequencies

Map Layout: 
   - randomly generated from seed OR cross compiled from document object.
       - some sort of smart traversal through walls.

Tileset:
   - Color Palette: pulled from bg colors of html entities.

Spells:
   - on keyboard, must spell most common unique words on page. Harder words -> stronger spells
   - spell names are interesting word names. 

Monsters:
   - color: generated from images on the screen. (image color palette -> monster color palette)
   - parts: mix & match using word as a seed.
   - stats: 

Items:
   - [n primitive types]: color, size variation from font color-size

Doors:
   - Links in page (tab load -> compile -> new level).
*/