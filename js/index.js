// Requires MooTools 1.3
function indexEvents() {

  var splash2 = $("splash2");
  var trigger = $("trigger");

  // The IE "filter" may or may not be working.
  var splash2In = function(){
    var effect = new Fx.Morph(splash2, {duration: 1500});
    effect.start(
      {"opacity": 1, 
       "filter": "alpha(opacity=1)",
       "z-index": 2}
    );
  };
  
  trigger.addEvent("mouseover", splash2In);
};

window.addEvent('domready', indexEvents);
