// JavaScript Document


(function(){
	
	var __t__={
		outinterface:['open'], /*对外结构*/
		iscreateview:false,
		isloadcss:false,
		iswait:false,
		lookcontactlock:false,
		mdlg:null,
		data:{},
        gocss:null,
		init:function(){
			
			Ds.dcom.addCom("login",this);//注册组建
			
		},
		callouti:function(oiname,param){
			//调用接口,必须函数
			__t__.iswait=false;
			__t__.lookcontactlock=false;
			if($.inArray(oiname,__t__.outinterface)==-1){
				$.alert("调用接口不存在","error");
				return;
			}
			if($.isFunction(__t__['outi_'+oiname])){
				__t__['outi_'+oiname](param||'');//调用接口
			}else{
				$.alert("调用接口没实现");
			}
		},
		outi_open:function(param){
			
			
			__t__.callback=param['callback']||null;
			__t__.isLoginPage=param['isLoginPage']||false;
			var dlg=new Ds.attach.__dlg__.popdlg({
				isHaveBoder:false,
				isOpenMove:true,
				isHaveBoder:true,
				width:280,
				height:150,
				moveType:1,
				closeCallback:function(){
					if(__t__.gocss){
						$(__t__.gocss).remove();
						__t__.gocss=null;
						__t__.isloadcss=false;
					}
				}
				});
			
			var qqurl=Ds.GU({m:'account',r:'authlogin',type:'qq'});
			var loginurl=Ds.GU({g:'wap.php',m:'account',r:'login'});
			var registurl=Ds.GU({g:'wap.php',m:'account',r:'regist'});
			
			if(__t__.isLoginPage){
				var loginhtml='<a href="javascript:;" class="dlg_login dlg_login_button">用帐号登录</a>';
			}else{
				var loginhtml='<a href="'+loginurl+'" class="dlg_login">用帐号登录</a>';
			}
			
			var html=['<div class="dlg_openlogin"><a class="dlg_auth_qq" href="',qqurl,'"></a></div>',
			          '<div class="dlg_locallogin">',
					  loginhtml,
					  '<a href="',registurl,'" class="dlg_regist">还没帐号去注册</a>',
					  '</div>'
			].join('');
			
			dlg.setContent(html);
			dlg.resizeWindow();
			
			$(".dlg_login_button").click(function(e) {
                dlg.closeWindow();
            });
			
		}
	
		
	};
	
	__t__.init();
	
})();