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
var products = {};

$(function() {

	getProductList()
		.then(getCountData)
		.then(printAnalysisResult);

	{
		$("#reset").click(function(){
			if ( confirm("本当にリセットしますか？") ) {
				$.ajax({
					dataType: "text",
					url: "./c.cgi?r"
				})
				.done(function(data){
					$("#reset").text("リセットしました").attr("disabled", "disabled");
				});
			}
		});
	}
});

function getProductList()
{
	var d = new $.Deferred;
	$.ajax({
		dataType: "text",
		url: "./data/products.txt",
		cache: false,
	})
	.done(function(data) {
		products = data.split(/\r?\n/);
		products.unshift(null);
	})
	.done(function(){
		d.resolve();
	});
	return d.promise();
}

function getCountData()
{
	var d = new $.Deferred;
	$.ajax({
		dataType: "json",
		url: "./data/count.json",
		cache: false, //キャッシュさせない
	})
	.done(function(data) {
		count = data;
	})
	.done(function(){
		d.resolve();
	});
	return d.promise();
}

function printAnalysisResult()
{
	//$("#total").text(count.total);
	printTotalCount($("#total"), 0, count.total);
	
	$.each(count.stat, function(booth, val) {
		var rate = Math.round(val/count.total*10000)/100;
		indiv.push({ "booth": booth, "val": val, "rate": rate, "name": products[booth] });
	});
	indiv.sort(function(a, b) {
		return ( a.val < b.val ? 1 : -1);
	});

	$.each(indiv, function(i, data) {
		var width = data.rate/indiv[0].rate*100;
		$("#totalbar tr").append('<td style="width:'+data.rate+'%;background-color:'+color[(i%color.length)]+'"></td>');
		$("#totalbar").animate({"width": "100%"}, 1000);
		$("#indiv").append(
			'<tr class="indivs">'+
				"<td>"+(i+1)+"</td>"+
				"<td>"+data.booth+"</td>"+
				"<td>"+data.name+"</td>"+
				"<td>"+data.val+"</td>"+
				"<td>"+data.rate+"%</td>"+
				"<td><div id=\"rate_"+i+"\" style=\"width:0;background-color:"+color[(i%color.length)]+";height:20px;\"></div></td>"+
			"</tr>"
		);
		$("#rate_"+i).delay(50*i).animate({"width":width+"%"}, 500, "easeOutBounce");
	});
}

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

})();
