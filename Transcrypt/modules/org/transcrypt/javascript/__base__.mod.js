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
