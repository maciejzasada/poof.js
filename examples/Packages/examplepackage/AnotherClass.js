Package('examplepackage',
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
			},

			doSomethingElse : function()
			{
				write(this + ': Doing something else');
			}
		}
	})
]);