// DOM Page-like elements 
var DOMPageContentList = new Array();

//DOM objects
var DOMLogoIdiom;
var DOMarrow_moveNextMap;
var DOMarrow_movePrevMap;
var greyBackground;
var svgObject;
var DIV_SgvHolder;

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
var loadPageTransitionID = null;
var startFadeOut = 0;

var jSonRequisition;

// Object representing all the text content
var textRepository;


// Constants
var dominio;
	
function initPage(){
	
	// Setting the URL of the page
	dominio = document.origin;
	
	DOMLogoIdiom = document.getElementById("logo_idiom");
	greyBackground = document.getElementById("background_Load_Info");
	DOMarrow_moveNextMap = document.getElementById("arrow_moveNextMap");
	DOMarrow_movePrevMap = document.getElementById("arrow_movePrevMap");
	svgObject = document.getElementById("svgRegion");
	DIV_SgvHolder = document.getElementById("div_svgHolder");
	
	// Defining the display elements list
	DOMPageContentList.push(document.getElementById("myImage"));
	DOMPageContentList.push(document.getElementById("div_about"));
	DOMPageContentList.push(document.getElementById("div_License"));
	DOMPageContentList.push(document.getElementById("div_Donate"));
	DOMPageContentList.push(document.getElementById("div_Contact"));
	
	// Loading the string repository
	LoadStringRepository();
	
	// Setting the image element to the top
	showElementAbove(DOMPageContentList[0]);
	
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
	
	
	AddImageEvents();
	
	// Adding the event OnLoad to the image, to detect when load is finished. On OnLoad, execute a function that flag when stop the animation
	DOMPageContentList[0].addEventListener("load", function(){
		startFadeOut = 1;
	}, false);	
	
	document.addEventListener("keydown", ChangeMapByClick, false);
	
	// Loading the episode marked as the first
	LoadEpisode(episodeNumber);
}
// Function to create and remove events
function AddImageEvents(){
	// Adding events
	svgObject.addEventListener("click", ChangeMapByClick, false);	
	svgObject.addEventListener("contextmenu", ChangeMapByClick, false);	
	DOMLogoIdiom.addEventListener("click", function (){
												ChangeIdiom();
												
													// Loading the episode again, in the same page
													LoadEpisode(episodeNumber);
											}, false);

	// Flags inside the image
	DOMarrow_moveNextMap.addEventListener("click", ChangeMapByClick, false);
	DOMarrow_movePrevMap.addEventListener("click", ChangeMapByClick, false);
	DOMarrow_moveNextMap.addEventListener("mouseover", ChangeArrowColor, false);
	DOMarrow_movePrevMap.addEventListener("mouseover", ChangeArrowColor, false);
	DOMarrow_moveNextMap.addEventListener("mouseout", ClearArrowColor, false);
	DOMarrow_movePrevMap.addEventListener("mouseout", ClearArrowColor, false);
	

}
function RemoveImageEvents(){
	// Adding events
	svgObject.removeEventListener("click");	
	svgObject.removeEventListener("contextmenu");	
	DOMLogoIdiom.removeEventListener("click");

	// Flags inside the image
	DOMarrow_moveNextMap.removeEventListener("click");
	DOMarrow_movePrevMap.removeEventListener("click");
	DOMarrow_moveNextMap.removeEventListener("mouseover");
	DOMarrow_movePrevMap.removeEventListener("mouseover");
	DOMarrow_moveNextMap.removeEventListener("mouseout");
	DOMarrow_movePrevMap.removeEventListener("mouseout");
}

// Temporari function
function LoadMapList(){
	LoadEpisode(episodeNumber);
}

