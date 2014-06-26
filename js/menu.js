
function SetupLayout(){
	$('.menu').layout({resize: false})
	$('#play-game').click(function(d){
		chrome.tabs.query({currentWindow: true, active:true}, function(tabs){
			if(tabs.length == 1){
				var tid = tabs[0].id;
				chrome.tabs.executeScript(tid, {file: "lib/jquery-1.10.2.js"}, function(e1){
					chrome.tabs.executeScript(tid, {file: "js/web.js"}, function(e2){
						console.log("<INJECTED SCRIPT>",e1,e2);
					});
				});
				
			}
		});
	});

}

document.addEventListener('DOMContentLoaded', function() {
  SetupLayout();
})