/* ============================================================
 * bootstrap-gridex.js for Bootstrap v2.3.1
 * https://github.com/geedmo/gridex
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================
 * 
 * jQuery Grid Expander for Bootstrap
 * 
 * Author: Geedmo (http://geedmo.com)
 * Version: 1.0
 * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;
	
  var pluginName = 'gridex',
  	  expandedClass = 'gd-expanded',
  	  expanderClass = 'gd-expander',
  	  oldwidth = 0;

 /* PUBLIC CLASS DEFINITION
  * ============================== */

  var Gridex = function (element, options) {
    
    this.settings = $.extend({}, $.fn[pluginName].defaults, options)
    
    this.$element = $(element);
    this.items 	  = this.$element.children(this.settings.children);
    this.sliding  = false;
    this.onresize = false;
	this.init();
  }

  Gridex.prototype.init = function () {
	var that = this;
	
	this.items.each(function(){
		$(this).find('.'+expanderClass)
			.height(0)
			.on('click', function(e) { e.stopPropagation(); });
	})
	
	// attacha event
	this.items.on('click.gridex.data-api', function (e) {
		e.preventDefault();
		e.stopPropagation();
		that.toggle(this);
	})

	// force to recalc height on screen resize
	$(window).resize(function() {
		
		if($(this).width() == oldwidth) return;
		oldwidth = $(this).width();

		that.items.each(function(){
			var $this = $(this);

			//$this.data('gridexHeight', $this.height())

			if($this.hasClass(expandedClass)) {
				that.toggle(this, function() {
					$this.data('gridexHeight', $this.siblings().eq(0).height())
						 .css({ height: '' })
				});
			}
			else
				$this.data('gridexHeight', $this.height()).css({ height: '' })
			
		})
		
	})
  }

  Gridex.prototype.toggle = function (item, callback) {
	  var that      = this,
	  	  $item 	= $(item),
	  	  $expander	= $item.find('.'+expanderClass),
	  	  itemHg 	= $item.data('gridexHeight'),
	  	  otherExpanded = $item.siblings('.'+expandedClass),
	  	  isCollapsed;
	  
	  // ignore if not expander element or sliding
	  if(!$expander.length || this.sliding) return;
	  
	  this.sliding = true;
	  
	  // save item height
	  if(!itemHg) {
	  	itemHg = $item.height();
		$item.css({height: itemHg}).data('gridexHeight', itemHg)	  	
	  }
	  
	  isCollapsed = !$item.hasClass(expandedClass);
	  
	  // when other expanded, show without animation
	  if(otherExpanded.length) {
	  	// show the item
	  	$item.add($expander).css({ height: '+=' + this.settings.height }).addClass(expandedClass)
  		// hide siblings
  		otherExpanded.removeClass(expandedClass)
  					 .css('height', '-=' + this.settings.height)
  					 .find('.'+expanderClass).css('height', '0')
  		
  		that.sliding = false;
	  }
	  else {
		  // slide down
		  $item.animate({ height: (isCollapsed ? '+=' + this.settings.height : itemHg)}, {
		  	duration: this.settings.speed,
		  	complete: function() {
		  		$item[isCollapsed ? 'addClass' : 'removeClass'](expandedClass);
		  		that.sliding = false;
		  		callback && callback()
		  	}})
		  
		  $expander.animate({ height: (isCollapsed ? this.settings.height : 0)})
		  
		  if(isCollapsed)
		  	$( 'html, body' ).animate( { scrollTop : $item.offset().top - this.settings.offsetTop } );
	  }
	  
	  

  }

 /* PLUGIN DEFINITION
  * ======================== */

  var old = $.fn[pluginName]

  $.fn[pluginName] = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data(pluginName);
      
      if(!data) $this.data(pluginName, (data = new Gridex(this, option)))
	  // API
	  if(typeof option == 'string')
	  	data[option] && data[option]();
    })
  }
  
  // DEFAULTS
  $.fn[pluginName].defaults = {
  	speed: 		400,	// slide down speed
  	height: 	500,	// expandable content height
  	offsetTop: 	0,		// scroll top extra offset
  	children: 	'li'	// grid childrens selector
  }
  
  // CONSTRUCTOR CONVENTION 
  $.fn[pluginName].Constructor = Gridex;


 /* GRIDEX NO CONFLICT
  * ================== */

  $.fn[pluginName].noConflict = function () {
    $.fn[pluginName] = old
    return this
  }


}(window.jQuery);