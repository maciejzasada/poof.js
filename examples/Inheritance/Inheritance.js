Package('',
[
	Import('BaseClass'),

	Class('public Inheritance extends BaseClass',
	{
		_public:
		{
			Inheritance : function()
			{
				this._super();
				write('Inheritance: constructor');
				this.doSomething();
				this.doSomethingElse();
			},

			doSomething : function()
			{
				this._super();
				write('Inheritance: Doing something');
			},

			doSomethingElse : function()
			{
				write('Inheritance: Doing something else');
			}
		}
	})
]);