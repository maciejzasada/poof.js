Package('',
[
	Class('public singleton SingletonClass',
	{
		_public:
		{
			SingletonClass : function()
			{
				write(this + ': constructor');
			}
		}
	})
]);