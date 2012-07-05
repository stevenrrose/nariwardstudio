/********************************************************************/
//			       Helpers
/********************************************************************/

var genUriPath = function(){

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


// takes catalog as an XML object and a uri and returns the index
// of the room containing it
var getRoomIndex = function(rooms, uri){

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
};



// takes room as an XML object and a tag name from catalog.xml and
// returns a string either empty or the value of the tag
var getRoomTagValue = function(room, tagName){

  var tag = room.getElementsByTagName(tagName)[0];
  if (tag.childNodes.length == 0){

    return "";
  } 
  else {
    
    return tag.childNodes[0].nodeValue;
  }
};





// Takes a DOM element and chains its current onclick handler with the
// one provided.
var extendOnClick = function(elem, callback) {
  
  var _onclick = elem.onclick;

  elem.onclick = function() {
    
    _onclick();
    callback();
  };
};



// Generic anchor behavior
var mkAddGenericBehavior = function(openAnchor){
  
  return function(elem) {
    // Highlight element during mouse-overs
    elem.onmouseout = function() {
      
      if (this != openAnchor) {
	
	this.style.color = "#acaa9c";
      }
    };
    
    elem.onmouseover = function() {
      
      if (this != openAnchor) {
	
	this.style.color = "#2f1010";
      }
    };
    
    // Un-highlight previously clicked element and highlight newly
    // clicked element.
    elem.onclick = function(elem) {
      
      return function() {

	openAnchor.style.color = "#acaa9c";
	elem.style.color = "#2f1010";
	
	openAnchor = elem;
      };
      
    }(elem);
  };
};


/********************************************************************/


var setUpMainAnchors = function(){

  // Default open anchor
  var openAnchor = document.getElementById('current');

  // Specialize the function to add generic anchor behavior to the
  // main menu
  var addGenericBehavior = mkAddGenericBehavior(openAnchor);

  // Setup individual anchors:

  // Set up 'current'
  current = document.getElementById('current');
  addGenericBehavior(current);
  
  var content = document.getElementById('mainContent');

  extendOnClick(current, function() {
    
    jQuery.get('current.html', function(resp) {
      
      content.innerHTML = resp;
    });
  });
  

  // Set up 'archive'
  archive = document.getElementById('archive');
  addGenericBehavior(archive);

  extendOnClick(archive, function() {
    
    // Insert submenu with archive anchors
    content.innerHTML =
      "<ul id='archiveNav'>" +
      "<li id='9096'>1990-1996</li>" +
      "<li id='9702'>1997-2002</li>" +
      "<li id='0307'>2003-2007</li>" +
      "<li id='0711'>2007-2011</li>" +
      "</ul>" +
      "<div id='thumbWrapper'></div>" +
      "<div id='mainSlider'></div>" +
      "<div id='mainTitle'></div>";

    setUpArchiveAnchors();
  });


  // Set up 'biography'
  biography = document.getElementById('biography');
  addGenericBehavior(biography);

  extendOnClick(biography, function() {
    
    jQuery.get('biography.html', function(resp) {
      
      content.innerHTML = resp;
    });
  });


  // Set up 'press'
  press = document.getElementById('press');
  addGenericBehavior(press);

  extendOnClick(press, function() {
    
    jQuery.get('press.html', function(resp) {
      
      content.innerHTML = resp;
    });
  });


  // Set up 'contact'
  contact = document.getElementById('contact');
  addGenericBehavior(contact);

  extendOnClick(contact, function() {
    
    jQuery.get('contact.html', function(resp) {
      
      content.innerHTML = resp;
    });
  });


  //  Open default
  openAnchor.onclick();
};




// Sets up the slider for the archive menu anchors

var archiveCallback = function(response){

  var thumbWrapper = document.getElementById("thumbWrapper");
  
  //inject thumbs
  thumbWrapper.innerHTML = response;


  //Set width of the thumb wrapper
  var width = 0;
  var i = 0;
  var thumbs = thumbWrapper.getElementsByTagName("a");

  while (i < thumbs.length){
    width = width + thumbs[i].offsetWidth;
    i = i + 1;
  }  

  thumbWrapper.style.width = width + "px";


  //set up the scrollbar
  jQuery("#mainSlider").slider("destroy");

  var contentWidth = document.getElementById("mainContent").offsetWidth;
  var thumbsWidth = thumbWrapper.offsetWidth;

  if (thumbsWidth > contentWidth) {

    jQuery("#mainSlider").slider({
      min: 0,
      max: thumbsWidth - contentWidth,
      value: 0,
      
      create: function(event, ui) {
	
	thumbWrapper.style.marginLeft = 0 + "px";
      },

      slide: function(event, ui) {
	
	thumbWrapper.style.marginLeft = (-1 * ui.value) + "px";
      }
    });

  }
  else {

    thumbWrapper.style.marginLeft =
      ((contentWidth - thumbsWidth) / 2) + "px";
  }


  //Add titles next
  var uriFromThumb = function(thumb){

    var pattern = /\w*:\/\/.*\/.*\?room=/;
    var valueIndex = thumb.href.match(pattern)[0].length;
    var maxLength = 30;

    return thumb.href.slice(valueIndex, valueIndex + maxLength);
  }

  var titlesCallback = function(data) {

    var mainTitle = document.getElementById("mainTitle");

    var rooms = data.getElementsByTagName("room");

    i = 0;
    while (i < thumbs.length){
      
      var uri = uriFromThumb(thumbs[i]);
      var roomNum = getRoomIndex(rooms, uri);
      var title = getRoomTagValue(rooms[roomNum], "title");
      
      thumbs[i].onmouseover = function(title){
	
	return function(){
	  
	  mainTitle.innerHTML = title;
	};
	
      }(title);
      
      thumbs[i].onmouseout = function(){
	
	mainTitle.innerHTML = "";
      };
      
      i = i + 1;
    }  
    
    thumbWrapper.style.visibility = "visible";
  }

  // Get catalog.xml for the titles
  var catalogUrl = genUriPath().concat("data/catalog.xml");
  jQuery.get(catalogUrl, titlesCallback)
};




var setUpArchiveAnchors = function() {

  // Default open anchor
  var openAnchor = document.getElementById('9096');

  // Specialize the function to add generic anchor behavior to the
  // main menu
  var addGenericBehavior = mkAddGenericBehavior(openAnchor);


  // Setup individual anchors:

  // Set up '9096'
  y9096 = document.getElementById('9096');
  addGenericBehavior(y9096);
  
  var content = document.getElementById('mainContent');

  extendOnClick(y9096, function() {
    
    jQuery.get('data/90-96-archive-thumbs.html', archiveCallback);

  });


  // Set up '9702'
  y9702 = document.getElementById('9702');
  addGenericBehavior(y9702);
  
  extendOnClick(y9702, function() {
    
    jQuery.get('data/97-02-archive-thumbs.html', archiveCallback);

  });


  // Set up '0307'
  y0307 = document.getElementById('0307');
  addGenericBehavior(y0307);
  
  extendOnClick(y0307, function() {
    
    jQuery.get('data/03-07-archive-thumbs.html', archiveCallback);
  });


  // Set up '0711'
  y0711 = document.getElementById('0711');
  addGenericBehavior(y0711);
  
  extendOnClick(y0711, function() {
    
    jQuery.get('data/07-11-archive-thumbs.html', archiveCallback);
  });

  //  Open default
  openAnchor.onclick();
};






/***********************************************************************/

var main = function(){

  jQuery("#wrapper").fadeIn(1000);

  setUpMainAnchors();

};

jQuery(document).ready(main)
