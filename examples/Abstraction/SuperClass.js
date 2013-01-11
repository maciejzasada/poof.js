Package('',
[
	Import('AbstractClass'),

	Class('public SuperClass extends AbstractClass',
	{
		_public:
		{
			SuperClass : function()
			{
				this._super();
				write(this + '(SuperClass): constructor');
			}
		}
	})
]);