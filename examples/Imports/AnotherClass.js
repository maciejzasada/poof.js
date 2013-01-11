Package('',
[
	Class('public AnotherClass',
	{
		_public:
		{
			AnotherClass : function()
			{
				write(this + ': constructor');
			},

			doSomething : function()
			{
				write(this + ': Doing something');
			}
		}
	})
]);