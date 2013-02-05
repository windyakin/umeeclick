/*
 *
 *	解析結果表示用JavaScript
 *	analyze.js - (c)2013 Takuto KANZAKI
 *	The MIT License. (http://opensource.org/licenses/mit-license.php)
 *
 */
(function() {

var count = {};
var indiv = {};

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
			analyzeCountData();
		}
	});
}

function analyzeCountData()
{
	$.each(count.stati, function(booth, val) {
		indiv[booth] = Math.round(val/count.total*100);
	});
	printAnalysisResult();
}

function printAnalysisResult()
{
	$("#result").append("<h2>合計うめぇ～な数</h2>\n"+"<p>"+count.total+"</p>");
	$.each(count.stati, function(booth, val) {
		var rate = Math.round(val/count.total*100);
		$("#indiv").append("<tr><td>"+booth+"</td><td>"+val+"</td><td>"+rate+"%</td><td><div style=\"width:"+rate+"%;background-color:red;\">&nbsp;</div></td></tr>");
	});
}

})();
