Package('',
[
	Class('public BaseClass',
	{
		_public:
		{
			BaseClass : function()
			{
				write(this + ': constructor');
			},

			doSomething : function()
			{
				write(this + ': Doing something');
			},

			doSomethingElse : function()
			{
				write(this + ': Doing something else');
			}
		}
	})
]);