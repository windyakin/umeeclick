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
	
	console.log("printTelopLoop("+i+")");
	
	var obj   = $("#telop");
	
	// テキストの入れ替え
	obj.text(telop[i]);
	
	// 幅の取得
	var width = obj.width();
	var sec   = Math.floor(width / 200)*1000;
	
	console.log("width:"+width+", sec:"+(sec/1000));
	
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
			obj.transition({x: -$("aspect").width()}, 0, 'linear');
			next();
		});
		
	setTimeout( function() {
		printTelopLoop( ++loop % (telop.length - 1) );
	}, 500+500+sec+300);
}

})();
