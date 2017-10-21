(function(window){
	'use strict';
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
				"classExist" : "Constructor Ilegal. Una clase con ese nombre ya se encuentra registrada",
				"allowedType" : "Argumento Invalido. La propiedad allowed debe ser del tipo Array.",
				"allowedItemsType" : "Argumento Invalido. Items en el array allowed deben ser del tipo String.",
				"emptyItem" : "Argumento Invalido. Items en el array allowed no pueden ser strings vacios",
				"methodType" : "Argumento Invalido. Los metodos del constructor deben ser del tipo Object",
				"methodChild" : "Argumento Invalido, Los metodos deben ser del tipo Function"
			},
			en : {
				"constructor" : "Illegal use of Constructor function. The App object can only be used as an interface through its methods",
				"lang" : "Illegal Argument. Language must be of type String and have a maximum of 2 characters.",
				"name" : "Invalid argument count. At least a 'name' property must be set.",
				"typeObject" : "Invalid argument. Constructor properies must be of type Object.",
				"nameType" : "Invalid argument. The name must be of type String.",
				"classExist" : "Illegal Constructor. A class with this name is already registered.",
				"allowedType" : "Invalid argument. The allowed prop must be of type Array",
				"allowedItemsType" : "Invalid argument. Items in the allowed array must be of type String",
				"emptyItem" : "Invalid argument. Items in the allowed array cannot be empty strings",
				"methodType" : "Invalid argument. Constructor methods be of type Object",
				"methodChild" : "Invalid argument. All methods must be of type function"
			}
		}
		//Control the singleton with a private local variable 
		let instance;
		//Control each app extension and their respective allowed properties
		let allowed = {};
		//Control each app extension so they can't repeat
		let _registeredClasses = [];

		function randRange(min,max){
			return Math.floor(Math.random()*(max-min+1))+min
		}

		function setLang(lan){
			if (typeof lan == "string" && lan.length == 2) {
				lang = lan;
			} else {
				throw(new Error(translations[lang].lang))
			}
		}

		function create(params){
			let _instance = Object.create(this);
			if (params) {
				if (typeof params != "object" || Array.isArray(params)) {
					throw Error(translations[lang].typeObject);
					return;
				}
				let allowed_props = this.getAllAllowedProps();
				let received_props = Object.keys(params);
				received_props.forEach(function(i){
					if (allowed_props.indexOf(i)==-1) {
						throw Error("Invalid argument. Illegal key for class constructor");
						return;
					}
					if (allowed_props.indexOf(i)>-1) {
						Object.defineProperty(_instance, i , {
							writable : false,
							configurable : false,
							enumerable : true,
							value : params[i]
						});
					}
				});
			} 
			return Object.preventExtensions(_instance);
		}

		function extend(params){
			let self = this;
			//Check that there is at least some params
			if (params) {
				//Check if at least its type is object
				if (typeof params == "object") {
					//Check that it's not an array
					if (!Array.isArray(params)) {
						//Check that the params have a mandatory name prop
						if (params.name) {
							//Check that the name's value is a string
							if (typeof params.name == 'string') {
								//Check that it's not yet been registered
								if (_registeredClasses.indexOf(params.name) < 0) {
									//Register it to the class array
									_registeredClasses.push(params.name.toLowerCase());
									allowed[params.name.toLowerCase()] = [];
									
								} else {
									throw(new Error(translations[lang].classExist));
									return;
								}
							} else {
								throw(new Error(translations[lang].nameType));
								return;
							}
						} else {
							throw(new Error(translations[lang].name));
							return;
						}
						//Check if the params have an allowed prop
						if (params.allowed) {
							//Check if it's an array
							if (Array.isArray(params.allowed)) {
								//Iterate over each element of the array
								params.allowed.forEach(function(item){
									//Check that each item is a string
									if (typeof item == "string") {
										//Check that they're not an empty string
										if (item.length > 0) {
											//Push it to the allowed object
											allowed[params.name.toLowerCase()].push(item);
										} else {
											throw(new Error(translations[lang].emptyItem));
										}
									} else {
										throw(new Error(translations[lang].allowedItemsType));
										return;
									}
								});
							} else {
								throw(new Error(translations[lang].allowedType));
								return;
							}
						}
						//Handmade class name
						let _constructorName = (function(name){
							return name.charAt(0).toUpperCase() + name.slice(1);
						})(params.name);
						//Create the instance after all errors could have occured
						let _instance = Object.create(self, {
							constructor : {value : new Function("return function "+_constructorName+"(){}")()}
						});
						if (params.methods) {
							if (typeof params.methods != "object" || Array.isArray(params.methods)) {
								throw Error(translations[lang].methodType);
								return;	
							}
							for(let method in params.methods){
								if (typeof params.methods[method] != "function") {
									throw(new Error(translations[lang].methodChild));
									return;
								}
								Object.defineProperty(_instance, method , {
									writable : false,
									configurable : false,
									enumerable : false,
									value : params.methods[method]
								})
							}
						}
						return Object.preventExtensions(_instance);
					} else {
						throw(new Error(translations[lang].typeObject));
						return;
					}
				} else {
					throw(new Error(translations[lang].typeObject));
					return;
				}
			} else {
				throw(new Error(translations[lang].name));
				return;
			}
		}

		function getOwnAllowedProps(){
			let props = allowed[this.constructor.name.toLowerCase()];
			if (props.length > 0) {
				return props;
			} else {
				return [];
			}
		}

		function getAllAllowedProps(){
			let buffer = [];
			for(let child in allowed){
				if (allowed[child].length > 0) {
					allowed[child].forEach( function(prop) {
						buffer.push(prop);
					});
				}
			}
			return buffer;
		}

		if (!instance) {
			instance = Object.create({ constructor : function App(){
				//Disallow the hability to try to execute the constructor Function
				throw(new Error(translations[lang].constructor));
				}}, {
				id : {value : randRange(100000, 9999999)},
				extend : {value : extend},
				create : {value : create},
				setLang : {value : setLang},
				getAllAllowedProps : {value : getAllAllowedProps},
				getOwnAllowedProps : {value : getOwnAllowedProps}
			});
		}
		return instance;
	})();

})(window)

