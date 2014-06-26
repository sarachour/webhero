
function SetupLayout(){
	$('.menu').layout({resize: false})
	$('#play-game').click(function(d){
		chrome.tabs.query({currentWindow: true, active:true}, function(tabs){
			if(tabs.length == 1){
				chrome.tabs.executeScript(tabs[0].id, {file: "js/web.js"}, function(){
					console.log("injected");
				});
			}
		});
	});

}

document.addEventListener('DOMContentLoaded', function() {
  SetupLayout();
})