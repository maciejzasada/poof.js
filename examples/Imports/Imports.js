Package('',
[
	Import('AnotherClass'),

	Class('public Imports',
	{
		_public:
		{
			Imports : function()
			{
				write('Imports example');
				
				var instance1 = new AnotherClass();
				instance1.doSomething();
			}
		}
	})
]);