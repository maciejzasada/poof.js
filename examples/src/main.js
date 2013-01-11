$(document).ready(function()
{
	var $example;
	var $html;
	var $js;
	var $error;
	var $iframe;
	var jsLoaded = false;
	var htmlLoaded = false;

	function run()
	{
		$example = $('section#example');
		$html = $('#example .source.html');
		$js = $('#example .source.js');
		$error = $('#example .source.html, #example .source.js');
		$iframe = $('iframe');
		$iframe.bind('load', onIframeLoad);

		loadExample();
	}

	function loadExample()
	{
		var exampleName = getExampleName();
		$iframe.attr('src', '');
		if(exampleName)
		{
			jsLoaded = false;
			htmlLoaded = false;
			$.get(exampleName + '/index.html').success(onExampleHtmlLoaded).error(onExampleLoadError);
			$.get(exampleName + '/' + exampleName + '.js').success(onExampleJsLoaded).error(onExampleJsLoadError);
			$example.show();
		} else
		{
			$example.hide();
		}
	}

	function getExampleName()
	{
		return window.location.hash.length > 1 ? window.location.hash.substring(1) : null;
	}

	function onExampleHtmlLoaded(data)
	{
		$html.html('<pre class="brush: js;"></pre>');
		$html.find('pre').text(data);
		htmlLoaded = true;
		onLoadComplete();
	}

	function onExampleJsLoaded(data)
	{
		$js.html('<pre class="brush: js;"></pre>');
		$js.find('pre').text(data);
		jsLoaded = true;
		onLoadComplete();
	}

	function onExampleLoadError(data)
	{
		console.log('error');
		$html.find('pre').text('Please run the examples on an HTTP server to enable live code preview or check the code manually.');
		onLoadComplete();
		runExample();
	}

	function onExampleJsLoadError(data)
	{
		if(data.status === 200)
		{
			onExampleJsLoaded(data.responseText);
		}
	}

	function onLoadComplete()
	{
		if(htmlLoaded && jsLoaded)
		{
			SyntaxHighlighter.highlight({}, $html.find('pre')[0]);
			SyntaxHighlighter.highlight({}, $js.find('pre')[0]);
			runExample();
		}
	}

	function runExample()
	{
		$iframe.attr('src', getExampleName() + '/index.html');
	}

	function onIframeLoad()
	{
	}

	$(window).hashchange(loadExample);
	run();
});