"use strict";
// Transcrypt'ed from Python, 2016-01-12 19:51:11
function test () {
	var __all__ = {};
	var __world__ = __all__;
	
	// Nested object creator, part of the nesting may already exist and have attributes
	var __nest__ = function (headObject, tailNames, value) {
		// In some cases this will be a global object, e.g. 'window'
		var current = headObject;
		
		if (tailNames != '') {	// Split on empty string doesn't give empty list
			// Find the last already created object in tailNames
			var tailChain = tailNames.split ('.');
			var firstNewIndex = tailChain.length;
			for (var index = 0; index < tailChain.length; index++) {
				if (!current.hasOwnProperty (tailChain [index])) {
					firstNewIndex = index;
					break;
				}
				current = current [tailChain [index]];
			}
			
			// Create the rest of the objects, if any
			for (var index = firstNewIndex; index < tailChain.length; index++) {
				current [tailChain [index]] = {};
				current = current [tailChain [index]];
			}
		}
		
		// Insert it new attributes, it may have been created earlier and have other attributes
		for (var attrib in value) {
			current [attrib] = value [attrib];			
		}		
	};
	__all__.__nest__ = __nest__;
	
	// Initialize module if not yet done and return its globals
	var __init__ = function (module) {
		if (!module.__inited__) {
			module.__all__.__init__ (module.__all__);
		}
		return module.__all__;
	};
	__all__.__init__ = __init__;
	
	// Since we want to assign functions, a = b.f should make b.f produce a bound function
	// So __get__ should be called by a property rather then a function
	// Factory __get__ creates one of three curried functions for func
	// Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
	var __get__ = function (self, func) {
		if (self) {
			if (self.hasOwnProperty ('__class__')) {			// Object before the dot
				return function (args) {						// Return bound function
					var args = [] .slice.apply (arguments);
					func.apply (null, [self] .concat (args));
				}
			}
			else {												// Class before the dot
				return func;									// Return static method
			}
		}
		else {													// Nothing before the dot
			return func;										// Return free function
		}
	}
	__all__.__get__ = __get__;
			
	// Class creator function
	var __class__ = function (name, bases, extra) {
		// Create class functor
		var cls = function () {
			var args = [] .slice.apply (arguments);
			return cls.__new__ (args);
		};
		
		// Copy methods and static attributes to class object
		for (var index in bases) {
			var base = bases [index];
			for (attrib in base) {
				cls [attrib] = base [attrib];
			}
		}
		
		// Add class specific attributes to class object
		cls.__name__ = name;
		cls.__bases__ = bases;
		
		// Add own methods and static attributes to class object
		for (var attrib in extra) {
			var descrip = Object.getOwnPropertyDescriptor (extra, attrib);
			Object.defineProperty (cls, attrib, descrip);
		}
				
		// Return class object
		return cls;
	};
	__all__.__class__ = __class__;

	// Create mother of all classes		
	var object = __all__.__class__ ('object', [], {
		__init__: function (self) {},
			
		// Object creator function is inherited by all classes
		__new__: function (args) {	// Args are just the constructor args		
			// Create instance, by 'inheriting' from this (the class), never more than 1 deep
			// In this way methods will be available both with a class and an object before the dot
			// The descriptor produced by __get__ will return the right method flavor
			var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
			
			// Call constructor
			this.__init__.apply (null, [instance] .concat (args));
			
			// Return instance			
			return instance;
		}	
	});
	__all__.object = object;

	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __Envir__ = __class__ ('__Envir__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.transpilerName = 'transcrypt';
							self.transpilerVersion = '0.0.15';
						});}
					});
					var __envir__ = __Envir__ ();
					//<all>
					__all__.__Envir__ = __Envir__;
					__all__.__envir__ = __envir__;
					//</all>
				}
			}
		}
	);

	// Initialize __base__ and make its names available directly and via __all__
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
	var __envir__ = __all__.__envir__;
	
	// Complete __envir__ for non-stub mode
	__envir__.executorName = __envir__.transpilerName;

	// Console message
	var print = function () {
		console.log ([] .slice.apply (arguments) .join (' '));
	};
	__all__.print = print;
	
	// Make console.log understand apply
	console.log.apply = function () {
		print ([] .slice.apply (arguments) .slice (1));
	};

	// In function, used to mimic Python's in operator
	var __in__ = function (element, container) {
		return container.indexOf (element) > -1;
	}
	__all__.__in__ = __in__;
	
	// Len function for collections
	var len = function (collection) {
		if (collection.hasOwnProperty ('length')) {
			return collection.length;
		}
		else {
			return collection.size;
		}
	};
	__all__.len = len;
	
	// Repr function for anything that has a toString method in JavaScript
	
	var str = function (anObject) {
		return anObject.toString ();
	}
	__all__.str = str;
	
	var repr = function (anObject) {
		return anObject.toString ();
	}
	__all__.repr = repr;
	
	// Zip method for arrays
	var zip = function () {
		var args = [].slice.call (arguments);
		var shortest = args.length == 0 ? [] : args.reduce (	// Find shortest array in arguments
			function (array0, array1) {
				return array0.length < array1.length ? array0 : array1;
			}
		);
		return shortest.map (					// Map each element of shortest array
			function (current, index) {			// To the result of this function
				return args.map (				// Map each array in arguments
					function (current) {		// To the result of this function
						return current [index]; // Namely it's index't entry
					}
				);
			}
		);
	}
	__all__.zip = zip;
	
	// Range method, returning an array
	function range (start, stop, step) {
		if (typeof stop == 'undefined') {
			// one param defined
			stop = start;
			start = 0;
		}
		if (typeof step == 'undefined') {
			step = 1;
		}
		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}
		var result = [];
		for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}
		return result;
	};
	
	// Enumerate method, returning a zipped list
	
	function enumerate (aList) {
		return zip (range (len (aList)), aList);
	}
	
	// --- Set methods
	
	var set = function (iterable) {
		return new Set (iterable);
	};
	__all__.set = set;
	
	// --- List methods
	
	var list = function  () {
		return [] .slice.apply (arguments);
	}
	__all__.list = list;
	
	Array.prototype.append = function (element) {
		this.push (element);
	};

	Array.prototype.extend = function (aList) {
		this.push.apply (this, aList);
	};
	
	Array.prototype.clear = function (aList) {
		aList.splice (0, aList.length);
	};
	
	// --- String methods
	
	String.prototype.join = function (aList) {
		return aList.join (this);
	};
	
	String.prototype.jsSplit = String.prototype.split;
	
	String.prototype.split = function (sep, maxsplit) {
		if (!sep) {
			sep = ' ';
		}
		return this.jsSplit (sep || /s+/, maxsplit);
	};
	
	String.prototype.rsplit = function (sep, maxsplit) {
		var split = this.split (sep || /s+/);
		return maxsplit ? [ split.slice (0, -maxsplit) .join (sep) ].concat (split.slice (-maxsplit)) : split;
	};
	
	String.prototype.strip = function () {
		return this.replace (/^\s*|\s*$/g, '');
	};
		
	String.prototype.lstrip = function () {
		return this.replace (/^\s*/g, '');
	};
	
	String.prototype.rstrip = function () {
		return this.replace (/\s*$/g, '');
	};

	__nest__ (
		__all__,
		'testmod', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function () {
						console.log ('testmod.f called');
					};
					print ('Initializing testmod');
					//<all>
					__all__.f = f;
					//</all>
				}
			}
		}
	);
	__nest__ (
		__all__,
		'testmod2', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var testmod2 = {};
					__nest__ (testmod2, 'testmod21', __init__ (__world__.testmod2.testmod21));
					testmod2.testmod21.f ();
					var f = function () {
						print ('testmod2.f');
					};
					//<all>
					__all__.f = f;
					//</all>
				}
			}
		}
	);
	__nest__ (
		__all__,
		'testmod2.testmod21', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function () {
						print ('testmod21.f');
					};
					//<all>
					__all__.f = f;
					//</all>
				}
			}
		}
	);
	(function () {
		var testmod = {};
		var testmod2 = {};
		__nest__ (testmod, '', __init__ (__world__.testmod));
		__nest__ (testmod2, '', __init__ (__world__.testmod2));
		__nest__ (testmod2, 'testmod21', __init__ (__world__.testmod2.testmod21));
		console.log ('test');
		testmod.f ();
		testmod2.f ();
		testmod2.testmod21.f ();
		var A = __class__ ('A', [object], {
			get __init__ () {return __get__ (this, function (self, x) {
				self.x = x;
			});},
			get show () {return __get__ (this, function (self, label) {
				print ('A.show', label, self.x);
			});}
		});
		var B = __class__ ('B', [object], {
			get __init__ () {return __get__ (this, function (self, y) {
				alert ('In B constructor');
				self.y = y;
			});},
			get show () {return __get__ (this, function (self, label) {
				print ('B.show', label, self.y);
			});}
		});
		var C = __class__ ('C', [A, B], {
			get __init__ () {return __get__ (this, function (self, x, y) {
				alert ('In C constructor');
				A.__init__ (self, x);
				B.__init__ (self, y);
				self.show ('constructor');
			});},
			get show () {return __get__ (this, function (self, label) {
				B.show (self, label);
				print ('C.show', label, self.x, self.y);
			});},
			get test () {return __get__ (this, function (self, a, b, c) {
				print (a, b, c);
			});}
		});
		var a = A (1001);
		a.show ('america');
		var b = B (2002);
		b.show ('russia');
		var c = C (3003, 4004);
		c.show ('netherlands');
		c.test (1111, 2222, 3333);
		var show2 = c.show;
		show2 ('copy');
		var f = function (a, b) {
			print (a, b);
		};
		f (10, 20);
		print (1, 2, 3, 4);
		print (5, 6, 7, 8);
		console.log ('terminated');
		//<all>
		__all__.A = A;
		__all__.B = B;
		__all__.C = C;
		__all__.a = a;
		__all__.b = b;
		__all__.c = c;
		__all__.f = f;
		__all__.show2 = show2;
		//</all>
	}) ();
	return __all__;
}
window ['test'] = test;
