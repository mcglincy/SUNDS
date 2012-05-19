//
// ThreeSixty image spinner
//
var ThreeSixty = function() {

  // ########## private vars ##########
	var 
	    enclosingDivId,
	    spinnerDivId = "#three-sixty-spinner",
	    spinnerSpanId = "#three-sixty-spinner span",
	    spinnerImagesDivId = "#three-sixty-spinner-images",
      divInnerHtml = '<div id="three-sixty-spinner"><span>0%</span></div><ol id="three-sixty-spinner-images"></ol>',

      // image subdir and name prefix
      spinnerImagePrefix,

      autoSpinEnabled = true,
      userDidMouseUp,
      autoSpinTicker,
      autoSpinTickMillis = 50,
      autoSpinFrameIncrement = 1,

      // set totalFrames to the number of spinner images
			totalFrames = 113,
			currentFrame = 0,
			frames = [],
			endFrame = 0,
			loadedImages = 0,
      
	    ready = false,
			dragging = false,
			pointerStartPosX = 0,
			pointerEndPosX = 0,
			pointerDistance = 0,

			monitorStartTime = 0,
			monitorInt = 10,
			ticker = 0,
			speedMultiplier = 10,
			spinner;

	// ########## private methods ##########

  function loadImage() {
      var li = document.createElement("li");
      var imageName = spinnerImagePrefix + (loadedImages + 1) + ".jpg";
      var image = $('<img>').attr('src', imageName).addClass("three-sixty-previous-image").appendTo(li);
      frames.push(image);
      $(spinnerImagesDivId).append(li);
      $(image).load(function() {
        imageLoaded();
      });    
  }

	function imageLoaded() {
		loadedImages++;
		$(spinnerSpanId).text(Math.floor(loadedImages / totalFrames * 100) + "%");
		if (loadedImages == totalFrames) {
			frames[0].removeClass("three-sixty-previous-image").addClass("three-sixty-current-image");
			$(spinnerDivId).fadeOut("slow", function(){
				spinner.hide();
				showThreesixty();
			});
		} else {
			loadImage();
		}
	};
	
	function showThreesixty () {
		$(spinnerImagesDivId).fadeIn("slow");
		ready = true;
		endFrame = -1 * totalFrames * 4;
		refresh();
	};

	function render() {
		if (currentFrame !== endFrame) {	
			var frameEasing = endFrame < currentFrame ? Math.floor((endFrame - currentFrame) * 0.1) : Math.ceil((endFrame - currentFrame) * 0.1);
			if (autoSpinEnabled && userDidMouseUp && Math.abs(frameEasing) <= 1) {
			  // frame changed is slowed down enough, so start autoSpin
			  startAutoSpin();
			}
			hidePreviousFrame();
			currentFrame += frameEasing;
			showCurrentFrame();
		} else {
			window.clearInterval(ticker);
			ticker = 0;
		}
	};
	
	function refresh() {
		if (ticker === 0) {
			ticker = self.setInterval(render, Math.round(1000 / 60));
		}
	}
	
	function hidePreviousFrame() {
		frames[getNormalizedCurrentFrame()].removeClass("three-sixty-current-image").addClass("three-sixty-previous-image");
	}
	
	function showCurrentFrame() {
		frames[getNormalizedCurrentFrame()].removeClass("three-sixty-previous-image").addClass("three-sixty-current-image");
	}
	
	function getNormalizedCurrentFrame() {
		var c = -Math.ceil(currentFrame % totalFrames);
		if (c < 0) c += (totalFrames - 1);
		return c;
	}
	
	function getPointerEvent(event) {
		return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
	}
	
	function autoSpinTick() {
	  if (!dragging) {
  	  endFrame = currentFrame + autoSpinFrameIncrement;
	    refresh();
	  }
	}

	function startAutoSpin() {
    if (!autoSpinTicker) {
	    autoSpinTicker = self.setInterval(autoSpinTick, autoSpinTickMillis);
	  }
  }

  function stopAutoSpin() {
    self.clearInterval(autoSpinTicker);
    autoSpinTicker = undefined;    
  }
  
  function trackPointer(event) {
		if (ready && dragging) {
			pointerEndPosX = getPointerEvent(event).pageX;
			if (monitorStartTime < new Date().getTime() - monitorInt) {
				pointerDistance = pointerEndPosX - pointerStartPosX;
				endFrame = currentFrame - Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $(enclosingDivId).width()));
				autoSpinFrameIncrement = (endFrame > currentFrame) ? 1 : -1;				
				refresh();
				monitorStartTime = new Date().getTime();
				pointerStartPosX = getPointerEvent(event).pageX;
			}
		}
	}
	
	function addTouchHandlers() {
      $(enclosingDivId).mousedown(function (event) {
        event.preventDefault();
        pointerStartPosX = getPointerEvent(event).pageX;
        dragging = true;
        userDidMouseUp = false;
        stopAutoSpin();
      });
      
      $(document).mouseup(function (event){
        event.preventDefault();
        dragging = false;
        userDidMouseUp = true;
      });
      
      $(document).mousemove(function (event){
        event.preventDefault();
        trackPointer(event);
      });
      
      $(enclosingDivId).live("touchstart", function (event) {
        event.preventDefault();
        pointerStartPosX = getPointerEvent(event).pageX;
        dragging = true;
      });
      
      $(enclosingDivId).live("touchmove", function (event) {
        event.preventDefault();
        trackPointer(event);
      });
      
      $(enclosingDivId).live("touchend", function (event) {
        event.preventDefault();
        dragging = false;
      });    	
	}

  // ############ public methods ###########
  return {

    // add a spinner to the given div id, using the given image prefix
    addSpinner : function addSpinner(divId, imagePrefix, width, height) {
      enclosingDivId = "#" + divId;
      spinnerImagePrefix = imagePrefix;
      $(enclosingDivId).html(divInnerHtml);
      $(enclosingDivId).css({
        'position': 'absolute',
        'overflow': 'hidden',
        'left': '50%',
        'top': '50%',
        'z-index': '1',
        'width': width,
        'height': height,
        'margin-left': -0.5 * width,
        'margin-top': -0.5 * height,
        });

      spinner = new CanvasLoader("three-sixty-spinner");
      spinner.setShape("spiral");
      spinner.setDiameter(90);
      spinner.setDensity(90);
      spinner.setRange(1);
      spinner.setSpeed(4);
      spinner.setColor("#333333");
      spinner.show();

      $(spinnerDivId).fadeIn("slow");    
      
      addTouchHandlers();
      loadImage();
    },
    
  }; // public methods return
} (); // end ThreeSixty
