$(function(){
	// 初期始動
	keepRatio();
	// ウインドウサイズが変更されたら相対を取り直す
	$(window).resize(keepRatio);
});

function keepRatio()
{
	var w = $("body").width();
	var h = $("body").height();
	
	if ( w / 16 >= h / 9 ) {
		w = Math.round((h/9)*16);
	}
	else {
		h = Math.round((w/16)*9);
	}
	
	/* 相対を取り直す必要がある要素 */
	$("#aspect").css({
		"width":		w,
		"height":		h,
		"margin":		Math.round(-h/2)+"px "+Math.round(-w/2)+"px"
	});
	
	$("#count").css({
		"width":		w*0.75,
		"height":		h*0.35,
		"margin":		Math.round((-h*0.35)/2)+"px "+Math.round((-w*0.75)/2)+"px",
		"font-size":	Math.round(h*0.4)+"px",
		"line-height":	Math.round(h*0.35)+"px",
	});
	
	$("#telop div").css({
		"font-size":	Math.round(h*0.1)+"px",
		"line-height":	Math.round(h*0.15)+"px",
	});
	
	$("#product div").css({
		"top":			-1 * $("#product div").width()+"px",
	});
	
	$("#baloon").css({
		"width":		w*0.25,
		"height":		w*0.25,
	});
	
	$("#baloon div").css({
		"font-size":	Math.round(w*0.07)+"px",
		"line-height":	Math.round(w*0.24)+"px",
	});
	
	$("#stamp").css({
		"width":		w*0.3,
		"height":		w*0.3,
		"margin":		Math.round(-w*0.3/2)+"px "+Math.round(-w*0.3/2)+"px"
	});
	
}
