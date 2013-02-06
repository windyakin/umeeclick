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
	$.each(count.stati, function(booth, val) {
		var rate = Math.round(val/count.total*100);
		indiv.push({ "booth": booth, "val": val, "rate": rate });
	});
	
	indiv.sort(function(a, b) {
		return ( a.val < b.val ? 1 : -1);
	});
	
	$.each(indiv, function(i, data) {
		$("#indiv").append("<tr><td>"+data.booth+"</td><td>"+data.val+"</td><td>"+data.rate+"%</td><td><div style=\"width:"+data.rate+"%;background-color:red;\">&nbsp;</div></td></tr>");
	});
}

})();
