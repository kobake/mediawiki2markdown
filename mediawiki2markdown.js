// Mediawiki書式をMarkdown書式に変換する
function mediawiki2markdown(val) {
	// 改行コード統一
	val = val.replace(/\r\n/g, '\n');
	val = val.replace(/\r/g, '\n');

	// 先頭改行追加
	val = "\n" + val;

	// 目次
	val = val.replace(/^======(.*)======/mg, '###### $1 ######');
	val = val.replace(/^=====(.*)=====/mg, '##### $1 #####');
	val = val.replace(/^====(.*)====/mg, '#### $1 ####');
	val = val.replace(/^===(.*)===/mg, '### $1 ###');
	val = val.replace(/^==(.*)==/mg, '## $1 ##');
	val = val.replace(/^=(.*)=/mg, '# $1 #');

	// 箇条書き
	val = val.replace(/^\* ?/mg, '- ');

	// コードブロック
	val = val.replace(/^ /mg, "\t");

	// コードブロックの開始（空行が無ければ空行を挿入）
	val = val.replace(/\n([^\t\n]+)\n\t/g, "\n$1\n\n\t");

	// コードブロックの開始（無条件にコメントHTMLを挿入）（箇条書きの後のコードブロック認識用）
	val = val.replace(/\n\n\t/g, "\n\n<!-- CODE -->\n\n\t");

	// リンク
	val = val.replace(/\[\[(.*)\|(.*)\]\]/mg, '[$2]($1)');

	// 先頭改行除去
	val = val.replace(/^\n/, '');

	// 結果
	return val;
}

// node で実行された場合
// 標準入力からMediaWikiのWikiTextを受け取り、
// 標準出力にMarkdownを出力する
if (typeof window === 'undefined') { // windowがundefinedならnodeからの実行とみなす
	process.stdin.setEncoding('utf8');
	var input_text = '';

	process.stdin.on('readable', function() {
		var chunk = process.stdin.read();
		if (chunk !== null) {
			input_text += chunk;
		}
	});

	process.stdin.on('end', function() {
		// 一気に変換する
		var output_text = mediawiki2markdown(input_text);
		// 出力
		process.stdout.write(output_text);
	});
}