// Functions that change the color of arrow, or clear the color
function ChangeArrowColor(evt){
	if(evt.srcElement == DOMarrow_moveNextMap)
		DOMarrow_moveNextMap.setAttribute("fill-opacity",0.75);
	else if(evt.srcElement == DOMarrow_movePrevMap)
		DOMarrow_movePrevMap.setAttribute("fill-opacity",0.75);
}
function ClearArrowColor(evt){
	if(evt.srcElement == DOMarrow_moveNextMap)
		DOMarrow_moveNextMap.setAttribute("fill-opacity",0);
	else if(evt.srcElement == DOMarrow_movePrevMap)
		DOMarrow_movePrevMap.setAttribute("fill-opacity",0);
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

				// Watch and return the episode minus 1, when it detect error
                if (ReturnIfImageError() == true)
                    episodeNumber = 0;    
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

				// Watch and return the episode plus 1, when it detect error
				if (ReturnIfImageError() == true)
				    episodeNumber = 0;   
			}
		}
		
	}
	// Detecting event to exit the SubPages tutorial
	else if (GetAction(evt) == "ESC"){
		ClosePageElement();
	}
	//In case of Context Menu, return false to do not allow to shot the menu
	if (evt.type == "contextmenu") 
		return false;
	else
		return true;
}

// Function that return True if the first image is a image error, or false, if it's normal
function ReturnIfImageError() {
    if (currentEpisode.pages[0].path.search("img_warning") > 0)
        return true;
    else
        return false;
    
}
//Function that receive an event and return if must go ahead or back of an action
function GetAction(evt){
	
	// Detecting click of the arrows inside map
	if(evt.srcElement == DOMarrow_moveNextMap){
		if (evt.stopPropagation) //if stopPropagation method supported
			evt.stopPropagation();
		else
			event.cancelBubble = true;
			
		return "AHEAD";
	}
	else if(evt.srcElement == DOMarrow_movePrevMap){
		if (evt.stopPropagation) //if stopPropagation method supported
			evt.stopPropagation();
		else
			event.cancelBubble = true;
			
		return "BACK";
	}
	
	else if (evt.type == "click" || evt.type == "contextmenu"){ // Get Mouse Event. When occurs a 'contextmenu', it's meaning there's a right click.
		if (evt.which == 1) // Left mouse click
			return "AHEAD";
		else if (evt.which == 3) // Right mouse click
			return "BACK";
	}
	else if(evt.type == "keydown"){ // Keyboard event
		if(evt.keyCode == 37)
			return "BACK";
		if(evt.keyCode == 39)
			return "AHEAD";
		if(evt.keyCode == 27) // Esc button. Specific to exit the subpages
			return "ESC";
	}
	
	
}

function LoadEpisode(episodeNumber){
	
	// Requesting JSON
    jSonRequisition.onreadystatechange = function () {

        if (jSonRequisition.readyState == 4 && jSonRequisition.status == 200) { // readyState == 4: Request finished and function ready - jSonRequisition.status == 200: OK

            // Loading JSOn to object
            currentEpisode = JSON.parse(jSonRequisition.responseText);

            // Loading the first page of this episode
            currentPage = 0;
            LoadPageToSVG(currentEpisode.pages[currentPage].path);

            //Setting first map
            currentMapNumber = 0;
            SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);

            // Finishing the transition and return the background to finish
            startFadeOut = 1;
        }
    }
	var urlComicsServer = dominio + "/CarregarEpisodio.aspx?episodeNumber=" + episodeNumber + "&idiom=" + currentIdiom;
	jSonRequisition.open("GET", urlComicsServer, true);
	jSonRequisition.send();
	
	// Inicializing the animation process
	bgFadeIn();
	
}
 
