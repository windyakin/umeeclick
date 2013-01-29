/*!
 *
 *	カウント表示アニメーション用JS
 *	count.js - (c)2012 windyakin ( http://windyakin.net/ )
 *
 *	結局作りなおしてます…。
 *
 *	Special Thanks iroiro123!
 *
 */
(function() {

// 商品のクラス
var Product = function(imageurl, soundurl) {
	this.image    = imageurl;
	this.soundurl = soundurl;
	this.sound = new Audio(this.soundurl);
	this.sound.load();
};

// 商品ごとの画像と音声の設定
var products = {};
products["01"] = new Product("./img/product/1.png", "./se/01.ogg");		// 泡々酒ストライプ
products["02"] = new Product("./img/product/2.png", "./se/02.ogg");		// おかやま米野菜
products["03"] = new Product("./img/product/3.png", "./se/03.ogg");		// 津山ビール
products["04"] = new Product("./img/product/4.png", "./se/04.ogg");		// SOYPORK
products["05"] = new Product("./img/product/5.png", "./se/05.ogg");		// 醍醐桜ジャージー牛乳
products["06"] = new Product("./img/product/6.png", "./se/06.ogg");		// 踊る！たこ焼き器
products["07"] = new Product("./img/product/7.png", "./se/07.ogg");		// 姫とうがらし藁綯い
products["08"] = new Product("./img/product/8.png", "./se/08.ogg");		// 黒々炒り豆
products["09"] = new Product("./img/product/9.png", "./se/09.ogg");		// FOODACTION美作
products["10"] = new Product("./img/product/10.png", "./se/10.ogg");	// 真庭ブランド
products["11"] = new Product("./img/product/11.png", "./se/11.ogg");	// 蒜山ジャージーヨーグルト
products["12"] = new Product("./img/product/12.png", "./se/12.ogg");	// 紅酢
products["13"] = new Product("./img/product/13.png", "./se/13.ogg");	// マグロの鉄太郎
products["14"] = new Product("./img/product/14.png", "./se/14.ogg");	// 蒟蒻名人 ゆばこん
products["15"] = new Product("./img/product/15.png", "./se/15.ogg");	// 倉敷ソーセージ
products["16"] = new Product("./img/product/16.png", "./se/16.ogg");	// どらせん作州黒餡
products["17"] = new Product("./img/product/17.png", "./se/17.ogg");	// 雄町米おかき

// キリ番音声
var eventsound = new Audio("./se/event.ogg");
eventsound.load();

// jQuery的処理はここから
$(function () {
	
	{
		$("#character").transition({opacity:0}, 0);
		$("#baloon").transition({opacity:0}, 0);
		$("#stamp").transition({opacity:0}, 0);
	}
	
	// 読み込んだ画像のリサイズ・再配置
	keepRatio(); // ratio.js
	
	getCountLoop();
	printToolbar();
	
});

// アニメーションフラグ
var aFlag = 0;
// 現在のカウントデータ
var now = {
	total: -1,		// カウント合計値
	booth: 0,		// ブース番号
	
	kiriban: {		// 最終キリ番の設定データ
		count: 0,	// キリ番の値
		booth: 0,	// ブース番号
		time : 0,	// キリ番イベントが発生した時間
	},
};
// 最後にアニメーションを行ったブースの記憶用
var lastbooth = 0;

function getCountLoop()
{
	$.ajax({
		
		dataType: "json",
		url: "./count.json",
		cache: false, //キャッシュさせない
		
		success: function (data) {
			// 初回起動時はとにかく現在のカウント値を取得
			if ( now.total == -1 ) {
				now = data;
				$("#count").text(now.total);
			}
			// カウント値が増加
			if ( data.total > now.total ) {
				// アニメーション中でなければうめぇな～！
				if ( aFlag == 0 ) {
					// キリ番のアニメーション
					if ( now.kiriban.time < data.kiriban.time ) {
						animateKiriban( kiriban );
					}
					// 通常のアニメーション
					else if ( now.total < data.total ) {
						// 最後にアニメーションしたブースと一緒でなければ通常のアニメーション
						if ( lastbooth != data.booth ) {
							animateNormal( data.total, data.booth );
						}
						// 最後にアニメーションしたブースと一緒であればカウントアップのみ
						else {
							animateCountup( data.total );
						}
					}
				}
			}
			now = data;
		},
		// 通信が完了したら１秒後に自分自身を呼び出す
		complete: function () {
			setTimeout(getCountLoop, 1000);
		}
		
	});
}

function animateNormal( count, booth )
{
	// ブース番号が存在しなければ何も実行しない
	if (!products[booth]) return;
	
	// アニメーションフラグを立てる
	aFlag = 1;
	
	// 商品画像の置き換え
	$("#transobj img").attr("src", products[booth].image);
	// ○○人目の部分
	$("#baloon div").text(count);
	
	// 改めてサイズを取り直す
	keepRatio(); // ratio.js
	
	var image = $("#transobj");
	var draw  = getSize($("#aspect"));
	var img   = getSize(image);
	var sound = products[booth].sound;
	
	// 出現中心のポイントを設定
	var center = {
		y: img.w + draw.h/2 - img.h/2,
		x: draw.w/2 - img.w/2
	};
	
	// ここからアニメーション処理
	$("#aspect")
		// カウンター非表示
		.queue( function (next) {
			$("#countbox").transition({ opacity: 0 }, 500, 'ease');
			$("#telop").transition({ opacity: 0 }, 500, 'ease');
			next();
		})
		// 画像アニメーション
		.queue( function (next) {
			image.transition({ y: center.y, x: center.x, rotate: 365 }, 800, 'ease');
			next();
		})
		.delay(500)
		// キャラ出現アニメーション
		.queue( function (next) {
			$("#baloon").transition({ opacity: 1.0, rotate: -15 }, 400);
			$("#character").transition({ opacity: 1.0 }, 800);
			next();
		})
		// 音を鳴らす
		.queue( function (next) {
			sound.load();
			sound.play();
			next();
		})
		.delay(4500)
		
		// 音を鳴らす
		.queue( function (next) {
			sound.load();
			sound.play();
			next();
		})
		.delay(3500)
		
		// 画像アニメーション
		.queue( function (next) {
			image.transition({ y: -center.y, x: -center.x, rotate: -365 }, 700, 'ease');
			next();
		})
		// キャラ消失アニメーション
		.queue( function (next) {
			$("#character").transition({ opacity: 0 }, 700);
			$("#baloon").transition({ opacity: 0 }, 700).transition({ rotate: 0 },0);
			next();
		})
		.delay(700)
		
		// カウンター表示
		.queue( function (next) {
			$("#count").text(now.total);
			$("#countbox").transition({ opacity: 1 }, 500, 'ease');
			$("#telop").transition({ opacity: 1 }, 500, 'ease');
			next();
		})
		.delay(500)
		
		// おわり
		.queue( function (next) {
			aFlag = 0;
			lastbooth = booth;
			next();
		});
	
}

function animateCountup( count )
{
	$("div#countbox")
		.queue( function (next) {
			$(this).transition( { opacity: 0 }, 500, 'ease');
			next();
		})
		.delay(500)
		.queue( function (next) {
			$("div#count").text(count);
			$(this).transition( { opacity: 1 }, 500, 'ease' );
			next();
		});
	
}

function animateKiriban( count, booth )
{
}

function getSize( dom )
{
	var w = dom.width();
	var h = dom.height();
	return { w: w, h: h };
}

function printToolbar()
{
	$.each(products, function (id, p) {
		$("<button>").text(id).appendTo("#toolbar");
	});
	
	// ツールバーの出現
	$(window).mousemove(function (e) {
		var wsh = document.documentElement.clientHeight;
		if ( e.pageY >= wsh - 80 ) {
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

})();
