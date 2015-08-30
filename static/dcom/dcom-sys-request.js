// JavaScript Document

(function(){
	
	
    var __t={
	  	 outinterface:['open'], /*对外结构*/
		 loadingLimer:null,
		 loadComplate:false,
		 init:function(){
			 Ds.dcom.addCom("sys-request",this);//注册组建	
		 },
		 callouti:function(oiname,param){
			//调用接口,必须函数
			__t.iswait=false;
			if($.inArray(oiname,__t.outinterface)==-1){
				alert("调用接口不存在","error");
				return;
			}
			if($.isFunction(__t['outi_'+oiname])){
				__t['outi_'+oiname](param||'');//调用接口
			}else{
				alert("调用接口没实现");
			}
		},
		outi_open:function(p){
			
			var url=p['u'];
			var data=p['d'];
			var dataType=p['dt'];
			var type=p['t'];
			var success=p['s'];
			var async=p['a'];
			var style=p['st'];//1,顶层加载进度条，dom对象是绑定对象上加载进度条，样式自行修改
			
			if($.inArray(type,['post','get'])){
				__t.Ajax(url,data,dataType,type,success,async,style);
			}
			
		},
		Ajax:function(url,data,dataType,type,success,async,style){
			
			Ds.Ajax(url,data,dataType,type,success,async,function(){
				//beforajax
				if(style===1){
					__t.createProcessBar();
				}else if(style!=0){
					__t.showLoading(style);
				}
			},function(){
				//completeajax
				if(style===1){
					__t.endProcessBar();
				}else if(style!=0){
					__t.hideLoading(style);
				}
			});
			
		},
		createProcessBar:function(){
			
			var dombar=Ds.E("dcom_ajax_processbar");
			if(dombar){
				return;
			}
			dombar=Ds.addDivToBody("dcom_ajax_proccessbar");
			
			__t.moveProcessBar();
		},
		moveProcessBar:function(){
			$("#dcom_ajax_proccessbar").animate({width:'90%'},200,function(){
			     $(this).animate({width:'98%'},5000);
			});
		},
		endProcessBar:function(){
		    $("#dcom_ajax_proccessbar").stop().animate({width:'100%'},100,function(){
				$(this).unbind();
				$(this).remove();
			});
			
		},
		showLoading:function(style){
			
			__t.loadComplate=false;
			__t.loadingLimer=window.setTimeout(function(){
			    
				if(!__t.loadComplate){
					var bdom=$(style).get(0);
					if(!bdom){
						bdom=Ds.E(style);
					}
					var bindDom=document.documentElement;
					bindDom=bdom||bindDom;
					var boxW=$(bindDom).width();
					var boxH=$(bindDom).height();
					var boxOft=$(bindDom).offset();
					var view=Ds.getViewSize();
					var dombar=Ds.E("dcom_ajax_loading");
					if(!dombar){
						dombar=Ds.addDivToBody("dcom_ajax_loading");
						dombar.innerHTML='<div class="dcom_ajax_loading-bounce1"></div><div class="dcom_ajax_loading-bounce2"></div>';
					}
					var loadWidth=$(dombar).width();
					var loadHeight=$(dombar).height();
					var left=0,top=0;
					if(style==2){
						//
						left=(boxW-loadWidth)/2;
						top=(view.clientHeight-loadHeight)/2+view.scrollTop;
					}else{
						left=(boxW-loadWidth)/2+boxOft.left;
						top=(boxH-loadHeight)/2+boxOft.top;
					}
					
					$(dombar).offset({left:left,top:top});
					window.clearTimeout(__t.loadingLimer);
				}
			
			},500);
			
		},
		hideLoading:function(style){
			__t.loadComplate=true;
			var dombar=Ds.E("dcom_ajax_loading");
			if(dombar){
			    $(dombar).remove();
			}
			
		},
		distroy:function(){
			
			//卸载时释放内存
			
		}
		 
    }
	__t.init();

})();