//Function to manipulate the page visualization
function MoveToFirstPage(){
	// Setting the page map and load
	currentPage = 0;
	currentMapNumber = 0;
	LoadPageToSVG(currentEpisode.pages[currentPage].path);		
	SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);	
}
function MoveToLastPage(){
	// Setting the page map and load
	currentPage = currentEpisode.pages.length - 1;
	currentMapNumber = 0;
	LoadPageToSVG(currentEpisode.pages[currentPage].path);		
	SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);	
}
function MoveToPrevPage(){
	if(currentPage >= 1){
		currentPage--;
		currentMapNumber = 0;
		LoadPageToSVG(currentEpisode.pages[currentPage].path);		
		SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
	}	
}
function MoveToNextPage(){
	if(currentPage < currentEpisode.pages.length - 1){
		currentPage++;
		currentMapNumber = 0;
		LoadPageToSVG(currentEpisode.pages[currentPage].path);		
		SetImageViewByMap(currentEpisode.pages[currentPage].maps[currentMapNumber]);
	}
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
			resquestMapTransationID = setInterval(function (){
				
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
				//actualMap_scale = CalculateScaleTransition(actualMap_scale, currentEpisode.pages[currentPage].maps[currentMapNumber].scale, currentEpisode.pages[currentPage].maps[currentMapNumber].transitionType);
				// As the scale() transition is very slow, I'll setup the scale level once.
				actualMap_scale = currentEpisode.pages[currentPage].maps[currentMapNumber].scale;
				
				// Setting the image scale, with the new values setted
				SetImageView(actualMap_x, actualMap_y, actualMap_scale);
				
				// Calling the animation function again, with the new values setted
				
			}, 20);
	}
}

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
	// Setting the transition speed
	if(TransitionSpeed == "fast-background")
		parameterChange = 0.05;
	else
		parameterChange = 0.01;
	if (parameter.toFixed(2) == destinyParameter.toFixed(2)) // If the parameter was in the same position of its destiny, return it
		return parameter;
	else {
		
		if (parameter < destinyParameter) // If the parameter is minor than destiny, calculate the half of the track to the front
		
			//return parameter + roundValueToDigits((destinyParameter - parameter) / 5) + 0.01;	
			return roundValueToDigits(parameter + parameterChange);	
		else // And if the parameter is minor than destiny, calculate the half of the track to the back
			//return parameter - roundValueToDigits((parameter - destinyParameter) / 5) - 0.01;	
			return roundValueToDigits(parameter  - parameterChange);	
	}
}


// Function to configurare the Image object, to set the transaction attributes, and to move and zoom the image
function SetImageView(x, y, scale){
	DOMPageContentList[0].setAttribute("transform","translate(" + x + ", " + y + ") scale(" + scale + ")");
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

	// Setting image path
	DOMPageContentList[0].setAttribute("xlink:href", imagePath);
	DOMPageContentList[0] = document.getElementById("myImage");
	
	// Setting the image download link
	document.getElementById("link_openPage").setAttribute("href", imagePath);
	
	// Start of the transition
	bgFadeIn();
	
}

function roundValueToDigits(value){
	return parseFloat(value.toFixed(2));
}

// Function to change the idiom of the page, and also, of the image
function ChangeIdiom(){	
	var contRepository = 0;
	
	if(currentIdiom == "en"){
		currentIdiom = "pt";
		
		// Changing the logo
		DOMLogoIdiom.setAttribute("src","img\\idiom_en.jpg");
		
		// Setting captions
		// Run all the caption repository, to set all the Paragraphs elements of the page
		for (contRepository = 0; contRepository < textRepository.length; contRepository++)
			document.getElementById(textRepository[contRepository].DOMElementID).innerText = textRepository[contRepository].PortugueseContent;
	}
	else{
		currentIdiom = "en";
		
		// Changing the logo
		DOMLogoIdiom.setAttribute("src","img\\idiom_pt.jpg");
		
		// Setting captions
		// Run all the caption repository, to set all the Paragraphs elements of the page
		for (contRepository = 0; contRepository < textRepository.length; contRepository++)
			document.getElementById(textRepository[contRepository].DOMElementID).innerText = textRepository[contRepository].EnglishContent;
	}
			
}

