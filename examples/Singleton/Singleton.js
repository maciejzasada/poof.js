Package('',
[
	Import('SingletonClass'),

	Class('public Singleton',
	{
		_public:
		{
			Singleton : function()
			{
				write('Singleton example');
				
				var instance1 = SingletonClass.getInstance();
				var instance1b = SingletonClass.getInstance();
				write(instance1);	// these two instances are the same
				write(instance1b);	// these two instances are the same

				var thisWillFail = new SingletonClass();	// singleton classes cannot be instantiated directly
			}
		}
	})
]);