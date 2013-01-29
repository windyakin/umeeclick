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
	this.imageurl = imageurl;
	this.soundurl = soundurl;
	this.image = $("");
	this.sound = new Audio(this.soundurl);
	this.sound.load();
//	this.duration = 3000;//this.sound.duration;
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
var eventsound = new Audio("se/event.ogg");
eventsound.load();

// jQuery的処理はここから
$(function () {
	
	// 画像を#productに追加
	$.each(products, function(id, p) {
		var imgtag = $("<img>").attr("src", p.imageurl);
		var divtag = $("<div>").append(imgtag);
		this.image = divtag.appendTo("#product");
	});
	
	// 読み込んだ画像のリサイズ・再配置
	keepRatio(); // ratio.js
	
});

// アニメーションフラグ
aFlag = 0;
// 現在のカウント値
total = -1;

function getCountLoop()
{
	$.ajax({
		
		dataType: "json",
		url: "./count.json",
		cache: false, //キャッシュさせない
		
		success: function (data) {
			
		},
		
		complete: function () {
			
		}
		
	});
}

function getSize( dom )
{
	var w = $(dom).width();
	var h = $(dom).height();
	return { w: w, h: h };
}

})();