// Function that generate the animation process of fade-in
function bgFadeIn(){

	var bgTransparency = 0.0;
	
	// Set the indication of fade-in to 0;
	startFadeOut = 0;
	
	// Putting the background above the image
	greyBackground.parentNode.appendChild(greyBackground);
	
	// Removing image events
	RemoveImageEvents();
	
	if (loadPageTransitionID == null){
		// Start the animation
		loadPageTransitionID = setInterval(function (){
		
			// Finish the animation when the process finish
			if( startFadeOut == 1 ){
				
				// When detect the load, generate the reverse animation. Return the original transparency.
				if ( roundValueToDigits(bgTransparency) >= 1.0 && roundValueToDigits(bgTransparency) <= 1.0  ) // Workarround when transaparency get a big value
					bgTransparency == 0;
				if( bgTransparency.toFixed(2) != "0.00" ){
					bgTransparency = CalculateScaleTransition(bgTransparency, 0.0, "fast-background");
					greyBackground.setAttribute("opacity", bgTransparency);
				}
				else{ // If the transparency go complete, finish the animation
					greyBackground.setAttribute("opacity", 0);
					
					// Return events that was deletede
					AddImageEvents();
					
					// Passing the image to the top of screen
					DOMPageContentList[0].parentNode.appendChild(DOMPageContentList[0]);
					DOMarrow_moveNextMap.parentNode.appendChild(DOMarrow_moveNextMap);
					DOMarrow_movePrevMap.parentNode.appendChild(DOMarrow_movePrevMap);
					
					clearInterval(loadPageTransitionID);
					loadPageTransitionID = null;
					return;
				}
			}
			else{
				// Set the transition of transparancy. When the transparency got the finish value, just ignore.
				bgTransparency = CalculateScaleTransition(bgTransparency, 0.75, "fast-background");
				greyBackground.setAttribute("opacity", bgTransparency);
			}

		}, 20);
	}
}

// Function to show an specific "DIV Page" above the others elements
function showElementAbove(element){
	for (cont = 0; cont < DOMPageContentList.length; cont++){
	
		if (DOMPageContentList[cont] == element){
			DOMPageContentList[cont].style.zIndex = 1;
		}
		else{
			DOMPageContentList[cont].style.zIndex = -1;
		}			
	}
	
	// In the end of the set, aways set the windows scroll to 0, to return to the top
	DIV_SgvHolder.scrollTop = 0;
	document.scrollingElement.scrollTop = 0;
}

//Function that hide the element page "about page, for example", and show the image element
function ClosePageElement(){
	showElementAbove(DOMPageContentList[0]);
	
	// Set the scroll type to none, when the image return to the top.
	DIV_SgvHolder.style.overflow = "hidden";
}

//Functions those call specific pages
function CallAboutPage(){
	showElementAbove(DOMPageContentList[1]);
	DIV_SgvHolder.style.overflow = "scroll";
}
function CallLicensePage(){
	showElementAbove(DOMPageContentList[2]);
	DIV_SgvHolder.style.overflow = "scroll";
}

function CallDonatePage(){
	showElementAbove(DOMPageContentList[3]);
	DIV_SgvHolder.style.overflow = "scroll";
}

function CallContactPage(){
	showElementAbove(DOMPageContentList[4]);
	DIV_SgvHolder.style.overflow = "scroll";
}

// Function that loads the string repository, to fill all text content
function LoadStringRepository(){
	
	// Starting XMLHTTP
	jSonRequisition_stringRep = new XMLHttpRequest();// code for IE7+, Firefox, Chrome, Opera, Safari
	
	if (jSonRequisition_stringRep == undefined){
		// code for IE6, IE5
		jSonRequisition_stringRep = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// Requesting JSON
    jSonRequisition_stringRep.onreadystatechange = function () {

        if (jSonRequisition_stringRep.readyState == 4 && jSonRequisition_stringRep.status == 200){  // readyState == 4: Request finished and function ready - jSonRequisition.status == 200: OK

            // Loading JSOn to object
            textRepository = JSON.parse(jSonRequisition_stringRep.responseText);       
			currentPage = 0;

			// Setting right now the paragraphs caption
			ChangeIdiom();			
		}
    }
	var urlComicsServer = dominio + "/Translation.aspx";
	jSonRequisition_stringRep.open("GET", urlComicsServer, true);
	jSonRequisition_stringRep.send();
}

