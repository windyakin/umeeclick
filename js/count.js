/*
 *
 *	カウント表示アニメーション用JavaScript
 *	count.js - (c)2012 Takuto KANZAKI
 *	The MIT License. (http://opensource.org/licenses/mit-license.php)
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
products[1]  = new Product("./img/product/01.png", "./se/01.ogg");	// 泡々酒ストライプ
products[2]  = new Product("./img/product/02.png", "./se/02.ogg");	// おかやま米野菜
products[3]  = new Product("./img/product/03.png", "./se/03.ogg");	// 津山ビール
products[4]  = new Product("./img/product/04.png", "./se/04.ogg");	// SOYPORK
products[5]  = new Product("./img/product/05.png", "./se/05.ogg");	// 醍醐桜ジャージー牛乳
products[6]  = new Product("./img/product/06.png", "./se/06.ogg");	// 踊る！たこ焼き器
products[7]  = new Product("./img/product/07.png", "./se/07.ogg");	// 姫とうがらし藁綯い
products[8]  = new Product("./img/product/08.png", "./se/08.ogg");	// 黒々炒り豆
products[9]  = new Product("./img/product/09.png", "./se/09.ogg");	// FOODACTION美作
products[10] = new Product("./img/product/10.png", "./se/10.ogg");	// 真庭ブランド
products[11] = new Product("./img/product/11.png", "./se/11.ogg");	// 蒜山ジャージーヨーグルト
products[12] = new Product("./img/product/12.png", "./se/12.ogg");	// 紅酢
products[13] = new Product("./img/product/13.png", "./se/13.ogg");	// マグロの鉄太郎
products[14] = new Product("./img/product/14.png", "./se/14.ogg");	// 蒟蒻名人 ゆばこん
products[15] = new Product("./img/product/15.png", "./se/15.ogg");	// 倉敷ソーセージ
products[16] = new Product("./img/product/16.png", "./se/16.ogg");	// どらせん作州黒餡
products[17] = new Product("./img/product/17.png", "./se/17.ogg");	// 雄町米おかき

// キリ番音声
var eventsound = new Audio("./se/event.ogg");
eventsound.load();

// アニメーションフラグ
var aFlag = 0;
// 現在のカウントデータ
var now = {
	total: -1,		// カウント合計値
	history: [],	// 押された記録（過去10回）
	kiriban: {		// 最終キリ番の設定データ
		count: 0,	// キリ番の値
		booth: 0,	// ブース番号
		time : 0,	// キリ番イベントが発生した時間
	},
};
// アニメーション待機キュー
var animationQueue = new Array();

// jQuery的処理はここから
$(function () {
	
	{
	}
	
	// 読み込んだ画像のリサイズ・再配置
	keepRatio(); // ratio.js
	
	printNowloading();
	//getCountData();
	printToolbar();
	
});


//========================================================================================
//
//	カウント値観測関数 - getCountData
//
// -----------------------------------------------------------------------------
//	param	なし
//	return	なし
//========================================================================================
function getCountData()
{
	$.ajax({
		
		dataType: "json",
		url: "./count.json",
		cache: false, //キャッシュさせない
		
		success: function(data) {
			// 初回起動時はとにかく現在のカウント値を取得
			if ( now.total == -1 ) {
				now = data;
				printTotalCount($("#count"), 0, now.total);
				//$("#count").text(now.total);
			}
			// キリ番には反応が早い
			if ( now.kiriban.time < data.kiriban.time ) {
				$("#aspect").stop();
				animationQueue.unshift({"count": data.kiriban.count, "booth": data.kiriban.booth, "kiriban": true});
			}
			// 何かボタンが押されていればアニメーションキューに挿入
			$.each(data.history, function() {
				if ( now.total < this.count ) {
					animationQueue.push(this);
				}
			});
			// 取得してきたデータを現在のデータと置き換える
			now = data;
		}

	});
}

//========================================================================================
//
//	アニメーション待機チェック - checkAnimationQueue
//
// -----------------------------------------------------------------------------
//	param	なし
//	return	なし
//========================================================================================
function checkAnimationQueue() {
	// アニメーションしてなかったら
	if ( aFlag == 0 ) {
		// アニメーション待機キューがあれば
		if ( animationQueue.length != 0 ) {
			var a = animationQueue.shift();
			if (a.kiriban) {
				animateKiriban(a.count, a.booth);
			}
			else {
				animateNormal(a.count, a.booth);
			}
			console.dir(animationQueue);
		}
		// もしアニメーション待機しているものがなければ
		else {
			// jsonの様子を見に行く
			getCountData();
		}
	}
	// 1.5秒毎に自分自身を呼び出す
	setTimeout(checkAnimationQueue, 1500);
}

//========================================================================================
//
//	通常アニメーション - animateNormal
//
// -----------------------------------------------------------------------------
//	param	count		カウント値
//			booth		ブース番号
//	return	なし
//========================================================================================
function animateNormal(count, booth)
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
	// 出現中心のポイントを計算
	var center = getCenter();
	
	// サウンドのロード
	var sound = products[booth].sound;
	
	// ここからアニメーション処理(ひどい)
	$("#aspect")
		// カウンター非表示
		.queue( function() {
			$("#countbox").transition({opacity: 0}, 500, 'ease');
			$("#scrollbox").transition({opacity: 0}, 500, 'ease');
			$(this).dequeue();
		})
		// 画像アニメーション
		.queue( function() {
			$("#transobj").transition({y: center.y, x: center.x, rotate: 365}, 800, 'ease');
			$(this).dequeue();
		})
		.delay(500)
		// キャラ出現アニメーション
		.queue( function() {
			$("#baloon").transition({opacity: 1.0, rotate: -15}, 400);
			$("#character").transition({opacity: 1.0}, 800);
			$(this).dequeue();
		})
		// 音を鳴らす
		.queue( function() {
			sound.load();
			sound.play();
			$(this).dequeue();
		})
		.delay(4500)
		
		// 突然ですがここでjsonを取得します（次のアニメーションの準備）
		.queue( function() {
			getCountData();
			$(this).dequeue();
		})

		// 音を鳴らす
		.queue( function() {
			sound.load();
			sound.play();
			$(this).dequeue();
		})
		.delay(3500)
		
		// 画像アニメーション
		.queue( function() {
			$("#transobj").transition({y: -center.y, x: -center.x, rotate: -365}, 700, 'ease');
			$(this).dequeue();
		})
		// キャラ消失アニメーション
		.queue( function() {
			$("#character").transition({opacity: 0}, 700);
			$("#baloon").transition({opacity: 0}, 700).transition({rotate: 0},0);
			$(this).dequeue();
		})
		
		// カウンター表示
		.queue( function() {
			// もしアニメーションを待機している物があればカウンターを非表示のまま終了
			if ( animationQueue.length == 0 ) {
				// もしキリ番カウント等で先に大きい数字に更新されていた場合の対応
				if ( $("#count").text() <= count ) {
					$("#count").text(count);
				}
				$("#countbox").transition({opacity: 1}, 500, 'ease');
				$("#scrollbox").transition({opacity: 1}, 500, 'ease');
			}
			$(this).dequeue();
		})
		// おわり
		.queue( function() {
			// アニメーションフラグをへし折る
			aFlag = 0;
			$(this).dequeue();
		});
	
}

//========================================================================================
//
//	カウント値増加アニメーション - animateCountup
//
// -----------------------------------------------------------------------------
//	param	count		カウント値
//	return	なし
//========================================================================================
function animateCountup(count)
{
	$("div#count")
		.queue( function() {
			$(this).transition( {opacity: 0, scale: 1.2}, 500, 'ease');
			$(this).dequeue();
		})
		.delay(500)
		.queue( function() {
			$(this).text(count);
			$(this).transition( {opacity: 1, scale: 1.0}, 500, 'ease');
			$(this).dequeue();
		});
	
}

//========================================================================================
//
//	キリ番アニメーション - animateKiriban
//
// -----------------------------------------------------------------------------
//	param	count		カウント値
//			booth		ブース番号
//	return	なし
//========================================================================================
function animateKiriban(count, booth)
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
	// 出現中心のポイントを計算
	var center = getCenter();
	
	// サウンドのロード
	var sound = products[booth].sound;
	
	// ここからアニメーション処理
	$("#aspect")
		// カウンター非表示
		.queue( function() {
			$("#countbox").transition({opacity: 0}, 500, 'ease');
			$("#scrollbox").transition({opacity: 0}, 500, 'ease');
			$(this).dequeue();
		})
		// 画像アニメーション
		.queue( function() {
			$("#transobj").transition({y: center.y, x: center.x, rotate: 365}, 800, 'ease');
			$(this).dequeue();
		})
		.delay(500)
		// キャラ出現アニメーション
		.queue( function() {
			$("#baloon").transition({opacity: 1.0, rotate: -15}, 400);
			$("#character").transition({opacity: 1.0}, 800);
			$("#stamp").transition({rotate: 0}, 0).transition({opacity: 1.0, rotate: -355}, 700);
			$(this).dequeue();
		})
		// 音を鳴らす
		.queue( function() {
			eventsound.load();
			eventsound.play();
			$(this).dequeue();
		})
		.delay(4500)
		
		// 音を鳴らす
		.queue( function() {
			sound.load();
			sound.play();
			$(this).dequeue();
		})
		.delay(3500)
		
		// 回転させよう
		.queue( function() {
			$("#stamp").transition({rotate: 365}, 700);
			$(this).dequeue();
		})
		
		// 音を鳴らす
		.queue( function() {
			eventsound.load();
			eventsound.play();
			$(this).dequeue();
		})
		.delay(4500)
		
		// 音を鳴らす
		.queue( function() {
			sound.load();
			sound.play();
			$(this).dequeue();
		})
		.delay(3500)
		
		// 画像アニメーション
		.queue( function() {
			$("#transobj").transition({y: -center.y, x: -center.x, rotate: -365}, 700, 'ease');
			$(this).dequeue();
		})
		// キャラ消失アニメーション
		.queue( function() {
			$("#character").transition({opacity: 0}, 700);
			$("#baloon").transition({opacity: 0}, 700).transition({rotate: 0},0);
			$("#stamp").transition({opacity: 0}, 700);
			$(this).dequeue();
		})
		.delay(700)
		
		// カウンター表示
		.queue( function() {
			$("#count").text(count);
			$("#countbox").transition({opacity: 1}, 500, 'ease');
			$("#scrollbox").transition({opacity: 1}, 500, 'ease');
			$(this).dequeue();
		})
		.delay(500)
		
		// おわり
		.queue( function() {
			// アニメーションフラグをへし折る
			aFlag = 0;
			$(this).dequeue();
		});
	
}

//========================================================================================
//
//	スタート画面描画関連関数 - printNowloading
//
// -----------------------------------------------------------------------------
//	param	なし
//	return	なし
//========================================================================================
function printNowloading()
{

	// initialize
	{
		$("#character").transition({opacity: 0}, 0);
		$("#baloon").transition({opacity: 0}, 0);
		$("#stamp").transition({opacity: 0}, 0);
		$("#start").transition({opacity: 0}, 0);
	}

	$("#start").delay(500).transition({opacity: 1}, 500);
	
	$("#start").click( function() {
		$("#loading").hide();
		checkAnimationQueue();
		//enterFullscreen();
	});
	
	// フルスクリーン化用関数
	function enterFullscreen()
	{
		var x = document.getElementById("aspect");
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
}

//========================================================================================
//
//	アニメーション用中心位置計算関数 - getCenter
//
// -----------------------------------------------------------------------------
//	param	なし
//	return	中心位置までの距離
//========================================================================================
function getCenter()
{
	// サイズを取得するだけ
	var getSize = function(dom) {
		return {w: dom.width(), h: dom.height()};
	};
	
	// それぞれのサイズを取得
	var draw  = getSize($("#aspect"));
	var img   = getSize($("#transobj"));
	
	// 計算して返す
	return {
		y: img.w + draw.h/2 - img.h/2,
		x: draw.w/2 - img.w/2
	};
}

//========================================================================================
//
//	なんかずららら～って感じでカウント数を増やすやつ - printTotalCount
//
// -----------------------------------------------------------------------------
//	param	$this		カウント表示場所
//			now			現在の値
//			total		表示する値
//	return	なし
//========================================================================================
function printTotalCount( $this, now, total )
{
	now += Math.ceil(total/50);
	if (now > total) { now = total; }
	$this.text(now);
	if ( now < total ) {
		setTimeout(function(){printTotalCount($this, now, total)}, 10); 
	}
	return;
}

//========================================================================================
//
//	(debug)ツールバー表示関数 - printToolbar
//
// -----------------------------------------------------------------------------
//	param	なし
//	return	なし
//========================================================================================
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
