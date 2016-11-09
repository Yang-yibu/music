$(function(){
	function format(v){
		var v = Math.floor(v);
		var s = v % 60;
		var m = Math.floor(v / 60);
		s = (s<10) ? "0" + s : s;
		return m + ":" + s;
	}
	//清除冒泡事件
	$(document).on("mousedown", function(){
		return false;
	});
	//渲染
	function render(){
		list.empty();
		$.each(musics, function(i, v){
			var c = (i ===current) ? "active" : "";
			var I = i + 1;
			I = (I < 10) ? "0" + I : I;
			$("<li class="+c+"><div class='xuhao'>"+I+"</div><div class='music'><div class='name'>"+musics[i].name+"</div><div class='author'>"+musics[i].author+"</div></div><div class='delete'></div></li>").appendTo(".list");
		});
	}
///////////////////////////////////////////////
	var $audio = $("#audio");
	var audio = $audio.get(0);
	var play = $(".play");
	var progress = $("#progress");
	var pI = $("#p-i");
	var vol = $("#vol");
	var vI = $("#v-i");
	var prev = $("#prev");
	var next = $("#next");
	var list = $(".list");

	var current = 0;
	var musics = [
		{name: "广岛之恋", author: "莫文蔚", src: "musics/aa.mp3"},
		{name: "夜莺", author: "雅尼", src: "musics/bb.mp3"},
		{name: "微甜的回忆", author: "杨子珊", src: "musics/cc.mp3"},
		{name: "追梦赤子心", author: "Gala", src: "musics/dd.mp3"},
		{name: "六月的雨", author: "胡歌", src: "musics/ee.mp3"},
		{name: "十七岁的雨季", author: "林志颖", src: "musics/ff.mp3"},
		{name: "外面的世界", author: "齐秦", src: "musics/gg.mp3"}
	];
	
////////////////////////////////////////////////
	render();
	list.on("touchend", "li", function(){
		var index = $(this).index();
		if(index != current){
			current = index;
			audio.src = musics[current].src;
		}
//		audio.play();
	});
//删除
	list.on("touchend", ".delete", function(){
		var li = $(this).closest("li");
		var index = li.index();
		console.log(index)
		musics.splice(index, 1);
		if(index === current){
			if(musics[current]){
				audio.src = musics[current].src
			}else{
				audio.src = "";
			}
		}else if(index > current){
			//不操心
		}else if(index < current){
			current -= 1;
		};
		render();
		return false;
	});
	
//删除全部
	$("#list-huishou").on("touchend", function(){
		musics = [];
		render();
	});
	
//切歌
	next.on("touchend", nex);
	prev.on("touchend", pre)
	function nex(){
		current = current + 1;
		if(current === musics.length){
			current = 0;
		};
		audio.src = musics[current].src;
		audio.play();
	}
	function pre(){
		current = current - 1;
		if(current === -1){
			current = musics.length - 1;
		};
		audio.src = musics[current].src;
		audio.play();
	}

	
	
	
//播放暂停
	play.on("touchend", function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});
	
	

//点击快进快退
	pI.click(false);
	progress.on("touchstart", function(e){
		var width = e.originalEvent.changedTouches[0].clientX - $(this).offset().left;
		audio.currentTime = width / $(this).width() * audio.duration;
	});
	
//拖动
	progress.on("touchstart", function(e){
		$(document).on("touchmove", function(e){
			var width = e.originalEvent.changedTouches[0].clientX - progress.offset().left;
			if(width <= 0 || width >= progress.width()){
				return;
			}
			audio.currentTime = width / progress.width() * audio.duration;;
			console.log(1)
		});
	});
	$(document).on("touchend", function(){
		$(document).off("touchmove");
	});
//音量
	vol.on("touchend", function(e){
		var width = e.originalEvent.changedTouches[0].clientX - $(this).offset().left;
		audio.volume = width / $(this).width();
		$(".mute").removeAttr("state-v");
	});
//拖动
	vol.on("touchstart", function(e){
		$(document).on("touchmove", function(e){
			var width = e.originalEvent.changedTouches[0].clientX - vol.offset().left;
			var c = width / vol.width();
			if(c<0 || c>1){
				return;
			}
			audio.volume = c;
		})
	});
	$(document).on("touchend", function(){
		$(document).off("touchmove");
	});
//静音
	$(".mute").on("touchstart", function(){
		if($(this).attr("state-v")){
			audio.volume = $(this).attr("state-v");
			$(this).removeAttr("state-v");
			
		}else{
			$(this).attr("state-v", audio.volume);
			audio.volume = 0;
		}
	});
//满音
	$(".man").on("touchstart", function(){
		audio.volume = 1;
	});

///////////////////////////////////////////////

//事件驱动
	$audio.on("loadstart", function(){
		render();
		
		$("#header .name").html(musics[current].name);
		$("#header .author").html(musics[current].author);
		$(".list-title p").html("播放列表("+(current + 1)+"/"+musics.length+")");
		
		
		list.find("li").removeClass("active");
		list.find("li").eq(current).addClass("active").find(".xuhao").html("&#xe7bd;").addClass("icon one");
		$(".one").on("touchend", function(){
			if(audio.paused){
				audio.play();
				$(this).html("&#xe7bd;");
			}else{
				audio.pause();
				$(this).html("&#xe646;");
			}
		});
		audio.play();
	});
	$audio.on("progress", function(){
		console.log("progress")
	});
	$audio.on("canplay", function(){
		$("#duration").html(format(audio.duration));
		
//		list.find("li").removeClass("active");
//		list.find("li").eq(current).addClass("active").find(".xuhao").html("&#xe7bd;").addClass("icon one");
//		$(".one").on("touchend", function(){
//			if(audio.paused){
//				audio.play();
//				$(this).html("&#xe7bd;");
//			}else{
//				audio.pause();
//				$(this).html("&#xe646;");
//			}
//		});
//		audio.play();
	});
	$audio.on("play", function(){
		console.log("play")
		//暂停
		play.html("&#xe7bd;");
		
	});
	$audio.on("pause", function(){
		console.log("pause")
		//播放
		play.html("&#xe646;");
		
	});
	$audio.on("ended", function(){
		console.log("ended");
		nex();
	});
	$audio.on("timeupdate", function(){
		//设置时长
		$("#currentTime").html(format(audio.currentTime));
		
		var width = audio.currentTime / audio.duration * progress.width();
		pI.css("width", width);
	});
	$audio.on("volumechange", function(){
		var width = audio.volume * vol.width();
		vI.css("width", width);
	});
////////////////////////////////////////////////////////////
	$("#header .list-title .icon:last-child").on("touchend", function(){
		$(".list-box").addClass("list-box-active");
	});
	$(".list-box .list-title .icon").on("touchend", function(){
		$(".list-box").removeClass("list-box-active");
	});
	
	console.log($(".list-box .list-title .icon:last-child"))
	
	
//切换音量
	$("#main").on("touchstart", function(){
		$(".vol-box").toggleClass("vol-active");
	});
	$(".volume").on("touchstart", function(){
		$(".vol-box").addClass("vol-active");
	})
	
//循环播放

	
});

