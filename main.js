'use strict';
/*
MyHeritance.js
Author : Horacio Gutierrez

The API exposes an interface inside the property app in the global object window. It uses a singleton pattern so if you try to extend from it more than once, it'll always end up using the same app identifier. The constructor function is also canceled so nobody can create a new app from scratch.
The interface exposes two shared methods accross all sub classes :

-Extend : Function(String name[,Array allowed_props, Object methods])
	The extend method requires only of a name so it can identify each class. This prevents creation of multiple classes with the same name accross the app. It can also take two optional parameters:
		*)allowed_props : An array with the name of the allowed property this sub class supports. If the instance tries to use a prop that's not been registered during class creation, it will throw an error.
		*)methods : An object containing all the class methods. These will be shared accross all instances of the same class.
-Create : Function([Any params])
	The create method requires no arguments to execute. It instanciates a new object from the given class and returns it. It can take a unique object as configuration which should contain the previously allowed properties for that instance. 

*/
(function(window){
	//Create a namespace in window called app which holds the interface of the singleton app object instance
	window.app = (function(){
		let instance;
		let allowed;

		function randRange(min,max){
			return Math.floor(Math.random()*(max-min+1))+min
		}

		function create(){

		}

		function extend(){

		}

		if (!instance) {
			instance = Object.create({ constructor : function App(){
			throw Error("Illegal use of Constructor function. The App object can only be used as an interface through its methods");
			} }, {
				id : {value : randRange(100000, 9999999)},
				extend : {value : extend},
				create : {value : create}
			});
		}
		return instance;
	})();

})(window)

