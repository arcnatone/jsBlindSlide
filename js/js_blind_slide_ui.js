/* 
# ------------
#
# jsBlindSlide
#
#
# Author : Ji-seop
# Last Update : 2017-09-06
# Options : speed(ms), time(ms), showTime(ms), bgLength(int), bgDelay(ms), bgSpeed(ms)
#
#-------------
*/
(function($){
	$.fn.jsBlindSlide = function(options){
		var slideObj = $(this);
		var slideArr = new Array();
		var defaults = new Array();
		defaults = {
			speed : 300,
			time : 3500,
			showTime : 2000,
			bgLength : 10,
			bgDelay : 100,
			bgSpeed : 250
		};
		var options = $.extend({}, defaults, options);
		
		slideArr = {
			state : false,
			area : slideObj,
			wrap : slideObj.find(".slide-wrap"),
			list : slideObj.find(".slide-list"),
			item : slideObj.find(".slide-list").find("li"),
			listLength : slideObj.find(".slide-list").find("li").length,
			bgList : null,
			bgItem : null,
			prevIdx : 0,
			nextIdx : 0,
			prevAni : $.noop(),
			nextAni : $.noop(),
			autoAni : $.noop(),
			clearAni : $.noop(),
			animation : $.noop(),
			bgAni : $.noop(),
			options : options
		};
		
		// Default Setting
		slideArr.item.eq(0).addClass("on");
		if(slideArr.options.bgLength < 1){
			slideArr.options.bgLength = 1;
		}

		// Blind layer setting
		slideArr.wrap.append("<ul class='blind-bg'></ul>");
		slideArr.bgList = slideArr.wrap.find(".blind-bg");

		for(var i=0; i < slideArr.options.bgLength; i++){
			slideArr.bgList.append("<li style='width:"+(100/slideArr.options.bgLength)+"%;'><div></div></li>");
		}
		slideArr.bgItem = slideArr.bgList.find("li");
		
		if(2*slideArr.options.bgDelay*(slideArr.options.bgLength+1) > slideArr.options.time){
			slideArr.options.bgDelay = slideArr.options.time/(2*(slideArr.options.bgLength+10));
		}
		
		// Animations
		slideArr.prevAni = function(){
			if(!slideArr.state){
				slideArr.bgAni();
				slideArr.state = true;

				if(slideArr.item.filter(".on").length < 1){
					slideArr.prevIdx = slideArr.listLength-1;
				}else{
					if(slideArr.item.filter(".on").index() == 0){
						slideArr.prevIdx = slideArr.listLength-1;
					}else{
						slideArr.prevIdx = slideArr.item.filter(".on").index()-1;
					}
				}
				
				setTimeout(function(){
					slideArr.item.filter(".on").hide().removeClass("on");
					slideArr.item.eq(slideArr.prevIdx).show().addClass("on");
					slideArr.state = false;
				}, (slideArr.options.bgDelay*slideArr.options.bgLength)+slideArr.options.bgSpeed);
			}
		}
		slideArr.nextAni = function(){
			if(!slideArr.state){
				slideArr.bgAni();
				slideArr.state = true;

				if(slideArr.item.filter(".on").length < 1){
					slideArr.nextIdx = 1;
				}else{
					if(slideArr.item.filter(".on").index() == slideArr.listLength-1){
						slideArr.nextIdx = 0;
					}else{
						slideArr.nextIdx = slideArr.item.filter(".on").index()+1;
					}
				}
				
				setTimeout(function(){
					slideArr.item.filter(".on").hide().removeClass("on");
					slideArr.item.eq(slideArr.nextIdx).show().addClass("on");
					slideArr.state = false;
				}, (slideArr.options.bgDelay*slideArr.options.bgLength)+slideArr.options.bgSpeed);
			}
		}
		slideArr.autoAni = function(){
			slideArr.animation = setInterval(slideArr.nextAni, slideArr.options.time + slideArr.options.showTime);
		}
		slideArr.clearAni = function(){
			clearInterval(slideArr.animation);
		}
		slideArr.bgAni = function(){
			slideArr.bgItem.each(function(i){
				var thisObj = $(this);
				thisObj.find("div").delay(i*slideArr.options.bgDelay).animate({"left":0}, slideArr.options.bgSpeed, "swing", function(){
					var bg = $(this);
					setTimeout(function(){
						bg.animate({"left":"100%"}, slideArr.options.bgSpeed, "swing", function(){
							bg.css({"left":"-100%"});
						});
					}, slideArr.options.bgDelay*slideArr.options.bgLength);
				});
			});
		}

		// Run
		slideArr.autoAni();

		// Return
		return $(this);
	}
})(jQuery);

