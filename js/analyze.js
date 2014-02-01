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
// 商品のクラス
var Product = function(num, name) {
	var booth = ("0" + num).slice(-2); // ひどい
	this.image    = "./img/products/"+booth+".png";
	this.soundurl = "./se/"+booth+".ogg";
	this.sound = new Audio(this.soundurl);
	this.sound.load();
};
var products = {};

$(function() {
	getCountData();
	getProductList();

	{
		$("#reset").click(function(){
			if ( confirm("本当にリセットしますか？") ) {
				$.ajax({
					dataType: "text",
					url: "./c.cgi?r"
				})
				.success(function(data){
					$("#reset").text("リセットしました").attr("disabled", "disabled");
				});
			}
		});
	}
});

function getProductList()
{
	$.ajax({

		dataType: "json",
		url: "./data/products.json",
		cache: false,

		success: function(data) {
			$.each( data.products, function(i, product) {
				products[i+1] = new Product( product.image, product.sound );
			});
		}
	});
}

function getCountData()
{
	$.ajax({
		
		dataType: "json",
		url: "./data/count.json",
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
	//$("#total").text(count.total);
	printTotalCount($("#total"), 0, count.total);
	$.each(count.stat, function(booth, val) {
		var rate = Math.round(val/count.total*10000)/100;
		indiv.push({ "booth": booth, "val": val, "rate": rate });
	});
	
	indiv.sort(function(a, b) {
		return ( a.val < b.val ? 1 : -1);
	});

	$.each(indiv, function(i, data) {
		var width = data.rate/indiv[0].rate*100;
		$("#totalbar tr").append('<td style="width:'+data.rate+'%;background-color:'+color[(i%color.length)]+'" id="total_'+(i+1)+'"></td>');
		$("#totalbar").animate({"width": "100%"}, 1000);
		$("#indiv").append(
			'<tr class="indivs">'+
				"<td>"+(i+1)+"</td>"+
				"<td>"+data.booth+"</td>"+
				"<td>"+data.val+"</td>"+
				"<td>"+data.rate+"%</td>"+
				"<td><div id=\"rate_"+i+"\"style=\"width:0;background-color:"+color[(i%color.length)]+";height:20px;\"></div></td>"+
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
