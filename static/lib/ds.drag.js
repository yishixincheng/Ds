// JavaScript Document

(function(){
	
	//拖拽
	var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },slice = [].slice;
	
	//参数说明，box代表拖拽的整体区域，proxy是代理，如果为空，整个box都可以拖拽，callback,回调函数
	
	function Drag(param){
		 
	     this.target=$(param['target']);
		 this.hander=param['hander']?$(param['hander']):this.target;
		 this.callback=param['callback']||null;
		 this.isStart=param['isStart']||false;
		 this.limitViewRange=param['limitViewRange']||false; //是否限制在可视区
		 if(this.isStart){ 
		    this.start(); //开启拖拽
		 }
	}
	Drag.prototype={
		
		start:function(){
			
			this.click=bind(this.click,this);
			this.moved=bind(this.moved,this);
			this.ended=bind(this.ended,this);
			this.began=bind(this.began,this);
			this.coordinate=bind(this.coordinate,this);
			this.off=bind(this.off,this);
			this.on=bind(this.on,this);
			this.bind=bind(this.bind,this);
			this.toggle();
		},
		toggle:function(method) {
		    if (method == null) {
			   method = 'on';
		    }
		    this.hander[method]('mousedown touchstart',this.began);
		    this.hander[method]('touchend',this.touchend);  
		    return this.hander[method]('click',this.click);
		 },
		 bind:function(method){
			  if (method == null) {
				  method = 'on';
			  }
			  $(document)[method]('mousemove touchmove', this.moved);
			  return $(document)[method]('mouseup touchcancel', this.ended);
		 },
		 on:function(){
			 
			 return this.toggle('on');
		 },
		 off:function(){
			 
			 return this.toggle('off');
		 },
		 coordinate:function(event) {
			 switch (event.type) {
				case 'touchstart':
				case 'touchmove':
				case 'touchend':
				case 'touchcancel':
				  return event.originalEvent.touches[0];
				default:
				  return event;
			  }
		  },
		  began:function(event) {
			  var ref;
			  if (this.$target) {
				return;
			  }
			  event.preventDefault();
			  event.stopPropagation();
			  this.bind('on');
			  this.$target =this.target.eq(0);
			  this.$target.addClass('g_dragging');
			  this.origin = {
				x: this.coordinate(event).pageX - this.$target.position().left,
				y: this.coordinate(event).pageY - this.$target.position().top
			  };
			  return (ref = this.callback) != null ? typeof ref.began === "function" ? ref.began(event) : void 0 : void 0;
		  },
		  ended:function(event) {
			  var ref;
			  if (this.$target == null) {
				return;
			  }
			  if (event.type !== 'touchend') {
				event.preventDefault();
				event.stopPropagation();
			  }
			  this.bind('off');
			  this.$target.removeClass('g_dragging');
			  delete this.$target;
			  delete this.origin;
			  
			  if(this.limitViewRange){
				  var oft=this.target.offset();
				  var view=Ds.getViewSize();
				  if(oft.left<0){
					  this.target.animate({left:'0px'},100);
				  }
				  if(oft.top<view.scrollTop){
					  this.target.animate({top:view.scrollTop+"px"},100);
				  }
				  var tw=this.target.width();
				  var th=this.target.height();
				  var mw=tw+oft.left-view.clientWidth;
				  if(mw>0){
					  var left=view.clientWidth-tw;
					  left=left<0?0:left;
					  this.target.animate({left:left+"px"},100);
				  }
			  }
			  return (ref = this.callbacks) != null ? typeof ref.ended === "function" ? ref.ended(event) : void 0 : void 0;
		  },
		  moved:function(event) {
			  var ref;
			  if (this.$target == null) {
				return;
			  }
			  event.preventDefault();
			  event.stopPropagation();
			  this.$target.css({
				left: this.coordinate(event).pageX - this.origin.x,
				top: this.coordinate(event).pageY - this.origin.y
			  });
			  this.dragged = this.$target;
			  return (ref = this.callbacks) != null ? typeof ref.moved === "function" ? ref.moved(event) : void 0 : void 0;
		   },
		   click : function(event) {
			  if (!this.dragged) {
				return;
			  }
			  event.preventDefault();
			  event.stopPropagation();
			  return delete this.dragged;
			},
		    touchend : function(event) {
			  this.ended(event);
			  return this.click(event);
			}
		
	}
	
  
	
	Ds.extend({
		Drag:Drag
	});
	
	
})();