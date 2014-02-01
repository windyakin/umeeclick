/*
 *
 *	テロップスクロールアニメーション用JavaScript
 *	telop.js - (c)2013 Takuto KANZAKI
 *	The MIT License. (http://opensource.org/licenses/mit-license.php)
 *
 */
(function() {

// テロップ文字列用配列
var telop = new Array();
// テロップ表示用回数
var loop = 0;

$(function () {
	// テロップ文章の取得
	$.ajax({
		dataType: 'text',
		url: "./data/telop.txt",
		success: function(data) {
			$.each(data.split(/\r?\n/), function(i, str) {
				if ( str == "" ) return;
				telop.push(str);
			});
		},
		complete: function() {
			printTelopLoop(0);
		}
	});
});

//========================================================================================
//
//	テロップアニメーション関数
//
// -----------------------------------------------------------------------------
//	param	i		テロップ表示回数
//	return	なし
//========================================================================================
function printTelopLoop(i)
{
	// テロップが存在しなければ何も実行しない
	if (!telop[i]) printTelopLoop(0);
	
	var obj   = $("#telop");
	
	telop[i] = convertTelopStr(telop[i]);
	
	// テキストの入れ替え
	obj.html(telop[i]);
	
	// 幅の取得
	var width = obj.width();
	var sec   = Math.floor(width / 200)*1000;
	
	$("#telop")
		// 文字を表示
		.queue( function(next) {
			obj.transition({opacity: 1}, 500);
			next();
		})
		.delay(500)
		// 文字を流す
		.queue( function(next) {
			obj.transition({x: -width}, sec, 'linear');
			next();
		})
		// 文字を消す
		.queue( function(next) {
			obj.transition({opacity: 0}, 100);
			next();
		})
		.delay(100)
		// もとに戻す
		.queue( function(next) {
			obj.transition({x: -$("aspect").width()}, 0, 'linear')
			// スパゲッティなりかけだが致し方ない…
			.queue( function(next) {
				setTimeout( function() {
					printTelopLoop( ++loop % (telop.length - 1) );
				}, 100);
				next()
			});
			next();
		});
	
}

//========================================================================================
//
//	文字列変換 - convertTelopStr
//
// -----------------------------------------------------------------------------
//	param	str		変換する文字列
//	return	str		変換済み文字列
//========================================================================================
function convertTelopStr(str)
{
	// 括弧を半角に
	str = str.replace(/(?:（|\()([^\(]*)(?:\)|）)/gi, "($1)");
	// カギ括弧を半角に
	str = str.replace(/(?:｢|「)([^」]*)(?:｣|」)/gi, "｢$1｣");
	// 緑色の変換
	str = str.replace(/\+([^\+]*)\+/gi, "<span id=\"green\">$1</span>");
	// 赤色の変換
	str = str.replace(/\*([^\*]*)\*/gi, "<span id=\"red\">$1</span>");
	
	return str;
}

})();
