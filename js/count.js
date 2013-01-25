$(function(){
	printToolbar();
	getCounter(-1, 0);
	
	{
		$("#character1").transition({opacity:0}, 0);
		$("#baloon").transition({opacity:0}, 0);
		$("#stamp").transition({opacity:0}, 0);
	}
	
	// テロップの文字スクロール
	$('.horizontal_scroller').SetScroller({
		velocity:		93,
		direction: 		'horizontal',
		loop:			'infinite',
		onmouseover:	'play',
		onmouseout:		'play',
		cursor:			'default',
	});
	
});

var aFlag = 0;
var setInID = null;

// 音声の読み込み
var SOUND = {
	// 通常の製品紹介音声
	"se01": new Audio("se/01.ogg"),		// 泡々酒ストライプ
	"se02": new Audio("se/02.ogg"),		// おかやま米野菜
	"se03": new Audio("se/03.ogg"),		// 津山ビール
	"se04": new Audio("se/04.ogg"),		// SOYPORK
	"se05": new Audio("se/05.ogg"),		// 醍醐桜ジャージー牛乳
	"se06": new Audio("se/06.ogg"),		// 踊る！たこ焼き器
	"se07": new Audio("se/07.ogg"),		// 姫とうがらし藁綯い
	"se08": new Audio("se/08.ogg"),		// 黒々炒り豆
	"se09": new Audio("se/09.ogg"),		// FOODACTION美作
	"se10": new Audio("se/10.ogg"),		// 真庭ブランド
	"se11": new Audio("se/11.ogg"),		// 蒜山ジャージーヨーグルト
	"se12": new Audio("se/12.ogg"),		// 紅酢
	"se13": new Audio("se/13.ogg"),		// マグロの鉄太郎
	"se14": new Audio("se/14.ogg"),		// 蒟蒻名人 ゆばこん
	"se15": new Audio("se/15.ogg"),		// 倉敷ソーセージ
	"se16": new Audio("se/16.ogg"),		// どらせん作州黒餡
	"se17": new Audio("se/17.ogg"),		// 雄町米おかき
	
	// イベント用
	"taiko": new Audio("se/taiko.ogg"),	// 和太鼓
	"event": new Audio("se/event.ogg"),	// キリ番音声
};

function getCounter( count, booth )
{
	// これがないとメモリがやばい
	clearInterval(setInID);
	
	// 現在時刻だよぉ
	var time = Math.floor((new Date)/100);
	
	$.get("./count.txt?"+time, function(data){
		
		// データの整理
		var lines    = data.split(/\r?\n/);
		var getcount = parseInt(lines[0]);
		var getbooth = lines[1];
		
		// 一番近いキリ番の値
		var kiriban  = Math.floor(getcount/100)*100;
		
		// カウント値が増えた時のイベント
		if ( getcount > count && count != -1 ) {
			
			if ( count < kiriban && kiriban <= getcount ) {
				// キリ番のスペシャルアニメーション
				kiribanAnimation();
			}
			else if ( aFlag == 0 ) {//&& getbooth != booth ) {
				// アニメーション中でなかったらアニメーションする
				normalAnimation(getcount, getbooth);
			}
			else {
				getbooth = booth;
			}
		}
		
		printCountNum(getcount, count, getbooth, booth);
		
		// タイマー的機能
		setInID = setInterval(function(){getCounter(getcount, getbooth);}, 1000);
		
	});
}

function printCountNum( goal, count, getbooth, booth ) {
	
	if ( goal - count >= 1 && count != -1 ) {
		$("div#countbox").transition( { opacity: 0 }, 500, 'ease',
			function(){
				if ( aFlag != 1 ) {
					$("div#count").text(goal);
					$(this).delay(250).transition( { opacity: 1 } );
				}
			}
		);
		if ( getbooth != booth ) {
			$("#telop").transition({opacity:0}, 500, 'ease');
		}
	}
	else {
		if ( aFlag != 1 ) {
			$("div#count").text(goal);
			$("div#countbox").transition( { opacity: 1 } );
			$("#telop").transition( { opacity: 1 } );
		}
	}
}

