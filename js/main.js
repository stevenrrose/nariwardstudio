// Requires Mootools 1.3
var mainEvents = function(){

  xmlhttp = new XMLHttpRequest();

  // asynchronous request
  var xhrInstance = function(url,fn){
    var xhrFn = function(){
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  	fn(xmlhttp.responseText);
      }
    };
    xmlhttp.onreadystatechange = xhrFn;
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
  };

  //synchronous request
  // var xhrInstance = function(url,fn){
  //   xmlhttp.open("GET",url,false);
  //   xmlhttp.send();
  //   if (xmlhttp.responseText.length > 0){
  //     fn(xmlhttp.responseText);
  //   }else{
  //     alert("empty reply");
  //   }
  // };

  fadeInWrapper();

  setUpMenuAnchors(xhrInstance);

};

var fadeInWrapper = function(){
  var wrapper = $("wrapper");
  var effect = new Fx.Morph(wrapper, {duration: 1000});
  effect.start(
    {"opacity": 1,
     "filter": "alpha(opacity=1)"}
  );
};

var viewCurrent = function(xhrInstance){
  var archiveEvents = function(response){
    var content = document.getElementById("mainContent");
    content.innerHTML = response;
  }
  xhrInstance("current.html", archiveEvents);
};

var viewArchive = function(xhrInstance){
  var archiveEvents = function(response){
    var content = document.getElementById("mainContent");
    content.innerHTML = response;
    setUpArchiveAnchors(xhrInstance);
  }
  xhrInstance("archive.html", archiveEvents);
};

var viewBiography = function(xhrInstance){
  var archiveEvents = function(response){
    var content = document.getElementById("mainContent");
    content.innerHTML = response;
  }
  xhrInstance("biography.html", archiveEvents);
};

var viewPress = function(xhrInstance){
  var archiveEvents = function(response){
    var content = document.getElementById("mainContent");
    content.innerHTML = response;
  }
  xhrInstance("press.html", archiveEvents);
};

var viewContact = function(xhrInstance){
  var archiveEvents = function(response){
    var content = document.getElementById("mainContent");
    content.innerHTML = response;
  }
  xhrInstance("contact.html", archiveEvents);
};

var setUpMenuAnchors = function(xhrInstance){
  var anchors = [];
  anchors.push([document.getElementById("current"), viewCurrent]);
  anchors.push([document.getElementById("archive"), viewArchive]);
  anchors.push([document.getElementById("biography"), viewBiography]);
  anchors.push([document.getElementById("press"), viewPress]);
  anchors.push([document.getElementById("contact"), viewContact]);

  //the default anchor for page open
  var defAnchor = anchors[0];

  //openAnchor is bound to the individual listeners, so they can keep
  //track of who was last clicked. Initialized to the default.
  var openAnchor = defAnchor[0];

  //Notice the closure under openAnchor here and below if you're
  //tempted to factorize
  var highlightAnchor =  function(anchor){
    openAnchor.style.color = "#acaa9c";
    anchor.style.color = "#2f1010";
  };

  var onClickEvents = function(anchor){
    var el = anchor[0];
    var viewFn = anchor[1];
    highlightAnchor(el);
    openAnchor = el;
    viewFn(xhrInstance);
  };

  var i = 0;
  while(i < anchors.length){
    anchors[i][0].onclick = 
      function(i){
	return function(){
	  onClickEvents(anchors[i]);
	};
      }(i);
    anchors[i][0].onmouseout = function(){
      if (this != openAnchor){
	this.style.color = "#acaa9c";
      }
    };
    anchors[i][0].onmouseover = function(){
      if (this != openAnchor){
	this.style.color = "#2f1010";
      }
    };
    i = i + 1;
  }

  //effectively clicks on the default anchor on page load
  onClickEvents(defAnchor);
};

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

var loadXML = function(url){
  xhttp=new XMLHttpRequest();
  xhttp.open("GET",url,false);
  xhttp.send();
  return xhttp.responseXML;
};

// extracts an array of rooms from catalog.xml
var loadCatalog = function(){
  var uri = genUriPath().concat("data/catalog.xml");
  var rooms = loadXML(uri).getElementsByTagName("room");
  return rooms;
};

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
  } else {
    return tag.childNodes[0].nodeValue;
  }
};

var setUpArchiveAnchors = function(xhrInstance){
  var anchors = [];
  anchors.push([document.getElementById("9096"), "data/90-96-archive-thumbs.html"]);
  anchors.push([document.getElementById("9702"), "data/97-02-archive-thumbs.html"]);
  anchors.push([document.getElementById("0307"), "data/03-07-archive-thumbs.html"]);
  anchors.push([document.getElementById("0711"), "data/07-11-archive-thumbs.html"]);

  //openAnchor is bound over the individual listeners, so they can keep
  //track of who was last clicked.
  var openAnchor;

  var highlightAnchor = function(anchor){
    if (openAnchor !== undefined){ 
      openAnchor.style.color = "#acaa9c";
    }
    anchor.style.color = "#2f1010";
  };

  var viewFn = function(uri, scrollbar){
    var insertMainThumbs = function(response){
      var thumbWrapper = document.getElementById("thumbWrapper");
      
      //hide until it's setup
      thumbWrapper.style.visibility = "hidden";
      
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
      var contentWidth = document.getElementById("mainContent").offsetWidth;
      var thumbsWidth = thumbWrapper.offsetWidth;
      var knob = $("knob");
      var slider = $("mainSlider");
      if (thumbsWidth > contentWidth){
	scrollbar.setRange([0, thumbsWidth - contentWidth]);
	scrollbar.set(0);
	scrollbar.attach();
	knob.setStyle("visibility", "visible");
      }else{
	slider.removeEvents(); //since the slider detach method is dysfunctional
	knob.removeEvents();
	knob.setStyle("visibility", "hidden");
	//center the few thumbs there are
	thumbWrapper.style.marginLeft = ((contentWidth - thumbsWidth) / 2) + "px";
      };
      
      
      //Add titles next
      var uriFromThumb = function(thumb){
	var pattern = /\w*:\/\/.*\/.*\?room=/;
	var valueIndex = thumb.href.match(pattern)[0].length;
	var maxLength = 30;
	return thumb.href.slice(valueIndex, valueIndex + maxLength);
      }
      var rooms = loadCatalog();
      var mainTitle = document.getElementById("mainTitle");
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
      
    };
    xhrInstance(uri, insertMainThumbs);
  };

  var onClickEvents = function(anchor){
    highlightAnchor(anchor[0]);
    openAnchor = anchor[0];

    var thumbWrapper = document.getElementById("thumbWrapper");
    //now make a mootools scrollbar
    var slider = $("mainSlider");
    var knob = $("knob");
    slider.style.visibility = "visible";
    var scrollbar = new Slider(
      slider, knob,
      {offset: -5,
       steps: 620,
       onChange: function(pos){
	 thumbWrapper.style.marginLeft = (-1 * pos) + "px";
       }
      }
    );

    viewFn(anchor[1], scrollbar);
  };

  var i = 0;
  while(i < anchors.length){
    anchors[i][0].onclick = 
      function(i){
	return function(){
	  onClickEvents(anchors[i]);
	}
      }(i);
    anchors[i][0].onmouseout = function(){
      if (this != openAnchor){
	this.style.color = "#acaa9c";
      }
    };
    anchors[i][0].onmouseover = function(){
      if (this != openAnchor){
	this.style.color = "#2f1010";
      }
    };
    i = i + 1;
  }
};

/***********************************************************************/


window.addEvent("domready", mainEvents);
