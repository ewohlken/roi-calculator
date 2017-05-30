/**
 * checks if input is an array
 * @param  foo
 * @return {Boolean}
 */
function isArray(foo=[]) {
	return (foo.constructor === Array);
}

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

/**
 * Houses our conversion functions
 * @type {Object}
 */
const util = {
	KMHtoMPH: function(kmh){
		return kmh/1.60934;
	},
	CtoF: function(C){
		return (C*9/5) + 32;
	},
	MtoFT: function(ft){
		return ft/0.3048;
	}
}

function _resolver(from, to) {
	var funcName = from.toUpperCase() + 'to' + to.toUpperCase();
	if(util.hasOwnProperty(funcName) && typeof util[funcName] === 'function') {
		return util[funcName];
	}else{
		return false;
	}
}

function convert(value, from, to) {
	var func = _resolver(from, to);
	if(func) {
		return func(value);
	}
}

export default function(value=[], from, to){

	if(isObject(value)) {
		for(key in value) {
			if(value[key].hasOwnPropterty('unit')) {
				value[key] = convert(value[key]['value'], value[key]['unit'][from], value[key]['unit'][to])
			}
		}
	}else{
		value = convert(parseInt(value), from, to);
	}

	return value;

}
