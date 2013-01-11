Package('',
[
	Import('examplepackage.AnotherClass'),

	Class('public Packages',
	{
		_public:
		{
			Packages : function()
			{
				write('Packages example');
				
				var instance1 = new AnotherClass();	// reference class by simple name
				var instance2 = new Package.examplepackage.AnotherClass();	// reference class by qualified name

				instance1.doSomething();
				instance2.doSomethingElse();
			}
		}
	})
]);