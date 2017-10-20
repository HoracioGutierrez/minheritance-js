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
		let lang = "en";

		let translations = {
			es : {
				"constructor" : "Uso ilegal de la funcion Constructora. El objeto App solo puede ser usado como la interfaz a traves de sus metodos.",
				"lang" : "Argumento Ilegal. El tipo de idioma debe ser String y tener como maximo 2 caracteres.",
				"name" : "Cantidad invalida de argumentos. Por lo menos una propiedad 'name' debe ser creada.",
				"typeObject" : "Argumento invalido. Parametos del constructor deben ser del tipo Object",
				"nameType" : "Argumento Invalido. El nombre debe ser del tipo String.",
				"classExist" : "Constructor Ilegal. Una clase con ese nombre ya se encuentra registrada"
			},
			en : {
				"constructor" : "Illegal use of Constructor function. The App object can only be used as an interface through its methods",
				"lang" : "Illegal Argument. Language must be of type String and have a maximum of 2 characters.",
				"name" : "Invalid argument count. At least a 'name' property must be set.",
				"typeObject" : "Invalid argument. Constructor properies must be of type Object.",
				"nameType" : "Invalid argument. The name must be of type String.",
				"classExist" : "Illegal Constructor. A class with this name is already registered."
			}
		}
		//Control the singleton with a private local variable 
		let instance;
		//Control each app extension and their respective allowed properties
		let allowed;
		//Control each app extension so they can't repeat
		let _registeredClasses = [];

		function randRange(min,max){
			return Math.floor(Math.random()*(max-min+1))+min
		}

		function setLang(lan){
			if (typeof lan == "string" && lan.length == 2) {
				lang = lan;
			} else {
				throw Error(translations[lang].lang)
			}
		}

		function create(){

		}

		function extend(params){
			if (params) {
				if (typeof params == "object") {
					if (!Array.isArray(params)) {
						if (params.name) {
							if (typeof params.name == 'string') {
								if (_registeredClasses.indexOf(params.name) < 0) {
									_registeredClasses.push(params.name.toLowerCase());
								} else {
									throw Error(translations[lang].classExist);
									return;
								}
							} else {
								throw Error(translations[lang].nameType);
								return;
							}
						} else {
							throw Error(translations[lang].name);
							return;
						}
					} else {
						throw Error(translations[lang].typeObject);
						return;
					}
				} else {
					throw Error(translations[lang].typeObject);
					return;
				}
			} else {
				throw Error(translations[lang].name);
				return;
			}
		}

		if (!instance) {
			instance = Object.create({ constructor : function App(){
				//Disallow the hability to try to execute the constructor Function
				throw Error(translations[lang].constructor);
				}}, {
				id : {value : randRange(100000, 9999999)},
				extend : {value : extend},
				create : {value : create},
				setLang : {value : setLang}
			});
		}
		return instance;
	})();

})(window)

