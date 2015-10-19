var tipCounter = 1;
var numTips = 3;

function compute() {

	var input = document.getElementById("input").value;
	if(localStorage["open_in"] == "sametab"){
		chrome.tabs.getSelected( undefined, function(tab) {
			chrome.tabs.update(tab.id, {url: "http://www.wolframalpha.com/input/?i="+encodeURIComponent(input) + "&t=crmtb01"}, undefined);
			window.close();	
		}); 
	} else {
		chrome.tabs.create({url: "http://www.wolframalpha.com/input/?i="+encodeURIComponent(input) + "&t=crmtb01"});	
	}
}

function submitHandler(submitEvent) {
	compute();
}

function hideTipsHandler(clickEvent) {

	$("#tipsDiv").hide("slow");
	localStorage["showTips"] = "false";
}

function cycleLeft(clickEvent) {
	
	$("#tip"+tipCounter).hide();

	tipCounter--;
	if(tipCounter <= 0) {
		tipCounter = numTips;
	}

	$("#tip"+tipCounter).show();

}

function cycleRight(clickEvent) {
	
	$("#tip"+tipCounter).hide();
	tipCounter = ((tipCounter++) % numTips)+1;
	$("#tip"+tipCounter).show();

}

function toMarketingPage(clickEvent) {
	chrome.tabs.create({url: "http://www.wolframalpha.com/extensions/chrome-extension.html", "active" : true});
}

$(document).ready(function () {

	$('#inputform').bind('submit', submitHandler);
	$('#hideTips').bind('click', hideTipsHandler);
	$('#leftCycle').bind('click', cycleLeft);
	$('#rightCycle').bind('click', cycleRight);
	$('#exploreLink').bind('click', toMarketingPage);

	if(localStorage["showTips"] == "true") {
		$("#tipsDiv").show();
	}

});