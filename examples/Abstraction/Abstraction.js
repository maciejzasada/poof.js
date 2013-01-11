Package('',
[
	Import('NormalClass'),
	Import('SuperClass'),
	Import('AbstractClass'),

	Class('public Abstraction',
	{
		_public:
		{
			Abstraction : function()
			{
				write('Abstraction: constructor');
				write('In this example, AbstractClass instantiation will fail as abstract classes can only be extended.');
				write('An appropriate error message is also logged in the console.');
				
				var instance1 = new NormalClass();		// fine, instantiate a normal class
				var instance2 = new SuperClass();		// fine, abstract classes can be extended
				var thisWillFail = new AbstractClass();	// fail, attempt to instantiate an abstract class
			}
		}
	})
]);