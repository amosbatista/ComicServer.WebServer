var imgObject;
var svgObject;
var mapList;
var currentMapNumber = 0;
var actualPage;
var imgX;
var imgY;
var imgCurrentScale;
var actualEpisode;
var DOMParaghResult;
var DOMTxtFilePath;


/*Objects*/
function _episode (episodenumber, idiom, prologue){
	this.prologue = prologue;
	this.pages = new Array();
	this.idiom = idiom;
	this.episodenumber = episodenumber;
	this.AddPage = function(newPage){
		this.pages.push(newPage);
	}
}

function _map (x,y,scale,transitionType){
	this.x = x;
	this.y = y;
	this.scale = parseFloat(scale.toFixed(2));
	this.transitionType = transitionType;
}
function _page (path) {
	this.path = path;
	this.maps = new Array();
	this.AddMap = function(newMap){
		this.maps.push(newMap);
	}
}

function init(){
	svgObject = document.getElementById("svgRegion");
	imgObject = document.getElementById("myImage");
	DOMParaghResult = document.getElementById("LBLResult");
	DOMTxtFilePath = document.getElementById("filePath");
	
	fatorZoom = 1.1;
	fatorScroll = 40;
	imgX = 0;
	imgY = 0;
	imgCurrentScale = 1;
	//svgObject.addEventListener("click", ChangeMap, false);	
	
	// Adding events to the buttons
	// UP, DOWN, LEFT, Right
	document.getElementById("cmd_up").addEventListener("click",RaiseY,false);
	document.getElementById("cmd_left").addEventListener("click",RaiseX,false);
	document.getElementById("cmd_right").addEventListener("click",LowX,false);
	document.getElementById("cmd_down").addEventListener("click",LowY,false);
	document.getElementById("cmd_down").addEventListener("click",LowY,false);
	
	//document.addEventListener("keydown", ProcessKeyboardEvent, true);
	// ZOOM
	document.getElementById("cmd_zoom_in").addEventListener("click",RaiseScale,false);
	document.getElementById("cmd_zoom_out").addEventListener("click",LowScale,false);
	
	ChangeMap();
	document.getElementById("prologue").value = "";
}
function startNewEpisode(){
	actualEpisode = new _episode(document.getElementById("txtEpisodeNumber").value, document.getElementById("rdoIdiom").value, document.getElementById("prologue").value);
	DOMParaghResult.innerText = "A new episode has been created, and the map cleared";
}
function loadImageFromPath(){
	actualPage = new _page(DOMTxtFilePath.value);
	setImagePath(DOMTxtFilePath.value);
	DOMParaghResult.innerText = "A new map has begun.";
}
function setImagePath(imagePath){
	imgObject.setAttribute("xlink:href",imagePath);
}

function RaiseScale(){
	imgCurrentScale = imgCurrentScale * fatorZoom;
	ChangeMap();
}
function LowScale(){
	imgCurrentScale = imgCurrentScale / fatorZoom;
	// Setting a scroll to compesating the zoom
	RaiseX();
	LowY();
	ChangeMap();
}
function RaiseX(){
	imgX = imgX + fatorScroll;
	ChangeMap();
}
function LowX(){
	imgX = imgX - fatorScroll;
	ChangeMap();
}
function RaiseY(){
	imgY = imgY + fatorScroll;
	ChangeMap();
}
function LowY(){
	imgY = imgY - fatorScroll;
	ChangeMap();
}

function ProcessKeyboardEvent(evt){
	if (evt.keyCode == 37) //Left
		LowX();
	if (evt.keyCode == 39) // Rigth
		RaiseX();
	if (evt.keyCode == 38) // UP
		LowY();	
	if (evt.keyCode == 40) //Down
		RaiseY();
	return false;
}

function AddPageMap(){
	var DOMRdoTransitionType = document.getElementById("rdoTransitionType");
	var newMap = new _map(imgX,imgY, imgCurrentScale, DOMRdoTransitionType.value);
	actualPage.AddMap(newMap);
	DOMParaghResult.innerText = "This position map has been setted to this page. Keep adding!";
}
function AddPageToEpisode(){
	actualEpisode.AddPage(actualPage);
	DOMParaghResult.innerText = "This page has been added to this episode. Set a new page to the episode.";
	DOMTxtFilePath.value="";
}
// After all programming, save the episode to database.
function FinishMap(){

	var form = document.getElementById("form_submit");
	document.getElementById("episodeNumber").value = actualEpisode.episodenumber;
	document.getElementById("idiom").value = actualEpisode.idiom;
	document.getElementById("jsonContent").value = JSON.stringify(actualEpisode);
	form.submit();
	
	DOMParaghResult.innerText = "Episode Done!!!!!";
}

function SetImageViewByMap(x,y,scale){
	imgObject.setAttribute("transform","translate(" + x + ", " + y + ") scale(" + scale + ")");
}
function ChangeMap(){
	SetImageViewByMap(imgX,imgY,imgCurrentScale);
	//setTextFields(imgX,imgY,imgCurrentScale);
}
function setTextFields(x,y,scale){
	DOMTxtScale.value = scale;
	DOMTxtX.value = x;
	DOMTxtY.value = y;
}
function SetScaleManualy(){
	imgCurrentScale = DOMTxtScale.value;
	ChangeMap();
}
function SetXManually(){
	imgX = DOMTxtX.value;
	ChangeMap();
}
function SetYManuallY(){
	imgY = DOMTxtY.value;
	ChangeMap();
}
