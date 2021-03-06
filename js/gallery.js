/*************************************************************/
//                        "Main"
/*************************************************************/

function roomEvents(){

  // first thing, what room is this?
  var roomUri = getRoomUri();

  // load catalog.xml and the current room as XML.		
  var rooms = loadCatalog();
  var roomIndex = getRoomIndex(rooms, roomUri);
  var room = rooms[roomIndex];

  // add page title
  insertTitle(room);

  // add work nav
  insertWorkNav(room);

  // display default content on initial page load. this should be
  // rewritten to allow per room specialization.
  var uri = getRoomTagValue(room, "images");
  if (uri != ""){
    (viewImages(genUriPath() + "data/" + uri))();
  }

  // add gallery navigation
  insertPrevTitle(getPrevRoom(rooms, roomIndex));
  insertNextTitle(getNextRoom(rooms, roomIndex));
}

window.addEvent("domready", roomEvents);


/*************************************************************/
//           Fns to add titles and gallery navigation
/*************************************************************/

function insertTitle(room){
  var title = getRoomTagValue(room, "title");
  var year = getRoomTagValue(room, "year");
  var titleBar = "Nari Ward. ".concat(year).concat(". ")
    .concat(title).concat(".");
  var roomTitle = title.concat(" (").concat(year).concat(")");

  document.getElementsByTagName("title")[0].innerHTML = titleBar;
  document.getElementById("roomTitle").innerHTML = roomTitle;
}

function insertPrevTitle(room){
  var title = getRoomTagValue(room, "title");
  var uri = getRoomTagValue(room, "uri");
  var anchor = document.getElementById("prevTitle");
  //update text
  anchor.getElementsByTagName("span")[0].innerHTML = title;
  //update href
  anchor.href = getUriNoFrag().concat(uri);
}

function insertNextTitle(room){
  var title = getRoomTagValue(room, "title");
  var uri = getRoomTagValue(room, "uri");
  var anchor = document.getElementById("nextTitle");
  //update text
  anchor.getElementsByTagName("span")[0].innerHTML = title;
  //update href
  anchor.href = getUriNoFrag().concat(uri);
}

function getPrevRoom(rooms, index){
  if (index == 0){
    return rooms[rooms.length - 1];
  } else {
    return rooms[index - 1];
  }
}

function getNextRoom(rooms, index){
  if (index == (rooms.length - 1)){
    return rooms[0];
  } else {
    return rooms[index + 1];
  }
}

/*************************************************************/
//           Fns to add work/room navigation
/*************************************************************/

function insertWorkNav(room){
  var nav = document.getElementById("workNav");
  
  //These are filenames or empty strings from catalog.xml
  var audio = getRoomTagValue(room, "audio");
  var drawings = getRoomTagValue(room, "drawings");
  var images = getRoomTagValue(room, "images");
  var text = getRoomTagValue(room, "text");
  var video = getRoomTagValue(room, "video");
  
  //get URL path, append data/ to it
  var path = genUriPath().concat("data/");

  //buttons stores the HTML to be injected into #workNav	
  var buttons = "";
  //listeners is a stack of "add listener" type thunks to apply to the
  //buttons
  var listeners = [];

  if (images != ""){
    buttons = buttons.concat(loadImagesButton());
    var imagesUri = path.concat(images);
    listeners.push(imagesListeners(imagesUri));
  }
  if (video != ""){
    buttons = buttons.concat(loadVideoButton());
    var videoUri = path.concat(video);
    listeners.push(videoListeners(videoUri));
  }
  if (drawings != ""){
    buttons = buttons.concat(loadDrawingsButton());
    var drawingsUri = path.concat(drawings);
    listeners.push(drawingsListeners(drawingsUri));
  }
  if (audio != ""){
    buttons = buttons.concat(loadAudioButton());
    var audioUri = path.concat(audio);
    listeners.push(audioListeners(audioUri));
  }
  if (text != ""){
    buttons = buttons.concat(loadTextButton());
    var textUri = path.concat(text);
    listeners.push(textListeners(textUri));
  }
  
  //Using listeners.length to measure the number of buttons. Don't
  //display only one button.
  if (listeners.length > 1){
    //Insert buttons html
    nav.innerHTML = buttons;

    //Add all of the listeners.
    var i=0;
    while (i < listeners.length){
      listeners[i]();
      i = i + 1;
    }
  }

  //Vertically centers workNavWrapper with respect to #content.
  //Something like this is need given the variability in height of the
  //workNav
  var wrapper = document.getElementById("wrapper");
  var navWrapper = document.getElementById("workNavWrapper");
  centerInParent(navWrapper, wrapper, -20);
}

function loadImagesButton(){
  var uri = genUriPath().concat("room-buttons/button-images.html");
  return loadText(uri);
}

