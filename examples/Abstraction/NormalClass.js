Package('',
[
	Class('public NormalClass',
	{
		_public:
		{
			NormalClass : function()
			{
				write(this + '(NormalClass): constructor');
			}
		}
	})
]);