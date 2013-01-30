(function() {

// テロップ用クラス
var Telop = function(id, str) {
	this.str   = str;
	this.id    = "t"+id;
};

var telop = {};

$(function () {
	$.get("./telop.txt", function(data) {
		$.each(data.split(/\r?\n/), function(i, val) {
			if ( val == "" ) return;
			telop[i] = new Telop(i, val);
		});
	});
	debug();
	setTimeout(debug, 500);
});

function debug() {
	console.log(telop[1]);
	printTelopLoop(1);
}

function printTelopLoop(number) {
	console.log("call printTelopLoop("+number+")");
	// テロップが存在しなければ何も実行しない
	if (!telop[number]) return;
}

})();
