Package('',
[
	Class('public Logging',
	{
		_public:
		{
			Logging : function()
			{
				write(this);	// easily identify a class instance
				this.log('Now you know where this comes from!');	// when code is concatenated and minified, you can still know where the logs come from!
			}
		}
	})
]);