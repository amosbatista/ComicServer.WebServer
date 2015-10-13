//DOM objects
var imgObject;
var svgObject;

var currentMapNumber;
var actualMap_x;
var actualMap_y;
var actualMap_scale;
var newMap;
var episodeNumber;
var currentEpisode;
var currentIdiom;
var currentPage;
var resquestMapTransationID = null; 
var jSonRequisition;
var DOMLogoIdiom;

// Constants
fatorZoom = 1.2;
fatorScroll = 40;
	
function initPage(){
	svgObject = document.getElementById("svgRegion");
	imgObject = document.getElementById("myImage");
	DOMLogoIdiom = document.getElementById("logo_idiom");
	episodeNumber = GetEpisodeNumber();
	currentIdiom = GetInitialIdiom();
	currentPage = 0;
	currentMapNumber = 0;
	
	
	// Starting XMLHTTP
	jSonRequisition = new XMLHttpRequest();// code for IE7+, Firefox, Chrome, Opera, Safari
	
	if (jSonRequisition == undefined){
		// code for IE6, IE5
		jSonRequisition = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// Adding events
	svgObject.addEventListener("click", ChangeMapByClick, false);	
	svgObject.addEventListener("contextmenu", ChangeMapByClick, false);	
	DOMLogoIdiom.addEventListener("click", ChangeIdiom, false);
	
	// Loading the episode marked as the first
	LoadEpisode(episodeNumber);
}
// Temporari function
function LoadMapList(){
	LoadEpisode(episodeNumber);
}

/* Function that programming the transition of the maps when the user clicks. 
If occours the end of map, increment the episode and loads the next page. 
Loads the next episode if there's no episode.*/
function ChangeMapByClick(evt){
	
	// Detect an action to move ahead
	if (GetAction(evt) == "AHEAD"){
		
		// See if the limit of page
		if(currentMapNumber < currentEpisode.pages[currentPage].maps.length - 1){
		//When its possible to change to next map, increment counter and set the map to image
			currentMapNumber++;
			SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
		}
		else{
			// Trying to move to another page, to the first map
			if(currentPage < currentEpisode.pages.length - 1){
				currentPage++;
				currentMapNumber = 0;
				LoadPageToSVG(currentEpisode.pages[currentPage].path);		
				SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
			}
			else{
				// If in the limit of the pages, load the next episode
				episodeNumber++;
				LoadEpisode(episodeNumber);
			}
		}
		
	}
	else if (GetAction(evt) == "BACK"){
		
		// See if the limit of page
		if(currentMapNumber >= 1){
		//When its possible to change to last map, decrement counter and set the map to image
			currentMapNumber--;
			SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
		}
		else{
			// Trying to move to another page, to the last map
			if(currentPage >= 1){
				currentPage--;
				currentMapNumber = currentEpisode.pages[currentPage].maps.length - 1;
				LoadPageToSVG(currentEpisode.pages[currentPage].path);		
				SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
			}
			else{
				// If in the start of the pages, load the last episode
				episodeNumber--;
				LoadEpisode(episodeNumber);
			}
		}
		
	}
	//In case of Context Menu, return false to do not allow to shot the menu
	if (evt.type == "contextmenu") 
		return false;
	else
		return true;
}
//Function that receive an event and return if must go ahead or back of an action
function GetAction(evt){

	if (evt.type == "click" || evt.type == "contextmenu"){ // Get Mouse Event. When occurs a 'contextmenu', it's meaning there's a right click.
		if (evt.which == 1) // Left mouse click
			return "AHEAD";
		else if (evt.which == 3) // Right mouse click
			return "BACK";
	}
	else if(evt.type == "keydown"){
		// Detect keyboard events
	}
}

function LoadEpisode(episodeNumber){
	
	// Requesting JSON
	jSonRequisition.onreadystatechange = function(){
	
		if(jSonRequisition.readyState == 4 && jSonRequisition.status == 200){ // readyState == 4: Request finished and function ready - jSonRequisition.status == 200: OK
			
			// Loading JSOn to object
			currentEpisode = JSON.parse(jSonRequisition.responseText); 
			
			// Loading the first page of this episode
			LoadPageToSVG(currentEpisode.pages[currentPage].path);
	
			//Setting first map
			SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
			
			//Returning, to finish the recursion
			//return
		}
		//else{
			// Calling the function again
		//	LoadEpisode(episodeNumber)
		//}
		
	}
	var urlComicsServer = "http://localhost:3472/CarregarEpisodio.aspx?episodeNumber=" + episodeNumber + "&idiom=" + currentIdiom;
	jSonRequisition.open("GET", urlComicsServer, true);
	jSonRequisition.send();
	
}




function SetImageViewByMap(map){
	if (actualMap_x == undefined){ // If it's the first time map, set the last time and go directly to the map
	//if (true){ // If it's the first time map, set the last time and go directly to the map
	
		actualMap_x = map.x;
		actualMap_y = map.y;
		actualMap_scale = map.scale;
		SetImageView(map.x, map.y ,map.scale);
	}
	else{
		if (resquestMapTransationID == null)
			//resquestMapTransationID = setInterval(MapTransition(actualMap.x, actualMap.y, actualMap.scale, map), 2000);
			
				
			resquestMapTransationID = setInterval(function (){
				// Declaring variables to memorize the transition
				//var _x;
				//var _y;
				//var _scale;
				
				if (actualMap_x == currentEpisode.pages[currentPage].maps[currentMapNumber].x && actualMap_y == currentEpisode.pages[currentPage].maps[currentMapNumber].y && actualMap_scale.toFixed(2) == currentEpisode.pages[currentPage].maps[currentMapNumber].scale.toFixed(2)){ // Stop the animation when all the parameters get the same of the map destiny
					clearInterval(resquestMapTransationID);
					resquestMapTransationID = null;
					return;
				}
				// Setting the values of the local variables, configurating its values. 
				var _x = parseInt(currentEpisode.pages[currentPage].maps[currentMapNumber].x);
				var _y = parseInt(currentEpisode.pages[currentPage].maps[currentMapNumber].y);
				actualMap_x = CalculateTransition(actualMap_x, _x, currentEpisode.pages[currentPage].maps[currentMapNumber].transitionType);
				actualMap_y = CalculateTransition(actualMap_y, _y, currentEpisode.pages[currentPage].maps[currentMapNumber].transitionType);
				//actualMap.scale = CalculateScaleTransition(actualMap.scale, currentEpisode.pages[currentPage].maps[currentMapNumber].scale, currentEpisode.pages[currentPage].maps[currentMapNumber].transitionType);
				// As the scale() transition is very slow, I'll setup the scale level once.
				actualMap_scale = currentEpisode.pages[currentPage].maps[currentMapNumber].scale;
				
				
				// Setting the image scale, with the new values setted
				SetImageView(actualMap_x, actualMap_y, actualMap_scale);
				
				// Calling the animation function again, with the new values setted
				//resquestMapTransationID = requestAnimationFrame(MapTransition(_x, _y, _scale, mapDestiny));
				
			}, 20);
		
		//SetImageView(map.x, map.y ,map.scale);
	}
}

// Function that execute the transition of the map
/*function MapTransition(x, y, scale, mapDestiny){
	// Declaring variables to memorize the transition
	//var _x;
	//var _y;
	//var _scale;
	
	if (x == mapDestiny.x && y == y.mapDestiny && scale == scale.mapDestiny){ // Stop the animation when all the parameters get the same of the map destiny
		clearInterval(resquestMapTransationID);
		resquestMapTransationID = null;
		return;
	}
	// Setting the values of the local variables, configurating its values. 
	actualMap.x = CalculateTransition(x, mapDestiny.x, mapDestiny.transitionType);
	actualMap.y = CalculateTransition(y, mapDestiny.y, mapDestiny.transitionType);
	scale = roundValueToDigits(scale);
	mapDestiny.scale = roundValueToDigits(mapDestiny.scale);
	actualMap.scale = CalculateTransition(scale, mapDestiny.scale, mapDestiny.transitionType);
	
	// Setting the image scale, with the new values setted
	SetImageView(actualMap.x, actualMap.y, actualMap.scale);
	
	// Calling the animation function again, with the new values setted
	//resquestMapTransationID = requestAnimationFrame(MapTransition(_x, _y, _scale, mapDestiny));
	
}
*/

// Function that receives a parameter, a parameter destiny (ex: a X ou Y), and return the distance that parameter must me set.
function CalculateTransition(parameter, destinyParameter, TransitionSpeed){
	if (parameter == destinyParameter) // If the parameter was in the same position of its destiny, return it
		return parameter;
	else {
		
		if (parameter < destinyParameter) // If the parameter is minor than destiny, calculate the half of the track to the front
			return parameter + Math.ceil((destinyParameter - parameter) / 5);	
		else // And if the parameter is minor than destiny, calculate the half of the track to the back
			return parameter - Math.ceil((parameter - destinyParameter) / 5);	
	}
	
}

// Function that are the same of abive, but calculates a decimal valor
function CalculateScaleTransition(parameter, destinyParameter, TransitionSpeed){
	if (parameter.toFixed(2) == destinyParameter.toFixed(2)) // If the parameter was in the same position of its destiny, return it
		return parameter;
	else {
		
		if (parameter < destinyParameter) // If the parameter is minor than destiny, calculate the half of the track to the front
		
			//return parameter + roundValueToDigits((destinyParameter - parameter) / 5) + 0.01;	
			return parameter + 0.01;	
		else // And if the parameter is minor than destiny, calculate the half of the track to the back
			//return parameter - roundValueToDigits((parameter - destinyParameter) / 5) - 0.01;	
			return parameter  - 0.01;	
	}
	
}


// Function to configurare the Image object, to set the transaction attributes, and to move and zoom the image
function SetImageView(x, y, scale){
	imgObject.setAttribute("transform","translate(" + x + ", " + y + ") scale(" + scale + ")");
}
/* Function to read the episode number from episode Hidden tag */
function GetEpisodeNumber(){
	return document.getElementById("episodeNumber").value;
}
function GetInitialIdiom(){
	return document.getElementById("idiom").value;
}

// Function to load a page
function LoadPageToSVG(imagePath){
	imgObject.setAttribute("xlink:href", imagePath);
	imgObject = document.getElementById("myImage");
}

function roundValueToDigits(value){
	return parseFloat(value.toFixed(2));
}

// Function to change the idiom of the page, and also, of the image
function ChangeIdiom(){
	if(currentIdiom == "en")
		currentIdiom = "pt";
	else
		currentIdiom = "en";
		
	// Loading the episode again, in the same page
	LoadEpisode(episodeNumber);
	
	// Changing the logo
	DOMLogoIdiom.setAttribute("src","img\idiom_" + currentIdiom + ".jpg");
}