// アニメーション
function normalAnimation( count, productID ) {
	var draw = getSize("#aspect")
	var img  = getSize("#product div");
	var y = img.w + draw.h/2 - img.h/2;
	var x = draw.w/2 - img.w/2;
	aFlag = 1; // アニメーションフラグ
	$("#product #s" + productID)
		// 出現アニメーション
		.transition({
			y :			y,
			x :			x,
			rotate :	365
		}, 800, 'ease')
		// 音を鳴らす
		.queue( function(next){
			SOUND["se"+productID].load();
			SOUND["se"+productID].play();
			next();
		})
		// 5秒待つ
		.delay(4500)
		.queue( function(next){
			SOUND["se"+productID].load();
			SOUND["se"+productID].play();
			next();
		})
		.delay(3500)
		// ここでアニメーションフラグを解除するといい感じ
		.queue( function(next){ aFlag = 0; next(); } )
		// 消失アニメーション
		.transition({
			y :			-y,
			x :			-x,
			rotate :	-365
		}, 700, 'ease')
	;
	$("#character1").transition({opacity:1.0}, 800).delay(8000).transition({opacity:0}, 700);
	$("#baloon div").text(count);
	$("#baloon").delay(600).transition({opacity:1.0, rotate:-15}, 200).delay(8000).transition({opacity:0}, 700).transition({rotate:0},0);
}

function kiribanAnimation()
{
	// アニメーション中であれば再度呼び出す
	if ( aFlag == 1 ) {
		setTimeout(function(){kiribanAnimation();}, 500);
	}
	else {
		// データを取りに行く
		$.get("./kiriban.txt", function(data) {
			var lines = data.split(/\r?\n/);
			var count = parseInt(lines[0]);
			var productID = lines[1];
			
			var draw = getSize("#aspect")
			var img  = getSize("#product div");
			var y = img.w + draw.h/2 - img.h/2;
			var x = draw.w/2 - img.w/2;
			aFlag = 1; // アニメーションフラグ
			
			$("#product #s" + productID)
				// 出現アニメーション
				.transition({
					y :			y,
					x :			x,
					rotate :	365,
					opacity:	0
				}, 0, 'ease')
				.transition({
					opacity:	1.0
				}, 800, 'ease')
				// 音を鳴らす
				.queue( function(next){
					SOUND["taiko"].load();
					SOUND["taiko"].play();
					next();
				})
				.delay(300)
				.queue( function(next){
					SOUND["event"].load();
					SOUND["event"].play();
					next();
				})
				// 5秒待つ
				.delay(5000)
				.queue( function(next){
					SOUND["se"+productID].load();
					SOUND["se"+productID].play();
					next();
				})
				// 2セット繰り返します
				.delay(3500)
				.queue( function(next){
					SOUND["taiko"].load();
					SOUND["taiko"].play();
					next();
				})
				.delay(300)
				.queue( function(next){
					SOUND["event"].load();
					SOUND["event"].play();
					next();
				})
				// 5秒待つ
				.delay(5000)
				.queue( function(next){
					SOUND["se"+productID].load();
					SOUND["se"+productID].play();
					next();
				})
				.delay(3500)
				// ここでアニメーションフラグを解除するといい感じ
				.queue( function(next){ aFlag = 0; next(); } )
				// 消失アニメーション
				.transition({
					y :			-y,
					x :			-x,
					rotate :	-365
				}, 700, 'ease')
			;
			$("#character1").transition({opacity:1.0}, 800).delay(16000).transition({opacity:0}, 700);
			$("#baloon div").text(count);
			$("#baloon").delay(600).transition({opacity:1.0, rotate:-15}, 200).delay(16000).transition({opacity:0}, 700).transition({rotate:0},0);
			$("#stamp").delay(1000).transition({opacity:1.0, rotate:-355}, 700).delay(7300).transition({rotate:365}, 700).delay(7300).transition({opacity:0}, 700).transition({rotate:0},0);
		});
	}
}

// ウィンドウサイズ取得
function getSize( dom )
{
	var w = $(dom).width();
	var h = $(dom).height();
	return { w: w, h: h };
}

//以下デバッグ・テスト用の関数

function enterFullscreen()
{
	var x = document.getElementById("body");
	if (x.webkitRequestFullScreen) {
		x.webkitRequestFullScreen();
	}
	else if (x.mozRequestFullScreen) {
		x.mozRequestFullScreen();
	}
	else {
		x.requestFullScreen();
	}
}

function printToolbar()
{
	// ツールバーの出現
	$(window).mousemove(function(e){
		var ws = getSize("body");
		if ( e.pageY >= ws.h - 80 ) {
			$("div#toolbar").slideDown();
		}
		else {
			$("div#toolbar").slideUp();
		}
	});
	$("#toolbar button").click(function(){
		$.get("./c.cgi?"+$(this).text());
	});
}

