(function(window){

	function handleAllowedProps(params, container, context){
		if (params.allowed || typeof params.allowed == "string") {
			if (Array.isArray(params.allowed)) {
				params.allowed.forEach(function(item){
					if (typeof item == "string") {
						if (item.length > 0) {
							container.push(item);
						} else {
							throw Error("Invalid argument. Items in the allowed array cannot be empty strings");
						}
					} else {
						throw Error("Invalid argument. Items in the allowed array must be of type String");
						return;
					}
				});
				resolveAllowed(context, container);
			} else {
				throw  Error('Invalid argument. The allowed property must be of type Array or null');
				return;
			}
		}
	}

	function resolveAllowed(context, container){
		/*if (context.getOwnAllowedProps) {
			context.getOwnAllowedProps().forEach(function(item){
				container.push(item);
			});
		}*/
		if (context.allowed) {
			context.allowed.forEach(function(item){
				container.push(item);
			});
		}
	}

	function getAllowed(context,container){
		if (context.getOwnAllowedProps) {
			resolveAllowed(context, container);	
		}
		return container;
	}

	function create(){

	}

	function extend(params){
		let allowed_props = [];
		let parent = this;
		if (params) {
			if (typeof params != "object" || Array.isArray(params)) {
				throw Error('Invalid argument. Constructor properies must be of type Object');
				return;
			}
			if (params.name) {
				if (typeof params.name != "string") {
					throw Error('Invalid argument count. Constructor must include a name');
					return;	
				}
			} else { 
				throw Error('Invalid argument count. Constructor must include a name');
				return;
			}
			handleAllowedProps(params, allowed_props, parent);
		}else{
			if (params == "") {
				throw Error('Invalid argument. Constructor properies must be of type Object');
				return;
			}
		}
		let _instance = Object.create(parent,{
			constructor : {value : new Function("return function "+params.name+"(){}")()},
			getOwnAllowedProps : {value : function(){
				return allowed_props;
			}},
			getAllAllowedProps : {value : function(){
				return parent;
			}}
		});
		return _instance;
	}
	window.app = (function(){
		let app = Object.create({ constructor : function App(){} }, {
			extend : {value : extend}
		})
		return app;
	})();
})(window)

let person = app.extend({
	name : "Person",
	allowed : ['name', 'age']
});

let employee = person.extend({
	name : "Employee",
	allowed : ['salary']
});

console.log(employee);