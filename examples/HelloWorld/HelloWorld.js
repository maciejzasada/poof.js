Package('',
[
	Class('public HelloWorld',
	{
		_public:
		{
			HelloWorld : function()
			{
				write('Hello World!');
			}
		}
	})
]);