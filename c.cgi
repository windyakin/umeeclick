#!/usr/bin/perl
#====================================================================================================
#
#	カウント集計用CGI
#	c.cgi - (c)2013 Takuto KANZAKI
#	The MIT License. (http://opensource.org/licenses/mit-license.php)
#
#	ブース番号をつけてアクセスすることで，カウントを集計します。
#
#	使用例 : /c.cgi?[BoothNum]
#
#====================================================================================================

use strict;
use warnings;
#use CGI::Carp qw(fatalsToBrowser); #debug
use lib './lib';
use JSON;

# CGIの実行結果を終了コードとする
exit(main());

sub main
{
	# debug start
	if ( $ARGV[0] !~ /^\d+$/ ) {
		print 'c.cgi - (c)2012 windyakin.'."\n";
		print 'ブース番号をつけてアクセスすることで，カウントを集計します。'."\n";
		print "\n";
		print 'Syntax: /c.cgi?[ BoothNum ]'."\n";
		print 'BoothNum'."\t".'事前に定められたブース番号です'."\n";
		print 'Return: [RoundNumFlag(0 or *)][EOF]'."\n";
		print "\n";
		print '[補足]'."\n";
		print '現在のカウント値は ./count.json に保存されています。'."\n";
		print 'カウントのリセットは /c.cgi?r できるようにします(予定)。';
		exit;
	}
	# debug end
	
	my $total  = 0;
	my $booth  = $ARGV[0];
	my $data   = JSON->new->allow_nonref;
	my $result = "0";
	
	# できる限りアクセスが集中しても大丈夫なようにしたい設計 …なんてなかった！
	if ( open( CNT, "+< ./count.json" ) )
	{
		flock( CNT, 2 ); # 読み込みロック
		$_ = <CNT>; # ファイルの1行目を取得(というか1行目にしか書かれてないし…)
		
		# 既存データを読み込む
		$data  = decode_json($_);
		# トータルカウント値を加算
		$total = ++$data->{'total'};
		# 押されたボタンの情報とか
		my %count = (
			"count" => $total+0,
			"booth" => $booth+0
		);
		# 押された履歴に追加する
		push(@{$data->{'history'}}, \%count);
		# ついでに10個を超える履歴は削除
		if ($#{$data->{'history'}} >= 10 ) {
			shift(@{$data->{'history'}});
		}

		# ブースごとのカウント値を加算
		$data->{'stati'}->{$booth}++;
		
		# キリ番の時に情報を書き込む
		if ( judgeKiriban($total) ) {
			$data->{'kiriban'}->{'count'}  = $total;
			$data->{'kiriban'}->{'booth'}  = $booth+0;
			$data->{'kiriban'}->{'time'}   = time;
			$result = "*";
		}
		
		seek( CNT, 0, 0 ); # 先頭
		print CNT encode_json($data); # データの書き出し
		truncate( CNT, tell(CNT) ); # 削る(知らなかった…)
		
		close( CNT ); # クローズと同時にロック解除するはず
	}
	
	# 結果を出力
	{
		print "Content-type: text/plain\n\n";
		print $result;
	}
	
	return $result;
}

#------------------------------------------------------------------------------------------------------------
#
#	キリ番判定関数
#	-------------------------------------------
#	@param	$count		カウント値
#	@return	キリ番であれば1,キリ番でなければ0
#
#------------------------------------------------------------------------------------------------------------
sub judgeKiriban
{
	my $count = shift;
	
	# ファイルを開く
	if ( open ( KIRI, '<', './kiriban.txt') ) {
		# キリ番を読み込む
		while ( <KIRI> ) {
			chomp;
			if ( $count eq $_ ) {
				return 1; # キリ番であれば1を返す
			}
		}
	}
	
	return 0;
}