function loadTextButton(){
  var uri = genUriPath().concat("room-buttons/button-text.html");
  return loadText(uri);
}

function loadAudioButton(){
  var uri = genUriPath().concat("room-buttons/button-audio.html");
  return loadText(uri);
}

function loadVideoButton(){
  var uri = genUriPath().concat("room-buttons/button-video.html");
  return loadText(uri);
}

function loadDrawingsButton(){
  var uri = genUriPath().concat("room-buttons/button-drawings.html");
  return loadText(uri);
}

function imagesListeners(uri){
  return function(){
    var images = document.getElementById("images");
    images.onclick = viewImages(uri);
    images.onmouseover = showKeyText("images");
    images.onmouseout = clearKeyText;
  }
}

function drawingsListeners(uri){
  return function(){
    var drawings = document.getElementById("drawings");
    drawings.onclick = viewDrawings(uri);
    drawings.onmouseover = showKeyText("drawings");
    drawings.onmouseout = clearKeyText;
  }
}

function textListeners(uri){
  return function(){
    var text = document.getElementById("text");
    text.onclick = viewText(uri);
    text.onmouseover = showKeyText("text");
    text.onmouseout = clearKeyText;
  }
}

function videoListeners(uri){
  return function(){
    var video = document.getElementById("video");
    video.onclick = viewVideo(uri);
    video.onmouseover = showKeyText("video");
    video.onmouseout = clearKeyText;
  }
}

function audioListeners(uri){
  return function(){
    var audio = document.getElementById("audio");
    audio.onclick = viewAudio(uri);
    audio.onmouseover = showKeyText("audio");
    audio.onmouseout = clearKeyText;
  }
}	

function viewImages(uri){
  return function(){
    var content = document.getElementById("content");
    xhrInstance(uri, insertThumbs(content));
  }
}

function viewText(uri){
  return function(){
    var content = document.getElementById("content");
    xhrInstance(uri, insertText(content));
  }
}

function viewDrawings(uri){
  return function(){
    var content = document.getElementById("content");
    xhrInstance(uri, insertThumbs(content));
  }
}

function viewAudio(uri){
  return function(){
    alert("Audio? Needs to be done.")
  }
}

function viewVideo(uri){
  return function(){
    alert("Video? Needs to be done.")
  }
}

//showKeyText takes a string and injects it in #workNavKey
function showKeyText(hint){
  return function(){
    var key = document.getElementById("workNavKey");
    key.innerHTML = hint;
  }
}

function clearKeyText(){
  var key = document.getElementById("workNavKey");
  key.innerHTML = "";
}

/*************************************************************/
//           General purpose helpers (AJAX, etc)
/*************************************************************/

// The sync parameter is set to false, since without the data the
// pages won't load properly anyway.
function loadText(url){
  xhttp=new XMLHttpRequest();
  xhttp.open("GET",url,false);
  xhttp.send();
  return xhttp.responseText;
} 

function loadXML(url){
  xhttp=new XMLHttpRequest();
  xhttp.open("GET",url,false);
  xhttp.send();
  return xhttp.responseXML;
} 

//Not being used at the moment....
function insertHtml(element){
  return function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      element.innerHTML=xmlhttp.responseText;
    }
  }
}

function xhrInstance(url,fn){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = fn;
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function insertText(element){
  return function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var textBoxHTML = 
	"<div id='textBox'>"
	.concat(xmlhttp.responseText)
	.concat("</div>");
      element.innerHTML = textBoxHTML;
    }
  }
}

function insertThumbs(element){
  return function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      element.style.display = "none";
      var thumbBoxHTML = 
	"<div id='thumbBox'>"
	.concat(xmlhttp.responseText)
	.concat("</div>");
      element.innerHTML = thumbBoxHTML;

      var thumbBox = document.getElementById("thumbBox");
      arrangeThumbs(thumbBox);
      
      //add "click to view" hint
      thumbBox.onmouseover = showKeyText("click to view");
      thumbBox.onmouseout = clearKeyText;

      element.style.display = "block";

      //add slimbox events to each of the thumbs
      var thumbs = element.getElementsByTagName("a");
      //slimbox needs this to be a mootools Element
      $$(thumbs).slimbox();
    }
  }
}

function centerInParent(child, parent, offset){
  var center = parent.offsetHeight / 2;
  child.style.top = 
    String((offset + center - child.offsetHeight / 2).toFixed(0)) + "px";
}

