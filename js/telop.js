(function() {

// テロップ文字列用配列
var telop = new Array();
var loop = 0;

$(function () {
	$.ajax({
		dataType: 'text',
		url: "./telop.txt",
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

function printTelopLoop(i)
{
	// テロップが存在しなければ何も実行しない
	if (!telop[i]) printTelopLoop(0);
	
	var obj   = $("#telop");
	
	telop[i] = convertColortext(telop[i]);
	
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

function convertColortext(str)
{
	str = str.replace(/\*([^\*]*)\*/gi, "<span id=\"red\">$1</span>");
	str = str.replace(/\+([^\+]*)\+/gi, "<span id=\"green\">$1</span>");
	return str;
}

})();
