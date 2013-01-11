Package('',
[
	Class('public abstract AbstractClass',
	{
		_public:
		{
			AbstractClass : function()
			{
				write(this + '(AbstractClass): constructor');
			}
		}
	})
]);