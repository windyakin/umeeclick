/*
 *
 *	解析結果表示用JavaScript
 *	analyze.js - (c)2013 Takuto KANZAKI
 *	The MIT License. (http://opensource.org/licenses/mit-license.php)
 *
 */
(function() {

var count = {};
var indiv = new Array();
var color = [ "#3498db", "#9b59b6", "#e67e22", "#e74c3c", "#95a5a6", "#1abc9c" ];

$(function() {
	getCountData();
});

function getCountData()
{
	$.ajax({
		
		dataType: "json",
		url: "./count.json",
		cache: false, //キャッシュさせない
		
		success: function(data) {
			count = data;
		},
		complete: function() {
			printAnalysisResult();
		}
	});
}

function printAnalysisResult()
{
	$("#result").append("<h2>合計うめぇ～な数</h2>\n"+"<p>"+count.total+"</p>");
	$.each(count.stat, function(booth, val) {
		var rate = Math.round(val/count.total*10000)/100;
		indiv.push({ "booth": booth, "val": val, "rate": rate });
	});
	
	indiv.sort(function(a, b) {
		return ( a.val < b.val ? 1 : -1);
	});
	
	$.each(indiv, function(i, data) {
		$("#all").append('<span style="display:inline-block;width:'+data.rate+'%;background:'+color[(i%color.length)]+';">&nbsp;</span>');
		$("#indiv").append("<tr><td>"+data.booth+"</td><td>"+data.val+"</td><td>"+data.rate+"%</td><td><div style=\"width:"+data.rate+"%;background-color:red;\">&nbsp;</div></td></tr>");
	});
}

})();
