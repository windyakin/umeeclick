(function() {

// テロップ文字列用配列
var telop = new Array();

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

var loop = 0;

function printTelopLoop(i)
{
	// テロップが存在しなければ何も実行しない
	if (!telop[i]) printTelopLoop(0);
	
	var obj   = $("#telop");
	
	// テキストの入れ替え
	obj.text(telop[i]);
	
	// 幅の取得
	var width = obj.width();
	var sec   = Math.floor(width / 20)*100;
	
	$("#telop")
		// 文字を表示
		.queue( function(next) {
			obj.transition({opacity: 1}, 300);
			next();
		})
		// 文字を流す
		.queue( function(next) {
			obj.transition({x: -width}, sec, 'linear');
			next();
		})
		// 文字を消す
		.queue( function(next) {
			obj.transition({opacity: 0}, 300);
			next();
		})
		// もとに戻す
		.queue( function(next) {
			obj.transition({x: width}, 0);
			next();
		});
		
	setTimeout( function() {
		printTelopLoop( loop++ % (telop.length - 1) );
	}, sec+300*2);
}

})();
