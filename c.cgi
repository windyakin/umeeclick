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
use CGI::Carp qw(fatalsToBrowser); #debug
use lib './lib';
use JSON;
use File::Copy 'copy';

# CGIの実行結果を終了コードとする
exit(main());

sub main
{
	if ( $ARGV[0] eq "r" ) {
		resetCounter();
		return 0;
	}
	elsif ( $ARGV[0] !~ /^\d+$/ ) {
		print 'c.cgi - (c)2012 windyakin.'."\n";
		print 'ブース番号をつけてアクセスすることで，カウントを集計します。'."\n";
		print "\n";
		print 'Syntax: /c.cgi?[ BoothNum ]'."\n";
		print 'BoothNum'."\t".'事前に定められたブース番号です'."\n";
		print 'Return: [RoundNumFlag(0 or *)][EOF]'."\n";
		print "\n";
		print '[補足]'."\n";
		print '現在のカウント値は ./count.json に保存されています。'."\n";
		print 'カウントのリセットは /c.cgi?r できます。';
		return 0;
	}
	
	my $total  = 0;
	my $booth  = sprintf("%d", $ARGV[0]); # 数値として認識させる
	my $data   = JSON->new->allow_nonref;
	my $result = "0";
	
	# できる限りアクセスが集中しても大丈夫なようにしたい設計 …なんてなかった！
	if ( open( CNT, "+< ./data/count.json" ) )
	{
		flock( CNT, 2 ); # 読み込みロック
		$_ = <CNT>; # ファイルの1行目を取得(というか1行目にしか書かれてないし…)
		
		# 既存データを読み込む
		$data  = decode_json($_);
		# トータルカウント値を加算
		$total = ++$data->{'total'};
		
		# キリ番の時にはキリ番専用のObjectに情報を書き込む
		if ( judgeKiriban($total) ) {
			$data->{'kiriban'}->{'count'}  = $total;
			$data->{'kiriban'}->{'booth'}  = $booth+0;
			$data->{'kiriban'}->{'time'}   = time;
			$result = "*";
		}
		else {
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
		}

		# ブースごとのカウント値を加算
		$data->{'stat'}->{$booth}++;
		
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
	if ( open ( KIRI, '<', './data/kiriban.txt') ) {
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

#------------------------------------------------------------------------------------------------------------
#
#	カウンターリセット
#	-------------------------------------------
#	@param	なし
#	@return	なし
#
#------------------------------------------------------------------------------------------------------------
sub resetCounter
{
	# 初期化用
	my $JSON = {
		"history" => undef,
		"kiriban" => {
			"count"  => 0,
			"time"   => 0,
			"booth"  => 0
		},
		"total"   => 0,
		"stat"    => undef,
	};
	# バックアップを作成
	{
		# ディレクトリを作成
		if ( !-d "./data/bak" ) { mkdir "./data/bak"; }
		# 同じ名前のファイルが生まれると意味が無いので
		my $i = 0;
		my $name = time."_".$i.".json";
		while ( !-e "./data/bak/".$name ) {
			copy "./data/count.json", "./data/bak/".$name;
			$i++;
		}
	}
	# ファイルに書き込む
	if ( open( CNT, "> ./data/count.json" ) ) {
		seek( CNT, 0, 0 ); # 先頭
		print CNT encode_json($JSON);
		truncate( CNT, tell(CNT) ); # 削る(知らなかった…)
		close( CNT ); # クローズと同時にロック解除するはず
	}
	# 結果を出力
	{
		print "Content-type: text/plain\n\n";
		print "reseted\n";
	}
	return;
}