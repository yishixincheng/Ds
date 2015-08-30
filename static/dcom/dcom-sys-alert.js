// JavaScript Document

(function(){
	
	
    var __t={
	  	 outinterface:['open'], /*对外结构*/
		 alerttimer:null,
		 init:function(){
			
			 Ds.dcom.addCom("sys-alert",this);//注册组建
			 
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
			
			var tip=p['tip'];
			var type=p['type']||"notice";
			var time=p['time']||2000000; //默认显示两秒
			var func=p['func'];
			
			if(__t.alerttimer!=null){
				window.clearTimeout(__t.alerttimer);
			}
			var len=tip.length;
			var ob=Ds.E("_P_Alert");
			if(!ob){ob=Ds.addDivToBody("_P_Alert")};
			ob.className="if_p_alertbody";
			var A=['<div class="if_p_alert_left"></div>','<div class="if_p_alert_mid">','<span class="',type,'"><i></i>',tip,'</span>','</div>','<div class="if_p_alert_right"></div>'];
			ob.innerHTML=A.join('');
			var w=80+len*16;
			ob.style.width=w+"px";
			$(ob).children().eq(1).width(w-16);
			Ds.centerWindow(ob,w,58);
			__t.alerttimer=window.setTimeout(function(){
				if($.isFunction(func)){func.call()};
				$(ob).remove()
			},time)
			
		},
		distroy:function(){
			
			//卸载时释放内存
			
		}
		 
    }
	__t.init();

})();