function arrangeThumbs(thumbBox)
{
  /* 
     setPos takes as arguments an element, an x position and a y
     position. The positions represent a number of half-thumbnail
     increments (with spacers). Since the grid should accommodate 9
     thumbs, the x position expected here is in the range of 0 to 4,
     as is the y.
  */

  var spacer = 15;
  var thumbSide = 125;

  function pix(pos)
  {
    var result = 
      spacer +
      pos / 2 * (thumbSide + spacer) + "px";
    return result;
  }

  function setPos(el, x, y)
  {
    el.style.left = pix(x);
    el.style.top = pix(y);
  }

  var thumbs = thumbBox.getElementsByTagName("a");
  
  switch(thumbs.length)
  {	
  case 1: 
    setPos(thumbs[0], 2, 2); 
    break;
    
  case 2: 
    setPos(thumbs[0], 1, 2);
    setPos(thumbs[1], 3, 2);
    break;
    
  case 3:
    setPos(thumbs[0], 1, 1);
    setPos(thumbs[1], 3, 1);
    setPos(thumbs[2], 2, 3);
    break;

  case 4:
    setPos(thumbs[0], 1, 1);
    setPos(thumbs[1], 3, 1);
    setPos(thumbs[2], 1, 3);
    setPos(thumbs[3], 3, 3);
    break;

  case 5:
    setPos(thumbs[0], 0, 1);
    setPos(thumbs[1], 2, 1);
    setPos(thumbs[2], 4, 1);
    setPos(thumbs[3], 1, 3);
    setPos(thumbs[4], 3, 3);
    break;

  case 6:
    setPos(thumbs[0], 0, 1);
    setPos(thumbs[1], 2, 1);
    setPos(thumbs[2], 4, 1);
    setPos(thumbs[3], 0, 3);
    setPos(thumbs[4], 2, 3);
    setPos(thumbs[5], 4, 3);
    break;

  case 7:
    setPos(thumbs[0], 1, 0);
    setPos(thumbs[1], 3, 0);
    setPos(thumbs[2], 0, 2);
    setPos(thumbs[3], 2, 2);
    setPos(thumbs[4], 4, 2);
    setPos(thumbs[5], 1, 4);
    setPos(thumbs[6], 3, 4);
    break;

  case 8:
    setPos(thumbs[0], 1, 0);
    setPos(thumbs[1], 3, 0);
    setPos(thumbs[2], 0, 2);
    setPos(thumbs[3], 2, 2);
    setPos(thumbs[4], 4, 2);
    setPos(thumbs[5], 0, 4);
    setPos(thumbs[6], 2, 4);
    setPos(thumbs[7], 4, 4);
    break;

  case 9:
    setPos(thumbs[0], 0, 0);
    setPos(thumbs[1], 2, 0);
    setPos(thumbs[2], 4, 0);
    setPos(thumbs[3], 0, 2);
    setPos(thumbs[4], 2, 2);
    setPos(thumbs[5], 4, 2);
    setPos(thumbs[6], 0, 4);
    setPos(thumbs[7], 2, 4);
    setPos(thumbs[8], 4, 4);
    break;
  }
}

/************************************************************/
// These functions are used to interact with catalog.xml. 

// extracts an array of rooms from catalog.xml
function loadCatalog(){
  var uri = genUriPath().concat("data/catalog.xml");
  var rooms = loadXML(uri).getElementsByTagName("room");
  return rooms;
}

// takes catalog as an XML object and a uri and returns the index
// of the room containing it
function getRoomIndex(rooms, uri){
  var i = 0;
  while (i < rooms.length){
    if (rooms[i].getElementsByTagName("uri")[0]
	.childNodes[0].nodeValue == uri){
      break;
    }
    i = i + 1;
  }
  //if uri is not found in catalog.xml, default to 0
  if (i == rooms.length){ i = 0; }

  return i;
}

// takes room as an XML object and a tag name from catalog.xml and
// returns a string either empty or the value of the tag
function getRoomTagValue(room, tagName){
  var tag = room.getElementsByTagName(tagName)[0];
  if (tag.childNodes.length == 0){
    return "";
  } else {
    return tag.childNodes[0].nodeValue;
  }
}

//URI processing. Could be redone with location methods perhaps.
function getUriNoFrag(){
  var url = window.document.URL;
  // matches the entire url except for the value we're after
  var pattern = /\w*:\/\/.*\/.*\?room=/;
  return url.match(pattern)[0];
}


function getRoomUri(){
  var url = window.document.URL;
  // matches the entire url except for the value we're after
  var pattern = /\w*:\/\/.*\/.*\?room=/;
  // determine the index of the value in the URL string
  var valueIndex = url.match(pattern)[0].length;
  // set a limit on how long the value can be. For safety reasons. 30
  // is arbitrary, but sufficient I guess.
  var valueLength = 30;
  var roomUri = url.slice(valueIndex, valueIndex + valueLength);

  return roomUri;
}

function genUriPath(){
  var url = window.document.URL;
  //matches the file name and the parameters. For example, finds
  //room-generic.html#amazing-grace in a full URL.
  var pattern = /[^\/]*$/;
  //construct the base Uri by removing the filename and whatever
  //follows it.
  var path = 
    url.slice(0, url.length - url.match(pattern)[0].length);
  return path;
}
