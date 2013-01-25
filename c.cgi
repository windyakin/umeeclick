#!/usr/bin/perl

use strict;
use warnings;
use CGI::Carp qw(fatalsToBrowser); #debug
use lib './lib';
use JSON;

print "Content-type: text/plain\n\n";

my $count  = 0;
my $booth  = sprintf("%02d", $ARGV[0]);
my $data   = JSON->new->allow_nonref;
my $result = 0;

# debug start
if ( $ARGV[0] !~ /^\d+$/ ) {
	if ( $ARGV[0] eq "v" ) {
		open( CNT, "< ./count.json" ) || die 'Cannot read count.txt';
		print while (<CNT>);
		close( CNT );
	}
	elsif ( $ARGV[0] =~ /^s(\d+)$/ ) {
		open( CNT, "+< ./count.json" ) || die 'Cannot wittern count.txt';
		flock( CNT, 1 ); # 読み込みロック
		$_ = <CNT>;
		flock( CNT, 8 ); # ロック解除
		
		$data  = decode_json($_);
		$data->{count} = $1+0;
		flock( CNT, 2 ); # 書き込みロック
		
		seek( CNT, 0, 0 );
		print CNT encode_json($data);
		truncate( CNT, tell(CNT) );
		print $data->{count};
		close( CNT );    # クローズと同時にロック解除するはず
	}
	elsif ( $ARGV[0] eq "r" ) {
	}
	else {
		print 'c.cgi - (c)2012 windyakin.'."\n";
		print 'アクセス毎にカウントし，キリ番かどうかを返します。'."\n";
		print "\n";
		print 'Syntax: /c.cgi?[ BoothNum ]'."\n";
		print 'BoothNum'."\t".'事前に定められたブース番号です'."\n";
		print 'Return: [RoundNumFlag(0 or 1)][EOF]'."\n";
		print "\n";
		print '[補足]'."\n";
		print '現在のカウント値は /c.cgi?v で見ることができます。'."\n";
		print 'カウント値のセットは /c.cgi?s[ SetNum ] で設定できます。';
	}
	exit;
}
# debug end

# できる限りアクセスが集中しても大丈夫なようにしたい設計 …なんてなかった！
if ( open( CNT, "+< ./count.json" ) )
{
	flock( CNT, 1 ); # 読み込みロック
	$_ = <CNT>;
	flock( CNT, 8 ); # ロック解除
	
	$data  = decode_json($_);
	$count = ++$data->{count};
	$data->{booth} = $booth;
	$data->{stati}->{$booth}++;
	
	# キリ番の時に情報を書き込む
	if ( ( $count / 100 <= 18 && $count % 100 == 0 ) ) {
		$data->{kiriban}->{count} = $count;
		$data->{kiriban}->{booth} = $booth;
		$result = 1;
	}
	
	flock( CNT, 2 ); # 書き込みロック
	
	seek( CNT, 0, 0 );
	print CNT encode_json($data);
	truncate( CNT, tell(CNT) );
	
	close( CNT );    # クローズと同時にロック解除するはず
}

{
	print $result;
}

exit;
