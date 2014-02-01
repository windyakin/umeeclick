#!/usr/bin/perl
#====================================================================================================
#
#	設定ファイル編集用CGI
#	edit.cgi - (c)2013 Takuto KANZAKI
#	The MIT License. (http://opensource.org/licenses/mit-license.php)
#
#====================================================================================================

use strict;
use warnings;
use CGI::Carp qw(fatalsToBrowser); #debug
use CGI;
use Encode;

exit(main());

sub main
{
	my $mode = {};
	my $query = CGI->new;
	
	print "Content-type: text/html; charset=UTF-8\n\n";
	
	if ( $ENV{'PATH_INFO'} eq "/kiriban" ) {
		$mode->{'en'} = "kiriban";
		$mode->{'ja'} = "キリ番";
	}
	elsif ( $ENV{'PATH_INFO'} eq "/telop" ) {
		$mode->{'en'} = "telop";
		$mode->{'ja'} = "テロップ";
	}
	elsif ( $ENV{'PATH_INFO'} eq "/products" ) {
		$mode->{'en'} = "products";
		$mode->{'ja'} = "製品名一覧";
	}
	else {
		return 0;
	}
	
	print '<!DOCTYPE html>'."\n";
	print '<html>'."\n";
	print '<head>'."\n";
	print ' <meta charset="UTF-8">'."\n";
	print ' <title>ファイル編集 - うめぇ～な！クリックシステム</title>'."\n";
	print ' <link rel="stylesheet" href="/css/index.css">'."\n";
	print '</head>'."\n";
	print '<body onload="sync_scroll(document.getElementById(\'te\'))">'."\n";
	if ( open(SETTING, "+<", "./data/".$mode->{'en'}.".txt") ) {
		binmode(SETTING);
		print "<h1>".$mode->{'ja'}."設定ファイル編集</h1>"."\n";
		print "<p>".$mode->{'ja'}."を編集します。</p>"."\n";
		if ( $query->param('text') ne "" ) {
			seek( SETTING, 0, 0 ); # 先頭
			print SETTING decode('UTF-8',$query->param('text'));
			truncate( SETTING, tell(SETTING) );
			print "<p>変更しました</p>";
		}
		print '<form method="POST" action="../edit.cgi/'.$mode->{'en'}.'">'."\n";
		print '<textarea style="width:80%;height:20em;background:#EEFFFF;font-family:monospace;" name="text">'."\n";
		seek( SETTING, 0, 0 ); # 先頭
		while(<SETTING>) { print $_; }
		print "</textarea><br>\n";
		print '<input type="submit" value="変更を保存">';
		print '</form>'."\n";
	}
	
	print '<p><a href="../index.html">戻る</a></p>'."\n";
	print "<hr>\n";
	print '<div id="copyright">edit.cgi - &copy; 2013 Takuto KANZAKI</div>'."\n";
	print '</body>'."\n";
	print '</html>'."\n";
}
