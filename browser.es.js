function getDefaultExportFromCjs$1 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var deepmerge$1 = /*@__PURE__*/getDefaultExportFromCjs$1(cjs);

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok$2 = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err$2 = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise$2 = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault$2 = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException$2 = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map$2 = function (f, r) {
    return r.ok === true ? ok$2(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2$2 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok$2(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError$2 = function (f, r) {
    return r.ok === true ? r : err$2(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen$2 = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign$2 = function() {
    __assign$2 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};

function __rest$2(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual$2(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual$2(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual$2(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray$2 = function (json) { return Array.isArray(json); };
var isJsonObject$2 = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray$2(json);
};
var typeString$2 = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot$2 = function (expected, got) {
    return "expected " + expected + ", got " + typeString$2(got);
};
var printPath$2 = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt$2 = function (newAt, _a) {
    var at = _a.at, rest = __rest$2(_a, ["at"]);
    return (__assign$2({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder$2 = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError$2(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise$2(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException$2(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map$2(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen$2(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok$2(json)
                : err$2({ message: expectedGot$2('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok$2(json)
                : err$2({ message: expectedGot$2('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok$2(json)
                : err$2({ message: expectedGot$2('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual$2(json, value)
                ? ok$2(value)
                : err$2({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject$2(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err$2({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err$2(prependAt$2("." + key, r.error));
                        }
                    }
                }
                return ok$2(obj);
            }
            else if (isJsonObject$2(json)) {
                return ok$2(json);
            }
            else {
                return err$2({ message: expectedGot$2('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray$2(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError$2(function (err$$1) { return prependAt$2("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2$2(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok$2([]));
            }
            else if (isJsonArray$2(json)) {
                return ok$2(json);
            }
            else {
                return err$2({ message: expectedGot$2('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray$2(json)) {
                if (json.length !== decoders.length) {
                    return err$2({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err$2(prependAt$2("[" + i + "]", nth.error));
                    }
                }
                return ok$2(result);
            }
            else {
                return err$2({ message: expectedGot$2("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$2(Object.assign, acc, decoder.decode(json)); }, ok$2({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok$2(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok$2(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject$2(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err$2(prependAt$2("." + key, r.error));
                        }
                    }
                }
                return ok$2(obj);
            }
            else {
                return err$2({ message: expectedGot$2('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok$2(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err$2({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok$2(withDefault$2(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err$2({
                        at: printPath$2(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject$2(jsonAtPath)) {
                    return err$2({
                        at: printPath$2(paths.slice(0, i + 1)),
                        message: expectedGot$2('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray$2(jsonAtPath)) {
                    return err$2({
                        at: printPath$2(paths.slice(0, i + 1)),
                        message: expectedGot$2('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError$2(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath$2(paths), message: 'path does not exist' }
                    : prependAt$2(printPath$2(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok$2(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err$2({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string$2 = Decoder$2.string;
/** See `Decoder.number` */
var number$2 = Decoder$2.number;
/** See `Decoder.boolean` */
var boolean$2 = Decoder$2.boolean;
/** See `Decoder.anyJson` */
var anyJson$2 = Decoder$2.anyJson;
/** See `Decoder.unknownJson` */
Decoder$2.unknownJson;
/** See `Decoder.constant` */
var constant$2 = Decoder$2.constant;
/** See `Decoder.object` */
var object$2 = Decoder$2.object;
/** See `Decoder.array` */
var array$2 = Decoder$2.array;
/** See `Decoder.tuple` */
Decoder$2.tuple;
/** See `Decoder.dict` */
Decoder$2.dict;
/** See `Decoder.optional` */
var optional$2 = Decoder$2.optional;
/** See `Decoder.oneOf` */
var oneOf$1 = Decoder$2.oneOf;
/** See `Decoder.union` */
var union$1 = Decoder$2.union;
/** See `Decoder.intersection` */
var intersection = Decoder$2.intersection;
/** See `Decoder.withDefault` */
Decoder$2.withDefault;
/** See `Decoder.valueAt` */
Decoder$2.valueAt;
/** See `Decoder.succeed` */
Decoder$2.succeed;
/** See `Decoder.fail` */
Decoder$2.fail;
/** See `Decoder.lazy` */
var lazy = Decoder$2.lazy;

const defaultConfig = {
    gateway: { webPlatform: {} },
    libraries: [],
    exposeAPI: true,
};
const defaultWidgetConfig = {
    awaitFactory: true,
    enable: false,
    timeout: 5 * 1000,
};
const defaultModalsConfig = {
    alerts: {
        enabled: false
    },
    dialogs: {
        enabled: false
    },
    awaitFactory: true,
    timeout: 5 * 1000,
};
const defaultIntentResolverConfig = {
    enable: false,
    timeout: 5 * 1000,
    awaitFactory: true,
};

const Glue42CoreMessageTypes = {
    platformUnload: { name: "platformUnload" },
    transportSwitchRequest: { name: "transportSwitchRequest" },
    transportSwitchResponse: { name: "transportSwitchResponse" },
    getCurrentTransport: { name: "getCurrentTransport" },
    getCurrentTransportResponse: { name: "getCurrentTransportResponse" },
    checkPreferredLogic: { name: "checkPreferredLogic" },
    checkPreferredConnection: { name: "checkPreferredConnection" },
    checkPreferredLogicResponse: { name: "checkPreferredLogicResponse" },
    checkPreferredConnectionResponse: { name: "checkPreferredConnectionResponse" }
};
const webPlatformTransportName = "web-platform";
const latestFDC3Type = "latest_fdc3_type";
const errorChannel = new MessageChannel();
const REQUEST_WIDGET_READY = "requestWidgetFactoryReady";
const REQUEST_MODALS_UI_FACTORY_READY = "requestModalsUIFactoryReady";
const MAX_SET_TIMEOUT_DELAY = 2147483647;
const REQUEST_INTENT_RESOLVER_UI_FACTORY_READY = "requestIntentResolverUIFactoryReady";

const extractErrorMsg = (error) => {
    if (typeof error === "string") {
        return error;
    }
    if (error?.message) {
        return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
    }
    return JSON.stringify(error);
};
const runDecoderWithIOError = (decoder, json) => {
    try {
        const result = decoder.runWithException(json);
        return result;
    }
    catch (error) {
        return ioError.raiseError(error, true);
    }
};
const getSupportedOperationsNames = (operations) => {
    return Object.keys(operations).filter((operation) => (operations)[operation].execute);
};
const handleOperationCheck = (supportedOperations, operationName) => {
    const isSupported = supportedOperations.some((operation) => operation.toLowerCase() === operationName.toLowerCase());
    return { isSupported };
};
const getSafeTimeoutDelay = (delay) => {
    return Math.min(delay, MAX_SET_TIMEOUT_DELAY);
};
const wrapPromise = () => {
    let wrapperResolve;
    let wrapperReject;
    const promise = new Promise((resolve, reject) => {
        wrapperResolve = resolve;
        wrapperReject = reject;
    });
    return { promise, resolve: wrapperResolve, reject: wrapperReject };
};

class IOError {
    raiseError(error, shouldThrowOriginalError) {
        const errorMessage = extractErrorMsg(error);
        errorChannel.port1.postMessage(errorMessage);
        if (shouldThrowOriginalError) {
            throw error;
        }
        throw new Error(errorMessage);
    }
}
const ioError = new IOError();

const connectBrowserAppProps = ["name", "title", "version", "customProperties", "icon", "caption", "type"];
const fdc3v2AppProps = ["appId", "name", "type", "details", "version", "title", "tooltip", "lang", "description", "categories", "icons", "screenshots", "contactEmail", "moreInfo", "publisher", "customConfig", "hostManifests", "interop", "localizedVersions"];

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok$1 = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err$1 = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise$1 = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault$1 = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException$1 = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map$1 = function (f, r) {
    return r.ok === true ? ok$1(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2$1 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok$1(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError$1 = function (f, r) {
    return r.ok === true ? r : err$1(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen$1 = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

function __rest$1(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual$1(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual$1(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual$1(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray$1 = function (json) { return Array.isArray(json); };
var isJsonObject$1 = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray$1(json);
};
var typeString$1 = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot$1 = function (expected, got) {
    return "expected " + expected + ", got " + typeString$1(got);
};
var printPath$1 = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt$1 = function (newAt, _a) {
    var at = _a.at, rest = __rest$1(_a, ["at"]);
    return (__assign$1({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder$1 = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError$1(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise$1(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException$1(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map$1(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen$1(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual$1(json, value)
                ? ok$1(value)
                : err$1({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err$1({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else if (isJsonObject$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError$1(function (err$$1) { return prependAt$1("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2$1(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok$1([]));
            }
            else if (isJsonArray$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json)) {
                if (json.length !== decoders.length) {
                    return err$1({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err$1(prependAt$1("[" + i + "]", nth.error));
                    }
                }
                return ok$1(result);
            }
            else {
                return err$1({ message: expectedGot$1("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$1(Object.assign, acc, decoder.decode(json)); }, ok$1({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok$1(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok$1(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok$1(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err$1({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok$1(withDefault$1(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError$1(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath$1(paths), message: 'path does not exist' }
                    : prependAt$1(printPath$1(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok$1(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err$1({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string$1 = Decoder$1.string;
/** See `Decoder.number` */
var number$1 = Decoder$1.number;
/** See `Decoder.boolean` */
var boolean$1 = Decoder$1.boolean;
/** See `Decoder.anyJson` */
var anyJson$1 = Decoder$1.anyJson;
/** See `Decoder.unknownJson` */
Decoder$1.unknownJson;
/** See `Decoder.constant` */
var constant$1 = Decoder$1.constant;
/** See `Decoder.object` */
var object$1 = Decoder$1.object;
/** See `Decoder.array` */
var array$1 = Decoder$1.array;
/** See `Decoder.tuple` */
Decoder$1.tuple;
/** See `Decoder.dict` */
var dict = Decoder$1.dict;
/** See `Decoder.optional` */
var optional$1 = Decoder$1.optional;
/** See `Decoder.oneOf` */
var oneOf = Decoder$1.oneOf;
/** See `Decoder.union` */
Decoder$1.union;
/** See `Decoder.intersection` */
Decoder$1.intersection;
/** See `Decoder.withDefault` */
Decoder$1.withDefault;
/** See `Decoder.valueAt` */
Decoder$1.valueAt;
/** See `Decoder.succeed` */
Decoder$1.succeed;
/** See `Decoder.fail` */
Decoder$1.fail;
/** See `Decoder.lazy` */
Decoder$1.lazy;

const nonEmptyStringDecoder$3 = string$1().where((s) => s.length > 0, "Expected a non-empty string");
const nonNegativeNumberDecoder$3 = number$1().where((num) => num >= 0, "Expected a non-negative number");

const intentDefinitionDecoder$1 = object$1({
    name: nonEmptyStringDecoder$3,
    displayName: optional$1(string$1()),
    contexts: optional$1(array$1(string$1())),
    customConfig: optional$1(object$1())
});
const v2TypeDecoder = oneOf(constant$1("web"), constant$1("native"), constant$1("citrix"), constant$1("onlineNative"), constant$1("other"));
const v2DetailsDecoder = object$1({
    url: nonEmptyStringDecoder$3
});
const v2IconDecoder = object$1({
    src: nonEmptyStringDecoder$3,
    size: optional$1(nonEmptyStringDecoder$3),
    type: optional$1(nonEmptyStringDecoder$3)
});
const v2ScreenshotDecoder = object$1({
    src: nonEmptyStringDecoder$3,
    size: optional$1(nonEmptyStringDecoder$3),
    type: optional$1(nonEmptyStringDecoder$3),
    label: optional$1(nonEmptyStringDecoder$3)
});
const v2ListensForIntentDecoder = object$1({
    contexts: array$1(nonEmptyStringDecoder$3),
    displayName: optional$1(nonEmptyStringDecoder$3),
    resultType: optional$1(nonEmptyStringDecoder$3),
    customConfig: optional$1(anyJson$1())
});
const v2IntentsDecoder = object$1({
    listensFor: optional$1(dict(v2ListensForIntentDecoder)),
    raises: optional$1(dict(array$1(nonEmptyStringDecoder$3)))
});
const v2UserChannelDecoder = object$1({
    broadcasts: optional$1(array$1(nonEmptyStringDecoder$3)),
    listensFor: optional$1(array$1(nonEmptyStringDecoder$3))
});
const v2AppChannelDecoder = object$1({
    name: nonEmptyStringDecoder$3,
    description: optional$1(nonEmptyStringDecoder$3),
    broadcasts: optional$1(array$1(nonEmptyStringDecoder$3)),
    listensFor: optional$1(array$1(nonEmptyStringDecoder$3))
});
const v2InteropDecoder = object$1({
    intents: optional$1(v2IntentsDecoder),
    userChannels: optional$1(v2UserChannelDecoder),
    appChannels: optional$1(array$1(v2AppChannelDecoder))
});
const glue42ApplicationDetailsDecoder = object$1({
    url: optional$1(nonEmptyStringDecoder$3),
    top: optional$1(number$1()),
    left: optional$1(number$1()),
    width: optional$1(nonNegativeNumberDecoder$3),
    height: optional$1(nonNegativeNumberDecoder$3)
});
const glue42HostManifestsBrowserDecoder = object$1({
    name: optional$1(nonEmptyStringDecoder$3),
    type: optional$1(nonEmptyStringDecoder$3.where((s) => s === "window", "Expected a value of window")),
    title: optional$1(nonEmptyStringDecoder$3),
    version: optional$1(nonEmptyStringDecoder$3),
    customProperties: optional$1(anyJson$1()),
    icon: optional$1(string$1()),
    caption: optional$1(string$1()),
    details: optional$1(glue42ApplicationDetailsDecoder),
    intents: optional$1(array$1(intentDefinitionDecoder$1)),
    hidden: optional$1(boolean$1())
});
const v1DefinitionDecoder = object$1({
    name: nonEmptyStringDecoder$3,
    appId: nonEmptyStringDecoder$3,
    title: optional$1(nonEmptyStringDecoder$3),
    version: optional$1(nonEmptyStringDecoder$3),
    manifest: nonEmptyStringDecoder$3,
    manifestType: nonEmptyStringDecoder$3,
    tooltip: optional$1(nonEmptyStringDecoder$3),
    description: optional$1(nonEmptyStringDecoder$3),
    contactEmail: optional$1(nonEmptyStringDecoder$3),
    supportEmail: optional$1(nonEmptyStringDecoder$3),
    publisher: optional$1(nonEmptyStringDecoder$3),
    images: optional$1(array$1(object$1({ url: optional$1(nonEmptyStringDecoder$3) }))),
    icons: optional$1(array$1(object$1({ icon: optional$1(nonEmptyStringDecoder$3) }))),
    customConfig: anyJson$1(),
    intents: optional$1(array$1(intentDefinitionDecoder$1))
});
const v2LocalizedDefinitionDecoder = object$1({
    appId: optional$1(nonEmptyStringDecoder$3),
    name: optional$1(nonEmptyStringDecoder$3),
    details: optional$1(v2DetailsDecoder),
    version: optional$1(nonEmptyStringDecoder$3),
    title: optional$1(nonEmptyStringDecoder$3),
    tooltip: optional$1(nonEmptyStringDecoder$3),
    lang: optional$1(nonEmptyStringDecoder$3),
    description: optional$1(nonEmptyStringDecoder$3),
    categories: optional$1(array$1(nonEmptyStringDecoder$3)),
    icons: optional$1(array$1(v2IconDecoder)),
    screenshots: optional$1(array$1(v2ScreenshotDecoder)),
    contactEmail: optional$1(nonEmptyStringDecoder$3),
    supportEmail: optional$1(nonEmptyStringDecoder$3),
    moreInfo: optional$1(nonEmptyStringDecoder$3),
    publisher: optional$1(nonEmptyStringDecoder$3),
    customConfig: optional$1(array$1(anyJson$1())),
    hostManifests: optional$1(anyJson$1()),
    interop: optional$1(v2InteropDecoder)
});
const v2DefinitionDecoder = object$1({
    appId: nonEmptyStringDecoder$3,
    name: optional$1(nonEmptyStringDecoder$3),
    type: v2TypeDecoder,
    details: v2DetailsDecoder,
    version: optional$1(nonEmptyStringDecoder$3),
    title: optional$1(nonEmptyStringDecoder$3),
    tooltip: optional$1(nonEmptyStringDecoder$3),
    lang: optional$1(nonEmptyStringDecoder$3),
    description: optional$1(nonEmptyStringDecoder$3),
    categories: optional$1(array$1(nonEmptyStringDecoder$3)),
    icons: optional$1(array$1(v2IconDecoder)),
    screenshots: optional$1(array$1(v2ScreenshotDecoder)),
    contactEmail: optional$1(nonEmptyStringDecoder$3),
    supportEmail: optional$1(nonEmptyStringDecoder$3),
    moreInfo: optional$1(nonEmptyStringDecoder$3),
    publisher: optional$1(nonEmptyStringDecoder$3),
    customConfig: optional$1(array$1(anyJson$1())),
    hostManifests: optional$1(anyJson$1()),
    interop: optional$1(v2InteropDecoder),
    localizedVersions: optional$1(dict(v2LocalizedDefinitionDecoder))
});
const allDefinitionsDecoder = oneOf(v1DefinitionDecoder, v2DefinitionDecoder);

const parseDecoderErrorToStringMessage = (error) => {
    return `${error.kind} at ${error.at}: ${JSON.stringify(error.input)}. Reason - ${error.message}`;
};

class FDC3Service {
    fdc3ToDesktopDefinitionType = {
        web: "window",
        native: "exe",
        citrix: "citrix",
        onlineNative: "clickonce",
        other: "window"
    };
    toApi() {
        return {
            isFdc3Definition: this.isFdc3Definition.bind(this),
            parseToBrowserBaseAppData: this.parseToBrowserBaseAppData.bind(this),
            parseToDesktopAppConfig: this.parseToDesktopAppConfig.bind(this)
        };
    }
    isFdc3Definition(definition) {
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            return { isFdc3: false, reason: parseDecoderErrorToStringMessage(decodeRes.error) };
        }
        if (definition.appId && definition.details) {
            return { isFdc3: true, version: "2.0" };
        }
        if (definition.manifest) {
            return { isFdc3: true, version: "1.2" };
        }
        return { isFdc3: false, reason: "The passed definition is not FDC3" };
    }
    parseToBrowserBaseAppData(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        const userProperties = this.getUserPropertiesFromDefinition(definition, version);
        const createOptions = { url: this.getUrl(definition, version) };
        const baseApplicationData = {
            name: definition.appId,
            type: "window",
            createOptions,
            userProperties: {
                ...userProperties,
                intents: version === "1.2"
                    ? userProperties.intents
                    : this.getIntentsFromV2AppDefinition(definition),
                details: createOptions
            },
            title: definition.title,
            version: definition.version,
            icon: this.getIconFromDefinition(definition, version),
            caption: definition.description,
            fdc3: version === "2.0" ? { ...definition, definitionVersion: "2.0" } : undefined,
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return baseApplicationData;
        }
        const ioDefinitionDecodeRes = glue42HostManifestsBrowserDecoder.run(ioConnectDefinition);
        if (!ioDefinitionDecodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(ioDefinitionDecodeRes.error)}`);
        }
        if (!Object.keys(ioDefinitionDecodeRes.result).length) {
            return baseApplicationData;
        }
        return this.mergeBaseAppDataWithGlueManifest(baseApplicationData, ioDefinitionDecodeRes.result);
    }
    parseToDesktopAppConfig(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        if (version === "1.2") {
            const fdc3v1Definition = definition;
            return {
                name: fdc3v1Definition.appId,
                type: "window",
                details: {
                    url: this.getUrl(definition, version)
                },
                version: fdc3v1Definition.version,
                title: fdc3v1Definition.title,
                tooltip: fdc3v1Definition.tooltip,
                caption: fdc3v1Definition.description,
                icon: fdc3v1Definition.icons?.[0].icon,
                intents: fdc3v1Definition.intents,
                customProperties: {
                    manifestType: fdc3v1Definition.manifestType,
                    images: fdc3v1Definition.images,
                    contactEmail: fdc3v1Definition.contactEmail,
                    supportEmail: fdc3v1Definition.supportEmail,
                    publisher: fdc3v1Definition.publisher,
                    icons: fdc3v1Definition.icons,
                    customConfig: fdc3v1Definition.customConfig
                }
            };
        }
        const fdc3v2Definition = definition;
        const desktopDefinition = {
            name: fdc3v2Definition.appId,
            type: this.fdc3ToDesktopDefinitionType[fdc3v2Definition.type],
            details: fdc3v2Definition.details,
            version: fdc3v2Definition.version,
            title: fdc3v2Definition.title,
            tooltip: fdc3v2Definition.tooltip,
            caption: fdc3v2Definition.description,
            icon: this.getIconFromDefinition(fdc3v2Definition, "2.0"),
            intents: this.getIntentsFromV2AppDefinition(fdc3v2Definition),
            fdc3: { ...fdc3v2Definition, definitionVersion: "2.0" }
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return desktopDefinition;
        }
        if (typeof ioConnectDefinition !== "object" || Array.isArray(ioConnectDefinition)) {
            throw new Error(`Invalid '${definition.hostManifests.ioConnect ? "hostManifests.ioConnect" : "hostManifests['Glue42']"}' key`);
        }
        return this.mergeDesktopConfigWithGlueManifest(desktopDefinition, ioConnectDefinition);
    }
    getUserPropertiesFromDefinition(definition, version) {
        if (version === "1.2") {
            return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key)));
        }
        return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key) && !fdc3v2AppProps.includes(key)));
    }
    getUrl(definition, version) {
        let url;
        if (version === "1.2") {
            const parsedManifest = JSON.parse(definition.manifest);
            url = parsedManifest.details?.url || parsedManifest.url;
        }
        else {
            url = definition.details?.url;
        }
        if (!url || typeof url !== "string") {
            throw new Error(`Invalid FDC3 ${version} definition. Provide valid 'url' under '${version === "1.2" ? "manifest" : "details"}' key`);
        }
        return url;
    }
    getIntentsFromV2AppDefinition(definition) {
        const fdc3Intents = definition.interop?.intents?.listensFor;
        if (!fdc3Intents) {
            return;
        }
        const intents = Object.entries(fdc3Intents).map((fdc3Intent) => {
            const [intentName, intentData] = fdc3Intent;
            return {
                name: intentName,
                ...intentData
            };
        });
        return intents;
    }
    getIconFromDefinition(definition, version) {
        if (version === "1.2") {
            return definition.icons?.find((iconDef) => iconDef.icon)?.icon || undefined;
        }
        return definition.icons?.find((iconDef) => iconDef.src)?.src || undefined;
    }
    mergeBaseAppDataWithGlueManifest(baseAppData, hostManifestDefinition) {
        let baseApplicationDefinition = baseAppData;
        if (hostManifestDefinition.customProperties) {
            baseApplicationDefinition.userProperties = { ...baseAppData.userProperties, ...hostManifestDefinition.customProperties };
        }
        if (hostManifestDefinition.details) {
            const details = { ...baseAppData.createOptions, ...hostManifestDefinition.details };
            baseApplicationDefinition.createOptions = details;
            baseApplicationDefinition.userProperties.details = details;
        }
        if (Array.isArray(hostManifestDefinition.intents)) {
            baseApplicationDefinition.userProperties.intents = (baseApplicationDefinition.userProperties.intents || []).concat(hostManifestDefinition.intents);
        }
        baseApplicationDefinition = { ...baseApplicationDefinition, ...hostManifestDefinition };
        delete baseApplicationDefinition.details;
        delete baseApplicationDefinition.intents;
        return baseApplicationDefinition;
    }
    mergeDesktopConfigWithGlueManifest(config, desktopDefinition) {
        const appConfig = Object.assign({}, config, desktopDefinition, { details: { ...config.details, ...desktopDefinition.details } });
        if (Array.isArray(desktopDefinition.intents)) {
            appConfig.intents = (config.intents || []).concat(desktopDefinition.intents);
        }
        return appConfig;
    }
}

const decoders$1 = {
    common: {
        nonEmptyStringDecoder: nonEmptyStringDecoder$3,
        nonNegativeNumberDecoder: nonNegativeNumberDecoder$3
    },
    fdc3: {
        allDefinitionsDecoder,
        v1DefinitionDecoder,
        v2DefinitionDecoder
    }
};

var INTENTS_ERRORS;
(function (INTENTS_ERRORS) {
    INTENTS_ERRORS["USER_CANCELLED"] = "User Closed Intents Resolver UI without choosing a handler";
    INTENTS_ERRORS["CALLER_NOT_DEFINED"] = "Caller Id is not defined";
    INTENTS_ERRORS["TIMEOUT_HIT"] = "Timeout hit";
    INTENTS_ERRORS["INTENT_NOT_FOUND"] = "Cannot find Intent";
    INTENTS_ERRORS["HANDLER_NOT_FOUND"] = "Cannot find Intent Handler";
    INTENTS_ERRORS["TARGET_INSTANCE_UNAVAILABLE"] = "Cannot start Target Instance";
    INTENTS_ERRORS["INTENT_DELIVERY_FAILED"] = "Target Instance did not add a listener";
    INTENTS_ERRORS["RESOLVER_UNAVAILABLE"] = "Intents Resolver UI unavailable";
    INTENTS_ERRORS["RESOLVER_TIMEOUT"] = "User did not choose a handler";
    INTENTS_ERRORS["INVALID_RESOLVER_RESPONSE"] = "Intents Resolver UI returned invalid response";
    INTENTS_ERRORS["INTENT_HANDLER_REJECTION"] = "Intent Handler function processing the raised intent threw an error or rejected the promise it returned";
})(INTENTS_ERRORS || (INTENTS_ERRORS = {}));

let IoC$1 = class IoC {
    _fdc3;
    _decoders = decoders$1;
    _errors = {
        intents: INTENTS_ERRORS
    };
    get fdc3() {
        if (!this._fdc3) {
            this._fdc3 = new FDC3Service().toApi();
        }
        return this._fdc3;
    }
    get decoders() {
        return this._decoders;
    }
    get errors() {
        return this._errors;
    }
};

const ioc = new IoC$1();
ioc.fdc3;
const decoders = ioc.decoders;
ioc.errors;

const nonEmptyStringDecoder$2 = string$2().where((s) => s.length > 0, "Expected a non-empty string");
const nonNegativeNumberDecoder$2 = number$2().where((num) => num >= 0, "Expected a non-negative number");
const optionalNonEmptyStringDecoder = optional$2(nonEmptyStringDecoder$2);
const libDomainDecoder = oneOf$1(constant$2("system"), constant$2("windows"), constant$2("appManager"), constant$2("layouts"), constant$2("intents"), constant$2("notifications"), constant$2("channels"), constant$2("extension"), constant$2("themes"), constant$2("prefs"), constant$2("ui"));
const windowOperationTypesDecoder = oneOf$1(constant$2("openWindow"), constant$2("windowHello"), constant$2("windowAdded"), constant$2("windowRemoved"), constant$2("getBounds"), constant$2("getFrameBounds"), constant$2("getUrl"), constant$2("moveResize"), constant$2("focus"), constant$2("close"), constant$2("getTitle"), constant$2("setTitle"), constant$2("focusChange"), constant$2("getChannel"), constant$2("notifyChannelsChanged"), constant$2("operationCheck"));
const appManagerOperationTypesDecoder = oneOf$1(constant$2("appHello"), constant$2("appDirectoryStateChange"), constant$2("instanceStarted"), constant$2("instanceStopped"), constant$2("applicationStart"), constant$2("instanceStop"), constant$2("clear"), constant$2("operationCheck"));
const layoutsOperationTypesDecoder = oneOf$1(constant$2("layoutAdded"), constant$2("layoutChanged"), constant$2("layoutRemoved"), constant$2("layoutRenamed"), constant$2("get"), constant$2("getAll"), constant$2("export"), constant$2("import"), constant$2("remove"), constant$2("rename"), constant$2("clientSaveRequest"), constant$2("getGlobalPermissionState"), constant$2("checkGlobalActivated"), constant$2("requestGlobalPermission"), constant$2("getDefaultGlobal"), constant$2("setDefaultGlobal"), constant$2("clearDefaultGlobal"), constant$2("updateMetadata"), constant$2("operationCheck"), constant$2("getCurrent"), constant$2("defaultLayoutChanged"), constant$2("layoutRestored"));
const notificationsOperationTypesDecoder = oneOf$1(constant$2("raiseNotification"), constant$2("requestPermission"), constant$2("notificationShow"), constant$2("notificationClick"), constant$2("getPermission"), constant$2("list"), constant$2("notificationRaised"), constant$2("notificationClosed"), constant$2("click"), constant$2("clear"), constant$2("clearAll"), constant$2("configure"), constant$2("getConfiguration"), constant$2("configurationChanged"), constant$2("setState"), constant$2("clearOld"), constant$2("activeCountChange"), constant$2("stateChange"), constant$2("operationCheck"), constant$2("getActiveCount"));
const systemOperationTypesDecoder = oneOf$1(constant$2("getEnvironment"), constant$2("getBase"), constant$2("platformShutdown"), constant$2("isFdc3DataWrappingSupported"), constant$2("clientError"), constant$2("systemHello"), constant$2("operationCheck"));
const windowRelativeDirectionDecoder = oneOf$1(constant$2("top"), constant$2("left"), constant$2("right"), constant$2("bottom"));
const windowBoundsDecoder = object$2({
    top: number$2(),
    left: number$2(),
    width: nonNegativeNumberDecoder$2,
    height: nonNegativeNumberDecoder$2
});
const windowOpenSettingsDecoder = optional$2(object$2({
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    context: optional$2(anyJson$2()),
    relativeTo: optional$2(nonEmptyStringDecoder$2),
    relativeDirection: optional$2(windowRelativeDirectionDecoder),
    windowId: optional$2(nonEmptyStringDecoder$2),
    layoutComponentId: optional$2(nonEmptyStringDecoder$2)
}));
const openWindowConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    url: nonEmptyStringDecoder$2,
    options: windowOpenSettingsDecoder
});
const windowHelloDecoder = object$2({
    windowId: optional$2(nonEmptyStringDecoder$2)
});
const coreWindowDataDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    name: nonEmptyStringDecoder$2
});
const simpleWindowDecoder = object$2({
    windowId: nonEmptyStringDecoder$2
});
const helloSuccessDecoder = object$2({
    windows: array$2(coreWindowDataDecoder),
    isWorkspaceFrame: boolean$2()
});
const windowTitleConfigDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    title: string$2()
});
const focusEventDataDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    hasFocus: boolean$2()
});
const windowMoveResizeConfigDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    relative: optional$2(boolean$2())
});
const windowBoundsResultDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    bounds: object$2({
        top: number$2(),
        left: number$2(),
        width: nonNegativeNumberDecoder$2,
        height: nonNegativeNumberDecoder$2
    })
});
const frameWindowBoundsResultDecoder = object$2({
    bounds: object$2({
        top: number$2(),
        left: number$2(),
        width: nonNegativeNumberDecoder$2,
        height: nonNegativeNumberDecoder$2
    })
});
const windowUrlResultDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    url: nonEmptyStringDecoder$2
});
const anyDecoder = anyJson$2();
const boundsDecoder = object$2({
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2)
});
const instanceDataDecoder = object$2({
    id: nonEmptyStringDecoder$2,
    applicationName: nonEmptyStringDecoder$2
});
const iframePermissionsPolicyConfigDecoder = object$2({
    flags: string$2()
});
const workspacesSandboxDecoder = object$2({
    flags: string$2()
});
const requestChannelSelectorConfigDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    channelsNames: array$2(nonEmptyStringDecoder$2)
});
const channelSelectorDecoder$1 = object$2({
    enabled: boolean$2(),
});
const applicationDetailsDecoder = object$2({
    url: nonEmptyStringDecoder$2,
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    workspacesSandbox: optional$2(workspacesSandboxDecoder),
    channelSelector: optional$2(channelSelectorDecoder$1),
    iframePermissionsPolicy: optional$2(iframePermissionsPolicyConfigDecoder)
});
const intentDefinitionDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    displayName: optional$2(string$2()),
    contexts: optional$2(array$2(string$2())),
    customConfig: optional$2(object$2())
});
const applicationDefinitionDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: nonEmptyStringDecoder$2.where((s) => s === "window", "Expected a value of window"),
    title: optional$2(nonEmptyStringDecoder$2),
    version: optional$2(nonEmptyStringDecoder$2),
    customProperties: optional$2(anyJson$2()),
    icon: optional$2(string$2()),
    caption: optional$2(string$2()),
    details: applicationDetailsDecoder,
    intents: optional$2(array$2(intentDefinitionDecoder)),
    hidden: optional$2(boolean$2()),
    fdc3: optional$2(decoders.fdc3.v2DefinitionDecoder)
});
const allApplicationDefinitionsDecoder = oneOf$1(applicationDefinitionDecoder, decoders.fdc3.v2DefinitionDecoder, decoders.fdc3.v1DefinitionDecoder);
object$2({
    definitions: array$2(allApplicationDefinitionsDecoder),
    mode: oneOf$1(constant$2("replace"), constant$2("merge"))
});
const appRemoveConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2
});
const appsExportOperationDecoder = object$2({
    definitions: array$2(applicationDefinitionDecoder)
});
const applicationDataDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: nonEmptyStringDecoder$2.where((s) => s === "window", "Expected a value of window"),
    instances: array$2(instanceDataDecoder),
    userProperties: optional$2(anyJson$2()),
    title: optional$2(nonEmptyStringDecoder$2),
    version: optional$2(nonEmptyStringDecoder$2),
    icon: optional$2(nonEmptyStringDecoder$2),
    caption: optional$2(nonEmptyStringDecoder$2)
});
const baseApplicationDataDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: nonEmptyStringDecoder$2.where((s) => s === "window", "Expected a value of window"),
    userProperties: anyJson$2(),
    title: optional$2(nonEmptyStringDecoder$2),
    version: optional$2(nonEmptyStringDecoder$2),
    icon: optional$2(nonEmptyStringDecoder$2),
    caption: optional$2(nonEmptyStringDecoder$2)
});
const appDirectoryStateChangeDecoder = object$2({
    appsAdded: array$2(baseApplicationDataDecoder),
    appsChanged: array$2(baseApplicationDataDecoder),
    appsRemoved: array$2(baseApplicationDataDecoder)
});
const appHelloSuccessDecoder = object$2({
    apps: array$2(applicationDataDecoder),
    initialChannelId: optional$2(nonEmptyStringDecoder$2)
});
const basicInstanceDataDecoder = object$2({
    id: nonEmptyStringDecoder$2
});
const layoutTypeDecoder = oneOf$1(constant$2("Global"), constant$2("Activity"), constant$2("ApplicationDefault"), constant$2("Swimlane"), constant$2("Workspace"));
const componentTypeDecoder = oneOf$1(constant$2("application"), constant$2("activity"));
const windowComponentStateDecoder = object$2({
    context: optional$2(anyJson$2()),
    bounds: windowBoundsDecoder,
    createArgs: object$2({
        name: optional$2(nonEmptyStringDecoder$2),
        url: optional$2(nonEmptyStringDecoder$2),
        context: optional$2(anyJson$2())
    }),
    windowState: optional$2(nonEmptyStringDecoder$2),
    restoreState: optional$2(nonEmptyStringDecoder$2),
    instanceId: nonEmptyStringDecoder$2,
    isCollapsed: optional$2(boolean$2()),
    isSticky: optional$2(boolean$2()),
    restoreSettings: object$2({
        groupId: optional$2(nonEmptyStringDecoder$2),
        groupZOrder: optional$2(number$2())
    })
});
const windowLayoutComponentDecoder = object$2({
    type: constant$2("window"),
    componentType: optional$2(componentTypeDecoder),
    application: nonEmptyStringDecoder$2,
    state: windowComponentStateDecoder
});
const windowLayoutItemDecoder = object$2({
    type: constant$2("window"),
    config: object$2({
        appName: nonEmptyStringDecoder$2,
        url: optional$2(nonEmptyStringDecoder$2),
        title: optional$2(string$2()),
        allowExtract: optional$2(boolean$2()),
        allowReorder: optional$2(boolean$2()),
        showCloseButton: optional$2(boolean$2()),
        isMaximized: optional$2(boolean$2())
    })
});
const groupLayoutItemDecoder = object$2({
    type: constant$2("group"),
    config: anyJson$2(),
    children: array$2(oneOf$1(windowLayoutItemDecoder))
});
const columnLayoutItemDecoder = object$2({
    type: constant$2("column"),
    config: anyJson$2(),
    children: array$2(oneOf$1(groupLayoutItemDecoder, windowLayoutItemDecoder, lazy(() => columnLayoutItemDecoder), lazy(() => rowLayoutItemDecoder)))
});
const rowLayoutItemDecoder = object$2({
    type: constant$2("row"),
    config: anyJson$2(),
    children: array$2(oneOf$1(columnLayoutItemDecoder, groupLayoutItemDecoder, windowLayoutItemDecoder, lazy(() => rowLayoutItemDecoder)))
});
const workspaceLayoutComponentStateDecoder = object$2({
    config: anyJson$2(),
    context: anyJson$2(),
    children: array$2(oneOf$1(rowLayoutItemDecoder, columnLayoutItemDecoder, groupLayoutItemDecoder, windowLayoutItemDecoder))
});
const workspaceLayoutComponentDecoder = object$2({
    type: constant$2("Workspace"),
    application: optional$2(nonEmptyStringDecoder$2),
    state: workspaceLayoutComponentStateDecoder
});
const workspaceFrameComponentStateDecoder = object$2({
    bounds: windowBoundsDecoder,
    instanceId: nonEmptyStringDecoder$2,
    selectedWorkspace: nonNegativeNumberDecoder$2,
    workspaces: array$2(workspaceLayoutComponentStateDecoder),
    windowState: optional$2(nonEmptyStringDecoder$2),
    restoreState: optional$2(nonEmptyStringDecoder$2),
    context: optional$2(anyJson$2())
});
const workspaceFrameComponentDecoder = object$2({
    type: constant$2("workspaceFrame"),
    application: nonEmptyStringDecoder$2,
    componentType: optional$2(componentTypeDecoder),
    state: workspaceFrameComponentStateDecoder
});
const glueLayoutDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: layoutTypeDecoder,
    token: optional$2(nonEmptyStringDecoder$2),
    components: array$2(oneOf$1(windowLayoutComponentDecoder, workspaceLayoutComponentDecoder, workspaceFrameComponentDecoder)),
    context: optional$2(anyJson$2()),
    metadata: optional$2(anyJson$2()),
    version: optional$2(number$2())
});
const renamedLayoutNotificationDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: layoutTypeDecoder,
    token: optional$2(nonEmptyStringDecoder$2),
    components: array$2(oneOf$1(windowLayoutComponentDecoder, workspaceLayoutComponentDecoder, workspaceFrameComponentDecoder)),
    context: optional$2(anyJson$2()),
    metadata: optional$2(anyJson$2()),
    version: optional$2(number$2()),
    prevName: nonEmptyStringDecoder$2
});
const newLayoutOptionsDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    context: optional$2(anyJson$2()),
    metadata: optional$2(anyJson$2()),
    instances: optional$2(array$2(nonEmptyStringDecoder$2)),
    ignoreInstances: optional$2(array$2(nonEmptyStringDecoder$2))
});
const restoreOptionsDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    context: optional$2(anyJson$2()),
    closeRunningInstance: optional$2(boolean$2()),
    closeMe: optional$2(boolean$2()),
    timeout: optional$2(nonNegativeNumberDecoder$2)
});
const layoutSummaryDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: layoutTypeDecoder,
    context: optional$2(anyJson$2()),
    metadata: optional$2(anyJson$2())
});
const simpleLayoutConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    type: layoutTypeDecoder
});
const saveLayoutConfigDecoder = object$2({
    layout: newLayoutOptionsDecoder
});
const renameLayoutConfigDecoder = object$2({
    layout: glueLayoutDecoder,
    newName: nonEmptyStringDecoder$2
});
const layoutResultDecoder = object$2({
    status: nonEmptyStringDecoder$2
});
const updateLayoutMetadataConfigDecoder = object$2({
    layout: glueLayoutDecoder,
});
const restoreLayoutConfigDecoder = object$2({
    layout: restoreOptionsDecoder
});
const getAllLayoutsConfigDecoder = object$2({
    type: layoutTypeDecoder
});
const allLayoutsFullConfigDecoder = object$2({
    layouts: array$2(glueLayoutDecoder)
});
const defaultGlobalChangedDecoder = optional$2(object$2({
    name: nonEmptyStringDecoder$2
}));
const importModeDecoder = oneOf$1(constant$2("replace"), constant$2("merge"));
const layoutsImportConfigDecoder = object$2({
    layouts: array$2(glueLayoutDecoder),
    mode: importModeDecoder,
    skipManagerRequest: optional$2(boolean$2())
});
const allLayoutsSummariesResultDecoder = object$2({
    summaries: array$2(layoutSummaryDecoder)
});
const simpleLayoutResultDecoder = object$2({
    layout: glueLayoutDecoder
});
const optionalSimpleLayoutResult = object$2({
    layout: optional$2(glueLayoutDecoder)
});
const setDefaultGlobalConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2
});
const intentsOperationTypesDecoder = oneOf$1(constant$2("findIntent"), constant$2("getIntents"), constant$2("getIntentsByHandler"), constant$2("raise"), constant$2("filterHandlers"));
const intentHandlerDecoder = object$2({
    applicationName: nonEmptyStringDecoder$2,
    applicationTitle: optional$2(string$2()),
    applicationDescription: optional$2(string$2()),
    applicationIcon: optional$2(string$2()),
    type: oneOf$1(constant$2("app"), constant$2("instance")),
    displayName: optional$2(string$2()),
    contextTypes: optional$2(array$2(nonEmptyStringDecoder$2)),
    instanceId: optional$2(string$2()),
    instanceTitle: optional$2(string$2()),
    resultType: optional$2(string$2())
});
object$2({
    applicationName: string$2(),
    applicationIcon: optional$2(string$2()),
    instanceId: optional$2(string$2()),
});
object$2({
    intent: nonEmptyStringDecoder$2,
    handler: intentHandlerDecoder
});
const intentDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    handlers: array$2(intentHandlerDecoder)
});
const intentTargetDecoder = oneOf$1(constant$2("startNew"), constant$2("reuse"), object$2({
    app: optional$2(nonEmptyStringDecoder$2),
    instance: optional$2(nonEmptyStringDecoder$2)
}));
const intentContextDecoder = object$2({
    type: optional$2(nonEmptyStringDecoder$2),
    data: optional$2(anyJson$2())
});
const intentsDecoder = array$2(intentDecoder);
const wrappedIntentsDecoder = object$2({
    intents: intentsDecoder
});
const intentFilterDecoder = object$2({
    name: optional$2(nonEmptyStringDecoder$2),
    contextType: optional$2(nonEmptyStringDecoder$2),
    resultType: optional$2(nonEmptyStringDecoder$2)
});
const findFilterDecoder = oneOf$1(nonEmptyStringDecoder$2, intentFilterDecoder);
const wrappedIntentFilterDecoder = object$2({
    filter: optional$2(intentFilterDecoder)
});
const applicationStartOptionsDecoder = object$2({
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    relativeTo: optional$2(nonEmptyStringDecoder$2),
    relativeDirection: optional$2(windowRelativeDirectionDecoder),
    waitForAGMReady: optional$2(boolean$2()),
    channelId: optional$2(nonEmptyStringDecoder$2),
});
const intentRequestDecoder = object$2({
    intent: nonEmptyStringDecoder$2,
    target: optional$2(intentTargetDecoder),
    context: optional$2(intentContextDecoder),
    options: optional$2(applicationStartOptionsDecoder),
    handlers: optional$2(array$2(intentHandlerDecoder)),
    timeout: optional$2(nonNegativeNumberDecoder$2),
    waitUserResponseIndefinitely: optional$2(boolean$2()),
    clearSavedHandler: optional$2(boolean$2())
});
const originAppDecoder = object$2({
    interopInstance: nonEmptyStringDecoder$2,
    name: optional$2(nonEmptyStringDecoder$2)
});
const startReasonDecoder = object$2({
    originApp: originAppDecoder,
    intentRequest: optional$2(intentRequestDecoder)
});
const applicationStartConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    waitForAGMReady: boolean$2(),
    id: optional$2(nonEmptyStringDecoder$2),
    context: optional$2(anyJson$2()),
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    relativeTo: optional$2(nonEmptyStringDecoder$2),
    relativeDirection: optional$2(windowRelativeDirectionDecoder),
    forceChromeTab: optional$2(boolean$2()),
    layoutComponentId: optional$2(nonEmptyStringDecoder$2),
    channelId: optional$2(nonEmptyStringDecoder$2),
    startReason: startReasonDecoder
});
const raiseRequestDecoder = oneOf$1(nonEmptyStringDecoder$2, intentRequestDecoder);
const resolverConfigDecoder = object$2({
    enabled: boolean$2(),
    appName: nonEmptyStringDecoder$2,
    waitResponseTimeout: number$2()
});
const handlerFilterDecoder = object$2({
    title: optional$2(nonEmptyStringDecoder$2),
    openResolver: optional$2(boolean$2()),
    timeout: optional$2(nonNegativeNumberDecoder$2),
    intent: optional$2(nonEmptyStringDecoder$2),
    contextTypes: optional$2(array$2(nonEmptyStringDecoder$2)),
    resultType: optional$2(nonEmptyStringDecoder$2),
    applicationNames: optional$2(array$2(nonEmptyStringDecoder$2))
});
const embeddedResolverConfigDecoder = object$2({
    enabled: boolean$2(),
    initialCaller: object$2({ instanceId: nonEmptyStringDecoder$2 }),
});
const raiseIntentRequestDecoder = object$2({
    intentRequest: intentRequestDecoder,
    resolverConfig: resolverConfigDecoder,
    embeddedResolverConfig: optional$2(embeddedResolverConfigDecoder)
});
const intentResultDecoder = object$2({
    request: intentRequestDecoder,
    handler: intentHandlerDecoder,
    result: anyJson$2()
});
const filterHandlersResultDecoder = object$2({
    handlers: array$2(intentHandlerDecoder)
});
const filterHandlersWithResolverConfigDecoder = object$2({
    filterHandlersRequest: handlerFilterDecoder,
    resolverConfig: resolverConfigDecoder,
    embeddedResolverConfig: optional$2(embeddedResolverConfigDecoder)
});
const AddIntentListenerRequestDecoder = object$2({
    intent: nonEmptyStringDecoder$2,
    contextTypes: optional$2(array$2(nonEmptyStringDecoder$2)),
    displayName: optional$2(string$2()),
    icon: optional$2(string$2()),
    description: optional$2(string$2()),
    resultType: optional$2(string$2())
});
const AddIntentListenerDecoder = oneOf$1(nonEmptyStringDecoder$2, AddIntentListenerRequestDecoder);
const intentInfoDecoder = object$2({
    intent: nonEmptyStringDecoder$2,
    contextTypes: optional$2(array$2(nonEmptyStringDecoder$2)),
    description: optional$2(nonEmptyStringDecoder$2),
    displayName: optional$2(nonEmptyStringDecoder$2),
    icon: optional$2(nonEmptyStringDecoder$2),
    resultType: optional$2(nonEmptyStringDecoder$2)
});
const getIntentsResultDecoder = object$2({
    intents: array$2(intentInfoDecoder)
});
const channelNameDecoder = (channelNames) => {
    return nonEmptyStringDecoder$2.where(s => channelNames.includes(s), "Expected a valid channel name");
};
const fdc3OptionsDecoder = object$2({
    contextType: optional$2(nonEmptyStringDecoder$2)
});
const publishOptionsDecoder = optional$2(oneOf$1(nonEmptyStringDecoder$2, object$2({
    name: optional$2(nonEmptyStringDecoder$2),
    fdc3: optional$2(boolean$2())
})));
const leaveChannelsConfig = object$2({
    windowId: optionalNonEmptyStringDecoder,
    channel: optionalNonEmptyStringDecoder
});
const fdc3ContextDecoder = anyJson$2().where((value) => typeof value.type === "string", "Expected a valid FDC3 Context with compulsory 'type' field");
const interopActionSettingsDecoder = object$2({
    method: nonEmptyStringDecoder$2,
    arguments: optional$2(anyJson$2()),
    target: optional$2(oneOf$1(constant$2("all"), constant$2("best")))
});
const glue42NotificationActionDecoder = object$2({
    action: string$2(),
    title: nonEmptyStringDecoder$2,
    icon: optional$2(string$2()),
    interop: optional$2(interopActionSettingsDecoder)
});
const notificationStateDecoder = oneOf$1(constant$2("Active"), constant$2("Acknowledged"), constant$2("Seen"), constant$2("Closed"), constant$2("Stale"), constant$2("Snoozed"), constant$2("Processing"));
const activeNotificationsCountChangeDecoder = object$2({
    count: number$2()
});
const notificationDefinitionDecoder = object$2({
    badge: optional$2(string$2()),
    body: optional$2(string$2()),
    data: optional$2(anyJson$2()),
    dir: optional$2(oneOf$1(constant$2("auto"), constant$2("ltr"), constant$2("rtl"))),
    icon: optional$2(string$2()),
    image: optional$2(string$2()),
    lang: optional$2(string$2()),
    renotify: optional$2(boolean$2()),
    requireInteraction: optional$2(boolean$2()),
    silent: optional$2(boolean$2()),
    tag: optional$2(string$2()),
    timestamp: optional$2(nonNegativeNumberDecoder$2),
    vibrate: optional$2(array$2(number$2()))
});
const glue42NotificationOptionsDecoder = object$2({
    title: nonEmptyStringDecoder$2,
    clickInterop: optional$2(interopActionSettingsDecoder),
    actions: optional$2(array$2(glue42NotificationActionDecoder)),
    focusPlatformOnDefaultClick: optional$2(boolean$2()),
    badge: optional$2(string$2()),
    body: optional$2(string$2()),
    data: optional$2(anyJson$2()),
    dir: optional$2(oneOf$1(constant$2("auto"), constant$2("ltr"), constant$2("rtl"))),
    icon: optional$2(string$2()),
    image: optional$2(string$2()),
    lang: optional$2(string$2()),
    renotify: optional$2(boolean$2()),
    requireInteraction: optional$2(boolean$2()),
    silent: optional$2(boolean$2()),
    tag: optional$2(string$2()),
    timestamp: optional$2(nonNegativeNumberDecoder$2),
    vibrate: optional$2(array$2(number$2())),
    severity: optional$2(oneOf$1(constant$2("Low"), constant$2("None"), constant$2("Medium"), constant$2("High"), constant$2("Critical"))),
    showToast: optional$2(boolean$2()),
    showInPanel: optional$2(boolean$2()),
    state: optional$2(notificationStateDecoder)
});
const notificationSetStateRequestDecoder = object$2({
    id: nonEmptyStringDecoder$2,
    state: notificationStateDecoder
});
object$2().where((value) => value.fdc3 ? typeof value.fdc3.type === "string" : true, "Expected a valid FDC3 Context with compulsory 'type' field");
const channelFDC3DisplayMetadataDecoder = object$2({
    color: optional$2(nonEmptyStringDecoder$2),
    icon: optional$2(nonEmptyStringDecoder$2),
    name: optional$2(nonEmptyStringDecoder$2),
    glyph: optional$2(nonEmptyStringDecoder$2)
});
const channelFdc3MetaDecoder = object$2({
    id: nonEmptyStringDecoder$2,
    displayMetadata: optional$2(channelFDC3DisplayMetadataDecoder)
});
const channelMetaDecoder = object$2({
    color: nonEmptyStringDecoder$2,
    fdc3: optional$2(channelFdc3MetaDecoder)
});
const channelDefinitionDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    meta: channelMetaDecoder,
    data: optional$2(object$2()),
});
const pathValueDecoder = object$2({
    path: nonEmptyStringDecoder$2,
    value: anyJson$2()
});
const pathsValueDecoder = array$2(pathValueDecoder);
const removeChannelDataDecoder = object$2({
    name: nonEmptyStringDecoder$2
});
const channelRestrictionsDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    read: boolean$2(),
    write: boolean$2(),
    windowId: optional$2(nonEmptyStringDecoder$2)
});
const channelRestrictionConfigWithWindowIdDecoder = object$2({
    name: nonEmptyStringDecoder$2,
    read: boolean$2(),
    write: boolean$2(),
    windowId: nonEmptyStringDecoder$2
});
const restrictionConfigDataDecoder = object$2({
    config: channelRestrictionConfigWithWindowIdDecoder
});
const restrictionsDecoder = object$2({
    channels: array$2(channelRestrictionsDecoder)
});
const getRestrictionsDataDecoder = object$2({
    windowId: nonEmptyStringDecoder$2
});
const restrictionsConfigDecoder = object$2({
    read: boolean$2(),
    write: boolean$2(),
    windowId: optional$2(nonEmptyStringDecoder$2)
});
const restrictAllDataDecoder = object$2({
    restrictions: restrictionsConfigDecoder
});
const raiseNotificationDecoder = object$2({
    settings: glue42NotificationOptionsDecoder,
    id: nonEmptyStringDecoder$2
});
const raiseNotificationResultDecoder = object$2({
    settings: glue42NotificationOptionsDecoder
});
const permissionRequestResultDecoder = object$2({
    permissionGranted: boolean$2()
});
const permissionQueryResultDecoder = object$2({
    permission: oneOf$1(constant$2("default"), constant$2("granted"), constant$2("denied"))
});
const notificationEventPayloadDecoder = object$2({
    definition: notificationDefinitionDecoder,
    action: optional$2(string$2()),
    id: optional$2(nonEmptyStringDecoder$2)
});
const notificationFilterDecoder = object$2({
    allowed: optional$2(array$2(nonEmptyStringDecoder$2)),
    blocked: optional$2(array$2(nonEmptyStringDecoder$2))
});
const notificationsConfigurationDecoder = object$2({
    enable: optional$2(boolean$2()),
    enableToasts: optional$2(boolean$2()),
    sourceFilter: optional$2(notificationFilterDecoder),
    showNotificationBadge: optional$2(boolean$2())
});
const notificationsConfigurationProtocolDecoder = object$2({
    configuration: notificationsConfigurationDecoder
});
const strictNotificationsConfigurationProtocolDecoder = object$2({
    configuration: object$2({
        enable: boolean$2(),
        enableToasts: boolean$2(),
        sourceFilter: object$2({
            allowed: array$2(nonEmptyStringDecoder$2),
            blocked: array$2(nonEmptyStringDecoder$2)
        })
    })
});
const platformSaveRequestConfigDecoder = object$2({
    layoutType: oneOf$1(constant$2("Global"), constant$2("Workspace")),
    layoutName: nonEmptyStringDecoder$2,
    context: optional$2(anyJson$2())
});
const saveRequestClientResponseDecoder = object$2({
    windowContext: optional$2(anyJson$2()),
});
const permissionStateResultDecoder = object$2({
    state: oneOf$1(constant$2("prompt"), constant$2("denied"), constant$2("granted"))
});
const simpleAvailabilityResultDecoder = object$2({
    isAvailable: boolean$2()
});
const simpleItemIdDecoder = object$2({
    itemId: nonEmptyStringDecoder$2
});
const operationCheckResultDecoder = object$2({
    isSupported: boolean$2()
});
const operationCheckConfigDecoder = object$2({
    operation: nonEmptyStringDecoder$2
});
const workspaceFrameBoundsResultDecoder = object$2({
    bounds: windowBoundsDecoder
});
const themeDecoder = object$2({
    displayName: nonEmptyStringDecoder$2,
    name: nonEmptyStringDecoder$2
});
const simpleThemeResponseDecoder = object$2({
    theme: themeDecoder
});
const allThemesResponseDecoder = object$2({
    themes: array$2(themeDecoder)
});
const selectThemeConfigDecoder = object$2({
    name: nonEmptyStringDecoder$2
});
const notificationsDataDecoder = object$2({
    id: nonEmptyStringDecoder$2,
    title: nonEmptyStringDecoder$2,
    clickInterop: optional$2(interopActionSettingsDecoder),
    actions: optional$2(array$2(glue42NotificationActionDecoder)),
    focusPlatformOnDefaultClick: optional$2(boolean$2()),
    badge: optional$2(string$2()),
    body: optional$2(string$2()),
    data: optional$2(anyJson$2()),
    dir: optional$2(oneOf$1(constant$2("auto"), constant$2("ltr"), constant$2("rtl"))),
    icon: optional$2(string$2()),
    image: optional$2(string$2()),
    lang: optional$2(string$2()),
    renotify: optional$2(boolean$2()),
    requireInteraction: optional$2(boolean$2()),
    silent: optional$2(boolean$2()),
    tag: optional$2(string$2()),
    timestamp: optional$2(nonNegativeNumberDecoder$2),
    vibrate: optional$2(array$2(number$2())),
    severity: optional$2(oneOf$1(constant$2("Low"), constant$2("None"), constant$2("Medium"), constant$2("High"), constant$2("Critical"))),
    showToast: optional$2(boolean$2()),
    showInPanel: optional$2(boolean$2()),
    state: optional$2(notificationStateDecoder)
});
const simpleNotificationDataDecoder = object$2({
    notification: notificationsDataDecoder
});
const allNotificationsDataDecoder = object$2({
    notifications: array$2(notificationsDataDecoder)
});
const simpleNotificationSelectDecoder = object$2({
    id: nonEmptyStringDecoder$2
});
const getWindowIdsOnChannelDataDecoder = object$2({
    channel: nonEmptyStringDecoder$2
});
const getWindowIdsOnChannelResultDecoder = object$2({
    windowIds: array$2(nonEmptyStringDecoder$2)
});
const channelsOperationTypesDecoder = oneOf$1(constant$2("addChannel"), constant$2("getMyChannel"), constant$2("getWindowIdsOnChannel"), constant$2("getWindowIdsWithChannels"), constant$2("joinChannel"), constant$2("restrict"), constant$2("getRestrictions"), constant$2("restrictAll"), constant$2("notifyChannelsChanged"), constant$2("leaveChannel"), constant$2("getMode"), constant$2("operationCheck"));
const getChannelsModeDecoder = object$2({
    mode: oneOf$1(constant$2("single"), constant$2("multi"))
});
const getMyChanelResultDecoder = object$2({
    channel: optional$2(nonEmptyStringDecoder$2)
});
const windowWithChannelFilterDecoder = object$2({
    application: optional$2(nonEmptyStringDecoder$2),
    channels: optional$2(array$2(nonEmptyStringDecoder$2)),
    windowIds: optional$2(array$2(nonEmptyStringDecoder$2))
});
const wrappedWindowWithChannelFilterDecoder = object$2({
    filter: optional$2(windowWithChannelFilterDecoder)
});
const getWindowIdsWithChannelsResultDecoder = object$2({
    windowIdsWithChannels: array$2(object$2({
        application: nonEmptyStringDecoder$2,
        channel: optional$2(nonEmptyStringDecoder$2),
        windowId: nonEmptyStringDecoder$2
    }))
});
const startApplicationContextDecoder = optional$2(anyJson$2());
const startApplicationOptionsDecoder = optional$2(object$2({
    top: optional$2(number$2()),
    left: optional$2(number$2()),
    width: optional$2(nonNegativeNumberDecoder$2),
    height: optional$2(nonNegativeNumberDecoder$2),
    relativeTo: optional$2(nonEmptyStringDecoder$2),
    relativeDirection: optional$2(windowRelativeDirectionDecoder),
    waitForAGMReady: optional$2(boolean$2()),
    channelId: optional$2(nonEmptyStringDecoder$2),
    reuseId: optional$2(nonEmptyStringDecoder$2),
    originIntentRequest: optional$2(intentRequestDecoder)
}));
const joinChannelDataDecoder = object$2({
    channel: nonEmptyStringDecoder$2,
    windowId: nonEmptyStringDecoder$2
});
const leaveChannelDataDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    channelName: optional$2(nonEmptyStringDecoder$2)
});
const channelsChangedDataDecoder = object$2({
    windowId: nonEmptyStringDecoder$2,
    channelNames: array$2(nonEmptyStringDecoder$2)
});
const windowChannelResultDecoder = object$2({
    channel: optional$2(nonEmptyStringDecoder$2),
});
const prefsOperationTypesDecoder = oneOf$1(constant$2("clear"), constant$2("clearAll"), constant$2("get"), constant$2("getAll"), constant$2("set"), constant$2("update"), constant$2("prefsChanged"), constant$2("prefsHello"), constant$2("operationCheck"), constant$2("registerSubscriber"));
const appPreferencesDecoder = object$2({
    app: nonEmptyStringDecoder$2,
    data: object$2(),
    lastUpdate: optional$2(nonEmptyStringDecoder$2),
});
const basePrefsConfigDecoder = object$2({
    app: nonEmptyStringDecoder$2,
});
const getPrefsResultDecoder = object$2({
    prefs: appPreferencesDecoder,
});
const getAllPrefsResultDecoder = object$2({
    all: array$2(appPreferencesDecoder),
});
const subscriberRegisterConfigDecoder = object$2({
    interopId: nonEmptyStringDecoder$2,
});
const changePrefsDataDecoder = object$2({
    app: nonEmptyStringDecoder$2,
    data: object$2(),
});
const prefsHelloSuccessDecoder = object$2({
    platform: object$2({
        app: nonEmptyStringDecoder$2,
    }),
    validNonExistentApps: optional$2(array$2(nonEmptyStringDecoder$2)),
});
const clientErrorDataDecoder = object$2({
    message: nonEmptyStringDecoder$2
});
const systemHelloSuccessDecoder = object$2({
    isClientErrorOperationSupported: boolean$2()
});

const nonEmptyStringDecoder$1 = decoders.common.nonEmptyStringDecoder;
const nonNegativeNumberDecoder$1 = decoders.common.nonNegativeNumberDecoder;
const widgetSourcesDecoder = object$2({
    bundle: nonEmptyStringDecoder$1,
    styles: array$2(nonEmptyStringDecoder$1),
    fonts: optional$2(array$2(nonEmptyStringDecoder$1))
});
const modalsSourcesDecoder = object$2({
    bundle: nonEmptyStringDecoder$1,
    styles: array$2(nonEmptyStringDecoder$1),
    fonts: optional$2(array$2(nonEmptyStringDecoder$1))
});
const intentResolverSourcesDecoder = object$2({
    bundle: nonEmptyStringDecoder$1,
    styles: array$2(nonEmptyStringDecoder$1),
    fonts: optional$2(array$2(nonEmptyStringDecoder$1))
});
const channelSelectorTypeDecoder = oneOf$1(constant$2("directional"), constant$2("default"));
const channelSelectorDecoder = object$2({
    type: optional$2(channelSelectorTypeDecoder),
    enable: optional$2(boolean$2())
});
const positionDecoder = oneOf$1(constant$2("top"), constant$2("bottom"), constant$2("left"), constant$2("right"));
const modeDecoder = oneOf$1(constant$2("default"), constant$2("compact"));
const displayModeDecoder = oneOf$1(constant$2("all"), constant$2("fdc3"));
const widgetChannelsDecoder = object$2({
    selector: optional$2(channelSelectorDecoder),
    displayMode: optional$2(displayModeDecoder)
});
const platformWidgetDefaultConfigDecoder = object$2({
    channels: optional$2(widgetChannelsDecoder),
    position: optional$2(positionDecoder),
    mode: optional$2(modeDecoder),
    displayInWorkspace: optional$2(boolean$2())
});
const widgetConfigDecoder = object$2({
    enable: boolean$2(),
    awaitFactory: optional$2(boolean$2()),
    timeout: optional$2(nonNegativeNumberDecoder$1),
    channels: optional$2(widgetChannelsDecoder),
    position: optional$2(positionDecoder),
    mode: optional$2(modeDecoder),
    displayInWorkspace: optional$2(boolean$2())
});
const modalsConfigDecoder = object$2({
    alerts: optional$2(object$2({
        enabled: boolean$2()
    })),
    dialogs: optional$2(object$2({
        enabled: boolean$2()
    })),
    awaitFactory: optional$2(boolean$2()),
    timeout: optional$2(nonNegativeNumberDecoder$1),
});
const uiOperationTypesDecoder = oneOf$1(constant$2("getResources"), constant$2("operationCheck"), constant$2("showAlert"), constant$2("showDialog"), constant$2("alertInteropAction"), constant$2("showResolver"));
const getResourcesDataDecoder = object$2({
    origin: nonEmptyStringDecoder$1
});
const blockedResourcesDecoder = object$2({
    blockedOrigin: constant$2(true)
});
const availableWidgetResourcesDecoder = object$2({
    blockedOrigin: constant$2(false),
    config: platformWidgetDefaultConfigDecoder,
    sources: widgetSourcesDecoder
});
const widgetResourcesDecoder = union$1(blockedResourcesDecoder, availableWidgetResourcesDecoder);
const availableModalsResourcesDecoder = object$2({
    blockedOrigin: constant$2(false),
    sources: modalsSourcesDecoder
});
const modalsResourcesDecoder = union$1(blockedResourcesDecoder, availableModalsResourcesDecoder);
const availableIntentResolverResourcesDecoder = object$2({
    blockedOrigin: constant$2(false),
    sources: intentResolverSourcesDecoder
});
const intentResolverResourcesDecoder = union$1(blockedResourcesDecoder, availableIntentResolverResourcesDecoder);
const resourcesDecoder = object$2({
    widget: optional$2(widgetResourcesDecoder),
    modals: optional$2(modalsResourcesDecoder),
    intentResolver: optional$2(intentResolverResourcesDecoder)
});
const getResourcesResultDecoder = object$2({
    resources: resourcesDecoder,
});
const alertsInteropSettingsDecoder = object$2({
    method: nonEmptyStringDecoder$1,
    arguments: optional$2(anyJson$2()),
    target: optional$2(oneOf$1(constant$2("best"), constant$2("all"), nonEmptyStringDecoder$1))
});
const modalRequestTargetDecoder = oneOf$1(constant$2("Global"), constant$2("WindowContainer"), nonEmptyStringDecoder$1);
const modalRequestMessageTargetDecoder = object$2({
    instance: nonEmptyStringDecoder$1,
    container: optional$2(oneOf$1(constant$2("Global"), constant$2("WindowContainer")))
});
const alertRequestConfigDecoder = object$2({
    variant: oneOf$1(constant$2("default"), constant$2("success"), constant$2("critical"), constant$2("info"), constant$2("warning")),
    text: nonEmptyStringDecoder$1,
    showCloseButton: optional$2(boolean$2()),
    clickInterop: optional$2(alertsInteropSettingsDecoder),
    onCloseInterop: optional$2(alertsInteropSettingsDecoder),
    actions: optional$2(array$2(object$2({
        id: nonEmptyStringDecoder$1,
        title: nonEmptyStringDecoder$1,
        clickInterop: alertsInteropSettingsDecoder
    }))),
    data: optional$2(anyJson$2()),
    ttl: optional$2(nonNegativeNumberDecoder$1),
    target: optional$2(modalRequestTargetDecoder)
});
const uiAlertRequestMessageDecoder = object$2({
    config: alertRequestConfigDecoder,
    target: modalRequestMessageTargetDecoder
});
const dialogRequestConfigDecoder = object$2({
    templateName: nonEmptyStringDecoder$1,
    variables: anyJson$2(),
    target: optional$2(modalRequestTargetDecoder),
    timer: optional$2(object$2({
        duration: nonNegativeNumberDecoder$1
    })),
    size: optional$2(object$2({
        width: nonNegativeNumberDecoder$1,
        height: nonNegativeNumberDecoder$1
    })),
    movable: optional$2(boolean$2()),
    transparent: optional$2(boolean$2())
});
const dialogResponseDecoder = object$2({
    isExpired: optional$2(boolean$2()),
    isClosed: optional$2(boolean$2()),
    isEnterPressed: optional$2(boolean$2()),
    responseButtonClicked: optional$2(object$2({
        id: nonEmptyStringDecoder$1,
        text: nonEmptyStringDecoder$1
    })),
    inputs: optional$2(array$2(object$2({
        type: oneOf$1(constant$2("checkbox"), constant$2("email"), constant$2("number"), constant$2("password"), constant$2("text")),
        id: nonEmptyStringDecoder$1,
        checked: optional$2(boolean$2()),
        value: optional$2(string$2())
    })))
});
object$2({
    result: dialogResponseDecoder
});
const uiDialogRequestMessageDecoder = object$2({
    config: dialogRequestConfigDecoder,
    target: modalRequestMessageTargetDecoder
});
const openAlertResultDecoder = object$2({
    id: nonEmptyStringDecoder$1
});
const openDialogResultDecoder = object$2({
    id: nonEmptyStringDecoder$1,
    responsePromise: anyJson$2()
});
const dialogOnCompletionConfigDecoder = object$2({
    response: dialogResponseDecoder
});
const alertInteropActionDecoder = object$2({
    name: nonEmptyStringDecoder$1,
    settings: alertsInteropSettingsDecoder
});
const alertOnClickConfigDecoder = object$2({
    interopAction: alertInteropActionDecoder
});
const alertInteropActionDataDecoder = object$2({
    interopAction: alertInteropActionDecoder
});
const intentResolverConfigDecoder = object$2({
    enable: boolean$2(),
    awaitFactory: optional$2(boolean$2()),
    timeout: optional$2(nonNegativeNumberDecoder$1)
});
const openResolverResultDecoder = object$2({
    id: nonEmptyStringDecoder$1
});
const userSettingsDecoder = object$2({
    preserveChoice: boolean$2()
});
const userChoiceResponseDecoder = object$2({
    intent: nonEmptyStringDecoder$1,
    handler: intentHandlerDecoder,
    userSettings: userSettingsDecoder
});
const intentResolverResponseDecoder = object$2({
    isExpired: optional$2(boolean$2()),
    isClosed: optional$2(boolean$2()),
    userChoice: optional$2(userChoiceResponseDecoder)
});
const onUserResponseResponseDecoder = object$2({
    response: intentResolverResponseDecoder
});
const openConfigWithIntentRequestDecoder = object$2({
    intentRequest: intentRequestDecoder
});
const openConfigWithHandlerFilterDecoder = object$2({
    handlerFilter: handlerFilterDecoder
});
const intentResolverOpenConfigDecoder = union$1(openConfigWithIntentRequestDecoder, openConfigWithHandlerFilterDecoder);
const uiResolverRequestMessageConfigDecoder = intersection(intentResolverOpenConfigDecoder, object$2({ timeout: nonNegativeNumberDecoder$1 }));
const uiResolverRequestMessageDecoder = object$2({
    config: uiResolverRequestMessageConfigDecoder
});
const uiResolverResponseMessageDecoder = object$2({
    result: intentResolverResponseDecoder
});

const parseConfig = (config = {}) => {
    const isPlatformInternal = !!config?.gateway?.webPlatform?.port;
    const decodedWidgetConfigResult = optional$2(widgetConfigDecoder).run(config.widget);
    if (!decodedWidgetConfigResult.ok) {
        throw ioError.raiseError(`The provided widget config is invalid. Error: ${JSON.stringify(decodedWidgetConfigResult.error)}`);
    }
    const decodedModalsConfigResult = optional$2(modalsConfigDecoder).run(config.modals);
    if (!decodedModalsConfigResult.ok) {
        throw ioError.raiseError(`The provided modals config is invalid. Error: ${JSON.stringify(decodedModalsConfigResult.error)}`);
    }
    const decodedIntentResolverConfigResult = optional$2(intentResolverConfigDecoder).run(config.intentResolver);
    if (!decodedIntentResolverConfigResult.ok) {
        throw ioError.raiseError(`The provided 'intentResolver' config is invalid. Error: ${JSON.stringify(decodedIntentResolverConfigResult.error)}`);
    }
    const combined = {
        ...defaultConfig,
        ...config,
        isPlatformInternal,
        logger: config.systemLogger?.level ?? "info",
        widget: deepmerge$1(defaultWidgetConfig, decodedWidgetConfigResult.result ?? {}),
        modals: deepmerge$1(defaultModalsConfig, decodedModalsConfigResult.result ?? {}),
        intentResolver: deepmerge$1(defaultIntentResolverConfig, decodedIntentResolverConfigResult.result ?? {}),
    };
    return combined;
};

const checkSingleton = () => {
    const ioConnectBrowserNamespace = window.glue42core || window.iobrowser;
    if (ioConnectBrowserNamespace && ioConnectBrowserNamespace.webStarted) {
        return ioError.raiseError("IoConnect Browser has already been started for this application.");
    }
    if (!ioConnectBrowserNamespace) {
        window.iobrowser = { webStarted: true };
        return;
    }
    ioConnectBrowserNamespace.webStarted = true;
};

const enterprise = (config) => {
    const enterpriseConfig = {
        windows: true,
        layouts: "full",
        appManager: "full",
        channels: true,
        libraries: config?.libraries ?? [],
        logger: config?.systemLogger?.level ?? "warn"
    };
    const injectedFactory = window.IODesktop || window.Glue;
    return injectedFactory(enterpriseConfig);
};

const operations$a = {
    openWindow: { name: "openWindow", dataDecoder: openWindowConfigDecoder, resultDecoder: coreWindowDataDecoder },
    windowHello: { name: "windowHello", dataDecoder: windowHelloDecoder, resultDecoder: helloSuccessDecoder },
    windowAdded: { name: "windowAdded", dataDecoder: coreWindowDataDecoder },
    windowRemoved: { name: "windowRemoved", dataDecoder: simpleWindowDecoder },
    getBounds: { name: "getBounds", dataDecoder: simpleWindowDecoder, resultDecoder: windowBoundsResultDecoder },
    getFrameBounds: { name: "getFrameBounds", dataDecoder: simpleWindowDecoder, resultDecoder: frameWindowBoundsResultDecoder },
    getUrl: { name: "getUrl", dataDecoder: simpleWindowDecoder, resultDecoder: windowUrlResultDecoder },
    moveResize: { name: "moveResize", dataDecoder: windowMoveResizeConfigDecoder },
    focus: { name: "focus", dataDecoder: simpleWindowDecoder },
    close: { name: "close", dataDecoder: simpleWindowDecoder },
    getTitle: { name: "getTitle", dataDecoder: simpleWindowDecoder, resultDecoder: windowTitleConfigDecoder },
    setTitle: { name: "setTitle", dataDecoder: windowTitleConfigDecoder },
    focusChange: { name: "focusChange", dataDecoder: focusEventDataDecoder },
    getChannel: { name: "getChannel", dataDecoder: simpleWindowDecoder, resultDecoder: windowChannelResultDecoder },
    notifyChannelsChanged: { name: "notifyChannelsChanged", dataDecoder: channelsChangedDataDecoder },
    operationCheck: { name: "operationCheck" }
};

function createRegistry$1(options) {
    if (options && options.errorHandling
        && typeof options.errorHandling !== "function"
        && options.errorHandling !== "log"
        && options.errorHandling !== "silent"
        && options.errorHandling !== "throw") {
        throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
    }
    var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
    var callbacks = {};
    function add(key, callback, replayArgumentsArr) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        if (replayArgumentsArr) {
            setTimeout(function () {
                replayArgumentsArr.forEach(function (replayArgument) {
                    var _a;
                    if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                        try {
                            if (Array.isArray(replayArgument)) {
                                callback.apply(undefined, replayArgument);
                            }
                            else {
                                callback.apply(undefined, [replayArgument]);
                            }
                        }
                        catch (err) {
                            _handleError(err, key);
                        }
                    }
                });
            }, 0);
        }
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.reduce(function (acc, element, index) {
                if (!(element === callback && acc.length === index)) {
                    acc.push(element);
                }
                return acc;
            }, []);
            if (allForKey.length === 0) {
                delete callbacks[key];
            }
            else {
                callbacks[key] = allForKey;
            }
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
                _handleError(err, key);
            }
        });
        return results;
    }
    function _handleError(exceptionArtifact, key) {
        var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
        if (_userErrorHandler) {
            _userErrorHandler(errParam);
            return;
        }
        var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
        if (options) {
            switch (options.errorHandling) {
                case "log":
                    return console.error(msg);
                case "silent":
                    return;
                case "throw":
                    throw new Error(msg);
            }
        }
        console.error(msg);
    }
    function clear() {
        callbacks = {};
    }
    function clearKey(key) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            return;
        }
        delete callbacks[key];
    }
    return {
        add: add,
        execute: execute,
        clear: clear,
        clearKey: clearKey
    };
}
createRegistry$1.default = createRegistry$1;
var lib$1 = createRegistry$1;


var CallbackRegistryFactory$1 = /*@__PURE__*/getDefaultExportFromCjs$1(lib$1);

class WebWindowModel {
    _id;
    _name;
    _bridge;
    registry = CallbackRegistryFactory$1();
    myCtxKey;
    ctxUnsubscribe;
    me;
    constructor(_id, _name, _bridge) {
        this._id = _id;
        this._name = _name;
        this._bridge = _bridge;
        this.myCtxKey = `___window___${this.id}`;
    }
    get id() {
        return this._id.slice();
    }
    get name() {
        return this._name.slice();
    }
    clean() {
        if (this.ctxUnsubscribe) {
            this.ctxUnsubscribe();
        }
    }
    processSelfFocusEvent(hasFocus) {
        this.me.isFocused = hasFocus;
        this.registry.execute("focus-change", this.me);
    }
    processChannelsChangedEvent(channelNames) {
        this.registry.execute("channels-changed", channelNames);
    }
    async toApi() {
        this.ctxUnsubscribe = await this._bridge.contextLib.subscribe(this.myCtxKey, (data) => this.registry.execute("context-updated", data));
        this.me = {
            id: this.id,
            name: this.name,
            isFocused: false,
            getURL: this.getURL.bind(this),
            moveResize: this.moveResize.bind(this),
            resizeTo: this.resizeTo.bind(this),
            moveTo: this.moveTo.bind(this),
            focus: this.focus.bind(this),
            close: this.close.bind(this),
            getTitle: this.getTitle.bind(this),
            setTitle: this.setTitle.bind(this),
            getBounds: this.getBounds.bind(this),
            getContext: this.getContext.bind(this),
            updateContext: this.updateContext.bind(this),
            setContext: this.setContext.bind(this),
            onContextUpdated: this.onContextUpdated.bind(this),
            onFocusChanged: this.onFocusChanged.bind(this),
            getChannel: this.getChannel.bind(this),
            onChannelsChanged: this.onChannelsChanged.bind(this),
        };
        return this.me;
    }
    async getURL() {
        const result = await this._bridge.send("windows", operations$a.getUrl, { windowId: this.id });
        return result.url;
    }
    onFocusChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to context changes, because the provided callback is not a function!");
        }
        return this.registry.add("focus-change", callback);
    }
    async moveResize(dimension) {
        const targetBounds = runDecoderWithIOError(boundsDecoder, dimension);
        const commandArgs = Object.assign({}, targetBounds, { windowId: this.id, relative: false });
        await this._bridge.send("windows", operations$a.moveResize, commandArgs);
        return this.me;
    }
    async resizeTo(width, height) {
        if (typeof width === "undefined" && typeof height === "undefined") {
            return this.me;
        }
        if (typeof width !== "undefined") {
            runDecoderWithIOError(nonNegativeNumberDecoder$2, width);
        }
        if (typeof height !== "undefined") {
            runDecoderWithIOError(nonNegativeNumberDecoder$2, height);
        }
        const commandArgs = Object.assign({}, { width, height }, { windowId: this.id, relative: true });
        await this._bridge.send("windows", operations$a.moveResize, commandArgs);
        return this.me;
    }
    async moveTo(top, left) {
        if (typeof top === "undefined" && typeof left === "undefined") {
            return this.me;
        }
        if (typeof top !== "undefined") {
            runDecoderWithIOError(number$2(), top);
        }
        if (typeof left !== "undefined") {
            runDecoderWithIOError(number$2(), left);
        }
        const commandArgs = Object.assign({}, { top, left }, { windowId: this.id, relative: true });
        await this._bridge.send("windows", operations$a.moveResize, commandArgs);
        return this.me;
    }
    async focus() {
        if (this.name === "Platform") {
            window.open(undefined, this.id);
        }
        else {
            await this._bridge.send("windows", operations$a.focus, { windowId: this.id });
        }
        return this.me;
    }
    async close() {
        await this._bridge.send("windows", operations$a.close, { windowId: this.id });
        return this.me;
    }
    async getTitle() {
        const result = await this._bridge.send("windows", operations$a.getTitle, { windowId: this.id });
        return result.title;
    }
    async setTitle(title) {
        const ttl = runDecoderWithIOError(nonEmptyStringDecoder$2, title);
        await this._bridge.send("windows", operations$a.setTitle, { windowId: this.id, title: ttl });
        return this.me;
    }
    async getBounds() {
        const result = await this._bridge.send("windows", operations$a.getBounds, { windowId: this.id });
        return result.bounds;
    }
    async getContext() {
        const ctx = await this._bridge.contextLib.get(this.myCtxKey);
        const { ___io___, ...rest } = ctx;
        return rest;
    }
    async updateContext(context) {
        const ctx = runDecoderWithIOError(anyDecoder, context);
        await this._bridge.contextLib.update(this.myCtxKey, ctx);
        return this.me;
    }
    async setContext(context) {
        const ctx = runDecoderWithIOError(anyDecoder, context);
        const current = await this._bridge.contextLib.get(this.myCtxKey);
        const newCtx = current.___io___ ? { ...ctx, ___io___: current.___io___ } : ctx;
        await this._bridge.contextLib.set(this.myCtxKey, newCtx);
        return this.me;
    }
    onContextUpdated(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to context changes, because the provided callback is not a function!");
        }
        const wrappedCallback = (data) => {
            const { ___io___, ...rest } = data;
            callback(rest, this.me);
        };
        return this.registry.add("context-updated", wrappedCallback);
    }
    async getChannel() {
        const result = await this._bridge.send("windows", operations$a.getChannel, { windowId: this.id }, undefined, { includeOperationCheck: true });
        return result.channel;
    }
    onChannelsChanged(callback) {
        return this.registry.add("channels-changed", callback);
    }
}

const commonOperations = {
    operationCheck: { name: "operationCheck", dataDecoder: operationCheckConfigDecoder, resultDecoder: operationCheckResultDecoder },
    getWorkspaceWindowFrameBounds: { name: "getWorkspaceWindowFrameBounds", resultDecoder: workspaceFrameBoundsResultDecoder, dataDecoder: simpleItemIdDecoder }
};

const PromiseWrap = (callback, timeoutMilliseconds, timeoutMessage) => {
    return new Promise((resolve, reject) => {
        let promiseActive = true;
        const timeout = setTimeout(() => {
            if (!promiseActive) {
                return;
            }
            promiseActive = false;
            const message = timeoutMessage || `Promise timeout hit: ${timeoutMilliseconds}`;
            reject(message);
        }, timeoutMilliseconds);
        callback()
            .then((result) => {
            if (!promiseActive) {
                return;
            }
            promiseActive = false;
            clearTimeout(timeout);
            resolve(result);
        })
            .catch((error) => {
            if (!promiseActive) {
                return;
            }
            promiseActive = false;
            clearTimeout(timeout);
            reject(error);
        });
    });
};
const PromisePlus$1 = (executor, timeoutMilliseconds, timeoutMessage) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const message = timeoutMessage || `Promise timeout hit: ${timeoutMilliseconds}`;
            reject(message);
        }, timeoutMilliseconds);
        const providedPromise = new Promise(executor);
        providedPromise
            .then((result) => {
            clearTimeout(timeout);
            resolve(result);
        })
            .catch((error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
};

class WindowsController {
    supportedOperationsNames = [];
    focusEventHandler;
    registry = CallbackRegistryFactory$1();
    platformRegistration;
    ioc;
    bridge;
    publicWindowId;
    allWindowProjections = [];
    me;
    logger;
    isWorkspaceFrame;
    instanceId;
    channelsController;
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("windows.controller.web");
        this.logger.trace("starting the web windows controller");
        this.publicWindowId = ioc.publicWindowId;
        this.addWindowOperationExecutors();
        this.ioc = ioc;
        this.bridge = ioc.bridge;
        this.instanceId = coreGlue.interop.instance.instance;
        this.channelsController = ioc.channelsController;
        this.logger.trace(`set the public window id: ${this.publicWindowId}, set the bridge operations and ioc, registering with the platform now`);
        this.platformRegistration = this.registerWithPlatform();
        await this.platformRegistration;
        await this.initializeFocusTracking();
        this.logger.trace("registration with the platform successful, attaching the windows property to glue and returning");
        const api = this.toApi();
        coreGlue.windows = api;
    }
    handlePlatformShutdown() {
        this.registry.clear();
        this.allWindowProjections = [];
        if (!this.focusEventHandler) {
            return;
        }
        document.removeEventListener("visibilityChange", this.focusEventHandler);
        window.removeEventListener("focus", this.focusEventHandler);
        window.removeEventListener("blur", this.focusEventHandler);
    }
    async handleBridgeMessage(args) {
        await this.platformRegistration;
        const operationName = runDecoderWithIOError(windowOperationTypesDecoder, args.operation);
        const operation = operations$a[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    async open(name, url, options) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        runDecoderWithIOError(nonEmptyStringDecoder$2, url);
        const settings = runDecoderWithIOError(windowOpenSettingsDecoder, options);
        const windowSuccess = await this.bridge.send("windows", operations$a.openWindow, { name, url, options: settings });
        return this.waitForWindowAdded(windowSuccess.windowId);
    }
    list() {
        return this.allWindowProjections.map((projection) => projection.api);
    }
    findById(id) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, id);
        return this.allWindowProjections.find((projection) => projection.id === id)?.api;
    }
    toApi() {
        return {
            open: this.open.bind(this),
            my: this.my.bind(this),
            list: this.list.bind(this),
            findById: this.findById.bind(this),
            onWindowAdded: this.onWindowAdded.bind(this),
            onWindowRemoved: this.onWindowRemoved.bind(this),
            onWindowGotFocus: this.onWindowGotFocus.bind(this),
            onWindowLostFocus: this.onWindowLostFocus.bind(this)
        };
    }
    addWindowOperationExecutors() {
        operations$a.focusChange.execute = this.handleFocusChangeEvent.bind(this);
        operations$a.windowAdded.execute = this.handleWindowAdded.bind(this);
        operations$a.windowRemoved.execute = this.handleWindowRemoved.bind(this);
        operations$a.getBounds.execute = this.handleGetBounds.bind(this);
        operations$a.getFrameBounds.execute = this.handleGetBounds.bind(this);
        operations$a.getTitle.execute = this.handleGetTitle.bind(this);
        operations$a.getUrl.execute = this.handleGetUrl.bind(this);
        operations$a.moveResize.execute = this.handleMoveResize.bind(this);
        operations$a.setTitle.execute = this.handleSetTitle.bind(this);
        operations$a.getChannel.execute = this.handleGetChannel.bind(this);
        operations$a.notifyChannelsChanged.execute = this.handleChannelsChanged.bind(this);
        operations$a.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$a);
    }
    my() {
        return Object.assign({}, this.me);
    }
    onWindowAdded(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to window added, because the provided callback is not a function!");
        }
        return this.registry.add("window-added", callback);
    }
    onWindowRemoved(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to window removed, because the provided callback is not a function!");
        }
        return this.registry.add("window-removed", callback);
    }
    onWindowGotFocus(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onWindowGotFocus, because the provided callback is not a function!");
        }
        return this.registry.add("window-got-focus", callback);
    }
    onWindowLostFocus(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onWindowLostFocus, because the provided callback is not a function!");
        }
        return this.registry.add("window-lost-focus", callback);
    }
    async sayHello() {
        const helloSuccess = await this.bridge.send("windows", operations$a.windowHello, { windowId: this.publicWindowId });
        return helloSuccess;
    }
    async registerWithPlatform() {
        const { windows, isWorkspaceFrame } = await this.sayHello();
        this.isWorkspaceFrame = isWorkspaceFrame;
        this.logger.trace("the platform responded to the hello message");
        if (!this.isWorkspaceFrame && this.publicWindowId) {
            this.logger.trace("i am not treated as a workspace frame, setting my window");
            const myWindow = windows.find((w) => w.windowId === this.publicWindowId);
            if (!myWindow) {
                const windowsInfo = windows.map(w => `${w.windowId}:${w.name}`).join(", ");
                return ioError.raiseError(`Cannot initialize the window library, because I received no information about me -> id: ${this.publicWindowId} name: ${window.name} from the platform: known windows: ${windowsInfo}`);
            }
            const myProjection = await this.ioc.buildWebWindow(this.publicWindowId, myWindow.name);
            this.me = myProjection.api;
            this.allWindowProjections.push(myProjection);
        }
        const currentWindows = await Promise.all(windows
            .filter((w) => w.windowId !== this.publicWindowId)
            .map((w) => this.ioc.buildWebWindow(w.windowId, w.name)));
        this.logger.trace("all windows projections are completed, building the list collection");
        this.allWindowProjections.push(...currentWindows);
    }
    async handleFocusChangeEvent(focusData) {
        const foundProjection = this.allWindowProjections.find((projection) => projection.id === focusData.windowId);
        if (!foundProjection) {
            return;
        }
        foundProjection.model.processSelfFocusEvent(focusData.hasFocus);
        const keyToExecute = focusData.hasFocus ? "window-got-focus" : "window-lost-focus";
        this.registry.execute(keyToExecute, foundProjection.api);
    }
    async handleWindowAdded(data) {
        if (this.allWindowProjections.some((projection) => projection.id === data.windowId)) {
            return;
        }
        const webWindowProjection = await this.ioc.buildWebWindow(data.windowId, data.name);
        this.allWindowProjections.push(webWindowProjection);
        this.registry.execute("window-added", webWindowProjection.api);
    }
    async handleWindowRemoved(data) {
        const removed = this.allWindowProjections.find((w) => w.id === data.windowId);
        if (!removed) {
            return;
        }
        this.allWindowProjections = this.allWindowProjections.filter((w) => w.id !== data.windowId);
        removed.model.clean();
        this.registry.execute("window-removed", removed.api);
    }
    async handleGetBounds() {
        if (!this.me && !this.isWorkspaceFrame) {
            return ioError.raiseError("This window cannot report it's bounds, because it is not a Glue Window, most likely because it is an iframe");
        }
        return {
            windowId: this.isWorkspaceFrame ? "noop" : this.me.id,
            bounds: {
                top: window.screenTop,
                left: window.screenLeft,
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
    async handleGetTitle() {
        if (!this.me) {
            return ioError.raiseError("This window cannot report it's title, because it is not a Glue Window, most likely because it is an iframe");
        }
        return {
            windowId: this.me.id,
            title: document.title
        };
    }
    async handleGetUrl() {
        if (!this.me) {
            return ioError.raiseError("This window cannot report it's url, because it is not a Glue Window, most likely because it is an iframe");
        }
        return {
            windowId: this.me.id,
            url: window.location.href
        };
    }
    async handleMoveResize(config) {
        const targetTop = typeof config.top === "number" ? config.top :
            config.relative ? 0 : window.screenTop;
        const targetLeft = typeof config.left === "number" ? config.left :
            config.relative ? 0 : window.screenLeft;
        const targetHeight = typeof config.height === "number" ? config.height :
            config.relative ? 0 : window.innerHeight;
        const targetWidth = typeof config.width === "number" ? config.width :
            config.relative ? 0 : window.innerWidth;
        const moveMethod = config.relative ? window.moveBy : window.moveTo;
        const resizeMethod = config.relative ? window.resizeBy : window.resizeTo;
        moveMethod(targetLeft, targetTop);
        resizeMethod(targetWidth, targetHeight);
    }
    async handleSetTitle(config) {
        document.title = config.title;
    }
    async initializeFocusTracking() {
        if (this.isWorkspaceFrame) {
            this.logger.trace("Ignoring the focus tracking, because this client is a workspace frame");
            return;
        }
        try {
            await this.bridge.send("windows", commonOperations.operationCheck, { operation: "focusChange" });
        }
        catch (error) {
            this.logger.warn("The platform of this client is outdated and does not support focus tracking, disabling focus events for this client.");
            return;
        }
        const hasFocus = document.hasFocus();
        await this.transmitFocusChange(true);
        if (!hasFocus) {
            await this.transmitFocusChange(false);
        }
        this.defineEventListeners();
    }
    processFocusEvent() {
        const hasFocus = document.hasFocus();
        this.transmitFocusChange(hasFocus);
    }
    waitForWindowAdded(windowId) {
        const foundWindow = this.allWindowProjections.find((projection) => projection.id === windowId);
        if (foundWindow) {
            return Promise.resolve(foundWindow.api);
        }
        return PromisePlus$1((resolve) => {
            const unsubscribe = this.onWindowAdded((addedWindow) => {
                if (addedWindow.id === windowId) {
                    unsubscribe();
                    resolve(addedWindow);
                }
            });
        }, 30000, `Timed out waiting for ${windowId} to be announced`);
    }
    async transmitFocusChange(hasFocus) {
        const eventData = {
            windowId: this.me?.id || `iframe-${this.instanceId}`,
            hasFocus
        };
        if (this.me) {
            this.me.isFocused = hasFocus;
        }
        await this.bridge.send("windows", operations$a.focusChange, eventData);
    }
    defineEventListeners() {
        this.focusEventHandler = this.processFocusEvent.bind(this);
        document.addEventListener("visibilityChange", this.focusEventHandler);
        window.addEventListener("focus", this.focusEventHandler);
        window.addEventListener("blur", this.focusEventHandler);
    }
    async handleGetChannel() {
        if (!this.me) {
            return ioError.raiseError("This window cannot report it's channel, because it is not a Glue Window, most likely because it is an iframe");
        }
        const channel = this.channelsController.my();
        return {
            ...(channel ? { channel } : {}),
        };
    }
    async handleChannelsChanged(data) {
        const windowProjection = this.allWindowProjections.find((projection) => projection.id === data.windowId);
        windowProjection?.model.processChannelsChangedEvent(data.channelNames);
    }
}

const GlueWebPlatformControlName = "T42.Web.Platform.Control";
const GlueWebPlatformStreamName = "T42.Web.Platform.Stream";
const GlueClientControlName = "T42.Web.Client.Control";
const GlueCorePlusThemesStream = "T42.Core.Plus.Themes.Stream";

class GlueBridge {
    coreGlue;
    communicationId;
    platformMethodTimeoutMs = 10000;
    controllers;
    sub;
    running;
    constructor(coreGlue, communicationId) {
        this.coreGlue = coreGlue;
        this.communicationId = communicationId;
    }
    get contextLib() {
        return this.coreGlue.contexts;
    }
    get interopInstance() {
        return this.coreGlue.interop.instance.instance;
    }
    async stop() {
        this.running = false;
        this.sub.close();
        await this.coreGlue.interop.unregister(GlueClientControlName);
    }
    async start(controllers) {
        this.running = true;
        this.controllers = controllers;
        await Promise.all([
            this.checkWaitMethod(GlueWebPlatformControlName),
            this.checkWaitMethod(GlueWebPlatformStreamName)
        ]);
        const systemId = this.communicationId;
        const [sub] = await Promise.all([
            this.coreGlue.interop.subscribe(GlueWebPlatformStreamName, systemId ? { target: { instance: this.communicationId } } : undefined),
            this.coreGlue.interop.registerAsync(GlueClientControlName, (args, _, success, error) => this.passMessageController(args, success, error))
        ]);
        this.sub = sub;
        this.sub.onData((pkg) => this.passMessageController(pkg.data));
    }
    getInteropInstance(windowId) {
        const result = this.coreGlue.interop.servers().find((s) => s.windowId && s.windowId === windowId);
        return {
            application: result?.application,
            applicationName: result?.applicationName,
            peerId: result?.peerId,
            instance: result?.instance,
            windowId: result?.windowId
        };
    }
    async send(domain, operation, operationData, options, webOptions) {
        if (operation.dataDecoder) {
            try {
                operation.dataDecoder.runWithException(operationData);
            }
            catch (error) {
                return ioError.raiseError(`Unexpected Web->Platform outgoing validation error: ${error.message}, for operation: ${operation.name} and input: ${JSON.stringify(error.input)}`);
            }
        }
        const operationSupported = webOptions?.includeOperationCheck ?
            (await this.checkOperationSupported(domain, operation)).isSupported :
            true;
        if (!operationSupported) {
            return ioError.raiseError(`Cannot complete operation: ${operation.name} for domain: ${domain} because this client is connected to a platform which does not support it`);
        }
        try {
            const operationResult = await this.transmitMessage(domain, operation, operationData, options);
            if (operation.resultDecoder) {
                operation.resultDecoder.runWithException(operationResult);
            }
            return operationResult;
        }
        catch (error) {
            if (error?.kind) {
                return ioError.raiseError(`Unexpected Web<-Platform incoming validation error: ${error.message}, for operation: ${operation.name} and input: ${JSON.stringify(error.input)}`);
            }
            return ioError.raiseError(error);
        }
    }
    async createNotificationsSteam() {
        const streamExists = this.coreGlue.interop.methods().some((method) => method.name === GlueCorePlusThemesStream);
        if (!streamExists) {
            return ioError.raiseError("Cannot subscribe to theme changes, because the underlying interop stream does not exist. Most likely this is the case when this client is not connected to Core Plus.");
        }
        return this.coreGlue.interop.subscribe(GlueCorePlusThemesStream, this.communicationId ? { target: { instance: this.communicationId } } : undefined);
    }
    async checkOperationSupported(domain, operation) {
        try {
            const result = await this.send(domain, commonOperations.operationCheck, { operation: operation.name });
            return result;
        }
        catch (error) {
            return { isSupported: false };
        }
    }
    checkWaitMethod(name) {
        return PromisePlus$1((resolve) => {
            const hasMethod = this.coreGlue.interop.methods().some((method) => {
                const nameMatch = method.name === name;
                const serverMatch = this.communicationId ?
                    method.getServers().some((server) => server.instance === this.communicationId) :
                    true;
                return nameMatch && serverMatch;
            });
            if (hasMethod) {
                return resolve();
            }
            const unSub = this.coreGlue.interop.serverMethodAdded((data) => {
                const method = data.method;
                const server = data.server;
                const serverMatch = this.communicationId ?
                    server.instance === this.communicationId :
                    true;
                if (method.name === name && serverMatch) {
                    unSub();
                    resolve();
                }
            });
        }, this.platformMethodTimeoutMs, `Cannot initiate Glue Web, because a system method's discovery timed out: ${name}`);
    }
    passMessageController(args, success, error) {
        const decodeResult = libDomainDecoder.run(args.domain);
        if (!decodeResult.ok) {
            if (error) {
                error(`Cannot execute this client control, because of domain validation error: ${JSON.stringify(decodeResult.error)}`);
            }
            return;
        }
        const domain = decodeResult.result;
        this.controllers[domain]
            .handleBridgeMessage(args)
            .then((resolutionData) => {
            if (success) {
                success(resolutionData);
            }
        })
            .catch((err) => {
            if (error) {
                error(err);
            }
            console.warn(err);
        });
    }
    async transmitMessage(domain, operation, data, options) {
        const messageData = { domain, data, operation: operation.name };
        let invocationResult;
        const baseErrorMessage = `Internal Platform Communication Error. Attempted operation: ${JSON.stringify(operation.name)} with data: ${JSON.stringify(data)}. `;
        const systemId = this.communicationId;
        try {
            if (!this.running) {
                throw new Error("Cannot send a control message, because the platform shut down");
            }
            invocationResult = await this.coreGlue.interop.invoke(GlueWebPlatformControlName, messageData, systemId ? { instance: this.communicationId } : undefined, options);
            if (!invocationResult) {
                throw new Error("Received unsupported result from the platform - empty result");
            }
            if (!Array.isArray(invocationResult.all_return_values) || invocationResult.all_return_values.length === 0) {
                throw new Error("Received unsupported result from the platform - empty values collection");
            }
        }
        catch (error) {
            if (error && error.all_errors && error.all_errors.length) {
                const invocationErrorMessage = error.all_errors[0].message;
                throw new Error(`${baseErrorMessage} -> Inner message: ${invocationErrorMessage}`);
            }
            throw new Error(`${baseErrorMessage} -> Inner message: ${error.message}`);
        }
        return invocationResult.all_return_values[0].returned;
    }
}

const operations$9 = {
    appHello: { name: "appHello", dataDecoder: windowHelloDecoder, resultDecoder: appHelloSuccessDecoder },
    appDirectoryStateChange: { name: "appDirectoryStateChange", dataDecoder: appDirectoryStateChangeDecoder },
    instanceStarted: { name: "instanceStarted", dataDecoder: instanceDataDecoder },
    instanceStopped: { name: "instanceStopped", dataDecoder: instanceDataDecoder },
    applicationStart: { name: "applicationStart", dataDecoder: applicationStartConfigDecoder, resultDecoder: instanceDataDecoder },
    instanceStop: { name: "instanceStop", dataDecoder: basicInstanceDataDecoder },
    import: { name: "import" },
    remove: { name: "remove", dataDecoder: appRemoveConfigDecoder },
    export: { name: "export", resultDecoder: appsExportOperationDecoder },
    clear: { name: "clear" },
    operationCheck: { name: "operationCheck" }
};

class AppManagerController {
    me;
    supportedOperationsNames = [];
    baseApplicationsTimeoutMS = 60000;
    appImportTimeoutMS = 20;
    registry = CallbackRegistryFactory$1();
    ioc;
    bridge;
    publicWindowId;
    applications = [];
    instances = [];
    platformRegistration;
    logger;
    channelsController;
    sessionController;
    interop;
    handlePlatformShutdown() {
        this.registry.clear();
        this.applications = [];
        this.instances = [];
        delete this.me;
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("appManger.controller.web");
        this.logger.trace("starting the web appManager controller");
        this.publicWindowId = ioc.publicWindowId;
        this.addOperationsExecutors();
        this.ioc = ioc;
        this.bridge = ioc.bridge;
        this.channelsController = ioc.channelsController;
        this.sessionController = ioc.sessionController;
        this.interop = coreGlue.interop;
        this.platformRegistration = this.registerWithPlatform();
        await this.platformRegistration;
        this.logger.trace("registration with the platform successful, attaching the appManager property to glue and returning");
        const api = this.toApi();
        coreGlue.appManager = api;
    }
    async handleBridgeMessage(args) {
        await this.platformRegistration;
        const operationName = runDecoderWithIOError(appManagerOperationTypesDecoder, args.operation);
        const operation = operations$9[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    onInstanceStarted(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onInstanceStarted requires a single argument of type function");
        }
        return this.registry.add("instance-started", callback, this.instances);
    }
    onInstanceStopped(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onInstanceStopped requires a single argument of type function");
        }
        return this.registry.add("instance-stopped", callback);
    }
    async startApplication(appName, context, options) {
        const channels = await this.channelsController.all();
        if (options?.channelId && !channels.includes(options.channelId)) {
            return ioError.raiseError(`The channel with name "${options.channelId}" doesn't exist!`);
        }
        const startOptions = {
            name: appName,
            waitForAGMReady: options?.waitForAGMReady ?? true,
            context,
            top: options?.top,
            left: options?.left,
            width: options?.width,
            height: options?.height,
            relativeTo: options?.relativeTo,
            relativeDirection: options?.relativeDirection,
            id: options?.reuseId,
            forceChromeTab: options?.forceTab,
            layoutComponentId: options?.layoutComponentId,
            channelId: options?.channelId,
            startReason: {
                originApp: {
                    name: this.me?.application.name,
                    interopInstance: this.interop.instance.instance
                }
            }
        };
        if (options?.originIntentRequest) {
            startOptions.startReason.intentRequest = options.originIntentRequest;
        }
        const openResult = await this.bridge.send("appManager", operations$9.applicationStart, startOptions);
        const app = this.applications.find((a) => a.name === openResult.applicationName);
        return this.ioc.buildInstance(openResult, app);
    }
    getApplication(name) {
        const verifiedName = runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        return this.applications.find((app) => app.name === verifiedName);
    }
    getInstances() {
        return this.instances.slice();
    }
    onAppAdded(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onAppAdded requires a single argument of type function");
        }
        return this.registry.add("application-added", callback, this.applications);
    }
    onAppRemoved(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onAppRemoved requires a single argument of type function");
        }
        return this.registry.add("application-removed", callback);
    }
    toApi() {
        const api = {
            myInstance: this.me,
            inMemory: {
                import: this.importApps.bind(this),
                remove: this.remove.bind(this),
                export: this.exportApps.bind(this),
                clear: this.clear.bind(this)
            },
            application: this.getApplication.bind(this),
            applications: this.getApplications.bind(this),
            instances: this.getInstances.bind(this),
            onAppAdded: this.onAppAdded.bind(this),
            onAppChanged: this.onAppChanged.bind(this),
            onAppRemoved: this.onAppRemoved.bind(this),
            onInstanceStarted: this.onInstanceStarted.bind(this),
            onInstanceStopped: this.onInstanceStopped.bind(this)
        };
        return api;
    }
    addOperationsExecutors() {
        operations$9.appDirectoryStateChange.execute = this.handleAppDirectoryStateChange.bind(this);
        operations$9.instanceStarted.execute = this.handleInstanceStartedMessage.bind(this);
        operations$9.instanceStopped.execute = this.handleInstanceStoppedMessage.bind(this);
        operations$9.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$9);
    }
    async handleAppDirectoryStateChange(data) {
        data.appsAdded.forEach(this.handleApplicationAddedMessage.bind(this));
        data.appsChanged.forEach(this.handleApplicationChangedMessage.bind(this));
        data.appsRemoved.forEach(this.handleApplicationRemovedMessage.bind(this));
    }
    onAppChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onAppChanged requires a single argument of type function");
        }
        return this.registry.add("application-changed", callback);
    }
    async handleApplicationAddedMessage(appData) {
        if (this.applications.some((app) => app.name === appData.name)) {
            return;
        }
        const app = await this.ioc.buildApplication(appData, []);
        const instances = this.instances.filter((instance) => instance.application.name === app.name);
        app.instances.push(...instances);
        this.applications.push(app);
        this.registry.execute("application-added", app);
    }
    async handleApplicationRemovedMessage(appData) {
        const appIndex = this.applications.findIndex((app) => app.name === appData.name);
        if (appIndex < 0) {
            return;
        }
        const app = this.applications[appIndex];
        this.applications.splice(appIndex, 1);
        this.registry.execute("application-removed", app);
    }
    async handleApplicationChangedMessage(appData) {
        const app = this.applications.find((app) => app.name === appData.name);
        if (!app) {
            return this.handleApplicationAddedMessage(appData);
        }
        app.title = appData.title;
        app.version = appData.version;
        app.icon = appData.icon;
        app.caption = appData.caption;
        app.userProperties = appData.userProperties;
        this.registry.execute("application-changed", app);
    }
    async handleInstanceStartedMessage(instanceData) {
        if (this.instances.some((instance) => instance.id === instanceData.id)) {
            return;
        }
        const application = this.applications.find((app) => app.name === instanceData.applicationName);
        if (!application) {
            return ioError.raiseError(`Cannot add instance: ${instanceData.id}, because there is no application definition associated with it`);
        }
        const instance = this.ioc.buildInstance(instanceData, application);
        this.instances.push(instance);
        application.instances.push(instance);
        this.registry.execute("instance-started", instance);
    }
    async handleInstanceStoppedMessage(instanceData) {
        const instance = this.instances.find((i) => i.id === instanceData.id);
        if (instance) {
            const instIdx = this.instances.findIndex((inst) => inst.id === instanceData.id);
            this.instances.splice(instIdx, 1);
        }
        const application = this.applications.find((app) => app.instances.some((inst) => inst.id === instanceData.id));
        if (application) {
            const instIdxApps = application.instances.findIndex((inst) => inst.id === instanceData.id);
            application.instances.splice(instIdxApps, 1);
        }
        if (!instance) {
            return;
        }
        this.registry.execute("instance-stopped", instance);
    }
    async importApps(definitions, mode = "replace") {
        runDecoderWithIOError(importModeDecoder, mode);
        if (!Array.isArray(definitions)) {
            return ioError.raiseError("Import must be called with an array of definitions");
        }
        if (definitions.length > 10000) {
            return ioError.raiseError("Cannot import more than 10000 app definitions in Glue42 Core.");
        }
        const parseResult = definitions.reduce((soFar, definition) => {
            const { isValid, error } = this.isValidDefinition(definition);
            if (!isValid) {
                soFar.invalid.push({ app: definition?.name, error: error ?? `Provided definition is invalid ${JSON.stringify(definition)}` });
            }
            else {
                soFar.valid.push(definition);
            }
            return soFar;
        }, { valid: [], invalid: [] });
        const responseTimeout = this.baseApplicationsTimeoutMS + this.appImportTimeoutMS * parseResult.valid.length;
        await this.bridge.send("appManager", operations$9.import, { definitions: parseResult.valid, mode }, { methodResponseTimeoutMs: responseTimeout });
        return {
            imported: parseResult.valid.map((valid) => valid.name),
            errors: parseResult.invalid
        };
    }
    isValidDefinition(definition) {
        const isFdc3V2Definition = definition?.appId && definition?.details;
        if (isFdc3V2Definition) {
            const decodeResult = decoders.fdc3.v2DefinitionDecoder.run(definition);
            return { isValid: decodeResult.ok, error: decodeResult.ok ? undefined : `Received invalid FDC3 v2 definition. Error: ${JSON.stringify(decodeResult.error)}` };
        }
        const isFdc3V1Definition = definition?.appId && definition?.manifest;
        if (isFdc3V1Definition) {
            const decodeResult = decoders.fdc3.v1DefinitionDecoder.run(definition);
            return { isValid: decodeResult.ok, error: decodeResult.ok ? undefined : `Received invalid FDC3 v1 definition. Error: ${JSON.stringify(decodeResult.error)}` };
        }
        const decodeResult = applicationDefinitionDecoder.run(definition);
        return { isValid: decodeResult.ok, error: decodeResult.ok ? undefined : `Received invalid definition. Error: ${JSON.stringify(decodeResult.error)}` };
    }
    async remove(name) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        await this.bridge.send("appManager", operations$9.remove, { name }, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
    }
    async clear() {
        await this.bridge.send("appManager", operations$9.clear, undefined, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
    }
    async exportApps() {
        const response = await this.bridge.send("appManager", operations$9.export, undefined, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
        return response.definitions;
    }
    getApplications() {
        return this.applications.slice();
    }
    async joinInitialChannel(initialChannelId) {
        try {
            await this.channelsController.join(initialChannelId);
        }
        catch (error) {
            this.logger.warn(`Application instance ${this.me} was unable to join the ${initialChannelId} channel. Reason: ${JSON.stringify(error)}`);
        }
    }
    async registerWithPlatform() {
        const result = await this.bridge.send("appManager", operations$9.appHello, { windowId: this.publicWindowId }, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
        this.logger.trace("the platform responded to the hello message with a full list of apps");
        this.applications = await Promise.all(result.apps.map((app) => this.ioc.buildApplication(app, app.instances)));
        this.instances = this.applications.reduce((instancesSoFar, app) => {
            instancesSoFar.push(...app.instances);
            return instancesSoFar;
        }, []);
        this.me = this.findMyInstance();
        this.logger.trace(`all applications were parsed and saved. I am ${this.me ? "NOT a" : "a"} valid instance`);
        const { channels: channelsStorageData } = this.sessionController.getWindowData();
        const channels = channelsStorageData ? channelsStorageData.currentNames : [result.initialChannelId];
        if (!channels?.length) {
            return;
        }
        await Promise.all(channels.map((channel) => channel ? this.joinInitialChannel(channel) : Promise.resolve()));
    }
    findMyInstance() {
        for (const app of this.applications) {
            const foundInstance = app.instances.find((instance) => instance.id === this.publicWindowId);
            if (foundInstance) {
                return foundInstance;
            }
        }
        return undefined;
    }
}

class InstanceModel {
    data;
    bridge;
    application;
    me;
    myCtxKey;
    constructor(data, bridge, application) {
        this.data = data;
        this.bridge = bridge;
        this.application = application;
        this.myCtxKey = `___instance___${this.data.id}`;
    }
    toApi() {
        const agm = this.bridge.getInteropInstance(this.data.id);
        const api = {
            id: this.data.id,
            agm,
            application: this.application,
            stop: this.stop.bind(this),
            getContext: this.getContext.bind(this)
        };
        this.me = Object.freeze(api);
        return this.me;
    }
    async getContext() {
        return this.bridge.contextLib.get(this.myCtxKey);
    }
    async stop() {
        await this.bridge.send("appManager", operations$9.instanceStop, { id: this.data.id });
    }
}

class ApplicationModel {
    data;
    instances;
    controller;
    me;
    constructor(data, instances, controller) {
        this.data = data;
        this.instances = instances;
        this.controller = controller;
    }
    toApi() {
        const api = {
            name: this.data.name,
            title: this.data.title,
            version: this.data.version,
            icon: this.data.icon,
            caption: this.data.caption,
            userProperties: this.data.userProperties,
            instances: this.instances,
            start: this.start.bind(this),
            onInstanceStarted: this.onInstanceStarted.bind(this),
            onInstanceStopped: this.onInstanceStopped.bind(this)
        };
        this.me = api;
        return this.me;
    }
    onInstanceStarted(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("OnInstanceStarted requires a single argument of type function");
        }
        return this.controller.onInstanceStarted((instance) => {
            if (instance.application.name === this.data.name) {
                callback(instance);
            }
        });
    }
    onInstanceStopped(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("OnInstanceStarted requires a single argument of type function");
        }
        return this.controller.onInstanceStopped((instance) => {
            if (instance.application.name === this.data.name) {
                callback(instance);
            }
        });
    }
    async start(context, options) {
        const verifiedContext = runDecoderWithIOError(startApplicationContextDecoder, context);
        const verifiedOptions = runDecoderWithIOError(startApplicationOptionsDecoder, options);
        return this.controller.startApplication(this.data.name, verifiedContext, verifiedOptions);
    }
}

const operations$8 = {
    layoutAdded: { name: "layoutAdded", dataDecoder: glueLayoutDecoder },
    layoutChanged: { name: "layoutChanged", dataDecoder: glueLayoutDecoder },
    layoutRemoved: { name: "layoutRemoved", dataDecoder: glueLayoutDecoder },
    layoutRestored: { name: "layoutRestored", dataDecoder: glueLayoutDecoder },
    defaultLayoutChanged: { name: "defaultLayoutChanged", dataDecoder: defaultGlobalChangedDecoder },
    layoutRenamed: { name: "layoutRenamed", dataDecoder: renamedLayoutNotificationDecoder },
    get: { name: "get", dataDecoder: simpleLayoutConfigDecoder, resultDecoder: optionalSimpleLayoutResult },
    getAll: { name: "getAll", dataDecoder: getAllLayoutsConfigDecoder, resultDecoder: allLayoutsSummariesResultDecoder },
    export: { name: "export", dataDecoder: getAllLayoutsConfigDecoder, resultDecoder: allLayoutsFullConfigDecoder },
    import: { name: "import", dataDecoder: layoutsImportConfigDecoder },
    remove: { name: "remove", dataDecoder: simpleLayoutConfigDecoder },
    rename: { name: "rename", dataDecoder: renameLayoutConfigDecoder, resultDecoder: layoutResultDecoder },
    save: { name: "save", dataDecoder: saveLayoutConfigDecoder, resultDecoder: simpleLayoutResultDecoder },
    restore: { name: "restore", dataDecoder: restoreLayoutConfigDecoder },
    clientSaveRequest: { name: "clientSaveRequest", dataDecoder: platformSaveRequestConfigDecoder, resultDecoder: saveRequestClientResponseDecoder },
    getGlobalPermissionState: { name: "getGlobalPermissionState", resultDecoder: permissionStateResultDecoder },
    requestGlobalPermission: { name: "requestGlobalPermission", resultDecoder: simpleAvailabilityResultDecoder },
    checkGlobalActivated: { name: "checkGlobalActivated", resultDecoder: simpleAvailabilityResultDecoder },
    getDefaultGlobal: { name: "getDefaultGlobal", resultDecoder: optionalSimpleLayoutResult },
    setDefaultGlobal: { name: "setDefaultGlobal", dataDecoder: setDefaultGlobalConfigDecoder },
    clearDefaultGlobal: { name: "clearDefaultGlobal" },
    getCurrent: { name: "getCurrent", resultDecoder: optionalSimpleLayoutResult },
    updateMetadata: { name: "updateMetadata", dataDecoder: updateLayoutMetadataConfigDecoder },
    operationCheck: { name: "operationCheck" }
};

class LayoutsController {
    supportedOperationsNames = [];
    defaultLayoutRestoreTimeoutMS = 120000;
    registry = CallbackRegistryFactory$1();
    bridge;
    logger;
    windowsController;
    saveRequestSubscription;
    handlePlatformShutdown() {
        this.registry.clear();
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("layouts.controller.web");
        this.logger.trace("starting the web layouts controller");
        this.bridge = ioc.bridge;
        this.windowsController = ioc.windowsController;
        this.addOperationsExecutors();
        const api = this.toApi();
        this.logger.trace("no need for platform registration, attaching the layouts property to glue and returning");
        coreGlue.layouts = api;
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(layoutsOperationTypesDecoder, args.operation);
        const operation = operations$8[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    toApi() {
        const api = {
            get: this.get.bind(this),
            getAll: this.getAll.bind(this),
            getCurrentLayout: this.getCurrentLayout.bind(this),
            export: this.exportLayouts.bind(this),
            import: this.importLayouts.bind(this),
            save: this.save.bind(this),
            restore: this.restore.bind(this),
            remove: this.remove.bind(this),
            onAdded: this.onAdded.bind(this),
            onChanged: this.onChanged.bind(this),
            onRemoved: this.onRemoved.bind(this),
            onDefaultGlobalChanged: this.onDefaultGlobalChanged.bind(this),
            onSaveRequested: this.subscribeOnSaveRequested.bind(this),
            getMultiScreenPermissionState: this.getGlobalPermissionState.bind(this),
            requestMultiScreenPermission: this.requestGlobalPermission.bind(this),
            getGlobalTypeState: this.checkGlobalActivated.bind(this),
            getDefaultGlobal: this.getDefaultGlobal.bind(this),
            setDefaultGlobal: this.setDefaultGlobal.bind(this),
            clearDefaultGlobal: this.clearDefaultGlobal.bind(this),
            rename: this.rename.bind(this),
            onRenamed: this.onRenamed.bind(this),
            onRestored: this.onRestored.bind(this),
            updateMetadata: this.updateMetadata.bind(this)
        };
        return Object.freeze(api);
    }
    addOperationsExecutors() {
        operations$8.layoutAdded.execute = this.handleOnAdded.bind(this);
        operations$8.layoutChanged.execute = this.handleOnChanged.bind(this);
        operations$8.layoutRemoved.execute = this.handleOnRemoved.bind(this);
        operations$8.layoutRenamed.execute = this.handleOnRenamed.bind(this);
        operations$8.layoutRestored.execute = this.handleOnRestored.bind(this);
        operations$8.defaultLayoutChanged.execute = this.handleOnDefaultChanged.bind(this);
        operations$8.clientSaveRequest.execute = this.handleSaveRequest.bind(this);
        operations$8.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$8);
    }
    async get(name, type) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        runDecoderWithIOError(layoutTypeDecoder, type);
        const result = await this.bridge.send("layouts", operations$8.get, { name, type });
        return result.layout;
    }
    async getCurrentLayout() {
        const result = await this.bridge.send("layouts", operations$8.getCurrent, undefined);
        return result.layout;
    }
    async getAll(type) {
        runDecoderWithIOError(layoutTypeDecoder, type);
        const result = await this.bridge.send("layouts", operations$8.getAll, { type });
        return result.summaries;
    }
    async exportLayouts(type) {
        runDecoderWithIOError(layoutTypeDecoder, type);
        const result = await this.bridge.send("layouts", operations$8.export, { type });
        return result.layouts;
    }
    async importLayouts(layouts, mode = "replace") {
        runDecoderWithIOError(importModeDecoder, mode);
        if (!Array.isArray(layouts)) {
            return ioError.raiseError("Import must be called with an array of layouts");
        }
        if (layouts.length > 1000) {
            return ioError.raiseError("Cannot import more than 1000 layouts at once in Glue42 Core.");
        }
        const parseResult = layouts.reduce((soFar, layout) => {
            const decodeResult = glueLayoutDecoder.run(layout);
            if (decodeResult.ok) {
                soFar.valid.push(layout);
            }
            else {
                this.logger.warn(`A layout with name: ${layout.name} was not imported, because of error: ${JSON.stringify(decodeResult.error)}`);
            }
            return soFar;
        }, { valid: [] });
        const layoutsToImport = layouts.filter((layout) => parseResult.valid.some((validLayout) => validLayout.name === layout.name));
        await this.bridge.send("layouts", operations$8.import, { layouts: layoutsToImport, mode });
    }
    async save(layout) {
        runDecoderWithIOError(newLayoutOptionsDecoder, layout);
        const saveResult = await this.bridge.send("layouts", operations$8.save, { layout });
        return saveResult.layout;
    }
    async restore(options) {
        runDecoderWithIOError(restoreOptionsDecoder, options);
        const invocationTimeout = options.timeout ? options.timeout * 2 : this.defaultLayoutRestoreTimeoutMS;
        await this.bridge.send("layouts", operations$8.restore, { layout: options }, { methodResponseTimeoutMs: invocationTimeout });
    }
    async remove(type, name) {
        runDecoderWithIOError(layoutTypeDecoder, type);
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        await this.bridge.send("layouts", operations$8.remove, { type, name });
    }
    async handleSaveRequest(config) {
        const response = {};
        if (this.saveRequestSubscription) {
            try {
                const onSaveRequestResponse = this.saveRequestSubscription(config);
                response.windowContext = onSaveRequestResponse?.windowContext;
            }
            catch (error) {
                this.logger.warn(`An error was thrown by the onSaveRequested callback, ignoring the callback: ${JSON.stringify(error)}`);
            }
        }
        return response;
    }
    async getGlobalPermissionState() {
        const requestResult = await this.bridge.send("layouts", operations$8.getGlobalPermissionState, undefined);
        return requestResult;
    }
    async requestGlobalPermission() {
        const currentState = (await this.getGlobalPermissionState()).state;
        if (currentState === "denied") {
            return { permissionGranted: false };
        }
        if (currentState === "granted") {
            return { permissionGranted: true };
        }
        const myWindow = this.windowsController.my();
        const globalNamespace = window.glue42core || window.iobrowser;
        const amIWorkspaceFrame = globalNamespace.isPlatformFrame;
        if (myWindow.name !== "Platform" && !amIWorkspaceFrame) {
            return ioError.raiseError("Cannot request permission for multi-window placement from any app other than the Platform.");
        }
        const requestResult = await this.bridge.send("layouts", operations$8.requestGlobalPermission, undefined, { methodResponseTimeoutMs: 180000 });
        return { permissionGranted: requestResult.isAvailable };
    }
    async checkGlobalActivated() {
        const requestResult = await this.bridge.send("layouts", operations$8.checkGlobalActivated, undefined);
        return { activated: requestResult.isAvailable };
    }
    async getDefaultGlobal() {
        const requestResult = await this.bridge.send("layouts", operations$8.getDefaultGlobal, undefined, undefined, { includeOperationCheck: true });
        return requestResult.layout;
    }
    async setDefaultGlobal(name) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        await this.bridge.send("layouts", operations$8.setDefaultGlobal, { name }, undefined, { includeOperationCheck: true });
    }
    async clearDefaultGlobal() {
        await this.bridge.send("layouts", operations$8.clearDefaultGlobal, undefined, undefined, { includeOperationCheck: true });
    }
    async rename(layout, newName) {
        runDecoderWithIOError(glueLayoutDecoder, layout);
        runDecoderWithIOError(nonEmptyStringDecoder$2, newName);
        const result = await this.bridge.send("layouts", operations$8.rename, { layout, newName }, undefined, { includeOperationCheck: true });
        return result;
    }
    async updateMetadata(layout) {
        runDecoderWithIOError(glueLayoutDecoder, layout);
        await this.bridge.send("layouts", operations$8.updateMetadata, { layout }, undefined, { includeOperationCheck: true });
    }
    onAdded(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onAdded, because the provided callback is not a function!");
        }
        this.exportLayouts("Global").then((layouts) => layouts.forEach((layout) => callback(layout))).catch(() => { });
        this.exportLayouts("Workspace").then((layouts) => layouts.forEach((layout) => callback(layout))).catch(() => { });
        return this.registry.add(operations$8.layoutAdded.name, callback);
    }
    onChanged(callback) {
        return this.registry.add(operations$8.layoutChanged.name, callback);
    }
    onDefaultGlobalChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onDefaultGlobalChanged, because the provided callback is not a function!");
        }
        this.getDefaultGlobal().then((layout) => callback(layout ? { name: layout.name } : undefined)).catch(() => { });
        return this.registry.add(operations$8.defaultLayoutChanged.name, callback);
    }
    onRemoved(callback) {
        return this.registry.add(operations$8.layoutRemoved.name, callback);
    }
    onRenamed(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onRenamed, because the provided callback is not a function!");
        }
        return this.registry.add(operations$8.layoutRenamed.name, callback);
    }
    onRestored(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onRestored, because the provided callback is not a function!");
        }
        return this.registry.add(operations$8.layoutRestored.name, callback);
    }
    subscribeOnSaveRequested(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onSaveRequested, because the provided argument is not a valid callback function.");
        }
        if (this.saveRequestSubscription) {
            return ioError.raiseError("Cannot subscribe to onSaveRequested, because this client has already subscribed and only one subscription is supported. Consider unsubscribing from the initial one.");
        }
        this.saveRequestSubscription = callback;
        return () => {
            delete this.saveRequestSubscription;
        };
    }
    async handleOnAdded(layout) {
        this.registry.execute(operations$8.layoutAdded.name, layout);
    }
    async handleOnChanged(layout) {
        this.registry.execute(operations$8.layoutChanged.name, layout);
    }
    async handleOnDefaultChanged(layout) {
        this.registry.execute(operations$8.defaultLayoutChanged.name, layout);
    }
    async handleOnRemoved(layout) {
        this.registry.execute(operations$8.layoutRemoved.name, layout);
    }
    async handleOnRestored(layout) {
        this.registry.execute(operations$8.layoutRestored.name, layout);
    }
    async handleOnRenamed(renamedData) {
        const { prevName, ...layout } = renamedData;
        this.registry.execute(operations$8.layoutRenamed.name, layout, { name: prevName });
    }
}

const operations$7 = {
    raiseNotification: { name: "raiseNotification", dataDecoder: raiseNotificationDecoder, resultDecoder: raiseNotificationResultDecoder },
    requestPermission: { name: "requestPermission", resultDecoder: permissionRequestResultDecoder },
    notificationShow: { name: "notificationShow", dataDecoder: notificationEventPayloadDecoder },
    notificationClick: { name: "notificationClick", dataDecoder: notificationEventPayloadDecoder },
    getPermission: { name: "getPermission", resultDecoder: permissionQueryResultDecoder },
    list: { name: "list", resultDecoder: allNotificationsDataDecoder },
    notificationRaised: { name: "notificationRaised", dataDecoder: simpleNotificationDataDecoder },
    notificationClosed: { name: "notificationClosed", dataDecoder: simpleNotificationSelectDecoder },
    click: { name: "click" },
    clear: { name: "clear" },
    clearAll: { name: "clearAll" },
    clearOld: { name: "clearOld" },
    configure: { name: "configure", dataDecoder: notificationsConfigurationProtocolDecoder },
    getConfiguration: { name: "getConfiguration", resultDecoder: strictNotificationsConfigurationProtocolDecoder },
    getActiveCount: { name: "getActiveCount", resultDecoder: activeNotificationsCountChangeDecoder },
    configurationChanged: { name: "configurationChanged", resultDecoder: strictNotificationsConfigurationProtocolDecoder },
    setState: { name: "setState", dataDecoder: notificationSetStateRequestDecoder },
    activeCountChange: { name: "activeCountChange", resultDecoder: activeNotificationsCountChangeDecoder },
    stateChange: { name: "stateChange", resultDecoder: notificationSetStateRequestDecoder },
    operationCheck: { name: "operationCheck" }
};

/* @ts-self-types="./index.d.ts" */
let urlAlphabet$1 =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let nanoid$1 = (size = 21) => {
  let id = '';
  let i = size | 0;
  while (i--) {
    id += urlAlphabet$1[(Math.random() * 64) | 0];
  }
  return id
};

class NotificationsController {
    supportedOperationsNames = [];
    registry = CallbackRegistryFactory$1();
    logger;
    bridge;
    notificationsSettings;
    notifications = {};
    coreGlue;
    buildNotificationFunc;
    notificationsConfiguration;
    notificationsActiveCount = 0;
    handlePlatformShutdown() {
        this.notifications = {};
        this.registry.clear();
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("notifications.controller.web");
        this.logger.trace("starting the web notifications controller");
        this.bridge = ioc.bridge;
        this.coreGlue = coreGlue;
        this.notificationsSettings = ioc.config.notifications;
        this.buildNotificationFunc = ioc.buildNotification;
        this.notificationsConfiguration = await this.getConfiguration();
        this.notificationsActiveCount = await this.getActiveCount();
        const api = this.toApi();
        this.addOperationExecutors();
        coreGlue.notifications = api;
        this.logger.trace("notifications are ready");
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(notificationsOperationTypesDecoder, args.operation);
        const operation = operations$7[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    toApi() {
        const api = {
            raise: this.raise.bind(this),
            requestPermission: this.requestPermission.bind(this),
            getPermission: this.getPermission.bind(this),
            list: this.list.bind(this),
            onRaised: this.onRaised.bind(this),
            onClosed: this.onClosed.bind(this),
            click: this.click.bind(this),
            clear: this.clear.bind(this),
            clearAll: this.clearAll.bind(this),
            clearOld: this.clearOld.bind(this),
            configure: this.configure.bind(this),
            getConfiguration: this.getConfiguration.bind(this),
            getFilter: this.getFilter.bind(this),
            setFilter: this.setFilter.bind(this),
            setState: this.setState.bind(this),
            onConfigurationChanged: this.onConfigurationChanged.bind(this),
            onActiveCountChanged: this.onActiveCountChanged.bind(this),
            onCounterChanged: this.onActiveCountChanged.bind(this),
            onStateChanged: this.onStateChanged.bind(this)
        };
        return Object.freeze(api);
    }
    async getPermission() {
        const queryResult = await this.bridge.send("notifications", operations$7.getPermission, undefined);
        return queryResult.permission;
    }
    async requestPermission() {
        const permissionResult = await this.bridge.send("notifications", operations$7.requestPermission, undefined);
        return permissionResult.permissionGranted;
    }
    async raise(options) {
        const settings = runDecoderWithIOError(glue42NotificationOptionsDecoder, options);
        settings.showToast = typeof settings.showToast === "boolean" ? settings.showToast : true;
        settings.showInPanel = typeof settings.showInPanel === "boolean" ? settings.showInPanel : true;
        const permissionGranted = await this.requestPermission();
        if (!permissionGranted) {
            return ioError.raiseError("Cannot raise the notification, because the user has declined the permission request");
        }
        const id = nanoid$1(10);
        const raiseResult = await this.bridge.send("notifications", operations$7.raiseNotification, { settings, id });
        const notification = this.buildNotificationFunc(raiseResult.settings, id);
        this.notifications[id] = notification;
        return notification;
    }
    async list() {
        const bridgeResponse = await this.bridge.send("notifications", operations$7.list, undefined, undefined, { includeOperationCheck: true });
        return bridgeResponse.notifications;
    }
    onRaised(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onRaised expects a callback of type function");
        }
        return this.registry.add("notification-raised", callback);
    }
    onClosed(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onClosed expects a callback of type function");
        }
        return this.registry.add("notification-closed", callback);
    }
    async click(id, action) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, id);
        if (action) {
            runDecoderWithIOError(nonEmptyStringDecoder$2, action);
        }
        await this.bridge.send("notifications", operations$7.click, { id, action }, undefined, { includeOperationCheck: true });
    }
    async clear(id) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, id);
        await this.bridge.send("notifications", operations$7.clear, { id }, undefined, { includeOperationCheck: true });
    }
    async clearAll() {
        await this.bridge.send("notifications", operations$7.clearAll, undefined, undefined, { includeOperationCheck: true });
    }
    async clearOld() {
        await this.bridge.send("notifications", operations$7.clearOld, undefined, undefined, { includeOperationCheck: true });
    }
    async configure(config) {
        const verifiedConfig = runDecoderWithIOError(notificationsConfigurationDecoder, config);
        await this.bridge.send("notifications", operations$7.configure, { configuration: verifiedConfig }, undefined, { includeOperationCheck: true });
    }
    async getConfiguration() {
        const response = await this.bridge.send("notifications", operations$7.getConfiguration, undefined, undefined, { includeOperationCheck: true });
        return response.configuration;
    }
    async getActiveCount() {
        try {
            const response = await this.bridge.send("notifications", operations$7.getActiveCount, undefined, undefined, { includeOperationCheck: true });
            return response.count;
        }
        catch (error) {
            console.warn("Failed to get accurate active notifications count", error);
            return 0;
        }
    }
    async getFilter() {
        const response = await this.bridge.send("notifications", operations$7.getConfiguration, undefined, undefined, { includeOperationCheck: true });
        return response.configuration.sourceFilter;
    }
    async setFilter(filter) {
        const verifiedFilter = runDecoderWithIOError(notificationFilterDecoder, filter);
        await this.bridge.send("notifications", operations$7.configure, { configuration: { sourceFilter: verifiedFilter } }, undefined, { includeOperationCheck: true });
        return verifiedFilter;
    }
    async setState(id, state) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, id);
        runDecoderWithIOError(notificationStateDecoder, state);
        await this.bridge.send("notifications", operations$7.setState, { id, state }, undefined, { includeOperationCheck: true });
    }
    onConfigurationChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to configuration changed, because the provided callback is not a function!");
        }
        setTimeout(() => callback(this.notificationsConfiguration), 0);
        return this.registry.add("notifications-config-changed", callback);
    }
    onActiveCountChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onActiveCountChanged changed, because the provided callback is not a function!");
        }
        setTimeout(() => callback({ count: this.notificationsActiveCount }), 0);
        return this.registry.add("notifications-active-count-changed", callback);
    }
    onStateChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to onStateChanged changed, because the provided callback is not a function!");
        }
        return this.registry.add("notification-state-changed", callback);
    }
    addOperationExecutors() {
        operations$7.notificationShow.execute = this.handleNotificationShow.bind(this);
        operations$7.notificationClick.execute = this.handleNotificationClick.bind(this);
        operations$7.notificationRaised.execute = this.handleNotificationRaised.bind(this);
        operations$7.notificationClosed.execute = this.handleNotificationClosed.bind(this);
        operations$7.configurationChanged.execute = this.handleConfigurationChanged.bind(this);
        operations$7.activeCountChange.execute = this.handleActiveCountChanged.bind(this);
        operations$7.stateChange.execute = this.handleNotificationStateChanged.bind(this);
        operations$7.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$7);
    }
    async handleConfigurationChanged(data) {
        this.notificationsConfiguration = data.configuration;
        this.registry.execute("notifications-config-changed", data.configuration);
    }
    async handleActiveCountChanged(data) {
        this.notificationsActiveCount = data.count;
        this.registry.execute("notifications-active-count-changed", data);
    }
    async handleNotificationStateChanged(data) {
        this.registry.execute("notification-state-changed", { id: data.id }, data.state);
    }
    async handleNotificationShow(data) {
        if (!data.id) {
            return;
        }
        const notification = this.notifications[data.id];
        if (notification && notification.onshow) {
            notification.onshow();
        }
    }
    async handleNotificationClick(data) {
        if (!data.action && this.notificationsSettings?.defaultClick) {
            this.notificationsSettings.defaultClick(this.coreGlue, data.definition);
        }
        if (data.action && this.notificationsSettings?.actionClicks?.some((actionDef) => actionDef.action === data.action)) {
            const foundHandler = this.notificationsSettings?.actionClicks?.find((actionDef) => actionDef.action === data.action);
            foundHandler.handler(this.coreGlue, data.definition);
        }
        if (!data.id) {
            return;
        }
        const notification = this.notifications[data.id];
        if (notification && notification.onclick) {
            notification.onclick();
            delete this.notifications[data.id];
        }
    }
    async handleNotificationRaised(data) {
        this.registry.execute("notification-raised", data.notification);
    }
    async handleNotificationClosed(data) {
        this.registry.execute("notification-closed", data);
    }
}

const operations$6 = {
    getIntents: { name: "getIntents", resultDecoder: wrappedIntentsDecoder },
    findIntent: { name: "findIntent", dataDecoder: wrappedIntentFilterDecoder, resultDecoder: wrappedIntentsDecoder },
    raise: { name: "raise", dataDecoder: raiseIntentRequestDecoder, resultDecoder: intentResultDecoder },
    filterHandlers: { name: "filterHandlers", dataDecoder: filterHandlersWithResolverConfigDecoder, resultDecoder: filterHandlersResultDecoder },
    getIntentsByHandler: { name: "getIntentsByHandler", dataDecoder: intentHandlerDecoder, resultDecoder: getIntentsResultDecoder }
};

const GLUE42_FDC3_INTENTS_METHOD_PREFIX = "Tick42.FDC3.Intents.";
const INTENTS_RESOLVER_APP_NAME = "intentsResolver";
const DEFAULT_RESOLVER_RESPONSE_TIMEOUT = 60 * 1000;
const ADDITIONAL_BRIDGE_OPERATION_TIMEOUT = 30 * 1000;
const DEFAULT_PICK_HANDLER_BY_TIMEOUT = 90 * 1000;

class IntentsController {
    bridge;
    logger;
    interop;
    appManagerController;
    windowsController;
    myIntents = new Set();
    prefsController;
    uiController;
    useIntentsResolverUI = true;
    intentsResolverAppName;
    intentResolverResponseTimeout = DEFAULT_RESOLVER_RESPONSE_TIMEOUT;
    unregisterIntentPromises = [];
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("intents.controller.web");
        this.logger.trace("starting the web intents controller");
        this.bridge = ioc.bridge;
        this.interop = coreGlue.interop;
        this.appManagerController = ioc.appManagerController;
        this.windowsController = ioc.windowsController;
        this.prefsController = ioc.prefsController;
        this.uiController = ioc.uiController;
        this.checkIfIntentsResolverIsEnabled(ioc.config);
        const api = this.toApi();
        this.logger.trace("no need for platform registration, attaching the intents property to glue and returning");
        coreGlue.intents = api;
    }
    handlePlatformShutdown() {
        this.myIntents = new Set();
        this.unregisterIntentPromises = [];
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(intentsOperationTypesDecoder, args.operation);
        const operation = operations$6[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    toApi() {
        const api = {
            raise: this.raise.bind(this),
            all: this.all.bind(this),
            addIntentListener: this.addIntentListener.bind(this),
            register: this.register.bind(this),
            find: this.find.bind(this),
            filterHandlers: this.filterHandlers.bind(this),
            getIntents: this.getIntentsByHandler.bind(this),
            clearSavedHandlers: this.clearSavedHandlers.bind(this),
            onHandlerAdded: this.onHandlerAdded.bind(this),
            onHandlerRemoved: this.onHandlerRemoved.bind(this)
        };
        return api;
    }
    async raise(request) {
        const validatedIntentRequest = runDecoderWithIOError(raiseRequestDecoder, request);
        const intentRequest = typeof validatedIntentRequest === "string"
            ? { intent: validatedIntentRequest }
            : validatedIntentRequest;
        await Promise.all(this.unregisterIntentPromises);
        if (intentRequest.clearSavedHandler) {
            this.logger.trace(`User removes saved handler for intent ${intentRequest.intent}`);
            await this.removeRememberedHandler(intentRequest.intent);
        }
        const resultFromRememberedHandler = await this.checkHandleRaiseWithRememberedHandler(intentRequest);
        if (resultFromRememberedHandler) {
            return resultFromRememberedHandler;
        }
        const requestWithResolverInfo = {
            intentRequest,
            resolverConfig: this.getLegacyResolverConfigByRequest({ intentRequest }),
            embeddedResolverConfig: this.getEmbeddedResolverConfig()
        };
        const methodResponseTimeoutMs = intentRequest.waitUserResponseIndefinitely
            ? MAX_SET_TIMEOUT_DELAY
            : (intentRequest.timeout || this.intentResolverResponseTimeout) + ADDITIONAL_BRIDGE_OPERATION_TIMEOUT;
        this.logger.trace(`Sending raise request to the platform: ${JSON.stringify(request)} and method response timeout of ${methodResponseTimeoutMs}ms`);
        const response = await this.bridge.send("intents", operations$6.raise, requestWithResolverInfo, { methodResponseTimeoutMs, waitTimeoutMs: methodResponseTimeoutMs });
        this.logger.trace(`Raise operation completed with response: ${JSON.stringify(response)}`);
        return response;
    }
    getLegacyResolverConfigByRequest(filter) {
        if (filter.handlerFilter) {
            return {
                enabled: typeof filter.handlerFilter?.openResolver === "boolean" ? filter.handlerFilter?.openResolver : this.useIntentsResolverUI,
                appName: this.intentsResolverAppName,
                waitResponseTimeout: filter.handlerFilter?.timeout || DEFAULT_PICK_HANDLER_BY_TIMEOUT
            };
        }
        const waitResponseTimeout = filter.intentRequest?.waitUserResponseIndefinitely ? MAX_SET_TIMEOUT_DELAY : this.intentResolverResponseTimeout;
        return {
            enabled: this.useIntentsResolverUI,
            appName: this.intentsResolverAppName,
            waitResponseTimeout
        };
    }
    getEmbeddedResolverConfig() {
        return {
            enabled: this.uiController.isIntentResolverEnabled(),
            initialCaller: { instanceId: this.interop.instance.instance }
        };
    }
    async all() {
        await Promise.all(this.unregisterIntentPromises);
        const result = await this.bridge.send("intents", operations$6.getIntents, undefined);
        return result.intents;
    }
    addIntentListener(intent, handler) {
        runDecoderWithIOError(AddIntentListenerDecoder, intent);
        if (typeof handler !== "function") {
            return ioError.raiseError("Cannot add intent listener, because the provided handler is not a function!");
        }
        let registerPromise;
        const intentName = typeof intent === "string" ? intent : intent.intent;
        const methodName = this.buildInteropMethodName(intentName);
        const alreadyRegistered = this.myIntents.has(intentName);
        if (alreadyRegistered) {
            return ioError.raiseError(`Intent listener for intent ${intentName} already registered!`);
        }
        this.myIntents.add(intentName);
        const result = {
            unsubscribe: () => {
                this.myIntents.delete(intentName);
                registerPromise
                    .then(() => this.interop.unregister(methodName))
                    .catch((err) => this.logger.trace(`Unregistration of a method with name ${methodName} failed with reason: ${err}`));
            }
        };
        let intentFlag = {};
        if (typeof intent === "object") {
            const { intent: removed, ...rest } = intent;
            intentFlag = rest;
        }
        registerPromise = this.interop.register({ name: methodName, flags: { intent: intentFlag } }, (args) => {
            if (this.myIntents.has(intentName)) {
                const { _initialCallerId, ...rest } = args;
                return handler(rest);
            }
        });
        registerPromise.catch(err => {
            this.myIntents.delete(intentName);
            this.logger.warn(`Registration of a method with name ${methodName} failed with reason: ${err}`);
        });
        return result;
    }
    async register(intent, handler) {
        runDecoderWithIOError(AddIntentListenerDecoder, intent);
        if (typeof handler !== "function") {
            return ioError.raiseError("Cannot add intent listener, because the provided handler is not a function!");
        }
        await Promise.all(this.unregisterIntentPromises);
        const intentName = typeof intent === "string" ? intent : intent.intent;
        const methodName = this.buildInteropMethodName(intentName);
        const alreadyRegistered = this.myIntents.has(intentName);
        if (alreadyRegistered) {
            return ioError.raiseError(`Intent listener for intent ${intentName} already registered!`);
        }
        this.myIntents.add(intentName);
        let intentFlag = {};
        if (typeof intent === "object") {
            const { intent: removed, ...rest } = intent;
            intentFlag = rest;
        }
        try {
            await this.interop.register({ name: methodName, flags: { intent: intentFlag } }, (args) => {
                if (this.myIntents.has(intentName)) {
                    const { _initialCallerId, ...rest } = args;
                    const caller = this.interop.servers().find((server) => server.instance === _initialCallerId);
                    return handler(rest, caller);
                }
            });
        }
        catch (err) {
            this.myIntents.delete(intentName);
            return ioError.raiseError(`Registration of a method with name ${methodName} failed with reason: ${JSON.stringify(err)}`);
        }
        return {
            unsubscribe: () => this.unsubscribeIntent(intentName)
        };
    }
    async find(intentFilter) {
        let data = undefined;
        if (typeof intentFilter !== "undefined") {
            const intentFilterObj = runDecoderWithIOError(findFilterDecoder, intentFilter);
            if (typeof intentFilterObj === "string") {
                data = {
                    filter: {
                        name: intentFilterObj
                    }
                };
            }
            else if (typeof intentFilterObj === "object") {
                data = {
                    filter: intentFilterObj
                };
            }
        }
        await Promise.all(this.unregisterIntentPromises);
        const result = await this.bridge.send("intents", operations$6.findIntent, data);
        return result.intents;
    }
    onHandlerAdded(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe for 'onHandlerAdded' event - callback is not a function!");
        }
        const unOnAppAdded = this.subscribeForAppEvent("onAppAdded", callback);
        const unOnServerMethodAdded = this.subscribeForServerMethodEvent("serverMethodAdded", callback);
        return () => {
            unOnAppAdded();
            unOnServerMethodAdded();
        };
    }
    onHandlerRemoved(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe for 'onHandlerRemoved' event - callback is not a function!");
        }
        const unOnAppRemoved = this.subscribeForAppEvent("onAppRemoved", callback);
        const unOnServerMethodRemoved = this.subscribeForServerMethodEvent("serverMethodRemoved", callback);
        return () => {
            unOnAppRemoved();
            unOnServerMethodRemoved();
        };
    }
    subscribeForAppEvent(method, callback) {
        return this.appManagerController[method]((app) => {
            const appIntents = app.userProperties.intents;
            if (!appIntents?.length) {
                return;
            }
            appIntents.forEach((intent) => {
                const handler = this.buildIntentHandlerFromApp(app, intent);
                callback(handler, intent.name);
            });
        });
    }
    subscribeForServerMethodEvent(eventMethod, callback) {
        return this.interop[eventMethod](async ({ server, method }) => {
            if (!method.name.startsWith(GLUE42_FDC3_INTENTS_METHOD_PREFIX)) {
                return;
            }
            const intentName = method.name.replace(GLUE42_FDC3_INTENTS_METHOD_PREFIX, "");
            const handler = await this.buildIntentHandlerFromServerMethod(eventMethod, server, method, intentName);
            callback(handler, intentName);
        });
    }
    buildIntentHandlerFromApp(app, intent) {
        const handler = {
            applicationName: app.name,
            type: "app",
            applicationDescription: app.caption,
            applicationIcon: app.icon,
            applicationTitle: app.title,
            contextTypes: intent.contexts,
            displayName: intent.displayName,
            resultType: intent.resultType
        };
        return handler;
    }
    async buildIntentHandlerFromServerMethod(eventMethod, server, method, intentName) {
        const info = method.flags.intent;
        const app = this.appManagerController.getApplication(server.application || server.applicationName);
        let title;
        if (eventMethod === "serverMethodAdded" && server.windowId) {
            title = await (this.windowsController.findById(server.windowId))?.getTitle();
        }
        const appIntent = app?.userProperties?.intents?.find((intent) => intent.name === intentName);
        const handler = {
            applicationName: server.application || server.applicationName || "",
            instanceId: server.windowId || server.instance,
            type: "instance",
            applicationIcon: info?.icon || app?.icon,
            applicationTitle: app?.title,
            applicationDescription: info?.description || app?.caption,
            contextTypes: info?.contextTypes || appIntent?.contexts,
            instanceTitle: title,
            displayName: info?.displayName || appIntent?.displayName,
            resultType: info?.resultType || appIntent?.resultType
        };
        return handler;
    }
    async clearSavedHandlers() {
        this.logger.trace("Removing all saved handlers from prefs storage for current app");
        await this.prefsController.update({ intents: undefined });
    }
    checkIfIntentsResolverIsEnabled(options) {
        this.useIntentsResolverUI = typeof options.intents?.enableIntentsResolverUI === "boolean"
            ? options.intents.enableIntentsResolverUI
            : true;
        this.intentsResolverAppName = options.intents?.intentsResolverAppName ?? INTENTS_RESOLVER_APP_NAME;
        this.intentResolverResponseTimeout = options.intents?.methodResponseTimeoutMs ?? DEFAULT_RESOLVER_RESPONSE_TIMEOUT;
    }
    clearUnregistrationPromise(promiseToRemove) {
        this.unregisterIntentPromises = this.unregisterIntentPromises.filter(promise => promise !== promiseToRemove);
    }
    buildInteropMethodName(intentName) {
        return `${GLUE42_FDC3_INTENTS_METHOD_PREFIX}${intentName}`;
    }
    unsubscribeIntent(intentName) {
        this.myIntents.delete(intentName);
        const methodName = this.buildInteropMethodName(intentName);
        const unregisterPromise = this.interop.unregister(methodName);
        this.unregisterIntentPromises.push(unregisterPromise);
        unregisterPromise
            .then(() => {
            this.clearUnregistrationPromise(unregisterPromise);
        })
            .catch((err) => {
            this.logger.error(`Unregistration of a method with name ${methodName} failed with reason: ${err}`);
            this.clearUnregistrationPromise(unregisterPromise);
        });
    }
    async filterHandlers(handlerFilter) {
        runDecoderWithIOError(handlerFilterDecoder, handlerFilter);
        this.checkIfAtLeastOneFilterIsPresent(handlerFilter);
        const embeddedResolverConfig = this.getEmbeddedResolverConfig();
        if (handlerFilter.openResolver && !this.useIntentsResolverUI && !embeddedResolverConfig.enabled) {
            return ioError.raiseError("Cannot resolve 'filterHandlers' request using Intents Resolver UI because it's globally disabled");
        }
        const methodResponseTimeoutMs = (handlerFilter.timeout || DEFAULT_PICK_HANDLER_BY_TIMEOUT) + ADDITIONAL_BRIDGE_OPERATION_TIMEOUT;
        const filterHandlersRequestWithResolverConfig = {
            filterHandlersRequest: handlerFilter,
            resolverConfig: this.getLegacyResolverConfigByRequest({ handlerFilter }),
            embeddedResolverConfig
        };
        const result = await this.bridge.send("intents", operations$6.filterHandlers, filterHandlersRequestWithResolverConfig, { methodResponseTimeoutMs, waitTimeoutMs: methodResponseTimeoutMs }, { includeOperationCheck: true });
        return result;
    }
    checkIfAtLeastOneFilterIsPresent(filter) {
        const errorMsg = "Provide at least one filter criteria of the following: 'intent' | 'contextTypes' | 'resultType' | 'applicationNames'";
        if (!Object.keys(filter).length) {
            return ioError.raiseError(errorMsg);
        }
        const { intent, resultType, contextTypes, applicationNames } = filter;
        const existingValidContextTypes = contextTypes?.length;
        const existingValidApplicationNames = applicationNames?.length;
        if (!intent && !resultType && !existingValidContextTypes && !existingValidApplicationNames) {
            return ioError.raiseError(errorMsg);
        }
    }
    async getIntentsByHandler(handler) {
        runDecoderWithIOError(intentHandlerDecoder, handler);
        const result = await this.bridge.send("intents", operations$6.getIntentsByHandler, handler, undefined, { includeOperationCheck: true });
        return result;
    }
    async removeRememberedHandler(intentName) {
        this.logger.trace(`Removing saved handler from prefs storage for intent ${intentName}`);
        let prefs;
        try {
            prefs = await this.prefsController.get();
        }
        catch (error) {
            this.logger.warn(`prefs.get() threw the following error: ${error}`);
            return;
        }
        const intentPrefs = prefs.data?.intents;
        if (!intentPrefs) {
            this.logger.trace("No app prefs found for current app");
            return;
        }
        delete intentPrefs[intentName];
        const updatedPrefs = {
            ...prefs.data,
            intents: intentPrefs
        };
        try {
            await this.prefsController.update(updatedPrefs);
        }
        catch (error) {
            this.logger.warn(`prefs.update() threw the following error: ${error}`);
            return;
        }
        this.logger.trace(`Handler saved choice for intent ${intentName} removed successfully`);
    }
    async checkForRememberedHandler(intentRequest) {
        let prefs;
        try {
            prefs = await this.prefsController.get();
        }
        catch (error) {
            this.logger.warn(`prefs.get() threw the following error: ${error}`);
            return;
        }
        const prefsForIntent = prefs.data?.intents?.[intentRequest.intent];
        return prefsForIntent?.handler;
    }
    async checkHandleRaiseWithRememberedHandler(intentRequest) {
        if (intentRequest.target) {
            return;
        }
        const rememberedHandler = await this.checkForRememberedHandler(intentRequest);
        if (!rememberedHandler) {
            return;
        }
        const operationData = {
            intentRequest: {
                ...intentRequest,
                target: {
                    app: rememberedHandler.applicationName,
                    instance: rememberedHandler.instanceId
                }
            },
            resolverConfig: this.getLegacyResolverConfigByRequest({ intentRequest }),
            embeddedResolverConfig: this.getEmbeddedResolverConfig()
        };
        try {
            const response = await this.bridge.send("intents", operations$6.raise, operationData);
            return response;
        }
        catch (error) {
            this.logger.trace(`Could not raise intent to remembered handler. Reason: ${error}. Removing it from Prefs store`);
            await this.removeRememberedHandler(intentRequest.intent);
        }
    }
}

const operations$5 = {
    addChannel: { name: "addChannel", dataDecoder: channelDefinitionDecoder },
    removeChannel: { name: "removeChannel", dataDecoder: removeChannelDataDecoder },
    getMyChannel: { name: "getMyChannel", resultDecoder: getMyChanelResultDecoder },
    getWindowIdsOnChannel: { name: "getWindowIdsOnChannel", dataDecoder: getWindowIdsOnChannelDataDecoder, resultDecoder: getWindowIdsOnChannelResultDecoder },
    getWindowIdsWithChannels: { name: "getWindowIdsWithChannels", dataDecoder: wrappedWindowWithChannelFilterDecoder, resultDecoder: getWindowIdsWithChannelsResultDecoder },
    joinChannel: { name: "joinChannel", dataDecoder: joinChannelDataDecoder },
    restrict: { name: "restrict", dataDecoder: restrictionConfigDataDecoder },
    getRestrictions: { name: "getRestrictions", dataDecoder: getRestrictionsDataDecoder, resultDecoder: restrictionsDecoder },
    restrictAll: { name: "restrictAll", dataDecoder: restrictAllDataDecoder },
    notifyChannelsChanged: { name: "notifyChannelsChanged", dataDecoder: channelsChangedDataDecoder },
    leaveChannel: { name: "leaveChannel", dataDecoder: leaveChannelDataDecoder },
    requestChannelSelector: { name: "requestChannelSelector", dataDecoder: requestChannelSelectorConfigDecoder },
    getMode: { name: "getMode", resultDecoder: getChannelsModeDecoder },
    operationCheck: { name: "operationCheck" }
};

const DEFAULT_MODE = "single";
const CHANNELS_PREFIX = "___channel___";
const SUBS_KEY = "subs";
const CHANGED_KEY = "changed";
const CHANNELS_CHANGED = "channels_changed";

class ChannelsController {
    supportedOperationsNames = [];
    registry = CallbackRegistryFactory$1();
    logger;
    contexts;
    interop;
    bridge;
    windowsController;
    sessionController;
    _mode;
    currentChannels = [];
    unsubscribeDict = {};
    handlePlatformShutdown() {
        this.registry.clear();
    }
    addOperationsExecutors() {
        operations$5.getMyChannel.execute = this.handleGetMyChannel.bind(this);
        operations$5.joinChannel.execute = this.handleJoinChannel.bind(this);
        operations$5.leaveChannel.execute = this.handleLeaveChannel.bind(this);
        operations$5.restrict.execute = ({ config }) => this.restrict(config);
        operations$5.getRestrictions.execute = ({ windowId }) => this.getRestrictions(windowId);
        operations$5.restrictAll.execute = ({ restrictions }) => this.restrictAll(restrictions);
        operations$5.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$5);
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("channels.controller.web");
        this.logger.trace("starting the web channels controller");
        this.contexts = coreGlue.contexts;
        this.interop = coreGlue.interop;
        this.addOperationsExecutors();
        this.bridge = ioc.bridge;
        this.windowsController = ioc.windowsController;
        this.sessionController = ioc.sessionController;
        this.logger.trace("no need for platform registration, attaching the channels property to glue and returning");
        this._mode = await this.getPlatformChannelsMode();
        const api = this.toApi();
        coreGlue.channels = api;
    }
    async postStart(io, ioc) {
        try {
            await this.requestChannelSelector(io.appManager.myInstance);
        }
        catch (error) {
            this.logger.warn(`Failed to display channel selector: ${extractErrorMsg(error)}`);
        }
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(channelsOperationTypesDecoder, args.operation);
        const operation = operations$5[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    async list() {
        const channelNames = this.getAllChannelNames();
        const channelContexts = await Promise.all(channelNames.map((channelName) => this.get(channelName)));
        return channelContexts;
    }
    my() {
        return this.current();
    }
    async handleGetMyChannel() {
        const channel = this.my();
        return channel ? { channel } : {};
    }
    async join(name, windowId) {
        const channelNames = this.getAllChannelNames();
        runDecoderWithIOError(channelNameDecoder(channelNames), name);
        runDecoderWithIOError(optionalNonEmptyStringDecoder, windowId);
        const forAnotherClient = windowId && windowId !== this.interop.instance.instance;
        if (forAnotherClient) {
            return await this.bridge.send("channels", operations$5.joinChannel, { channel: name, windowId }, undefined, { includeOperationCheck: true });
        }
        if (this._mode === "single") {
            return this.switchToChannel(name);
        }
        return this.joinAdditionalChannel(name);
    }
    handleJoinChannel({ channel, windowId }) {
        return this.join(channel, windowId);
    }
    onChanged(callback) {
        return this.changed(callback);
    }
    async leave(config = {}) {
        runDecoderWithIOError(leaveChannelsConfig, config);
        if (config.channel) {
            const channelNames = this.getAllChannelNames();
            runDecoderWithIOError(channelNameDecoder(channelNames), config.channel);
        }
        const forAnotherClient = config.windowId && config.windowId !== this.interop.instance.instance;
        if (config.windowId && forAnotherClient) {
            const leaveData = { windowId: config.windowId, channelName: config.channel };
            await this.bridge.send("channels", operations$5.leaveChannel, leaveData, undefined, { includeOperationCheck: true });
            return;
        }
        const channelNamesToLeave = config.channel ? [config.channel] : this.currentChannels;
        channelNamesToLeave.forEach((name) => this.unsubscribe(name));
        this.currentChannels = this.currentChannels.filter((channelName) => !channelNamesToLeave.includes(channelName));
        this.sessionController.setWindowData({ currentNames: this.currentChannels }, "channels");
        this.executeChangedEvents();
        await this.notifyChannelsChanged();
    }
    handleLeaveChannel(data) {
        return this.leave({ channel: data.channelName });
    }
    toApi() {
        const api = {
            mode: this._mode,
            subscribe: this.subscribe.bind(this),
            subscribeFor: this.subscribeFor.bind(this),
            publish: this.publish.bind(this),
            all: this.all.bind(this),
            list: this.list.bind(this),
            get: this.get.bind(this),
            getMyChannels: this.getMyChannels.bind(this),
            myChannels: this.myChannels.bind(this),
            onChannelsChanged: this.onChannelsChanged.bind(this),
            join: this.join.bind(this),
            leave: this.leave.bind(this),
            current: this.current.bind(this),
            my: this.my.bind(this),
            changed: this.changed.bind(this),
            onChanged: this.onChanged.bind(this),
            add: this.add.bind(this),
            remove: this.remove.bind(this),
            getMy: this.getMy.bind(this),
            getWindowsOnChannel: this.getWindowsOnChannel.bind(this),
            getWindowsWithChannels: this.getWindowsWithChannels.bind(this),
            restrict: this.restrict.bind(this),
            getRestrictions: this.getRestrictions.bind(this),
            restrictAll: this.restrictAll.bind(this),
            clearChannelData: this.clearChannelData.bind(this),
            setPath: this.setPath.bind(this),
            setPaths: this.setPaths.bind(this)
        };
        return Object.freeze(api);
    }
    createContextName(channelName) {
        return `${CHANNELS_PREFIX}${channelName}`;
    }
    getAllChannelNames() {
        const contextNames = this.contexts.all();
        const channelContextNames = contextNames.filter((contextName) => contextName.startsWith(CHANNELS_PREFIX));
        const channelNames = channelContextNames.map((channelContextName) => channelContextName.replace(CHANNELS_PREFIX, ""));
        return channelNames;
    }
    async joinAdditionalChannel(name) {
        if (this.currentChannels.includes(name)) {
            return;
        }
        this.currentChannels = [...this.currentChannels, name];
        const contextName = this.createContextName(name);
        const unsub = await this.contexts.subscribe(contextName, (context, delta, _, __, extraData) => {
            this.registry.execute(SUBS_KEY, context.data, context, delta, extraData?.updaterId);
        });
        this.unsubscribeDict[name] = unsub;
        this.executeChangedEvents(name);
        this.sessionController.setWindowData({ currentNames: this.currentChannels }, "channels");
        await this.notifyChannelsChanged();
    }
    async switchToChannel(name) {
        const currentChannel = this.currentChannels[0];
        if (name === currentChannel) {
            return;
        }
        this.unsubscribe(currentChannel);
        this.currentChannels = [name];
        const contextName = this.createContextName(name);
        const unsub = await this.contexts.subscribe(contextName, (context, delta, _, __, extraData) => {
            this.registry.execute(SUBS_KEY, context.data, context, delta, extraData?.updaterId);
        });
        this.unsubscribeDict[name] = unsub;
        this.executeChangedEvents(name);
        this.sessionController.setWindowData({ currentNames: this.currentChannels }, "channels");
        await this.notifyChannelsChanged();
    }
    unsubscribe(channelName) {
        if (channelName) {
            this.unsubscribeDict[channelName]?.();
            delete this.unsubscribeDict[channelName];
            return;
        }
        Object.values(this.unsubscribeDict).forEach((unsub) => unsub());
        this.unsubscribeDict = {};
    }
    executeChangedEvents(name) {
        this.registry.execute(CHANGED_KEY, name);
        this.registry.execute(CHANNELS_CHANGED, this.currentChannels);
    }
    async notifyChannelsChanged() {
        const windowId = this.windowsController.my().id;
        if (!windowId) {
            return;
        }
        try {
            await this.bridge.send("channels", operations$5.notifyChannelsChanged, { channelNames: this.currentChannels, windowId }, undefined, { includeOperationCheck: true });
        }
        catch (error) {
            this.logger.warn(`Failed to notify channel changed: ${extractErrorMsg(error)}`);
        }
    }
    async updateData(name, data) {
        const contextName = this.createContextName(name);
        const fdc3Type = this.getFDC3Type(data);
        if (this.contexts.setPathSupported) {
            const pathValues = Object.keys(data).map((key) => {
                return {
                    path: `data.${key}`,
                    value: data[key]
                };
            });
            if (fdc3Type) {
                pathValues.push({ path: latestFDC3Type, value: fdc3Type });
            }
            await this.contexts.setPaths(contextName, pathValues);
        }
        else {
            if (fdc3Type) {
                data[latestFDC3Type] = fdc3Type;
            }
            await this.contexts.update(contextName, { data });
        }
    }
    getFDC3Type(data) {
        const fdc3PropsArr = Object.keys(data).filter((key) => key.indexOf("fdc3_") === 0);
        if (fdc3PropsArr.length === 0) {
            return;
        }
        if (fdc3PropsArr.length > 1) {
            return ioError.raiseError("FDC3 does not support updating of multiple context keys");
        }
        return fdc3PropsArr[0].split("_").slice(1).join("_");
    }
    subscribe(callback, options) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to channels, because the provided callback is not a function!");
        }
        if (options) {
            runDecoderWithIOError(fdc3OptionsDecoder, options);
        }
        const currentChannel = this.current();
        const wrappedCallback = options?.contextType
            ? this.getWrappedSubscribeCallbackWithFdc3Type(callback, options.contextType)
            : this.getWrappedSubscribeCallback(callback);
        if (currentChannel) {
            this.replaySubscribe(wrappedCallback, currentChannel);
        }
        return this.registry.add(SUBS_KEY, wrappedCallback);
    }
    async subscribeFor(name, callback, options) {
        const channelNames = this.getAllChannelNames();
        runDecoderWithIOError(channelNameDecoder(channelNames), name);
        if (typeof callback !== "function") {
            return ioError.raiseError(`Cannot subscribe to channel ${name}, because the provided callback is not a function!`);
        }
        if (options) {
            runDecoderWithIOError(fdc3OptionsDecoder, options);
        }
        const contextName = this.createContextName(name);
        const wrappedCallback = options?.contextType
            ? this.getWrappedSubscribeCallbackWithFdc3Type(callback, options.contextType)
            : this.getWrappedSubscribeCallback(callback);
        return this.contexts.subscribe(contextName, (context, delta, _, __, extraData) => {
            wrappedCallback(context.data, context, delta, extraData?.updaterId);
        });
    }
    async publish(data, options) {
        if (typeof data !== "object") {
            return ioError.raiseError("Cannot publish to channel, because the provided data is not an object!");
        }
        runDecoderWithIOError(publishOptionsDecoder, options);
        if (typeof options === "object") {
            return this.publishWithOptions(data, options);
        }
        if (typeof options === "string") {
            const channelNames = this.getAllChannelNames();
            runDecoderWithIOError(channelNameDecoder(channelNames), options);
        }
        if (!options && this.currentChannels.length > 1) {
            return this.publishOnMultipleChannels(data);
        }
        const channelName = typeof options === "string" ? options : this.currentChannels[0];
        if (!channelName) {
            return ioError.raiseError("Cannot publish to channel, because not joined to a channel!");
        }
        const canPublish = this.isAllowedByRestrictions(channelName, "write");
        if (!canPublish) {
            return ioError.raiseError(`Cannot publish on channel ${channelName} due to restrictions`);
        }
        return this.updateData(channelName, data);
    }
    async all() {
        const channelNames = this.getAllChannelNames();
        return channelNames;
    }
    async get(name, options) {
        const channelNames = this.getAllChannelNames();
        runDecoderWithIOError(channelNameDecoder(channelNames), name);
        if (options) {
            runDecoderWithIOError(fdc3OptionsDecoder, options);
        }
        const contextName = this.createContextName(name);
        const channelContext = await this.contexts.get(contextName);
        if (options?.contextType) {
            return this.getContextForFdc3Type(channelContext, options.contextType);
        }
        if (channelContext.latest_fdc3_type) {
            return this.getContextWithFdc3Data(channelContext);
        }
        return channelContext;
    }
    async getMyChannels() {
        return Promise.all(this.currentChannels.map((channelName) => {
            const contextName = this.createContextName(channelName);
            return this.contexts.get(contextName);
        }));
    }
    myChannels() {
        return this.currentChannels;
    }
    getContextForFdc3Type(channelContext, searchedType) {
        const encodedType = `fdc3_${searchedType.split(".").join("&")}`;
        if (!channelContext.data[encodedType]) {
            return {
                name: channelContext.name,
                meta: channelContext.meta,
                data: {}
            };
        }
        const fdc3Context = { type: searchedType, ...channelContext.data[encodedType] };
        return {
            name: channelContext.name,
            meta: channelContext.meta,
            data: { fdc3: fdc3Context }
        };
    }
    getContextWithFdc3Data(channelContext) {
        const { latest_fdc3_type, ...rest } = channelContext;
        const parsedType = latest_fdc3_type.split("&").join(".");
        const fdc3Context = { type: parsedType, ...rest.data[`fdc3_${latest_fdc3_type}`] };
        delete rest.data[`fdc3_${latest_fdc3_type}`];
        const context = {
            name: channelContext.name,
            meta: channelContext.meta,
            data: {
                ...rest.data,
                fdc3: fdc3Context
            }
        };
        return context;
    }
    current() {
        return this.currentChannels[0];
    }
    changed(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to channel changed, because the provided callback is not a function!");
        }
        return this.registry.add(CHANGED_KEY, callback);
    }
    async add(info) {
        const channelContext = runDecoderWithIOError(channelDefinitionDecoder, info);
        const channelWithSuchNameExists = this.getAllChannelNames().includes(channelContext.name);
        if (channelWithSuchNameExists) {
            return ioError.raiseError("There's an already existing channel with such name");
        }
        await this.bridge.send("channels", operations$5.addChannel, channelContext);
        return {
            name: channelContext.name,
            meta: channelContext.meta,
            data: channelContext.data || {}
        };
    }
    async remove(name) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        const channelWithSuchNameExists = this.getAllChannelNames().includes(name);
        if (!channelWithSuchNameExists) {
            return ioError.raiseError("There's no channel with such name");
        }
        await this.bridge.send("channels", operations$5.removeChannel, { name }, undefined, { includeOperationCheck: true });
    }
    replaySubscribe = (callback, channelId) => {
        this.get(channelId)
            .then((channelContext) => {
            if (!channelContext) {
                return undefined;
            }
            const contextName = this.createContextName(channelContext.name);
            return this.contexts.subscribe(contextName, (context, delta, _, __, extraData) => {
                callback(context.data, context, delta, extraData?.updaterId);
            });
        })
            .then((un) => un?.())
            .catch(err => this.logger.trace(err));
    };
    async getMy(options) {
        if (!this.currentChannels.length) {
            return;
        }
        if (options) {
            runDecoderWithIOError(fdc3OptionsDecoder, options);
        }
        return this.get(this.currentChannels[this.currentChannels.length - 1], options);
    }
    async getWindowsOnChannel(channel) {
        const channelNames = this.getAllChannelNames();
        runDecoderWithIOError(channelNameDecoder(channelNames), channel);
        const { windowIds } = await this.bridge.send("channels", operations$5.getWindowIdsOnChannel, { channel }, undefined, { includeOperationCheck: true });
        const result = windowIds.reduce((windows, windowId) => {
            const window = this.windowsController.findById(windowId);
            return window ? [...windows, window] : windows;
        }, []);
        return result;
    }
    async getWindowsWithChannels(filter) {
        const operationData = filter !== undefined
            ? { filter: runDecoderWithIOError(windowWithChannelFilterDecoder, filter) }
            : {};
        const { windowIdsWithChannels } = await this.bridge.send("channels", operations$5.getWindowIdsWithChannels, operationData, undefined, { includeOperationCheck: true });
        const result = windowIdsWithChannels.reduce((windowsWithChannels, { application, channel, windowId }) => {
            const window = this.windowsController.findById(windowId);
            return window ? [...windowsWithChannels, { application, channel, window }] : windowsWithChannels;
        }, []);
        return result;
    }
    async clearChannelData(name) {
        const paths = [
            { path: "data", value: {} },
            { path: "latest_fdc3_type", value: null },
        ];
        await this.handleSetPaths("clearChannelData", paths, name);
    }
    async restrict(config) {
        runDecoderWithIOError(channelRestrictionsDecoder, config);
        const channelNames = this.getAllChannelNames();
        runDecoderWithIOError(channelNameDecoder(channelNames), config.name);
        const forAnotherClient = config.windowId && config.windowId !== this.interop.instance.instance;
        if (forAnotherClient) {
            return this.bridge.send("channels", operations$5.restrict, { config }, undefined, { includeOperationCheck: true });
        }
        const sessionStorageData = this.sessionController.getWindowData();
        const restrictions = sessionStorageData?.restrictions ? { ...sessionStorageData.restrictions, [config.name]: config } : { [config.name]: config };
        const currentChannel = await this.getMy();
        const prevReadAllowed = this.checkPreviousReadAllowed(currentChannel?.name);
        this.sessionController.setWindowData(restrictions, "restrictions");
        if (!currentChannel || prevReadAllowed || !config.read || currentChannel.name !== config.name) {
            return;
        }
        this.replaySubscribeCallback(config.name);
    }
    async getRestrictions(windowId) {
        runDecoderWithIOError(optionalNonEmptyStringDecoder, windowId);
        const forAnotherClient = windowId && windowId !== this.interop.instance.instance;
        if (windowId && forAnotherClient) {
            return this.bridge.send("channels", operations$5.getRestrictions, { windowId }, undefined, { includeOperationCheck: true });
        }
        return this.getMyRestrictions();
    }
    async restrictAll(restrictions) {
        runDecoderWithIOError(restrictionsConfigDecoder, restrictions);
        const allChannelNames = this.getAllChannelNames();
        const forAnotherClient = restrictions.windowId && restrictions.windowId !== this.interop.instance.instance;
        if (forAnotherClient) {
            return this.bridge.send("channels", operations$5.restrictAll, { restrictions }, undefined, { includeOperationCheck: true });
        }
        const allRestrictions = {};
        allChannelNames.forEach((name) => {
            allRestrictions[name] = { ...restrictions, name };
        });
        const currentChannel = await this.getMy();
        const prevReadAllowed = this.checkPreviousReadAllowed(currentChannel?.name);
        this.sessionController.setWindowData(allRestrictions, "restrictions");
        if (!currentChannel || prevReadAllowed || !restrictions.read) {
            return;
        }
        this.replaySubscribeCallback(currentChannel.name);
    }
    async setPath(path, name) {
        const validatedPath = runDecoderWithIOError(pathValueDecoder, path);
        const paths = [{ path: `data.${validatedPath.path}`, value: validatedPath.value }];
        await this.handleSetPaths("setPath", paths, name);
    }
    async setPaths(paths, name) {
        const validatedPaths = runDecoderWithIOError(pathsValueDecoder, paths);
        const dataPaths = validatedPaths.map(({ path, value }) => ({ path: `data.${path}`, value }));
        await this.handleSetPaths("setPaths", dataPaths, name);
    }
    async handleSetPaths(operation, paths, name) {
        const channelNamesToUpdate = name ? [name] : this.currentChannels;
        if (!channelNamesToUpdate.length) {
            return ioError.raiseError(`Cannot complete ${operation} operation, because channel is not specified. Either join one or pass a channel name as second argument!`);
        }
        this.validateChannelNames(channelNamesToUpdate);
        const { allowed, forbidden } = this.groupChannelsByPermission("write", channelNamesToUpdate);
        if (channelNamesToUpdate.length === forbidden.length) {
            return ioError.raiseError(`Cannot complete ${operation} operation due to write restrictions to the following channels: ${channelNamesToUpdate.join(", ")}`);
        }
        if (forbidden.length) {
            this.logger.warn(`Cannot set paths on channel${forbidden.length > 1 ? "s" : ""}: ${forbidden.join(", ")} due to write restrictions`);
        }
        await Promise.all(allowed.map((channelName) => {
            const contextName = this.createContextName(channelName);
            return this.contexts.setPaths(contextName, paths);
        }));
    }
    validateChannelNames(names) {
        const allChannelNames = this.getAllChannelNames();
        names.forEach((name) => runDecoderWithIOError(channelNameDecoder(allChannelNames), name));
    }
    groupChannelsByPermission(action, channelNames) {
        return channelNames.reduce((byFar, channelName) => {
            const isAllowed = this.isAllowedByRestrictions(channelName, action);
            if (isAllowed) {
                byFar.allowed.push(channelName);
            }
            else {
                byFar.forbidden.push(channelName);
            }
            return byFar;
        }, { allowed: [], forbidden: [] });
    }
    isAllowedByRestrictions(channelName, action) {
        const { channels } = this.getMyRestrictions();
        if (!channels?.length) {
            return true;
        }
        const restriction = channels.find((restriction) => restriction.name === channelName);
        return restriction ? restriction[action] : true;
    }
    getMyRestrictions() {
        const sessionStorageData = this.sessionController.getWindowData();
        const restrictions = Object.values(sessionStorageData?.restrictions || {});
        return { channels: restrictions };
    }
    replaySubscribeCallback(channelName) {
        const contextName = this.createContextName(channelName);
        this.contexts.subscribe(contextName, (context, delta, _, __, extraData) => {
            this.registry.execute(SUBS_KEY, context.data, context, delta, extraData?.updaterId);
        }).then((unsub) => {
            if (unsub && typeof unsub === "function") {
                unsub();
            }
        }).catch(err => this.logger.error(err));
    }
    checkPreviousReadAllowed(channelName) {
        if (!channelName) {
            return true;
        }
        const prevRestrictions = this.sessionController.getWindowData().restrictions;
        if (!prevRestrictions?.[channelName]) {
            return true;
        }
        return prevRestrictions[channelName].read;
    }
    async publishWithOptions(data, options) {
        if (options.name) {
            const channelNames = this.getAllChannelNames();
            runDecoderWithIOError(channelNameDecoder(channelNames), options.name);
        }
        const publishOnMultipleChannels = options.name ? false : this.currentChannels.length > 1;
        if (publishOnMultipleChannels) {
            return this.publishOnMultipleChannels(data, options.fdc3);
        }
        const channelName = options.name || this.currentChannels[0];
        if (!channelName) {
            return ioError.raiseError("Cannot publish to channel, because not joined to a channel!");
        }
        const canPublish = this.isAllowedByRestrictions(channelName, "write");
        if (!canPublish) {
            return ioError.raiseError(`Cannot publish on channel ${channelName} due to restrictions`);
        }
        if (!options.fdc3) {
            return this.updateData(channelName, data);
        }
        return this.publishFdc3Data(channelName, data);
    }
    async publishOnMultipleChannels(data, isFdc3) {
        const { allowed, forbidden } = this.groupChannelsByPermission("write", this.currentChannels);
        if (this.currentChannels.length === forbidden.length) {
            return ioError.raiseError(`Cannot complete 'publish' operation due to write restrictions to all joined channels: ${this.currentChannels.join(", ")}`);
        }
        if (forbidden.length) {
            this.logger.warn(`Data on channel${forbidden.length > 1 ? "s" : ""}: ${forbidden.join(", ")} won't be published due to write restrictions`);
        }
        const publishMethod = isFdc3 ? this.publishFdc3Data.bind(this) : this.updateData.bind(this);
        await Promise.all(allowed.map((channelName) => publishMethod(channelName, data)));
    }
    async publishFdc3Data(channelName, data) {
        runDecoderWithIOError(fdc3ContextDecoder, data);
        const { type, ...rest } = data;
        const parsedType = type.split(".").join("&");
        const fdc3DataToPublish = { [`fdc3_${parsedType}`]: rest };
        return this.updateData(channelName, fdc3DataToPublish);
    }
    getWrappedSubscribeCallback(callback) {
        const wrappedCallback = (channelData, context, delta, updaterId) => {
            const canRead = this.isAllowedByRestrictions(context.name, "read");
            if (!canRead) {
                return;
            }
            const { data, latest_fdc3_type } = context;
            const latestTypePropName = `fdc3_${latest_fdc3_type}`;
            if (!latest_fdc3_type || (delta.data && !delta.data[latestTypePropName])) {
                callback(channelData, context, updaterId);
                return;
            }
            const parsedType = latest_fdc3_type.split("&").join(".");
            const fdc3Data = { type: parsedType, ...data[latestTypePropName] };
            const { [latestTypePropName]: latestFDC3Type, ...rest } = channelData;
            callback({ ...rest, fdc3: fdc3Data }, context, updaterId);
        };
        return wrappedCallback;
    }
    getWrappedSubscribeCallbackWithFdc3Type(callback, fdc3Type) {
        const didReplay = { replayed: false };
        const wrappedCallback = (_, context, delta, updaterId) => {
            const canRead = this.isAllowedByRestrictions(context.name, "read");
            if (!canRead) {
                return;
            }
            const { data, latest_fdc3_type } = context;
            const searchedType = `fdc3_${fdc3Type.split(".").join("&")}`;
            if (!data[searchedType] || (delta.data && !delta.data[searchedType])) {
                return;
            }
            if (didReplay.replayed) {
                return this.parseDataAndInvokeSubscribeCallback({ latestFdc3TypeEncoded: latest_fdc3_type, searchedType: fdc3Type, callback, context, updaterId });
            }
            const fdc3Data = { type: fdc3Type, ...data[searchedType] };
            callback({ fdc3: fdc3Data }, context, updaterId);
            didReplay.replayed = true;
        };
        return wrappedCallback;
    }
    parseDataAndInvokeSubscribeCallback(args) {
        const { latestFdc3TypeEncoded, searchedType, callback, context, updaterId } = args;
        const latestPublishedType = latestFdc3TypeEncoded.split("&").join(".");
        if (latestPublishedType !== searchedType) {
            return;
        }
        const fdc3Data = { type: searchedType, ...context.data[`fdc3_${latestFdc3TypeEncoded}`] };
        callback({ fdc3: fdc3Data }, context, updaterId);
    }
    async requestChannelSelector(myInstance) {
        if (!myInstance) {
            return;
        }
        const myApplicationData = myInstance.application;
        const myAppDetails = myApplicationData.userProperties?.details;
        if (!myAppDetails) {
            return;
        }
        if (!myAppDetails?.channelSelector?.enabled) {
            return;
        }
        const { channels: channelsStorageData } = this.sessionController.getWindowData();
        const windowId = myInstance.id;
        const channelsNames = channelsStorageData?.currentNames || [];
        const requestChannelSelectorConfig = { windowId, channelsNames };
        await this.bridge.send("channels", operations$5.requestChannelSelector, requestChannelSelectorConfig, undefined, { includeOperationCheck: true });
    }
    async getPlatformChannelsMode() {
        try {
            const result = await this.bridge.send("channels", operations$5.getMode, {}, undefined, { includeOperationCheck: true });
            return result.mode;
        }
        catch (error) {
            this.logger.warn(error?.message || JSON.stringify(error));
            return DEFAULT_MODE;
        }
    }
    onChannelsChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to channels changed, because the provided callback is not a function");
        }
        return this.registry.add(CHANNELS_CHANGED, callback);
    }
}

const operations$4 = {
    getEnvironment: { name: "getEnvironment", resultDecoder: anyDecoder },
    getBase: { name: "getBase", resultDecoder: anyDecoder },
    platformShutdown: { name: "platformShutdown" },
    isFdc3DataWrappingSupported: { name: "isFdc3DataWrappingSupported" },
    clientError: { name: "clientError", dataDecoder: clientErrorDataDecoder },
    systemHello: { name: "systemHello", resultDecoder: systemHelloSuccessDecoder },
    operationCheck: { name: "operationCheck" }
};

class SystemController {
    supportedOperationsNames = [];
    bridge;
    ioc;
    logger;
    errorPort = errorChannel.port2;
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("system.controller.web");
        this.logger.trace("starting the web system controller");
        this.bridge = ioc.bridge;
        this.ioc = ioc;
        this.addOperationsExecutors();
        let isClientErrorOperationSupported = false;
        try {
            const systemHelloSuccess = await this.bridge.send("system", operations$4.systemHello, undefined, undefined, { includeOperationCheck: true });
            isClientErrorOperationSupported = systemHelloSuccess.isClientErrorOperationSupported;
        }
        catch (error) {
            this.logger.warn("The platform of this client is outdated and does not support some system operations.");
        }
        this.errorPort.onmessage = async (event) => {
            if (!isClientErrorOperationSupported) {
                return;
            }
            await this.bridge.send("system", operations$4.clientError, { message: event.data }, undefined, { includeOperationCheck: true });
        };
        await this.setEnvironment();
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(systemOperationTypesDecoder, args.operation);
        const operation = operations$4[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    async processPlatformShutdown() {
        Object.values(this.ioc.controllers).forEach((controller) => controller.handlePlatformShutdown ? controller.handlePlatformShutdown() : null);
        this.ioc.preferredConnectionController.stop();
        this.ioc.eventsDispatcher.stop();
        await this.bridge.stop();
    }
    async setEnvironment() {
        const environment = await this.bridge.send("system", operations$4.getEnvironment, undefined);
        const base = await this.bridge.send("system", operations$4.getBase, undefined);
        const globalNamespace = window.glue42core || window.iobrowser;
        const globalNamespaceName = window.glue42core ? "glue42core" : "iobrowser";
        const globalObj = Object.assign({}, globalNamespace, base, { environment });
        window[globalNamespaceName] = globalObj;
    }
    addOperationsExecutors() {
        operations$4.platformShutdown.execute = this.processPlatformShutdown.bind(this);
        operations$4.isFdc3DataWrappingSupported.execute = this.handleIsFdc3DataWrappingSupported.bind(this);
        operations$4.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$4);
    }
    async handleIsFdc3DataWrappingSupported() {
        return { isSupported: true };
    }
}

class Notification {
    onclick = () => { };
    onshow = () => { };
    id;
    title;
    badge;
    body;
    data;
    dir;
    icon;
    image;
    lang;
    renotify;
    requireInteraction;
    silent;
    tag;
    timestamp;
    vibrate;
    clickInterop;
    actions;
    focusPlatformOnDefaultClick;
    severity;
    showToast;
    showInPanel;
    state;
    constructor(config, id) {
        this.id = id;
        this.badge = config.badge;
        this.body = config.body;
        this.data = config.data;
        this.dir = config.dir;
        this.icon = config.icon;
        this.image = config.image;
        this.lang = config.lang;
        this.renotify = config.renotify;
        this.requireInteraction = config.requireInteraction;
        this.silent = config.silent;
        this.tag = config.tag;
        this.timestamp = config.timestamp;
        this.vibrate = config.vibrate;
        this.title = config.title;
        this.clickInterop = config.clickInterop;
        this.actions = config.actions;
        this.focusPlatformOnDefaultClick = config.focusPlatformOnDefaultClick;
        this.severity = config.severity;
        this.showToast = config.showToast;
        this.showInPanel = config.showInPanel;
        this.state = config.state;
    }
}

oneOf$1(constant$2("clientHello"));
const extensionConfigDecoder = object$2({
    widget: object$2({
        inject: boolean$2()
    })
});

const operations$3 = {
    clientHello: { name: "clientHello", resultDecoder: extensionConfigDecoder }
};

class ExtController {
    windowId;
    logger;
    bridge;
    eventsDispatcher;
    channelsController;
    config;
    channels = [];
    unsubFuncs = [];
    contentCommands = {
        widgetVisualizationPermission: { name: "widgetVisualizationPermission", handle: this.handleWidgetVisualizationPermission.bind(this) },
        changeChannel: { name: "changeChannel", handle: this.handleChangeChannel.bind(this) }
    };
    handlePlatformShutdown() {
        this.unsubFuncs.forEach((unsub) => unsub());
        this.channels = [];
        this.unsubFuncs = [];
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("extension.controller.web");
        this.windowId = ioc.publicWindowId;
        this.logger.trace("starting the extension web controller");
        this.bridge = ioc.bridge;
        this.channelsController = ioc.channelsController;
        this.eventsDispatcher = ioc.eventsDispatcher;
        try {
            await this.registerWithPlatform();
        }
        catch (error) {
            return;
        }
        this.channels = await this.channelsController.list();
        const unsubDispatcher = this.eventsDispatcher.onContentMessage(this.handleContentMessage.bind(this));
        const unsubChannels = this.channelsController.onChanged((channel) => {
            this.eventsDispatcher.sendContentMessage({ command: "channelChange", newChannel: channel });
        });
        this.unsubFuncs.push(unsubDispatcher);
        this.unsubFuncs.push(unsubChannels);
    }
    async handleBridgeMessage(_) {
    }
    handleContentMessage(message) {
        if (!message || typeof message.command !== "string") {
            return;
        }
        const foundHandler = this.contentCommands[message.command];
        if (!foundHandler) {
            return;
        }
        foundHandler.handle(message);
    }
    async registerWithPlatform() {
        this.logger.trace("registering with the platform");
        this.config = await this.bridge.send("extension", operations$3.clientHello, { windowId: this.windowId });
        this.logger.trace("the platform responded to the hello message with a valid extension config");
    }
    async handleWidgetVisualizationPermission() {
        if (!this.config?.widget.inject) {
            return this.eventsDispatcher.sendContentMessage({ command: "permissionResponse", allowed: false });
        }
        const currentChannel = this.channels.find((channel) => channel.name === this.channelsController.my());
        this.eventsDispatcher.sendContentMessage({ command: "permissionResponse", allowed: true, channels: this.channels, currentChannel });
    }
    async handleChangeChannel(message) {
        if (message.name === "no-channel") {
            await this.channelsController.leave();
            return;
        }
        await this.channelsController.join(message.name);
    }
}

class EventsDispatcher {
    config;
    glue;
    registry = CallbackRegistryFactory$1();
    glue42EventName = "Glue42";
    _handleMessage;
    _resolveWidgetReadyPromise;
    _resolveModalsUIFactoryReadyPromise;
    _resolveIntentResolverUIFactoryReadyPromise;
    constructor(config) {
        this.config = config;
    }
    events = {
        notifyStarted: { name: "notifyStarted", handle: this.handleNotifyStarted.bind(this) },
        contentInc: { name: "contentInc", handle: this.handleContentInc.bind(this) },
        requestGlue: { name: "requestGlue", handle: this.handleRequestGlue.bind(this) },
        widgetFactoryReady: { name: "widgetFactoryReady", handle: this.handleWidgetReady.bind(this) },
        modalsUIFactoryReady: { name: "modalsUIFactoryReady", handle: this.handleModalsUIFactoryReady.bind(this) },
        intentResolverUIFactoryReady: { name: "intentResolverUIFactoryReady", handle: this.handleIntentResolverUIFactoryReady.bind(this) },
    };
    stop() {
        window.removeEventListener(this.glue42EventName, this._handleMessage);
    }
    start(glue) {
        this.glue = glue;
        this.wireCustomEventListener();
        this.announceStarted();
    }
    sendContentMessage(message) {
        this.send("contentOut", "glue42core", message);
    }
    onContentMessage(callback) {
        return this.registry.add("content-inc", callback);
    }
    async widgetReady() {
        const widgetReadyPromise = new Promise((resolve) => {
            this._resolveWidgetReadyPromise = resolve;
        });
        this.requestWidgetReady();
        return widgetReadyPromise;
    }
    async modalsUIFactoryReady() {
        const modalsUIFactoryReadyPromise = new Promise((resolve) => {
            this._resolveModalsUIFactoryReadyPromise = resolve;
        });
        this.requestModalsUIFactoryReady();
        return modalsUIFactoryReadyPromise;
    }
    async intentResolverUIFactoryReady() {
        const intentResolverUIFactoryReadyPromise = new Promise((resolve) => {
            this._resolveIntentResolverUIFactoryReadyPromise = resolve;
        });
        this.requestIntentResolverUIFactoryReady();
        return intentResolverUIFactoryReadyPromise;
    }
    wireCustomEventListener() {
        this._handleMessage = this.handleMessage.bind(this);
        window.addEventListener(this.glue42EventName, this._handleMessage);
    }
    handleMessage(event) {
        const data = event.detail;
        const namespace = data?.glue42 ?? data?.glue42core;
        if (!namespace) {
            return;
        }
        const glue42Event = namespace.event;
        const foundHandler = this.events[glue42Event];
        if (!foundHandler) {
            return;
        }
        foundHandler.handle(namespace.message);
    }
    announceStarted() {
        this.send("start", "glue42");
    }
    handleRequestGlue() {
        if (!this.config.exposeAPI) {
            this.send("requestGlueResponse", "glue42", { error: "Will not give access to the underlying Glue API, because it was explicitly denied upon initialization." });
            return;
        }
        this.send("requestGlueResponse", "glue42", { glue: this.glue });
    }
    handleNotifyStarted() {
        this.announceStarted();
    }
    handleContentInc(message) {
        this.registry.execute("content-inc", message);
    }
    requestWidgetReady() {
        this.send(REQUEST_WIDGET_READY, "glue42");
    }
    handleWidgetReady() {
        this._resolveWidgetReadyPromise?.();
    }
    requestModalsUIFactoryReady() {
        this.send(REQUEST_MODALS_UI_FACTORY_READY, "glue42");
    }
    handleModalsUIFactoryReady() {
        this._resolveModalsUIFactoryReadyPromise?.();
    }
    requestIntentResolverUIFactoryReady() {
        this.send(REQUEST_INTENT_RESOLVER_UI_FACTORY_READY, "glue42");
    }
    handleIntentResolverUIFactoryReady() {
        this._resolveIntentResolverUIFactoryReadyPromise?.();
    }
    send(eventName, namespace, message) {
        const payload = {};
        payload[namespace] = { event: eventName, message };
        const event = new CustomEvent(this.glue42EventName, { detail: payload });
        window.dispatchEvent(event);
    }
}

class PreferredConnectionController {
    coreGlue;
    transactionTimeout = 15000;
    transactionLocks = {};
    webPlatformTransport;
    webPlatformMessagesUnsubscribe;
    reconnectCounter = 0;
    logger;
    constructor(coreGlue) {
        this.coreGlue = coreGlue;
        this.logger = this.coreGlue.logger.subLogger("web.preferred.connection.controller");
    }
    stop() {
        if (!this.webPlatformMessagesUnsubscribe) {
            return;
        }
        this.webPlatformMessagesUnsubscribe();
    }
    async start(coreConfig) {
        if (coreConfig.isPlatformInternal) {
            this.logger.trace("This is an internal client to the platform, skipping all client preferred communication logic.");
            return;
        }
        const isConnectedToPlatform = this.coreGlue.connection.transport.name() === webPlatformTransportName;
        if (!isConnectedToPlatform) {
            return ioError.raiseError("Cannot initiate the Glue Web Bridge, because the initial connection was not handled by a Web Platform transport.");
        }
        if (!this.coreGlue.connection.transport.isPreferredActivated) {
            this.logger.trace("The platform of this client was configured without a preferred connection, skipping the rest of the initialization.");
            return;
        }
        this.webPlatformTransport = this.coreGlue.connection.transport;
        this.webPlatformMessagesUnsubscribe = this.webPlatformTransport.onMessage(this.handleWebPlatformMessage.bind(this));
        const transportState = await this.getCurrentPlatformTransportState();
        await this.checkSwitchTransport(transportState);
    }
    handleWebPlatformMessage(msg) {
        if (typeof msg === "string") {
            return;
        }
        const isConnectedToPlatform = this.coreGlue.connection.transport.name() === webPlatformTransportName;
        const type = msg.type;
        const args = msg.args;
        const transactionId = msg.transactionId;
        if (type === Glue42CoreMessageTypes.transportSwitchRequest.name) {
            return this.handleTransportSwitchRequest(args, transactionId);
        }
        if (type === Glue42CoreMessageTypes.platformUnload.name && !isConnectedToPlatform) {
            return this.handlePlatformUnload();
        }
        if (type === Glue42CoreMessageTypes.getCurrentTransportResponse.name) {
            return this.handleGetCurrentTransportResponse(args, transactionId);
        }
        if (type === Glue42CoreMessageTypes.checkPreferredLogic.name) {
            return this.handleCheckPreferredLogic(transactionId);
        }
        if (type === Glue42CoreMessageTypes.checkPreferredConnection.name) {
            return this.handleCheckPreferredConnection(args, transactionId);
        }
    }
    async reEstablishPlatformPort() {
        try {
            await this.webPlatformTransport.connect();
        }
        catch (error) {
            this.logger.trace(`Error when re-establishing port connection to the platform: ${JSON.stringify(error)}`);
            --this.reconnectCounter;
            if (this.reconnectCounter > 0) {
                return this.reEstablishPlatformPort();
            }
            this.logger.warn("This client lost connection to the platform while connected to a preferred GW and was not able to re-connect to the platform.");
        }
        this.logger.trace("The connection to the platform was re-established, closing the connection to the web gateway.");
        this.reconnectCounter = 0;
        this.webPlatformTransport.close();
        const transportState = await this.getCurrentPlatformTransportState();
        await this.checkSwitchTransport(transportState);
    }
    async checkSwitchTransport(config) {
        const myCurrentTransportName = this.coreGlue.connection.transport.name();
        if (myCurrentTransportName === config.transportName) {
            this.logger.trace("A check switch was requested, but the platform transport and my transport are identical, no switch is necessary");
            return;
        }
        this.logger.trace(`A check switch was requested and a transport switch is necessary, because this client is now on ${myCurrentTransportName}, but it should reconnect to ${JSON.stringify(config)}`);
        const result = await this.coreGlue.connection.switchTransport(config);
        this.setConnected();
        this.logger.trace(`The transport switch was completed with result: ${JSON.stringify(result)}`);
    }
    async getCurrentPlatformTransportState() {
        this.logger.trace("Requesting the current transport state of the platform.");
        const transaction = this.setTransaction(Glue42CoreMessageTypes.getCurrentTransport.name);
        this.sendPlatformMessage(Glue42CoreMessageTypes.getCurrentTransport.name, transaction.id);
        const transportState = await transaction.lock;
        this.logger.trace(`The platform responded with transport state: ${JSON.stringify(transportState)}`);
        return transportState;
    }
    setTransaction(operation) {
        const transaction = {};
        const transactionId = nanoid$1(10);
        const transactionLock = new Promise((resolve, reject) => {
            let transactionLive = true;
            transaction.lift = (args) => {
                transactionLive = false;
                delete this.transactionLocks[transactionId];
                resolve(args);
            };
            transaction.fail = (reason) => {
                transactionLive = false;
                delete this.transactionLocks[transactionId];
                reject(reason);
            };
            setTimeout(() => {
                if (!transactionLive) {
                    return;
                }
                transactionLive = false;
                this.logger.warn(`Transaction for operation: ${operation} timed out.`);
                delete this.transactionLocks[transactionId];
                reject(`Transaction for operation: ${operation} timed out.`);
            }, this.transactionTimeout);
        });
        transaction.lock = transactionLock;
        transaction.id = transactionId;
        this.transactionLocks[transactionId] = transaction;
        return transaction;
    }
    sendPlatformMessage(type, transactionId, args) {
        this.logger.trace(`Sending a platform message of type: ${type}, id: ${transactionId} and args: ${JSON.stringify(args)}`);
        this.webPlatformTransport.sendObject({
            glue42core: { type, args, transactionId }
        });
    }
    handleTransportSwitchRequest(args, transactionId) {
        this.logger.trace(`Received a transport switch request with id: ${transactionId} and data: ${JSON.stringify(args)}`);
        this.coreGlue.connection.switchTransport(args.switchSettings)
            .then((result) => {
            this.logger.trace(`The transport switch was completed with result: ${JSON.stringify(result)}`);
            this.setConnected();
            this.sendPlatformMessage(Glue42CoreMessageTypes.transportSwitchResponse.name, transactionId, { success: result.success });
        })
            .catch((error) => {
            this.logger.error(error);
            this.sendPlatformMessage(Glue42CoreMessageTypes.transportSwitchResponse.name, transactionId, { success: false });
        });
    }
    handlePlatformUnload() {
        this.reconnectCounter = 5;
        this.logger.trace("The platform was unloaded while I am connected to a preferred connection, re-establishing the port connection.");
        this.reEstablishPlatformPort();
    }
    handleGetCurrentTransportResponse(args, transactionId) {
        this.logger.trace(`Got a current transport response from the platform with id: ${transactionId} and data: ${JSON.stringify(args)}`);
        const transportState = args.transportState;
        const transaction = this.transactionLocks[transactionId];
        transaction?.lift(transportState);
    }
    handleCheckPreferredLogic(transactionId) {
        setTimeout(() => this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredLogicResponse.name, transactionId), 0);
    }
    handleCheckPreferredConnection(args, transactionId) {
        const url = args.url;
        this.logger.trace(`Testing the possible connection to: ${url}`);
        this.checkPreferredConnection(url)
            .then((result) => {
            this.logger.trace(`The connection to ${url} is possible`);
            this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredConnectionResponse.name, transactionId, result);
        })
            .catch((error) => {
            this.logger.trace(`The connection to ${url} is not possible`);
            this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredConnectionResponse.name, transactionId, { error });
        });
    }
    checkPreferredConnection(url) {
        return new Promise((resolve) => {
            const ws = new WebSocket(url);
            ws.onerror = () => resolve({ live: false });
            ws.onopen = () => {
                ws.close();
                resolve({ live: true });
            };
        });
    }
    setConnected() {
        this.webPlatformTransport.manualSetReadyState();
    }
}

const operations$2 = {
    getCurrent: { name: "getCurrent", resultDecoder: simpleThemeResponseDecoder },
    list: { name: "list", resultDecoder: allThemesResponseDecoder },
    select: { name: "select", dataDecoder: selectThemeConfigDecoder }
};

class ThemesController {
    logger;
    bridge;
    registry = CallbackRegistryFactory$1();
    themesSubscription;
    activeThemeSubs = 0;
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("themes.controller.web");
        this.logger.trace("starting the web themes controller");
        this.bridge = ioc.bridge;
        const api = this.toApi();
        coreGlue.themes = api;
        this.logger.trace("themes are ready");
    }
    handlePlatformShutdown() {
        this.registry.clear();
        this.activeThemeSubs = 0;
        this.themesSubscription?.close();
        delete this.themesSubscription;
    }
    async handleBridgeMessage() {
    }
    toApi() {
        const api = {
            getCurrent: this.getCurrent.bind(this),
            list: this.list.bind(this),
            select: this.select.bind(this),
            onChanged: this.onChanged.bind(this)
        };
        return Object.freeze(api);
    }
    async getCurrent() {
        const bridgeResponse = await this.bridge.send("themes", operations$2.getCurrent, undefined, undefined, { includeOperationCheck: true });
        return bridgeResponse.theme;
    }
    async list() {
        const bridgeResponse = await this.bridge.send("themes", operations$2.list, undefined, undefined, { includeOperationCheck: true });
        return bridgeResponse.themes;
    }
    async select(name) {
        runDecoderWithIOError(nonEmptyStringDecoder$2, name);
        await this.bridge.send("themes", operations$2.select, { name }, undefined, { includeOperationCheck: true });
    }
    async onChanged(callback) {
        if (typeof callback !== "function") {
            return ioError.raiseError("onChanged requires a callback of type function");
        }
        const subReady = this.themesSubscription ?
            Promise.resolve() :
            this.configureThemeSubscription();
        await subReady;
        ++this.activeThemeSubs;
        const unsubFunc = this.registry.add("on-theme-change", callback);
        return () => this.themeUnsub(unsubFunc);
    }
    async configureThemeSubscription() {
        if (this.themesSubscription) {
            return;
        }
        this.themesSubscription = await this.bridge.createNotificationsSteam();
        this.themesSubscription.onData((data) => {
            const eventData = data.data;
            const validation = simpleThemeResponseDecoder.run(eventData);
            if (!validation.ok) {
                this.logger.warn(`Received invalid theme data on the theme event stream: ${JSON.stringify(validation.error)}`);
                return;
            }
            const themeChanged = validation.result;
            this.registry.execute("on-theme-change", themeChanged.theme);
        });
        this.themesSubscription.onClosed(() => {
            this.logger.warn("The Themes interop stream was closed, no theme changes notifications will be received");
            this.registry.clear();
            this.activeThemeSubs = 0;
            delete this.themesSubscription;
        });
    }
    themeUnsub(registryUnsub) {
        registryUnsub();
        --this.activeThemeSubs;
        if (this.activeThemeSubs) {
            return;
        }
        this.themesSubscription?.close();
        delete this.themesSubscription;
    }
}

class SessionStorageController {
    sessionStorage = window.sessionStorage;
    windowId;
    get allNamespaces() {
        return [{ namespace: this.windowNamespace, defaultValue: {} }];
    }
    configure(config) {
        this.windowId = config.windowId;
        this.allNamespaces.forEach(({ namespace, defaultValue }) => {
            const data = this.sessionStorage.getItem(namespace);
            if (!data) {
                this.sessionStorage.setItem(namespace, JSON.stringify(defaultValue));
            }
        });
    }
    get windowNamespace() {
        return `io_connect_window_${this.windowId}`;
    }
    getWindowData() {
        return JSON.parse(this.sessionStorage.getItem(this.windowNamespace));
    }
    setWindowData(data, key) {
        const allData = this.getWindowData();
        allData[key] = data;
        this.sessionStorage.setItem(this.windowNamespace, JSON.stringify(allData));
    }
}

const operations$1 = {
    clear: { name: "clear", dataDecoder: basePrefsConfigDecoder },
    clearAll: { name: "clearAll" },
    get: { name: "get", dataDecoder: basePrefsConfigDecoder, resultDecoder: getPrefsResultDecoder },
    getAll: { name: "getAll", resultDecoder: getAllPrefsResultDecoder },
    set: { name: "set", dataDecoder: changePrefsDataDecoder },
    update: { name: "update", dataDecoder: changePrefsDataDecoder },
    prefsChanged: { name: "prefsChanged", dataDecoder: getPrefsResultDecoder },
    prefsHello: { name: "prefsHello", resultDecoder: prefsHelloSuccessDecoder },
    operationCheck: { name: "operationCheck" },
    registerSubscriber: { name: "registerSubscriber", dataDecoder: subscriberRegisterConfigDecoder },
};

class PrefsController {
    supportedOperationsNames = [];
    bridge;
    config;
    logger;
    appManagerController;
    platformAppName;
    registry = CallbackRegistryFactory$1();
    validNonExistentApps;
    signaledSubscription = false;
    interopId;
    handlePlatformShutdown() {
        this.registry.clear();
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("prefs.controller.web");
        this.logger.trace("starting the web prefs controller");
        this.addOperationsExecutors();
        this.interopId = coreGlue.interop.instance.instance;
        this.bridge = ioc.bridge;
        this.config = ioc.config;
        this.appManagerController = ioc.appManagerController;
        try {
            const prefsHelloSuccess = await this.bridge.send("prefs", operations$1.prefsHello, undefined, undefined, { includeOperationCheck: true });
            this.platformAppName = prefsHelloSuccess.platform.app;
            this.validNonExistentApps = prefsHelloSuccess.validNonExistentApps ?? [];
        }
        catch (error) {
            this.logger.warn("The platform of this client is outdated and does not support Prefs API.");
            return;
        }
        this.logger.trace("no need for platform registration, attaching the prefs property to glue and returning");
        const api = this.toApi();
        coreGlue.prefs = api;
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(prefsOperationTypesDecoder, args.operation);
        const operation = operations$1[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    async get(app) {
        const verifiedApp = app === undefined || app === null ? this.getMyAppName() : runDecoderWithIOError(nonEmptyStringDecoder$2, app);
        const { prefs } = await this.bridge.send("prefs", operations$1.get, { app: verifiedApp }, undefined, { includeOperationCheck: true });
        return prefs;
    }
    async update(data, options) {
        const verifiedOptions = runDecoderWithIOError(optional$2(basePrefsConfigDecoder), options);
        const app = verifiedOptions?.app ?? this.getMyAppName();
        await this.updateFor(app, data);
    }
    addOperationsExecutors() {
        operations$1.prefsChanged.execute = this.handleOnChanged.bind(this);
        operations$1.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        this.supportedOperationsNames = getSupportedOperationsNames(operations$1);
    }
    toApi() {
        const api = {
            clear: this.clear.bind(this),
            clearAll: this.clearAll.bind(this),
            clearFor: this.clearFor.bind(this),
            get: this.get.bind(this),
            getAll: this.getAll.bind(this),
            set: this.set.bind(this),
            setFor: this.setFor.bind(this),
            subscribe: this.subscribe.bind(this),
            subscribeFor: this.subscribeFor.bind(this),
            update: this.update.bind(this),
            updateFor: this.updateFor.bind(this),
        };
        return api;
    }
    async clear() {
        const app = this.getMyAppName();
        await this.clearFor(app);
    }
    async clearAll() {
        await this.bridge.send("prefs", operations$1.clearAll, undefined, undefined, { includeOperationCheck: true });
    }
    async clearFor(app) {
        const verifiedApp = runDecoderWithIOError(nonEmptyStringDecoder$2, app);
        await this.bridge.send("prefs", operations$1.clear, { app: verifiedApp }, undefined, { includeOperationCheck: true });
    }
    async getAll() {
        const result = await this.bridge.send("prefs", operations$1.getAll, undefined, undefined, { includeOperationCheck: true });
        return result;
    }
    async set(data, options) {
        const verifiedOptions = runDecoderWithIOError(optional$2(basePrefsConfigDecoder), options);
        const app = verifiedOptions?.app ?? this.getMyAppName();
        await this.setFor(app, data);
    }
    async setFor(app, data) {
        const verifiedApp = runDecoderWithIOError(nonEmptyStringDecoder$2, app);
        const verifiedData = runDecoderWithIOError(object$2(), data);
        await this.bridge.send("prefs", operations$1.set, { app: verifiedApp, data: verifiedData }, undefined, { includeOperationCheck: true });
    }
    subscribe(callback) {
        const app = this.getMyAppName();
        return this.subscribeFor(app, callback);
    }
    subscribeFor(app, callback) {
        const verifiedApp = runDecoderWithIOError(nonEmptyStringDecoder$2, app);
        const applications = this.appManagerController.getApplications();
        const isValidApp = verifiedApp === this.platformAppName || applications.some((application) => application.name === verifiedApp) || this.validNonExistentApps.includes(verifiedApp);
        if (!isValidApp) {
            return ioError.raiseError(`The provided app name "${app}" is not valid.`);
        }
        if (typeof callback !== "function") {
            return ioError.raiseError("Cannot subscribe to prefs, because the provided callback is not a function!");
        }
        if (!this.signaledSubscription) {
            this.bridge.send("prefs", operations$1.registerSubscriber, { interopId: this.interopId }, undefined, { includeOperationCheck: true })
                .catch((error) => {
                this.logger.warn("Failed to register subscriber for prefs");
                this.logger.error(error);
            });
            this.signaledSubscription = true;
        }
        const subscriptionKey = this.getSubscriptionKey(verifiedApp);
        this.get(verifiedApp).then(callback);
        return this.registry.add(subscriptionKey, callback);
    }
    async updateFor(app, data) {
        const verifiedApp = runDecoderWithIOError(nonEmptyStringDecoder$2, app);
        const verifiedData = runDecoderWithIOError(object$2(), data);
        await this.bridge.send("prefs", operations$1.update, { app: verifiedApp, data: verifiedData }, undefined, { includeOperationCheck: true });
    }
    getMyAppName() {
        const myAppName = this.config.isPlatformInternal ? this.platformAppName : this.appManagerController.me?.application.name;
        if (!myAppName) {
            return ioError.raiseError("App Preferences operations can not be executed for windows that do not have app!");
        }
        return myAppName;
    }
    getSubscriptionKey(app) {
        return `prefs-changed-${app}`;
    }
    async handleOnChanged({ prefs }) {
        const subscriptionKey = this.getSubscriptionKey(prefs.app);
        this.registry.execute(subscriptionKey, prefs);
    }
}

const operations = {
    getResources: { name: "getResources", dataDecoder: getResourcesDataDecoder, resultDecoder: getResourcesResultDecoder },
    operationCheck: { name: "operationCheck", dataDecoder: operationCheckConfigDecoder, resultDecoder: operationCheckResultDecoder },
    showAlert: { name: "showAlert", dataDecoder: uiAlertRequestMessageDecoder },
    showDialog: { name: "showDialog", dataDecoder: uiDialogRequestMessageDecoder },
    alertInteropAction: { name: "alertInteropAction", dataDecoder: alertInteropActionDataDecoder },
    showResolver: { name: "showResolver", dataDecoder: uiResolverRequestMessageDecoder, resultDecoder: uiResolverResponseMessageDecoder },
};

const DEFAULT_ALERT_TTL = 5 * 1000;
const MODALS_SHADOW_HOST_ID = "io-modals-shadow-host";
const MODALS_ROOT_ELEMENT_ID = "io-modals-root";
const WIDGET_SHADOW_HOST_ID = "io-widget-shadow-host";
const WIDGET_ROOT_ELEMENT_ID = "io-widget-root";
const INTENT_RESOLVER_SHADOW_HOST_ID = "io-intent-resolver-shadow-host";
const INTENT_RESOLVER_ROOT_ELEMENT_ID = "io-intent-resolver-root";
const SHADOW_ROOT_ELEMENT_CLASSNAME = "io-body io-variables";

class UIController {
    ioc;
    supportedOperationsNames = [];
    logger;
    bridge;
    config;
    zIndexDictionary = {
        [WIDGET_SHADOW_HOST_ID]: "100",
        [MODALS_SHADOW_HOST_ID]: "101",
        [INTENT_RESOLVER_SHADOW_HOST_ID]: "100"
    };
    widgetResources;
    modalsResources;
    intentResolverResources;
    modalsUiApi;
    isDialogOpen = false;
    intentResolverUiApi;
    isIntentResolverOpen = false;
    constructor(ioc) {
        this.ioc = ioc;
    }
    async start(coreGlue, ioc) {
        this.logger = coreGlue.logger.subLogger("ui.controller.web");
        this.logger.trace("starting the ui controller");
        this.bridge = ioc.bridge;
        this.config = ioc.config;
        this.addOperationsExecutors();
        const resources = await this.getResources();
        if (!resources) {
            this.logger.trace("No UI elements to display - platform is not initialized with any UI resources");
            return;
        }
        this.logger.trace(`Received UI resources from platform: ${JSON.stringify(resources)}`);
        this.setResources(resources);
    }
    async handleBridgeMessage(args) {
        const operationName = runDecoderWithIOError(uiOperationTypesDecoder, args.operation);
        const operation = operations[operationName];
        if (!operation.execute) {
            return;
        }
        let operationData = args.data;
        if (operation.dataDecoder) {
            operationData = runDecoderWithIOError(operation.dataDecoder, args.data);
        }
        return await operation.execute(operationData);
    }
    async showComponents(io) {
        const initializeWidgetPromise = this.widgetResources ? this.initializeWidget(io, this.widgetResources) : Promise.resolve();
        const initializeModalsPromise = this.modalsResources ? this.initializeModalsUi(io, this.modalsResources) : Promise.resolve();
        const initializeIntentResolverPromise = this.intentResolverResources ? this.initializeIntentResolverUI(io, this.intentResolverResources) : Promise.resolve();
        await Promise.all([
            this.config.widget.awaitFactory ? initializeWidgetPromise : Promise.resolve(),
            this.config.modals.awaitFactory ? initializeModalsPromise : Promise.resolve(),
            this.config.intentResolver.awaitFactory ? initializeIntentResolverPromise : Promise.resolve(),
        ]);
    }
    isIntentResolverEnabled() {
        return !!this.intentResolverResources && this.config.intentResolver.enable;
    }
    addOperationsExecutors() {
        operations.operationCheck.execute = async (config) => handleOperationCheck(this.supportedOperationsNames, config.operation);
        operations.showAlert.execute = this.handleShowAlert.bind(this);
        operations.showDialog.execute = this.handleShowDialog.bind(this);
        operations.showResolver.execute = this.handleShowResolver.bind(this);
        this.supportedOperationsNames = getSupportedOperationsNames(operations);
    }
    async handleShowAlert({ config }) {
        if (!this.config.modals.alerts.enabled) {
            return ioError.raiseError("Unable to perform showAlert operation because the client was initialized with 'modals: { alerts: { enabled: false } }' config.");
        }
        const modalsUiApi = this.modalsUiApi;
        if (!modalsUiApi) {
            return ioError.raiseError("Unable to perform showAlert operation because modalsUiApi is missing.");
        }
        const { promise: closePromise, resolve: resolveClosePromise } = wrapPromise();
        const onClick = (config) => {
            const decodedConfig = alertOnClickConfigDecoder.run(config);
            if (!decodedConfig.ok) {
                this.logger.error(`alert.onClick() was invoked with an invalid config. Error: ${JSON.stringify(decodedConfig.error)}.`);
                return;
            }
            const { interopAction } = decodedConfig.result;
            this.bridge.send("ui", operations.alertInteropAction, { interopAction }, undefined, { includeOperationCheck: true })
                .catch((error) => this.logger.warn(extractErrorMsg(error)));
        };
        let result;
        try {
            this.logger.trace(`Open alert with config: ${JSON.stringify(config)}`);
            result = modalsUiApi.alerts.open({ ...config, onClick, onClose: resolveClosePromise });
        }
        catch (error) {
            return ioError.raiseError(`modalsUiApi.alerts.open() failed. Reason: ${extractErrorMsg(error)}.`);
        }
        const decodeResult = openAlertResultDecoder.run(result);
        if (!decodeResult.ok) {
            return ioError.raiseError(`modalsUiApi.alerts.open() returned an invalid result. Error: ${JSON.stringify(decodeResult.error)}.`);
        }
        const timeoutId = setTimeout(() => {
            resolveClosePromise();
        }, getSafeTimeoutDelay(config.ttl ?? DEFAULT_ALERT_TTL));
        closePromise.then(() => {
            clearTimeout(timeoutId);
            try {
                modalsUiApi.alerts.close({ id: decodeResult.result.id });
            }
            catch (error) {
                this.logger.warn(`Failed to close alert with id ${decodeResult.result.id}. Reason: ${extractErrorMsg(error)}`);
            }
        });
    }
    async handleShowDialog({ config }) {
        if (!this.config.modals.dialogs.enabled) {
            return ioError.raiseError("Unable to perform showDialog operation because the client was initialized with 'modals: { dialogs: { enabled: false } }' config.");
        }
        const modalsUiApi = this.modalsUiApi;
        if (!modalsUiApi) {
            return ioError.raiseError("Unable to perform showDialog operation because modalsUiApi is missing.");
        }
        if (this.isDialogOpen) {
            return ioError.raiseError("Cannot open a dialog because another one is already open.");
        }
        const { promise: completionPromise, resolve: resolveCompletionPromise } = wrapPromise();
        let result;
        try {
            this.logger.trace(`Open dialog with config: ${JSON.stringify(config)}`);
            result = modalsUiApi.dialogs.open({ ...config, onCompletion: resolveCompletionPromise });
        }
        catch (error) {
            return ioError.raiseError(`modalsUiApi.dialogs.open() failed. Reason: ${extractErrorMsg(error)}.`);
        }
        const decodeResult = openDialogResultDecoder.run(result);
        if (!decodeResult.ok) {
            return ioError.raiseError(`modalsUiApi.dialogs.open() returned an invalid result. Error: ${JSON.stringify(decodeResult.error)}.`);
        }
        this.isDialogOpen = true;
        let timeoutId;
        if (config.timer) {
            timeoutId = setTimeout(() => {
                resolveCompletionPromise({ response: { isExpired: true } });
            }, getSafeTimeoutDelay(config.timer.duration));
        }
        const response = await completionPromise;
        clearTimeout(timeoutId);
        this.isDialogOpen = false;
        try {
            modalsUiApi.dialogs.close({ id: decodeResult.result.id });
        }
        catch (error) {
            this.logger.warn(`Failed to close dialog with id ${decodeResult.result.id}. Reason: ${extractErrorMsg(error)}`);
        }
        const decodeResponse = dialogOnCompletionConfigDecoder.run(response);
        if (!decodeResponse.ok) {
            return ioError.raiseError(`completionPromise was resolved with an invalid result. Error: ${JSON.stringify(decodeResponse.error)}.`);
        }
        return { result: decodeResponse.result.response };
    }
    async handleShowResolver({ config }) {
        this.logger.trace(`Received open intent resolver request with config: ${JSON.stringify(config)}`);
        if (!this.config.intentResolver.enable) {
            return ioError.raiseError("Unable to perform showResolver operation because the client was initialized with 'intentResolver: { enable: false }' config.");
        }
        const intentResolverApi = this.intentResolverUiApi;
        if (!intentResolverApi) {
            return ioError.raiseError("Unable to perform showResolver operation because intentResolverApi is missing.");
        }
        if (this.isIntentResolverOpen) {
            return ioError.raiseError("Cannot open the intent resolver because another one is already open.");
        }
        const { promise: completionPromise, resolve: resolveIntentResolverPromise } = wrapPromise();
        let result;
        try {
            this.logger.trace(`Open intent resolver with config: ${JSON.stringify(config)}`);
            result = intentResolverApi.open({ ...config, onUserResponse: resolveIntentResolverPromise });
        }
        catch (error) {
            return ioError.raiseError(`intentResolverUI.open() failed. Reason: ${extractErrorMsg(error)}.`);
        }
        const decodedOpenResult = openResolverResultDecoder.run(result);
        if (!decodedOpenResult.ok) {
            return ioError.raiseError(`intentResolverUI.open() returned an invalid result. Error: ${JSON.stringify(decodedOpenResult.error)}.`);
        }
        const timer = setTimeout(() => resolveIntentResolverPromise({ response: { isExpired: true } }), getSafeTimeoutDelay(config.timeout));
        const response = await completionPromise;
        clearTimeout(timer);
        this.isIntentResolverOpen = false;
        try {
            intentResolverApi.close({ id: decodedOpenResult.result.id });
        }
        catch (error) {
            this.logger.warn(`Failed to close intent resolver with id ${decodedOpenResult.result.id}. Reason: ${extractErrorMsg(error)}`);
        }
        const decodedResponse = onUserResponseResponseDecoder.run(response);
        if (!decodedResponse.ok) {
            return ioError.raiseError(`completionPromise was resolved with an invalid result. Error: ${JSON.stringify(decodedResponse.error)}.`);
        }
        return { result: decodedResponse.result.response };
    }
    async getResources() {
        const data = {
            origin: window.origin
        };
        try {
            const result = await this.bridge.send("ui", operations.getResources, data, undefined, { includeOperationCheck: true });
            return result.resources;
        }
        catch (error) {
            this.logger.warn(error?.message || JSON.stringify(error));
        }
    }
    appendModalsResources(resources) {
        this.logger.trace("Appending modals resources");
        return this.appendResources(MODALS_SHADOW_HOST_ID, MODALS_ROOT_ELEMENT_ID, resources.sources);
    }
    appendWidgetResources(resources) {
        this.logger.trace("Appending widget resources");
        return this.appendResources(WIDGET_SHADOW_HOST_ID, WIDGET_ROOT_ELEMENT_ID, resources.sources);
    }
    appendIntentResolverResources(resources) {
        this.logger.trace("Appending intent resolver resources");
        return this.appendResources(INTENT_RESOLVER_SHADOW_HOST_ID, INTENT_RESOLVER_ROOT_ELEMENT_ID, resources.sources);
    }
    appendResources(shadowHostId, rootElementId, sources) {
        const { bundle, fonts = [], styles } = sources;
        const shadowHost = document.createElement("div");
        shadowHost.id = shadowHostId;
        shadowHost.style.position = "fixed";
        shadowHost.style.zIndex = this.zIndexDictionary[shadowHostId];
        const shadowRoot = shadowHost.attachShadow({ mode: "open" });
        const script = document.createElement("script");
        script.src = bundle;
        script.type = "module";
        shadowRoot.appendChild(script);
        const rootElement = document.createElement("div");
        rootElement.id = rootElementId;
        rootElement.className = SHADOW_ROOT_ELEMENT_CLASSNAME;
        shadowRoot.appendChild(rootElement);
        styles.forEach((style) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = style;
            shadowRoot.appendChild(link);
        });
        fonts.forEach((font) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = font;
            document.head.insertBefore(link, document.head.firstChild);
        });
        document.body.appendChild(shadowHost);
        return { rootElement };
    }
    async initializeWidget(io, resources) {
        this.logger.trace("Initializing IOBrowserWidget.");
        const { rootElement } = this.appendWidgetResources(resources);
        this.subscribeForThemeChanges(io, rootElement);
        const config = {
            ...deepmerge$1(resources.config, this.config.widget),
            rootElement
        };
        return PromiseWrap(async () => {
            await this.ioc.eventsDispatcher.widgetReady();
            this.logger.trace(`IOBrowserWidget factory is available. Invoking it with config: ${JSON.stringify(config)}`);
            await window.IOBrowserWidget(io, config);
            this.logger.trace("IOBrowserWidget was initialized successfully.");
        }, config.timeout, `Timeout of ${config.timeout}ms hit waiting for IOBrowserWidget to initialize.`);
    }
    async initializeModalsUi(io, resources) {
        this.logger.trace("Initializing IOBrowserModalsUI.");
        const { rootElement } = this.appendModalsResources(resources);
        this.subscribeForThemeChanges(io, rootElement);
        const config = {
            ...this.config.modals,
            rootElement
        };
        return PromiseWrap(async () => {
            await this.ioc.eventsDispatcher.modalsUIFactoryReady();
            this.logger.trace(`IOBrowserModalsUI factory is available. Invoking it with config: ${JSON.stringify(config)}`);
            this.modalsUiApi = await window.IOBrowserModalsUI(io, config);
            this.logger.trace("IOBrowserModalsUI was initialized successfully.");
        }, config.timeout, `Timeout of ${config.timeout}ms hit waiting for IOBrowserModalsUI to initialize.`);
    }
    async initializeIntentResolverUI(io, resources) {
        this.logger.trace("Initializing IOBrowserIntentResolverUI.");
        const { rootElement } = this.appendIntentResolverResources(resources);
        this.subscribeForThemeChanges(io, rootElement);
        const config = {
            ...this.config.intentResolver,
            rootElement
        };
        const timeout = config.timeout;
        return PromiseWrap(async () => {
            await this.ioc.eventsDispatcher.intentResolverUIFactoryReady();
            this.logger.trace(`IOBrowserIntentResolverUI factory is available. Invoking it with config: ${JSON.stringify(config)}`);
            this.intentResolverUiApi = await window.IOBrowserIntentResolverUI(io, config);
            this.logger.trace("IOBrowserIntentResolverUI initialized successfully.");
        }, timeout, `Timeout of ${timeout}ms hit waiting for IOBrowserIntentResolverUI to initialize.`);
    }
    setResources(resources) {
        this.setWidgetResources(resources.widget);
        this.setModalsUiResources(resources.modals);
        this.setIntentResolverResources(resources.intentResolver);
    }
    setWidgetResources(resources) {
        const baseMsg = "Widget won't be displayed. Reason: ";
        const decodedConfig = widgetConfigDecoder.run(this.config.widget);
        if (!decodedConfig.ok) {
            this.logger.warn(`${baseMsg} invalid widget config. Error: ${decodedConfig.error}`);
            return;
        }
        if (!this.config.widget.enable) {
            this.logger.trace(`${baseMsg} Client initialized with 'widget: { enable: false }' config`);
            return;
        }
        if (!resources) {
            this.logger.trace(`${baseMsg} Platform did not provide resources`);
            return;
        }
        if (resources.blockedOrigin) {
            this.logger.warn(`${baseMsg} Platform has blocked client's origin ('${window.location.toString()}') from retrieving widget resources`);
            return;
        }
        this.widgetResources = resources;
    }
    setModalsUiResources(resources) {
        const baseMsg = "Modals won't be displayed. Reason: ";
        const decodedConfig = modalsConfigDecoder.run(this.config.modals);
        if (!decodedConfig.ok) {
            this.logger.warn(`${baseMsg} invalid modals config. Error: ${decodedConfig.error}`);
            return;
        }
        if (!this.config.modals.alerts.enabled && !this.config.modals.dialogs.enabled) {
            this.logger.trace(`${baseMsg} Client initialized with 'modals: { alerts: { enabled: false }, dialogs: { enabled: false } }' config`);
            return;
        }
        if (!resources) {
            this.logger.trace(`${baseMsg} Platform did not provide resources`);
            return;
        }
        if (resources.blockedOrigin) {
            this.logger.warn(`${baseMsg} Platform has blocked client's origin ('${window.location.toString()}') from retrieving modals resources`);
            return;
        }
        this.modalsResources = resources;
    }
    setIntentResolverResources(resources) {
        const baseMsg = "Intent Resolver UI won't be displayed. Reason: ";
        const decodedConfig = intentResolverConfigDecoder.run(this.config.intentResolver);
        if (!decodedConfig.ok) {
            this.logger.warn(`${baseMsg} invalid intent resolver config. Error: ${JSON.stringify(decodedConfig.error)}`);
            return;
        }
        if (!this.config.intentResolver.enable) {
            this.logger.trace(`${baseMsg} Client initialized with 'intentResolver: { enable: false }' config`);
            return;
        }
        if (!resources) {
            this.logger.trace(`${baseMsg} Platform did not provide resources`);
            return;
        }
        if (resources.blockedOrigin) {
            this.logger.warn(`${baseMsg} Platform has blocked client's origin ('${window.location.toString()}') from retrieving intent resolver resources`);
            return;
        }
        this.intentResolverResources = resources;
    }
    subscribeForThemeChanges(io, element) {
        const themesApi = io.themes;
        if (!themesApi) {
            return;
        }
        const changeTheme = async (theme) => {
            if (element.classList.contains(theme.name)) {
                return;
            }
            const allThemes = await themesApi.list();
            element.classList.remove(...allThemes.map(({ name }) => name));
            element.classList.add(theme.name);
        };
        themesApi.onChanged(changeTheme);
        themesApi.getCurrent().then(changeTheme);
    }
}

class IoC {
    _coreGlue;
    _communicationId;
    _publicWindowId;
    _webConfig;
    _windowsControllerInstance;
    _appManagerControllerInstance;
    _layoutsControllerInstance;
    _notificationsControllerInstance;
    _intentsControllerInstance;
    _channelsControllerInstance;
    _themesControllerInstance;
    _extensionController;
    _systemControllerInstance;
    _bridgeInstance;
    _eventsDispatcher;
    _preferredConnectionController;
    _sessionController;
    _prefsControllerInstance;
    _uiController;
    controllers = {
        windows: this.windowsController,
        appManager: this.appManagerController,
        layouts: this.layoutsController,
        notifications: this.notificationsController,
        intents: this.intentsController,
        channels: this.channelsController,
        system: this.systemController,
        extension: this.extensionController,
        themes: this.themesController,
        prefs: this.prefsController,
        ui: this.uiController
    };
    get communicationId() {
        return this._communicationId;
    }
    get publicWindowId() {
        return this._publicWindowId;
    }
    get windowsController() {
        if (!this._windowsControllerInstance) {
            this._windowsControllerInstance = new WindowsController();
        }
        return this._windowsControllerInstance;
    }
    get uiController() {
        if (!this._uiController) {
            this._uiController = new UIController(this);
        }
        return this._uiController;
    }
    get appManagerController() {
        if (!this._appManagerControllerInstance) {
            this._appManagerControllerInstance = new AppManagerController();
        }
        return this._appManagerControllerInstance;
    }
    get layoutsController() {
        if (!this._layoutsControllerInstance) {
            this._layoutsControllerInstance = new LayoutsController();
        }
        return this._layoutsControllerInstance;
    }
    get themesController() {
        if (!this._themesControllerInstance) {
            this._themesControllerInstance = new ThemesController();
        }
        return this._themesControllerInstance;
    }
    get notificationsController() {
        if (!this._notificationsControllerInstance) {
            this._notificationsControllerInstance = new NotificationsController();
        }
        return this._notificationsControllerInstance;
    }
    get intentsController() {
        if (!this._intentsControllerInstance) {
            this._intentsControllerInstance = new IntentsController();
        }
        return this._intentsControllerInstance;
    }
    get systemController() {
        if (!this._systemControllerInstance) {
            this._systemControllerInstance = new SystemController();
        }
        return this._systemControllerInstance;
    }
    get channelsController() {
        if (!this._channelsControllerInstance) {
            this._channelsControllerInstance = new ChannelsController();
        }
        return this._channelsControllerInstance;
    }
    get prefsController() {
        if (!this._prefsControllerInstance) {
            this._prefsControllerInstance = new PrefsController();
        }
        return this._prefsControllerInstance;
    }
    get extensionController() {
        if (!this._extensionController) {
            this._extensionController = new ExtController();
        }
        return this._extensionController;
    }
    get eventsDispatcher() {
        if (!this._eventsDispatcher) {
            this._eventsDispatcher = new EventsDispatcher(this.config);
        }
        return this._eventsDispatcher;
    }
    get bridge() {
        if (!this._bridgeInstance) {
            this._bridgeInstance = new GlueBridge(this._coreGlue, this.communicationId);
        }
        return this._bridgeInstance;
    }
    get preferredConnectionController() {
        if (!this._preferredConnectionController) {
            this._preferredConnectionController = new PreferredConnectionController(this._coreGlue);
        }
        return this._preferredConnectionController;
    }
    get sessionController() {
        if (!this._sessionController) {
            this._sessionController = new SessionStorageController();
        }
        return this._sessionController;
    }
    get config() {
        return this._webConfig;
    }
    defineGlue(coreGlue) {
        this._coreGlue = coreGlue;
        this._publicWindowId = coreGlue.connection.transport.publicWindowId;
        const globalNamespace = window.glue42core || window.iobrowser;
        this._communicationId = coreGlue.connection.transport.communicationId || globalNamespace.communicationId;
    }
    defineConfig(config) {
        this._webConfig = config;
    }
    async buildWebWindow(id, name) {
        const model = new WebWindowModel(id, name, this.bridge);
        const api = await model.toApi();
        return { id, model, api };
    }
    buildNotification(config, id) {
        return new Notification(config, id);
    }
    async buildApplication(app, applicationInstances) {
        const application = (new ApplicationModel(app, [], this.appManagerController)).toApi();
        const instances = applicationInstances.map((instanceData) => this.buildInstance(instanceData, application));
        application.instances.push(...instances);
        return application;
    }
    buildInstance(instanceData, app) {
        return (new InstanceModel(instanceData, this.bridge, app)).toApi();
    }
}

var version$1 = "4.0.2";

const setupGlobalSystem = (io, bridge) => {
    return {
        getContainerInfo: async () => {
            if (window === window.parent) {
                return;
            }
            if (window.name.includes("#wsp")) {
                return {
                    workspaceFrame: {
                        id: "N/A"
                    }
                };
            }
            return window.parent === window.top ?
                { top: {} } :
                { parent: {} };
        },
        getProfileData: async () => {
            if (!bridge) {
                throw new Error("Bridge is not available and cannot fetch the profile data");
            }
            const data = await bridge.send("system", { name: "getProfileData" }, undefined);
            return data;
        }
    };
};

const createFactoryFunction = (coreFactoryFunction) => {
    let cachedApiPromise;
    const initAPI = async (config) => {
        const ioc = new IoC();
        const glue = await PromiseWrap(() => coreFactoryFunction(config, { version: version$1 }), 30000, "Glue Web initialization timed out, because core didn't resolve");
        const logger = glue.logger.subLogger("web.main.controller");
        ioc.defineGlue(glue);
        ioc.sessionController.configure({ windowId: glue.interop.instance.instance });
        await ioc.preferredConnectionController.start(config);
        await ioc.bridge.start(ioc.controllers);
        ioc.defineConfig(config);
        logger.trace("the bridge has been started, initializing all controllers");
        await Promise.all(Object.values(ioc.controllers).map((controller) => controller.start(glue, ioc)));
        logger.trace("all controllers reported started, starting all additional libraries");
        try {
            await Promise.all(config.libraries.map((lib) => lib(glue, config)));
            logger.trace("all libraries were started");
            ioc.eventsDispatcher.start(glue);
            logger.trace("start event dispatched, glue is ready, returning it");
            await ioc.uiController.showComponents(glue).catch((err) => logger.warn(err?.message ? err.message : JSON.stringify(err)));
            await Promise.all(Object.values(ioc.controllers).map((controller) => controller.postStart ? controller.postStart(glue, ioc) : Promise.resolve()));
            window.iobrowser.system = setupGlobalSystem(glue, ioc.bridge);
            window.iobrowser = Object.freeze({ ...window.iobrowser });
            return glue;
        }
        catch (error) {
            return ioError.raiseError(error, true);
        }
    };
    const factory = (userConfig) => {
        if (window.glue42gd || window.iodesktop) {
            return enterprise(userConfig);
        }
        const config = parseConfig(userConfig);
        try {
            checkSingleton();
        }
        catch (error) {
            return typeof cachedApiPromise === "undefined" ? Promise.reject(new Error(error)) : cachedApiPromise;
        }
        const apiPromise = initAPI(config);
        cachedApiPromise = userConfig?.memoizeAPI ? apiPromise : undefined;
        return apiPromise;
    };
    return factory;
};

var MetricTypes = {
    STRING: 1,
    NUMBER: 2,
    TIMESTAMP: 3,
    OBJECT: 4
};

function getMetricTypeByValue(metric) {
    if (metric.type === MetricTypes.TIMESTAMP) {
        return "timestamp";
    }
    else if (metric.type === MetricTypes.NUMBER) {
        return "number";
    }
    else if (metric.type === MetricTypes.STRING) {
        return "string";
    }
    else if (metric.type === MetricTypes.OBJECT) {
        return "object";
    }
    return "unknown";
}
function getTypeByValue(value) {
    if (value.constructor === Date) {
        return "timestamp";
    }
    else if (typeof value === "number") {
        return "number";
    }
    else if (typeof value === "string") {
        return "string";
    }
    else if (typeof value === "object") {
        return "object";
    }
    else {
        return "string";
    }
}
function serializeMetric(metric) {
    const serializedMetrics = {};
    const type = getMetricTypeByValue(metric);
    if (type === "object") {
        const values = Object.keys(metric.value).reduce((memo, key) => {
            const innerType = getTypeByValue(metric.value[key]);
            if (innerType === "object") {
                const composite = defineNestedComposite(metric.value[key]);
                memo[key] = {
                    type: "object",
                    description: "",
                    context: {},
                    composite,
                };
            }
            else {
                memo[key] = {
                    type: innerType,
                    description: "",
                    context: {},
                };
            }
            return memo;
        }, {});
        serializedMetrics.composite = values;
    }
    serializedMetrics.name = normalizeMetricName(metric.path.join("/") + "/" + metric.name);
    serializedMetrics.type = type;
    serializedMetrics.description = metric.description;
    serializedMetrics.context = {};
    return serializedMetrics;
}
function defineNestedComposite(values) {
    return Object.keys(values).reduce((memo, key) => {
        const type = getTypeByValue(values[key]);
        if (type === "object") {
            memo[key] = {
                type: "object",
                description: "",
                context: {},
                composite: defineNestedComposite(values[key]),
            };
        }
        else {
            memo[key] = {
                type,
                description: "",
                context: {},
            };
        }
        return memo;
    }, {});
}
function normalizeMetricName(name) {
    if (typeof name !== "undefined" && name.length > 0 && name[0] !== "/") {
        return "/" + name;
    }
    else {
        return name;
    }
}
function getMetricValueByType(metric) {
    const type = getMetricTypeByValue(metric);
    if (type === "timestamp") {
        return Date.now();
    }
    else {
        return publishNestedComposite(metric.value);
    }
}
function publishNestedComposite(values) {
    if (typeof values !== "object") {
        return values;
    }
    return Object.keys(values).reduce((memo, key) => {
        const value = values[key];
        if (typeof value === "object" && value.constructor !== Date) {
            memo[key] = publishNestedComposite(value);
        }
        else if (value.constructor === Date) {
            memo[key] = new Date(value).getTime();
        }
        else if (value.constructor === Boolean) {
            memo[key] = value.toString();
        }
        else {
            memo[key] = value;
        }
        return memo;
    }, {});
}
function flatten(arr) {
    return arr.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function getHighestState(arr) {
    return arr.sort((a, b) => {
        if (!a.state) {
            return 1;
        }
        if (!b.state) {
            return -1;
        }
        return b.state - a.state;
    })[0];
}
function aggregateDescription(arr) {
    let msg = "";
    arr.forEach((m, idx, a) => {
        const path = m.path.join(".");
        if (idx === a.length - 1) {
            msg += path + "." + m.name + ": " + m.description;
        }
        else {
            msg += path + "." + m.name + ": " + m.description + ",";
        }
    });
    if (msg.length > 100) {
        return msg.slice(0, 100) + "...";
    }
    else {
        return msg;
    }
}
function composeMsgForRootStateMetric(system) {
    const aggregatedState = system.root.getAggregateState();
    const merged = flatten(aggregatedState);
    const highestState = getHighestState(merged);
    const aggregateDesc = aggregateDescription(merged);
    return {
        description: aggregateDesc,
        value: highestState.state,
    };
}

function gw3 (connection, config) {
    if (!connection || typeof connection !== "object") {
        throw new Error("Connection is required parameter");
    }
    let joinPromise;
    let session;
    const init = (repo) => {
        let resolveReadyPromise;
        joinPromise = new Promise((resolve) => {
            resolveReadyPromise = resolve;
        });
        session = connection.domain("metrics");
        session.onJoined((reconnect) => {
            if (!reconnect && resolveReadyPromise) {
                resolveReadyPromise();
                resolveReadyPromise = undefined;
            }
            const rootStateMetric = {
                name: "/State",
                type: "object",
                composite: {
                    Description: {
                        type: "string",
                        description: "",
                    },
                    Value: {
                        type: "number",
                        description: "",
                    },
                },
                description: "System state",
                context: {},
            };
            const defineRootMetricsMsg = {
                type: "define",
                metrics: [rootStateMetric],
            };
            session.send(defineRootMetricsMsg);
            if (reconnect) {
                replayRepo(repo);
            }
        });
        session.join({
            system: config.system,
            service: config.service,
            instance: config.instance
        });
    };
    const replayRepo = (repo) => {
        replaySystem(repo.root);
    };
    const replaySystem = (system) => {
        createSystem(system);
        system.metrics.forEach((m) => {
            createMetric(m);
        });
        system.subSystems.forEach((ss) => {
            replaySystem(ss);
        });
    };
    const createSystem = async (system) => {
        if (system.parent === undefined) {
            return;
        }
        await joinPromise;
        const metric = {
            name: normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
            type: "object",
            composite: {
                Description: {
                    type: "string",
                    description: "",
                },
                Value: {
                    type: "number",
                    description: "",
                },
            },
            description: "System state",
            context: {},
        };
        const createMetricsMsg = {
            type: "define",
            metrics: [metric],
        };
        session.send(createMetricsMsg);
    };
    const updateSystem = async (system, state) => {
        await joinPromise;
        const shadowedUpdateMetric = {
            type: "publish",
            values: [{
                    name: normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                    value: {
                        Description: state.description,
                        Value: state.state,
                    },
                    timestamp: Date.now(),
                }],
        };
        session.send(shadowedUpdateMetric);
        const stateObj = composeMsgForRootStateMetric(system);
        const rootMetric = {
            type: "publish",
            peer_id: connection.peerId,
            values: [{
                    name: "/State",
                    value: {
                        Description: stateObj.description,
                        Value: stateObj.value,
                    },
                    timestamp: Date.now(),
                }],
        };
        session.send(rootMetric);
    };
    const createMetric = async (metric) => {
        const metricClone = cloneMetric(metric);
        await joinPromise;
        const m = serializeMetric(metricClone);
        const createMetricsMsg = {
            type: "define",
            metrics: [m],
        };
        session.send(createMetricsMsg);
        if (typeof metricClone.value !== "undefined") {
            updateMetricCore(metricClone);
        }
    };
    const updateMetric = async (metric) => {
        const metricClone = cloneMetric(metric);
        await joinPromise;
        updateMetricCore(metricClone);
    };
    const updateMetricCore = (metric) => {
        if (canUpdate()) {
            const value = getMetricValueByType(metric);
            const publishMetricsMsg = {
                type: "publish",
                values: [{
                        name: normalizeMetricName(metric.path.join("/") + "/" + metric.name),
                        value,
                        timestamp: Date.now(),
                    }],
            };
            return session.sendFireAndForget(publishMetricsMsg);
        }
        return Promise.resolve();
    };
    const cloneMetric = (metric) => {
        const metricClone = { ...metric };
        if (typeof metric.value === "object" && metric.value !== null) {
            metricClone.value = { ...metric.value };
        }
        return metricClone;
    };
    const canUpdate = () => {
        try {
            const func = config.canUpdateMetric ?? (() => true);
            return func();
        }
        catch {
            return true;
        }
    };
    return {
        init,
        createSystem,
        updateSystem,
        createMetric,
        updateMetric,
    };
}

var Helpers = {
    validate: (definition, parent, transport) => {
        if (definition === null || typeof definition !== "object") {
            throw new Error("Missing definition");
        }
        if (parent === null || typeof parent !== "object") {
            throw new Error("Missing parent");
        }
        if (transport === null || typeof transport !== "object") {
            throw new Error("Missing transport");
        }
    },
};

class BaseMetric {
    definition;
    system;
    transport;
    value;
    type;
    path = [];
    name;
    description;
    get repo() {
        return this.system?.repo;
    }
    get id() { return `${this.system.path}/${name}`; }
    constructor(definition, system, transport, value, type) {
        this.definition = definition;
        this.system = system;
        this.transport = transport;
        this.value = value;
        this.type = type;
        Helpers.validate(definition, system, transport);
        this.path = system.path.slice(0);
        this.path.push(system.name);
        this.name = definition.name;
        this.description = definition.description;
        transport.createMetric(this);
    }
    update(newValue) {
        this.value = newValue;
        return this.transport.updateMetric(this);
    }
}

class NumberMetric extends BaseMetric {
    constructor(definition, system, transport, value) {
        super(definition, system, transport, value, MetricTypes.NUMBER);
    }
    incrementBy(num) {
        this.update(this.value + num);
    }
    increment() {
        this.incrementBy(1);
    }
    decrement() {
        this.incrementBy(-1);
    }
    decrementBy(num) {
        this.incrementBy(num * -1);
    }
}

class ObjectMetric extends BaseMetric {
    constructor(definition, system, transport, value) {
        super(definition, system, transport, value, MetricTypes.OBJECT);
    }
    update(newValue) {
        this.mergeValues(newValue);
        return this.transport.updateMetric(this);
    }
    mergeValues(values) {
        return Object.keys(this.value).forEach((k) => {
            if (typeof values[k] !== "undefined") {
                this.value[k] = values[k];
            }
        });
    }
}

class StringMetric extends BaseMetric {
    constructor(definition, system, transport, value) {
        super(definition, system, transport, value, MetricTypes.STRING);
    }
}

class TimestampMetric extends BaseMetric {
    constructor(definition, system, transport, value) {
        super(definition, system, transport, value, MetricTypes.TIMESTAMP);
    }
    now() {
        this.update(new Date());
    }
}

function system(name, repo, protocol, parent, description) {
    if (!repo) {
        throw new Error("Repository is required");
    }
    if (!protocol) {
        throw new Error("Transport is required");
    }
    const _transport = protocol;
    const _name = name;
    const _description = description || "";
    const _repo = repo;
    const _parent = parent;
    const _path = _buildPath(parent);
    let _state = {};
    const id = _arrayToString(_path, "/") + name;
    const root = repo.root;
    const _subSystems = [];
    const _metrics = [];
    function subSystem(nameSystem, descriptionSystem) {
        if (!nameSystem || nameSystem.length === 0) {
            throw new Error("name is required");
        }
        const match = _subSystems.filter((s) => s.name === nameSystem);
        if (match.length > 0) {
            return match[0];
        }
        const _system = system(nameSystem, _repo, _transport, me, descriptionSystem);
        _subSystems.push(_system);
        return _system;
    }
    function setState(state, stateDescription) {
        _state = { state, description: stateDescription };
        _transport.updateSystem(me, _state);
    }
    function stringMetric(definition, value) {
        return _getOrCreateMetric(definition, MetricTypes.STRING, value, (metricDef) => new StringMetric(metricDef, me, _transport, value));
    }
    function numberMetric(definition, value) {
        return _getOrCreateMetric(definition, MetricTypes.NUMBER, value, (metricDef) => new NumberMetric(metricDef, me, _transport, value));
    }
    function objectMetric(definition, value) {
        return _getOrCreateMetric(definition, MetricTypes.OBJECT, value, (metricDef) => new ObjectMetric(metricDef, me, _transport, value));
    }
    function timestampMetric(definition, value) {
        return _getOrCreateMetric(definition, MetricTypes.TIMESTAMP, value, (metricDef) => new TimestampMetric(metricDef, me, _transport, value));
    }
    function _getOrCreateMetric(metricObject, expectedType, value, createMetric) {
        let metricDef = { name: "" };
        if (typeof metricObject === "string") {
            metricDef = { name: metricObject };
        }
        else {
            metricDef = metricObject;
        }
        const matching = _metrics.filter((shadowedMetric) => shadowedMetric.name === metricDef.name);
        if (matching.length > 0) {
            const existing = matching[0];
            if (existing.type !== expectedType) {
                throw new Error(`A metric named ${metricDef.name} is already defined with different type.`);
            }
            if (typeof value !== "undefined") {
                existing
                    .update(value)
                    .catch(() => { });
            }
            return existing;
        }
        const metric = createMetric(metricDef);
        _metrics.push(metric);
        return metric;
    }
    function _buildPath(shadowedSystem) {
        if (!shadowedSystem || !shadowedSystem.parent) {
            return [];
        }
        const path = _buildPath(shadowedSystem.parent);
        path.push(shadowedSystem.name);
        return path;
    }
    function _arrayToString(path, separator) {
        return ((path && path.length > 0) ? path.join(separator) : "");
    }
    function getAggregateState() {
        const aggState = [];
        if (Object.keys(_state).length > 0) {
            aggState.push({
                name: _name,
                path: _path,
                state: _state.state,
                description: _state.description,
            });
        }
        _subSystems.forEach((shadowedSubSystem) => {
            const result = shadowedSubSystem.getAggregateState();
            if (result.length > 0) {
                aggState.push(...result);
            }
        });
        return aggState;
    }
    const me = {
        get name() {
            return _name;
        },
        get description() {
            return _description;
        },
        get repo() {
            return _repo;
        },
        get parent() {
            return _parent;
        },
        path: _path,
        id,
        root,
        get subSystems() {
            return _subSystems;
        },
        get metrics() {
            return _metrics;
        },
        subSystem,
        getState: () => {
            return _state;
        },
        setState,
        stringMetric,
        timestampMetric,
        objectMetric,
        numberMetric,
        getAggregateState,
    };
    _transport.createSystem(me);
    return me;
}

class Repository {
    root;
    constructor(options, protocol) {
        protocol.init(this);
        this.root = system("", this, protocol);
        this.addSystemMetrics(this.root, options.clickStream || options.clickStream === undefined);
    }
    addSystemMetrics(rootSystem, useClickStream) {
        if (typeof navigator !== "undefined") {
            rootSystem.stringMetric("UserAgent", navigator.userAgent);
        }
        if (useClickStream && typeof document !== "undefined") {
            const clickStream = rootSystem.subSystem("ClickStream");
            const documentClickHandler = (e) => {
                if (!e.target) {
                    return;
                }
                const target = e.target;
                const className = target ? target.getAttribute("class") ?? "" : "";
                clickStream.objectMetric("LastBrowserEvent", {
                    type: "click",
                    timestamp: new Date(),
                    target: {
                        className,
                        id: target.id,
                        type: "<" + target.tagName.toLowerCase() + ">",
                        href: target.href || "",
                    },
                });
            };
            clickStream.objectMetric("Page", {
                title: document.title,
                page: window.location.href,
            });
            if (document.addEventListener) {
                document.addEventListener("click", documentClickHandler);
            }
            else {
                document.attachEvent("onclick", documentClickHandler);
            }
        }
        rootSystem.stringMetric("StartTime", (new Date()).toString());
        const urlMetric = rootSystem.stringMetric("StartURL", "");
        const appNameMetric = rootSystem.stringMetric("AppName", "");
        if (typeof window !== "undefined") {
            if (typeof window.location !== "undefined") {
                const startUrl = window.location.href;
                urlMetric.update(startUrl);
            }
            if (typeof window.glue42gd !== "undefined") {
                appNameMetric.update(window.glue42gd.appName);
            }
        }
    }
}

class NullProtocol {
    init(repo) {
    }
    createSystem(system) {
        return Promise.resolve();
    }
    updateSystem(metric, state) {
        return Promise.resolve();
    }
    createMetric(metric) {
        return Promise.resolve();
    }
    updateMetric(metric) {
        return Promise.resolve();
    }
}

class PerfTracker {
    api;
    lastCount = 0;
    initialPublishTimeout = 10 * 1000;
    publishInterval = 60 * 1000;
    system;
    constructor(api, initialPublishTimeout, publishInterval) {
        this.api = api;
        this.initialPublishTimeout = initialPublishTimeout ?? this.initialPublishTimeout;
        this.publishInterval = publishInterval ?? this.publishInterval;
        this.scheduleCollection();
        this.system = this.api.subSystem("performance", "Performance data published by the web application");
    }
    scheduleCollection() {
        setTimeout(() => {
            this.collect();
            setInterval(() => {
                this.collect();
            }, this.publishInterval);
        }, this.initialPublishTimeout);
    }
    collect() {
        try {
            this.collectMemory();
            this.collectEntries();
        }
        catch {
        }
    }
    collectMemory() {
        const memory = window.performance.memory;
        this.system.stringMetric("memory", JSON.stringify({
            totalJSHeapSize: memory.totalJSHeapSize,
            usedJSHeapSize: memory.usedJSHeapSize
        }));
    }
    collectEntries() {
        const allEntries = window.performance.getEntries();
        if (allEntries.length <= this.lastCount) {
            return;
        }
        this.lastCount = allEntries.length;
        const jsonfiedEntries = allEntries.map((i) => i.toJSON());
        this.system.stringMetric("entries", JSON.stringify(jsonfiedEntries));
    }
}

var metrics = (options) => {
    let protocol;
    if (!options.connection || typeof options.connection !== "object") {
        protocol = new NullProtocol();
    }
    else {
        protocol = gw3(options.connection, options);
    }
    const repo = new Repository(options, protocol);
    let rootSystem = repo.root;
    if (!options.disableAutoAppSystem) {
        rootSystem = rootSystem.subSystem("App");
    }
    const api = addFAVSupport(rootSystem);
    initPerf(api, options.pagePerformanceMetrics);
    return api;
};
function initPerf(api, config) {
    if (typeof window === "undefined") {
        return;
    }
    const perfConfig = window?.glue42gd?.metrics?.pagePerformanceMetrics;
    if (perfConfig) {
        config = perfConfig;
    }
    if (config?.enabled) {
        new PerfTracker(api, config.initialPublishTimeout, config.publishInterval);
    }
}
function addFAVSupport(system) {
    const reportingSystem = system.subSystem("reporting");
    const def = {
        name: "features"
    };
    let featureMetric;
    const featureMetricFunc = (name, action, payload) => {
        if (typeof name === "undefined" || name === "") {
            throw new Error("name is mandatory");
        }
        else if (typeof action === "undefined" || action === "") {
            throw new Error("action is mandatory");
        }
        else if (typeof payload === "undefined" || payload === "") {
            throw new Error("payload is mandatory");
        }
        if (!featureMetric) {
            featureMetric = reportingSystem.objectMetric(def, { name, action, payload });
        }
        else {
            featureMetric.update({
                name,
                action,
                payload
            });
        }
    };
    system.featureMetric = featureMetricFunc;
    return system;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createRegistry(options) {
    if (options && options.errorHandling
        && typeof options.errorHandling !== "function"
        && options.errorHandling !== "log"
        && options.errorHandling !== "silent"
        && options.errorHandling !== "throw") {
        throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
    }
    var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
    var callbacks = {};
    function add(key, callback, replayArgumentsArr) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        if (replayArgumentsArr) {
            setTimeout(function () {
                replayArgumentsArr.forEach(function (replayArgument) {
                    var _a;
                    if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                        try {
                            if (Array.isArray(replayArgument)) {
                                callback.apply(undefined, replayArgument);
                            }
                            else {
                                callback.apply(undefined, [replayArgument]);
                            }
                        }
                        catch (err) {
                            _handleError(err, key);
                        }
                    }
                });
            }, 0);
        }
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.reduce(function (acc, element, index) {
                if (!(element === callback && acc.length === index)) {
                    acc.push(element);
                }
                return acc;
            }, []);
            if (allForKey.length === 0) {
                delete callbacks[key];
            }
            else {
                callbacks[key] = allForKey;
            }
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
                _handleError(err, key);
            }
        });
        return results;
    }
    function _handleError(exceptionArtifact, key) {
        var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
        if (_userErrorHandler) {
            _userErrorHandler(errParam);
            return;
        }
        var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
        if (options) {
            switch (options.errorHandling) {
                case "log":
                    return console.error(msg);
                case "silent":
                    return;
                case "throw":
                    throw new Error(msg);
            }
        }
        console.error(msg);
    }
    function clear() {
        callbacks = {};
    }
    function clearKey(key) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            return;
        }
        delete callbacks[key];
    }
    return {
        add: add,
        execute: execute,
        clear: clear,
        clearKey: clearKey
    };
}
createRegistry.default = createRegistry;
var lib = createRegistry;


var CallbackRegistryFactory = /*@__PURE__*/getDefaultExportFromCjs(lib);

class InProcTransport {
    gw;
    registry = CallbackRegistryFactory();
    client;
    constructor(settings, logger) {
        this.gw = settings.facade;
        this.gw.connect((_client, message) => {
            this.messageHandler(message);
        }).then((client) => {
            this.client = client;
        });
    }
    get isObjectBasedTransport() {
        return true;
    }
    sendObject(msg) {
        if (this.client) {
            this.client.send(msg);
            return Promise.resolve(undefined);
        }
        else {
            return Promise.reject(`not connected`);
        }
    }
    send(_msg) {
        return Promise.reject("not supported");
    }
    onMessage(callback) {
        return this.registry.add("onMessage", callback);
    }
    onConnectedChanged(callback) {
        callback(true);
        return () => { };
    }
    close() {
        return Promise.resolve();
    }
    open() {
        return Promise.resolve();
    }
    name() {
        return "in-memory";
    }
    reconnect() {
        return Promise.resolve();
    }
    messageHandler(msg) {
        this.registry.execute("onMessage", msg);
    }
}

class SharedWorkerTransport {
    logger;
    worker;
    registry = CallbackRegistryFactory();
    constructor(workerFile, logger) {
        this.logger = logger;
        this.worker = new SharedWorker(workerFile);
        this.worker.port.onmessage = (e) => {
            this.messageHandler(e.data);
        };
    }
    get isObjectBasedTransport() {
        return true;
    }
    sendObject(msg) {
        this.worker.port.postMessage(msg);
        return Promise.resolve();
    }
    send(_msg) {
        return Promise.reject("not supported");
    }
    onMessage(callback) {
        return this.registry.add("onMessage", callback);
    }
    onConnectedChanged(callback) {
        callback(true);
        return () => { };
    }
    close() {
        return Promise.resolve();
    }
    open() {
        return Promise.resolve();
    }
    name() {
        return "shared-worker";
    }
    reconnect() {
        return Promise.resolve();
    }
    messageHandler(msg) {
        this.registry.execute("onMessage", msg);
    }
}

class Utils {
    static isNode() {
        if (typeof Utils._isNode !== "undefined") {
            return Utils._isNode;
        }
        if (typeof window !== "undefined") {
            Utils._isNode = false;
            return false;
        }
        try {
            Utils._isNode = Object.prototype.toString.call(global.process) === "[object process]";
        }
        catch (e) {
            Utils._isNode = false;
        }
        return Utils._isNode;
    }
    static _isNode;
}

class PromiseWrapper {
    static delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    resolve;
    reject;
    promise;
    rejected = false;
    resolved = false;
    get ended() {
        return this.rejected || this.resolved;
    }
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (t) => {
                this.resolved = true;
                resolve(t);
            };
            this.reject = (err) => {
                this.rejected = true;
                reject(err);
            };
        });
    }
}

const timers = {};
function getAllTimers() {
    return timers;
}
function timer (timerName) {
    const existing = timers[timerName];
    if (existing) {
        return existing;
    }
    const marks = [];
    function now() {
        return new Date().getTime();
    }
    const startTime = now();
    mark("start", startTime);
    let endTime;
    let period;
    function stop() {
        endTime = now();
        mark("end", endTime);
        period = endTime - startTime;
        return period;
    }
    function mark(name, time) {
        const currentTime = time ?? now();
        let diff = 0;
        if (marks.length > 0) {
            diff = currentTime - marks[marks.length - 1].time;
        }
        marks.push({ name, time: currentTime, diff });
    }
    const timerObj = {
        get startTime() {
            return startTime;
        },
        get endTime() {
            return endTime;
        },
        get period() {
            return period;
        },
        stop,
        mark,
        marks
    };
    timers[timerName] = timerObj;
    return timerObj;
}

const WebSocketConstructor = Utils.isNode() ? null : window.WebSocket;
class WS {
    ws;
    logger;
    settings;
    startupTimer = timer("connection");
    _running = true;
    _registry = CallbackRegistryFactory();
    wsRequests = [];
    constructor(settings, logger) {
        this.settings = settings;
        this.logger = logger;
        if (!this.settings.ws) {
            throw new Error("ws is missing");
        }
    }
    onMessage(callback) {
        return this._registry.add("onMessage", callback);
    }
    send(msg, options) {
        return new Promise((resolve, reject) => {
            this.waitForSocketConnection(() => {
                try {
                    this.ws?.send(msg);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, reject);
        });
    }
    open() {
        this.logger.info("opening ws...");
        this._running = true;
        return new Promise((resolve, reject) => {
            this.waitForSocketConnection(resolve, reject);
        });
    }
    close() {
        this._running = false;
        if (this.ws) {
            this.ws.close();
        }
        return Promise.resolve();
    }
    onConnectedChanged(callback) {
        return this._registry.add("onConnectedChanged", callback);
    }
    name() {
        return this.settings.ws;
    }
    reconnect() {
        this.ws?.close();
        const pw = new PromiseWrapper();
        this.waitForSocketConnection(() => {
            pw.resolve();
        });
        return pw.promise;
    }
    waitForSocketConnection(callback, failed) {
        failed = failed ?? (() => { });
        if (!this._running) {
            failed(`wait for socket on ${this.settings.ws} failed - socket closed by user`);
            return;
        }
        if (this.ws?.readyState === 1) {
            callback();
            return;
        }
        this.wsRequests.push({ callback, failed });
        if (this.wsRequests.length > 1) {
            return;
        }
        this.openSocket();
    }
    async openSocket(retryInterval, retriesLeft) {
        this.logger.info(`opening ws to ${this.settings.ws}, retryInterval: ${retryInterval}, retriesLeft: ${retriesLeft}...`);
        this.startupTimer.mark("opening-socket");
        if (retryInterval === undefined) {
            retryInterval = this.settings.reconnectInterval;
        }
        if (typeof retriesLeft === "undefined") {
            retriesLeft = this.settings.reconnectAttempts;
        }
        if (retriesLeft !== undefined) {
            if (retriesLeft === 0) {
                this.notifyForSocketState(`wait for socket on ${this.settings.ws} failed - no more retries left`);
                return;
            }
            this.logger.debug(`will retry ${retriesLeft} more times (every ${retryInterval} ms)`);
        }
        try {
            await this.initiateSocket();
            this.startupTimer.mark("socket-initiated");
            this.notifyForSocketState();
        }
        catch {
            setTimeout(() => {
                const retries = retriesLeft === undefined ? undefined : retriesLeft - 1;
                this.openSocket(retryInterval, retries);
            }, retryInterval);
        }
    }
    initiateSocket() {
        const pw = new PromiseWrapper();
        this.logger.debug(`initiating ws to ${this.settings.ws}...`);
        this.ws = new WebSocketConstructor(this.settings.ws ?? "");
        this.ws.onerror = (err) => {
            let reason = "";
            try {
                reason = JSON.stringify(err);
            }
            catch (error) {
                const seen = new WeakSet();
                const replacer = (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return;
                        }
                        seen.add(value);
                    }
                    return value;
                };
                reason = JSON.stringify(err, replacer);
            }
            this.logger.info(`ws error - reason: ${reason}`);
            pw.reject("error");
            this.notifyStatusChanged(false, reason);
        };
        this.ws.onclose = (err) => {
            this.logger.info(`ws closed - code: ${err?.code} reason: ${err?.reason}`);
            pw.reject("closed");
            this.notifyStatusChanged(false);
        };
        this.ws.onopen = () => {
            this.startupTimer.mark("ws-opened");
            this.logger.info(`ws opened ${this.settings.identity?.application}`);
            pw.resolve();
            this.notifyStatusChanged(true);
        };
        this.ws.onmessage = (message) => {
            this._registry.execute("onMessage", message.data);
        };
        return pw.promise;
    }
    notifyForSocketState(error) {
        this.wsRequests.forEach((wsRequest) => {
            if (error) {
                if (wsRequest.failed) {
                    wsRequest.failed(error);
                }
            }
            else {
                wsRequest.callback();
            }
        });
        this.wsRequests = [];
    }
    notifyStatusChanged(status, reason) {
        this._registry.execute("onConnectedChanged", status, reason);
    }
}

class MessageReplayerImpl {
    specs;
    specsNames = [];
    messages = {};
    isDone;
    subs = {};
    subsRefCount = {};
    connection;
    constructor(specs) {
        this.specs = {};
        for (const spec of specs) {
            this.specs[spec.name] = spec;
            this.specsNames.push(spec.name);
        }
    }
    init(connection) {
        this.connection = connection;
        for (const name of this.specsNames) {
            for (const type of this.specs[name].types) {
                let refCount = this.subsRefCount[type];
                if (!refCount) {
                    refCount = 0;
                }
                refCount += 1;
                this.subsRefCount[type] = refCount;
                if (refCount > 1) {
                    continue;
                }
                const sub = connection.on(type, (msg) => this.processMessage(type, msg));
                this.subs[type] = sub;
            }
        }
    }
    processMessage(type, msg) {
        if (this.isDone || !msg) {
            return;
        }
        for (const name of this.specsNames) {
            if (this.specs[name].types.indexOf(type) !== -1) {
                const messages = this.messages[name] || [];
                this.messages[name] = messages;
                messages.push(msg);
            }
        }
    }
    drain(name, callback) {
        if (callback) {
            (this.messages[name] || []).forEach(callback);
        }
        delete this.messages[name];
        for (const type of this.specs[name].types) {
            this.subsRefCount[type] -= 1;
            if (this.subsRefCount[type] <= 0) {
                this.connection?.off(this.subs[type]);
                delete this.subs[type];
                delete this.subsRefCount[type];
            }
        }
        delete this.specs[name];
        if (!this.specs.length) {
            this.isDone = true;
        }
    }
}

/* @ts-self-types="./index.d.ts" */
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let nanoid = (size = 21) => {
  let id = '';
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id
};

const PromisePlus = (executor, timeoutMilliseconds, timeoutMessage) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const message = timeoutMessage || `Promise timeout hit: ${timeoutMilliseconds}`;
            reject(message);
        }, timeoutMilliseconds);
        const providedPromise = new Promise(executor);
        providedPromise
            .then((result) => {
            clearTimeout(timeout);
            resolve(result);
        })
            .catch((error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
};

class WebPlatformTransport {
    settings;
    logger;
    identity;
    isPreferredActivated;
    _communicationId;
    publicWindowId;
    selfAssignedWindowId;
    iAmConnected = false;
    parentReady = false;
    rejected = false;
    parentPingResolve;
    parentPingInterval;
    connectionResolve;
    extConnectionResolve;
    extConnectionReject;
    connectionReject;
    port;
    myClientId;
    extContentAvailable = false;
    extContentConnecting = false;
    extContentConnected = false;
    parentWindowId;
    parentInExtMode = false;
    webNamespace = "g42_core_web";
    parent;
    parentType;
    parentPingTimeout = 5000;
    connectionRequestTimeout = 7000;
    defaultTargetString = "*";
    registry = CallbackRegistryFactory();
    messages = {
        connectionAccepted: { name: "connectionAccepted", handle: this.handleConnectionAccepted.bind(this) },
        connectionRejected: { name: "connectionRejected", handle: this.handleConnectionRejected.bind(this) },
        connectionRequest: { name: "connectionRequest", handle: this.handleConnectionRequest.bind(this) },
        parentReady: {
            name: "parentReady", handle: () => {
            }
        },
        parentPing: { name: "parentPing", handle: this.handleParentPing.bind(this) },
        platformPing: { name: "platformPing", handle: this.handlePlatformPing.bind(this) },
        platformReady: { name: "platformReady", handle: this.handlePlatformReady.bind(this) },
        clientUnload: { name: "clientUnload", handle: () => { } },
        manualUnload: { name: "manualUnload", handle: this.handleManualUnload.bind(this) },
        extConnectionResponse: { name: "extConnectionResponse", handle: this.handleExtConnectionResponse.bind(this) },
        extSetupRequest: { name: "extSetupRequest", handle: this.handleExtSetupRequest.bind(this) },
        gatewayDisconnect: { name: "gatewayDisconnect", handle: this.handleGatewayDisconnect.bind(this) },
        gatewayInternalConnect: { name: "gatewayInternalConnect", handle: this.handleGatewayInternalConnect.bind(this) }
    };
    constructor(settings, logger, identity) {
        this.settings = settings;
        this.logger = logger;
        this.identity = identity;
        this.extContentAvailable = !!window.glue42ext;
        this.setUpMessageListener();
        this.setUpUnload();
        this.setupPlatformUnloadListener();
        this.parentType = window.name.includes("#wsp") ? "workspace" : undefined;
    }
    manualSetReadyState() {
        this.iAmConnected = true;
        this.parentReady = true;
    }
    get transportWindowId() {
        return this.publicWindowId;
    }
    get communicationId() {
        return this._communicationId;
    }
    async sendObject(msg) {
        if (this.extContentConnected) {
            return window.postMessage({ glue42ExtOut: msg }, window.origin);
        }
        if (!this.port) {
            throw new Error("Cannot send message, because the port was not opened yet");
        }
        this.port.postMessage(msg);
    }
    get isObjectBasedTransport() {
        return true;
    }
    onMessage(callback) {
        return this.registry.add("onMessage", callback);
    }
    send() {
        return Promise.reject("not supported");
    }
    onConnectedChanged(callback) {
        return this.registry.add("onConnectedChanged", callback);
    }
    async open() {
        this.logger.debug("opening a connection to the web platform gateway.");
        await this.connect();
        this.notifyStatusChanged(true);
    }
    close() {
        const message = {
            glue42core: {
                type: this.messages.gatewayDisconnect.name,
                data: {
                    clientId: this.myClientId,
                    ownWindowId: this.identity?.windowId
                }
            }
        };
        this.port?.postMessage(message);
        this.parentReady = false;
        this.notifyStatusChanged(false, "manual reconnection");
        return Promise.resolve();
    }
    name() {
        return "web-platform";
    }
    async reconnect() {
        await this.close();
        return Promise.resolve();
    }
    initiateInternalConnection() {
        return new Promise((resolve, reject) => {
            this.logger.debug("opening an internal web platform connection");
            this.port = this.settings.port;
            if (this.iAmConnected) {
                this.logger.warn("cannot open a new connection, because this client is currently connected");
                return;
            }
            this.port.onmessage = (event) => {
                if (this.iAmConnected && !event.data?.glue42core) {
                    this.registry.execute("onMessage", event.data);
                    return;
                }
                const data = event.data?.glue42core;
                if (!data) {
                    return;
                }
                if (data.type === this.messages.gatewayInternalConnect.name && data.success) {
                    this.publicWindowId = this.settings.windowId;
                    if (this.identity && this.publicWindowId) {
                        this.identity.windowId = this.publicWindowId;
                        this.identity.instance = this.publicWindowId;
                    }
                    resolve();
                }
                if (data.type === this.messages.gatewayInternalConnect.name && data.error) {
                    reject(data.error);
                }
            };
            this.port.postMessage({
                glue42core: {
                    type: this.messages.gatewayInternalConnect.name
                }
            });
        });
    }
    initiateRemoteConnection(target) {
        return PromisePlus((resolve, reject) => {
            this.connectionResolve = resolve;
            this.connectionReject = reject;
            this.myClientId = this.myClientId ?? nanoid(10);
            const bridgeInstanceId = this.getMyWindowId() || nanoid(10);
            const request = {
                glue42core: {
                    type: this.messages.connectionRequest.name,
                    clientId: this.myClientId,
                    clientType: "child",
                    bridgeInstanceId,
                    selfAssignedWindowId: this.selfAssignedWindowId
                }
            };
            this.logger.debug("sending connection request");
            if (this.extContentConnecting) {
                request.glue42core.clientType = "child";
                request.glue42core.bridgeInstanceId = this.myClientId;
                request.glue42core.parentWindowId = this.parentWindowId;
                return window.postMessage(request, window.origin);
            }
            if (!target) {
                throw new Error("Cannot send a connection request, because no glue target was specified!");
            }
            target.postMessage(request, this.defaultTargetString);
        }, this.connectionRequestTimeout, "The connection to the target glue window timed out");
    }
    async isParentCheckSuccess(parentCheck) {
        try {
            await parentCheck;
            return { success: true };
        }
        catch (error) {
            return { success: false };
        }
    }
    setUpMessageListener() {
        if (this.settings.port) {
            this.logger.debug("skipping generic message listener, because this is an internal client");
            return;
        }
        window.addEventListener("message", (event) => {
            const data = event.data?.glue42core;
            if (!data || this.rejected) {
                return;
            }
            const allowedOrigins = this.settings.allowedOrigins || [];
            if (allowedOrigins.length && !allowedOrigins.includes(event.origin)) {
                this.logger.warn(`received a message from an origin which is not in the allowed list: ${event.origin}`);
                return;
            }
            if (!this.checkMessageTypeValid(data.type)) {
                this.logger.error(`cannot handle the incoming glue42 core message, because the type is invalid: ${data.type}`);
                return;
            }
            const messageType = data.type;
            this.logger.debug(`received valid glue42core message of type: ${messageType}`);
            this.messages[messageType].handle(event);
        });
    }
    setUpUnload() {
        if (this.settings.port) {
            this.logger.debug("skipping unload event listener, because this is an internal client");
            return;
        }
        window.addEventListener("beforeunload", () => {
            if (this.extContentConnected) {
                return;
            }
            const message = {
                glue42core: {
                    type: this.messages.clientUnload.name,
                    data: {
                        clientId: this.myClientId,
                        ownWindowId: this.identity?.windowId
                    }
                }
            };
            if (this.parent) {
                this.parent.postMessage(message, this.defaultTargetString);
            }
            this.port?.postMessage(message);
        });
    }
    handlePlatformReady(event) {
        this.logger.debug("the web platform gave the ready signal");
        this.parentReady = true;
        if (this.parentPingResolve) {
            this.parentPingResolve();
            delete this.parentPingResolve;
        }
        if (this.parentPingInterval) {
            clearInterval(this.parentPingInterval);
            delete this.parentPingInterval;
        }
        this.parent = event.source;
        this.parentType = window.name.includes("#wsp") ? "workspace" : "window";
    }
    handleConnectionAccepted(event) {
        const data = event.data?.glue42core;
        if (this.myClientId !== data.clientId) {
            return this.logger?.debug(`ignoring a connection accepted signal, because it is not targeted at me. My id: ${this.myClientId}, the id in the message: ${data.clientId}`);
        }
        return this.handleAcceptanceOfMyRequest(data);
    }
    handleAcceptanceOfMyRequest(data) {
        this.logger.debug("handling a connection accepted signal targeted at me.");
        this.isPreferredActivated = data.isPreferredActivated;
        if (this.extContentConnecting) {
            return this.processExtContentConnection(data);
        }
        if (!data.port) {
            this.logger.error("cannot set up my connection, because I was not provided with a port");
            return;
        }
        this.publicWindowId = this.getMyWindowId();
        if (this.identity) {
            this.identity.windowId = this.publicWindowId;
            this.identity.instance = this.identity.instance ? this.identity.instance : this.publicWindowId || nanoid(10);
        }
        if (this.identity && data.appName) {
            this.identity.application = data.appName;
            this.identity.applicationName = data.appName;
        }
        this._communicationId = data.communicationId;
        this.port = data.port;
        this.port.onmessage = (e) => this.registry.execute("onMessage", e.data);
        if (this.connectionResolve) {
            this.logger.debug("my connection is set up, calling the connection resolve.");
            this.connectionResolve();
            delete this.connectionResolve;
            return;
        }
        this.logger.error("unable to call the connection resolve, because no connection promise was found");
    }
    processExtContentConnection(data) {
        this.logger.debug("handling a connection accepted signal targeted at me for extension content connection.");
        this.extContentConnecting = false;
        this.extContentConnected = true;
        this.publicWindowId = this.parentWindowId || this.myClientId;
        if (this.extContentConnecting && this.identity) {
            this.identity.windowId = this.publicWindowId;
        }
        if (this.identity && data.appName) {
            this.identity.application = data.appName;
            this.identity.applicationName = data.appName;
        }
        window.addEventListener("message", (event) => {
            const extData = event.data?.glue42ExtInc;
            if (!extData) {
                return;
            }
            const allowedOrigins = this.settings.allowedOrigins || [];
            if (allowedOrigins.length && !allowedOrigins.includes(event.origin)) {
                this.logger.warn(`received a message from an origin which is not in the allowed list: ${event.origin}`);
                return;
            }
            this.registry.execute("onMessage", extData);
        });
        if (this.connectionResolve) {
            this.logger.debug("my connection is set up, calling the connection resolve.");
            this.connectionResolve();
            delete this.connectionResolve;
            return;
        }
    }
    handleConnectionRejected(event) {
        this.logger.debug("handling a connection rejection. Most likely the reason is that this window was not created by a glue API call");
        if (!this.connectionReject) {
            return;
        }
        const errorMsg = typeof event.data.glue42core?.error === "string"
            ? `Connection was rejected. ${event.data.glue42core?.error}`
            : "The platform connection was rejected. Most likely because this window was not created by a glue API call";
        this.connectionReject(errorMsg);
        delete this.connectionReject;
    }
    handleConnectionRequest() {
        if (this.extContentConnecting) {
            this.logger.debug("This connection request event is targeted at the extension content");
            return;
        }
    }
    handleParentPing(event) {
        if (!this.parentReady) {
            this.logger.debug("my parent is not ready, I am ignoring the parent ping");
            return;
        }
        if (!this.iAmConnected) {
            this.logger.debug("i am not fully connected yet, I am ignoring the parent ping");
            return;
        }
        const message = {
            glue42core: {
                type: this.messages.parentReady.name
            }
        };
        if (this.extContentConnected) {
            message.glue42core.extMode = { windowId: this.myClientId };
        }
        const source = event.source;
        this.logger.debug("responding to a parent ping with a ready message");
        source.postMessage(message, event.origin);
    }
    setupPlatformUnloadListener() {
        this.onMessage((msg) => {
            if (msg.type === "platformUnload") {
                this.logger.debug("detected a web platform unload");
                this.parentReady = false;
                this.notifyStatusChanged(false, "Gateway unloaded");
            }
        });
    }
    handleManualUnload() {
        const message = {
            glue42core: {
                type: this.messages.clientUnload.name,
                data: {
                    clientId: this.myClientId,
                    ownWindowId: this.identity?.windowId
                }
            }
        };
        if (this.extContentConnected) {
            return window.postMessage({ glue42ExtOut: message }, window.origin);
        }
        this.port?.postMessage(message);
    }
    handlePlatformPing() {
        return;
    }
    notifyStatusChanged(status, reason) {
        this.iAmConnected = status;
        this.registry.execute("onConnectedChanged", status, reason);
    }
    checkMessageTypeValid(typeToValidate) {
        return typeof typeToValidate === "string" && !!this.messages[typeToValidate];
    }
    requestConnectionPermissionFromExt() {
        return this.waitForContentScript()
            .then(() => PromisePlus((resolve, reject) => {
            this.extConnectionResolve = resolve;
            this.extConnectionReject = reject;
            const message = {
                glue42core: {
                    type: "extSetupRequest"
                }
            };
            this.logger.debug("permission request to the extension content script was sent");
            window.postMessage(message, window.origin);
        }, this.parentPingTimeout, "Cannot initialize glue, because this app was not opened or created by a Glue Client and the request for extension connection timed out"));
    }
    handleExtConnectionResponse(event) {
        const data = event.data?.glue42core;
        if (!data.approved) {
            return this.extConnectionReject ? this.extConnectionReject("Cannot initialize glue, because this app was not opened or created by a Glue Client and the request for extension connection was rejected") : undefined;
        }
        if (this.extConnectionResolve) {
            this.extConnectionResolve();
            delete this.extConnectionResolve;
        }
        this.extContentConnecting = true;
        this.parentType = "extension";
        this.logger.debug("The extension connection was approved, proceeding.");
    }
    handleExtSetupRequest() {
        return;
    }
    handleGatewayDisconnect() {
        return;
    }
    handleGatewayInternalConnect() {
        return;
    }
    waitForContentScript() {
        const contentReady = !!window.glue42ext?.content;
        if (contentReady) {
            return Promise.resolve();
        }
        return PromisePlus((resolve) => {
            window.addEventListener("Glue42EXTReady", () => {
                resolve();
            });
        }, this.connectionRequestTimeout, "The content script was available, but was never heard to be ready");
    }
    async connect() {
        if (this.settings.port) {
            await this.initiateInternalConnection();
            this.logger.debug("internal web platform connection completed");
            return;
        }
        this.logger.debug("opening a client web platform connection");
        await this.findParent();
        await this.initiateRemoteConnection(this.parent);
        this.logger.debug("the client is connected");
    }
    async findParent() {
        const connectionNotPossibleMsg = "Cannot initiate glue, because this window was not opened or created by a glue client";
        const myInsideParents = this.getPossibleParentsInWindow(window);
        const myOutsideParents = this.getPossibleParentsOutsideWindow(window.top?.opener, window.top);
        const uniqueParents = new Set([...myInsideParents, ...myOutsideParents]);
        if (!uniqueParents.size && !this.extContentAvailable) {
            throw new Error(connectionNotPossibleMsg);
        }
        if (!uniqueParents.size && this.extContentAvailable) {
            await this.requestConnectionPermissionFromExt();
            return;
        }
        const defaultParentCheck = await this.isParentCheckSuccess(this.confirmParent(Array.from(uniqueParents)));
        if (defaultParentCheck.success) {
            this.logger.debug("The default parent was found!");
            return;
        }
        if (!this.extContentAvailable) {
            throw new Error(connectionNotPossibleMsg);
        }
        await this.requestConnectionPermissionFromExt();
    }
    getPossibleParentsInWindow(currentWindow) {
        return (!currentWindow?.parent || currentWindow === currentWindow.parent) ? [] : [currentWindow.parent, ...this.getPossibleParentsInWindow(currentWindow.parent)];
    }
    getPossibleParentsOutsideWindow(opener, current) {
        return (!opener || !current || opener === current) ? [] : [opener, ...this.getPossibleParentsInWindow(opener), ...this.getPossibleParentsOutsideWindow(opener.opener, opener)];
    }
    confirmParent(targets) {
        const connectionNotPossibleMsg = "Cannot initiate glue, because this window was not opened or created by a glue client";
        const parentCheck = PromisePlus((resolve) => {
            this.parentPingResolve = resolve;
            const message = {
                glue42core: {
                    type: this.messages.platformPing.name
                }
            };
            this.parentPingInterval = setInterval(() => {
                targets.forEach((target) => {
                    target.postMessage(message, this.defaultTargetString);
                });
            }, 1000);
        }, this.parentPingTimeout, connectionNotPossibleMsg);
        parentCheck.catch(() => {
            if (this.parentPingInterval) {
                clearInterval(this.parentPingInterval);
                delete this.parentPingInterval;
            }
        });
        return parentCheck;
    }
    getMyWindowId() {
        if (this.parentType === "workspace") {
            return window.name.substring(0, window.name.indexOf("#wsp"));
        }
        if (window !== window.top) {
            return;
        }
        if (window.name?.includes("g42")) {
            return window.name;
        }
        this.selfAssignedWindowId = this.selfAssignedWindowId || `g42-${nanoid(10)}`;
        return this.selfAssignedWindowId;
    }
}

const waitForInvocations = (invocations, callback) => {
    let left = invocations;
    return () => {
        left--;
        if (left === 0) {
            callback();
        }
    };
};

class AsyncSequelizer {
    minSequenceInterval;
    queue = [];
    isExecutingQueue = false;
    constructor(minSequenceInterval = 0) {
        this.minSequenceInterval = minSequenceInterval;
    }
    enqueue(action) {
        return new Promise((resolve, reject) => {
            this.queue.push({ action, resolve, reject });
            this.executeQueue();
        });
    }
    async executeQueue() {
        if (this.isExecutingQueue) {
            return;
        }
        this.isExecutingQueue = true;
        while (this.queue.length) {
            const operation = this.queue.shift();
            if (!operation) {
                this.isExecutingQueue = false;
                return;
            }
            try {
                const actionResult = await operation.action();
                operation.resolve(actionResult);
            }
            catch (error) {
                operation.reject(error);
            }
            await this.intervalBreak();
        }
        this.isExecutingQueue = false;
    }
    intervalBreak() {
        return new Promise((res) => setTimeout(res, this.minSequenceInterval));
    }
}

function domainSession (domain, connection, logger, successMessages, errorMessages) {
    if (domain == null) {
        domain = "global";
    }
    successMessages = successMessages ?? ["success"];
    errorMessages = errorMessages ?? ["error"];
    let isJoined = domain === "global";
    let tryReconnecting = false;
    let _latestOptions;
    let _connectionOn = false;
    const callbacks = CallbackRegistryFactory();
    connection.disconnected(handleConnectionDisconnected);
    connection.loggedIn(handleConnectionLoggedIn);
    connection.on("success", (msg) => handleSuccessMessage(msg));
    connection.on("error", (msg) => handleErrorMessage(msg));
    connection.on("result", (msg) => handleSuccessMessage(msg));
    if (successMessages) {
        successMessages.forEach((sm) => {
            connection.on(sm, (msg) => handleSuccessMessage(msg));
        });
    }
    if (errorMessages) {
        errorMessages.forEach((sm) => {
            connection.on(sm, (msg) => handleErrorMessage(msg));
        });
    }
    const requestsMap = {};
    function join(options) {
        _latestOptions = options;
        return new Promise((resolve, reject) => {
            if (isJoined) {
                resolve({});
                return;
            }
            let joinPromise;
            if (domain === "global") {
                joinPromise = _connectionOn ? Promise.resolve({}) : Promise.reject("not connected to gateway");
            }
            else {
                logger.debug(`joining domain ${domain}`);
                const joinMsg = {
                    type: "join",
                    destination: domain,
                    domain: "global",
                    options,
                };
                joinPromise = send(joinMsg);
            }
            joinPromise
                .then(() => {
                handleJoined();
                resolve({});
            })
                .catch((err) => {
                logger.debug("error joining " + domain + " domain: " + JSON.stringify(err));
                reject(err);
            });
        });
    }
    function leave() {
        if (domain === "global") {
            return Promise.resolve();
        }
        logger.debug("stopping session " + domain + "...");
        const leaveMsg = {
            type: "leave",
            destination: domain,
            domain: "global",
        };
        tryReconnecting = false;
        return send(leaveMsg)
            .then(() => {
            isJoined = false;
            callbacks.execute("onLeft");
        })
            .catch(() => {
            isJoined = false;
            callbacks.execute("onLeft");
        });
    }
    function handleJoined() {
        logger.debug("did join " + domain);
        isJoined = true;
        const wasReconnect = tryReconnecting;
        tryReconnecting = false;
        callbacks.execute("onJoined", wasReconnect);
    }
    function handleConnectionDisconnected() {
        _connectionOn = false;
        logger.debug("connection is down");
        isJoined = false;
        tryReconnecting = true;
        callbacks.execute("onLeft", { disconnected: true });
    }
    function handleConnectionLoggedIn() {
        _connectionOn = true;
        if (tryReconnecting) {
            logger.debug("connection is now up - trying to reconnect...");
            join(_latestOptions);
        }
    }
    function onJoined(callback) {
        if (isJoined) {
            callback(false);
        }
        return callbacks.add("onJoined", callback);
    }
    function onLeft(callback) {
        if (!isJoined) {
            callback();
        }
        return callbacks.add("onLeft", callback);
    }
    function handleErrorMessage(msg) {
        if (domain !== msg.domain) {
            return;
        }
        const requestId = msg.request_id;
        if (!requestId) {
            return;
        }
        const entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.error(msg);
    }
    function handleSuccessMessage(msg) {
        if (msg.domain !== domain) {
            return;
        }
        const requestId = msg.request_id;
        if (!requestId) {
            return;
        }
        const entry = requestsMap[requestId];
        if (!entry) {
            return;
        }
        entry.success(msg);
    }
    function getNextRequestId() {
        return nanoid(10);
    }
    let queuedCalls = [];
    function send(msg, tag, options) {
        const ignore = ["hello", "join"];
        if (msg.type && ignore.indexOf(msg.type) === -1) {
            if (!isJoined) {
                console.warn(`trying to send a message (${msg.domain} ${msg.type}) but not connected, will queue`);
                const pw = new PromiseWrapper();
                queuedCalls.push({ msg, tag, options, pw });
                if (queuedCalls.length === 1) {
                    const unsubscribe = onJoined(() => {
                        logger.info(`joined - will now send queued messages (${queuedCalls.length} -> [${queuedCalls.map((m) => m.msg.type)}])`);
                        queuedCalls.forEach((qm) => {
                            send(qm.msg, qm.tag, qm.options)
                                .then((t) => qm.pw.resolve(t))
                                .catch((e) => qm.pw.reject(e));
                        });
                        queuedCalls = [];
                        unsubscribe();
                    });
                }
                return pw.promise;
            }
        }
        options = options ?? {};
        msg.request_id = msg.request_id ?? getNextRequestId();
        msg.domain = msg.domain ?? domain;
        if (!options.skipPeerId) {
            msg.peer_id = connection.peerId;
        }
        const requestId = msg.request_id;
        return new Promise((resolve, reject) => {
            requestsMap[requestId] = {
                success: (successMsg) => {
                    delete requestsMap[requestId];
                    successMsg._tag = tag;
                    resolve(successMsg);
                },
                error: (errorMsg) => {
                    logger.warn(`Gateway error - ${JSON.stringify(errorMsg)}`);
                    delete requestsMap[requestId];
                    errorMsg._tag = tag;
                    reject(errorMsg);
                },
            };
            connection
                .send(msg, options)
                .catch((err) => {
                requestsMap[requestId].error({ err });
            });
        });
    }
    function sendFireAndForget(msg) {
        msg.request_id = msg.request_id ? msg.request_id : getNextRequestId();
        msg.domain = msg.domain ?? domain;
        msg.peer_id = connection.peerId;
        return connection.send(msg);
    }
    return {
        join,
        leave,
        onJoined,
        onLeft,
        send,
        sendFireAndForget,
        on: (type, callback) => {
            connection.on(type, (msg) => {
                if (msg.domain !== domain) {
                    return;
                }
                try {
                    callback(msg);
                }
                catch (e) {
                    logger.error(`Callback  failed: ${e} \n ${e.stack} \n msg was: ${JSON.stringify(msg)}`, e);
                }
            });
        },
        loggedIn: (callback) => connection.loggedIn(callback),
        connected: (callback) => connection.connected(callback),
        disconnected: (callback) => connection.disconnected(callback),
        get peerId() {
            return connection.peerId;
        },
        get domain() {
            return domain;
        },
    };
}

class Connection {
    settings;
    logger;
    protocolVersion = 3;
    peerId;
    token;
    info;
    resolvedIdentity;
    availableDomains;
    gatewayToken;
    replayer;
    messageHandlers = {};
    ids = 1;
    registry = CallbackRegistryFactory();
    _connected = false;
    isTrace = false;
    transport;
    _defaultTransport;
    _defaultAuth;
    _targetTransport;
    _targetAuth;
    _swapTransport = false;
    _switchInProgress = false;
    _transportSubscriptions = [];
    datePrefix = "#T42_DATE#";
    datePrefixLen = this.datePrefix.length;
    dateMinLen = this.datePrefixLen + 1;
    datePrefixFirstChar = this.datePrefix[0];
    _sequelizer = new AsyncSequelizer();
    _isLoggedIn = false;
    shouldTryLogin = true;
    pingTimer;
    sessions = [];
    globalDomain;
    initialLogin = true;
    initialLoginAttempts = 3;
    loginConfig;
    constructor(settings, logger) {
        this.settings = settings;
        this.logger = logger;
        settings = settings || {};
        settings.reconnectAttempts = settings.reconnectAttempts ?? 10;
        settings.reconnectInterval = settings.reconnectInterval ?? 1000;
        if (settings.inproc) {
            this.transport = new InProcTransport(settings.inproc, logger.subLogger("inMemory"));
        }
        else if (settings.sharedWorker) {
            this.transport = new SharedWorkerTransport(settings.sharedWorker, logger.subLogger("shared-worker"));
        }
        else if (settings.webPlatform) {
            this.transport = new WebPlatformTransport(settings.webPlatform, logger.subLogger("web-platform"), settings.identity);
        }
        else if (settings.ws !== undefined) {
            this.transport = new WS(settings, logger.subLogger("ws"));
        }
        else {
            throw new Error("No connection information specified");
        }
        this.isTrace = logger.canPublish("trace");
        logger.debug(`starting with ${this.transport.name()} transport`);
        const unsubConnectionChanged = this.transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
        const unsubOnMessage = this.transport.onMessage(this.handleTransportMessage.bind(this));
        this._transportSubscriptions.push(unsubConnectionChanged);
        this._transportSubscriptions.push(unsubOnMessage);
        this._defaultTransport = this.transport;
        this.ping();
    }
    async switchTransport(settings) {
        return this._sequelizer.enqueue(async () => {
            if (!settings || typeof settings !== "object") {
                throw new Error("Cannot switch transports, because the settings are missing or invalid.");
            }
            if (typeof settings.type === "undefined") {
                throw new Error("Cannot switch the transport, because the type is not defined");
            }
            this.logger.trace(`Starting transport switch with settings: ${JSON.stringify(settings)}`);
            const switchTargetTransport = settings.type === "secondary" ? this.getNewSecondaryTransport(settings) : this._defaultTransport;
            this._targetTransport = switchTargetTransport;
            this._targetAuth = settings.type === "secondary" ? this.getNewSecondaryAuth(settings) : this._defaultAuth;
            const verifyPromise = this.verifyConnection();
            this._swapTransport = true;
            this._switchInProgress = true;
            this.logger.trace("The new transport has been set, closing the current transport");
            await this.transport.close();
            try {
                await verifyPromise;
                const isSwitchSuccess = this.transport === switchTargetTransport;
                this.logger.info(`The reconnection after the switch was completed. Was the switch a success: ${isSwitchSuccess}`);
                this._switchInProgress = false;
                return { success: isSwitchSuccess };
            }
            catch (error) {
                this.logger.info("The reconnection after the switch timed out, reverting back to the default transport.");
                this.switchTransport({ type: "default" });
                this._switchInProgress = false;
                return { success: false };
            }
        });
    }
    onLibReAnnounced(callback) {
        return this.registry.add("libReAnnounced", callback);
    }
    setLibReAnnounced(lib) {
        this.registry.execute("libReAnnounced", lib);
    }
    send(message, options) {
        if (this.transport.sendObject &&
            this.transport.isObjectBasedTransport) {
            const msg = this.createObjectMessage(message);
            if (this.isTrace) {
                this.logger.trace(`>> ${JSON.stringify(msg)}`);
            }
            return this.transport.sendObject(msg, options);
        }
        else {
            const strMessage = this.createStringMessage(message);
            if (this.isTrace) {
                this.logger.trace(`>> ${strMessage}`);
            }
            return this.transport.send(strMessage, options);
        }
    }
    on(type, messageHandler) {
        type = type.toLowerCase();
        if (this.messageHandlers[type] === undefined) {
            this.messageHandlers[type] = {};
        }
        const id = this.ids++;
        this.messageHandlers[type][id] = messageHandler;
        return {
            type,
            id,
        };
    }
    off(info) {
        delete this.messageHandlers[info.type.toLowerCase()][info.id];
    }
    get isConnected() {
        return this._isLoggedIn;
    }
    connected(callback) {
        return this.loggedIn(() => {
            const currentServer = this.transport.name();
            callback(currentServer);
        });
    }
    disconnected(callback) {
        return this.registry.add("disconnected", callback);
    }
    async login(authRequest, reconnect) {
        if (!this._defaultAuth) {
            this._defaultAuth = authRequest;
        }
        if (this._swapTransport) {
            this.logger.trace("Detected a transport swap, swapping transports");
            const newAuth = this.transportSwap();
            authRequest = newAuth ?? authRequest;
        }
        this.logger.trace(`Starting login for transport: ${this.transport.name()} and auth ${JSON.stringify(authRequest)}`);
        try {
            await this.transport.open();
            this.logger.trace(`Transport: ${this.transport.name()} opened, logging in`);
            timer("connection").mark("transport-opened");
            const identity = await this.loginCore(authRequest, reconnect);
            this.logger.trace(`Logged in with identity: ${JSON.stringify(identity)}`);
            timer("connection").mark("protocol-logged-in");
            return identity;
        }
        catch (error) {
            if (this._switchInProgress) {
                this.logger.trace("An error while logging in after a transport swap, preparing a default swap.");
                this.prepareDefaultSwap();
            }
            throw new Error(error);
        }
    }
    async logout() {
        await this.logoutCore();
        await this.transport.close();
    }
    loggedIn(callback) {
        if (this._isLoggedIn) {
            callback();
        }
        return this.registry.add("onLoggedIn", callback);
    }
    domain(domain, successMessages, errorMessages) {
        let session = this.sessions.find((s) => s.domain === domain);
        if (!session) {
            session = domainSession(domain, this, this.logger.subLogger(`domain=${domain}`), successMessages, errorMessages);
            this.sessions.push(session);
        }
        return session;
    }
    authToken() {
        const createTokenReq = {
            domain: "global",
            type: "create-token"
        };
        if (!this.globalDomain) {
            return Promise.reject(new Error("no global domain session"));
        }
        return this.globalDomain.send(createTokenReq)
            .then((res) => {
            return res.token;
        });
    }
    reconnect() {
        return this.transport.reconnect();
    }
    setLoggedIn(value) {
        this._isLoggedIn = value;
        if (this._isLoggedIn) {
            this.registry.execute("onLoggedIn");
        }
    }
    distributeMessage(message, type) {
        const handlers = this.messageHandlers[type.toLowerCase()];
        if (handlers !== undefined) {
            Object.keys(handlers).forEach((handlerId) => {
                const handler = handlers[handlerId];
                if (handler !== undefined) {
                    try {
                        handler(message);
                    }
                    catch (error) {
                        try {
                            this.logger.error(`Message handler failed with ${error.stack}`, error);
                        }
                        catch (loggerError) {
                            console.log("Message handler failed", error);
                        }
                    }
                }
            });
        }
    }
    handleConnectionChanged(connected) {
        if (this._connected === connected) {
            return;
        }
        this._connected = connected;
        if (connected) {
            if (this.settings?.replaySpecs?.length) {
                this.replayer = new MessageReplayerImpl(this.settings.replaySpecs);
                this.replayer.init(this);
            }
            this.registry.execute("connected");
        }
        else {
            this.handleDisconnected();
            this.registry.execute("disconnected");
        }
    }
    handleDisconnected() {
        this.setLoggedIn(false);
        const tryToLogin = this.shouldTryLogin;
        if (tryToLogin && this.initialLogin) {
            if (this.initialLoginAttempts <= 0) {
                return;
            }
            this.initialLoginAttempts--;
        }
        this.logger.debug("disconnected - will try new login?" + this.shouldTryLogin);
        if (this.shouldTryLogin) {
            if (!this.loginConfig) {
                throw new Error("no login info");
            }
            this.login(this.loginConfig, true)
                .catch(() => {
                setTimeout(this.handleDisconnected.bind(this), this.settings.reconnectInterval || 1000);
            });
        }
    }
    handleTransportMessage(msg) {
        let msgObj;
        if (typeof msg === "string") {
            msgObj = this.processStringMessage(msg);
        }
        else {
            msgObj = this.processObjectMessage(msg);
        }
        if (this.isTrace) {
            this.logger.trace(`<< ${JSON.stringify(msgObj)}`);
        }
        this.distributeMessage(msgObj.msg, msgObj.msgType);
    }
    verifyConnection() {
        return PromisePlus((resolve) => {
            let unsub;
            const ready = waitForInvocations(2, () => {
                if (unsub) {
                    unsub();
                }
                resolve();
            });
            unsub = this.onLibReAnnounced((lib) => {
                if (lib.name === "interop") {
                    return ready();
                }
                if (lib.name === "contexts") {
                    return ready();
                }
            });
        }, 10000, "Transport switch timed out waiting for all libraries to be re-announced");
    }
    getNewSecondaryTransport(settings) {
        if (!settings.transportConfig?.url) {
            throw new Error("Missing secondary transport URL.");
        }
        return new WS(Object.assign({}, this.settings, { ws: settings.transportConfig.url, reconnectAttempts: 1 }), this.logger.subLogger("ws-secondary"));
    }
    getNewSecondaryAuth(settings) {
        if (!settings.transportConfig?.auth) {
            throw new Error("Missing secondary transport auth information.");
        }
        return settings.transportConfig.auth;
    }
    transportSwap() {
        this._swapTransport = false;
        if (!this._targetTransport || !this._targetAuth) {
            this.logger.warn(`Error while switching transports - either the target transport or auth is not defined: transport defined -> ${!!this._defaultTransport}, auth defined -> ${!!this._targetAuth}. Staying on the current one.`);
            return;
        }
        this._transportSubscriptions.forEach((unsub) => unsub());
        this._transportSubscriptions = [];
        this.transport = this._targetTransport;
        const unsubConnectionChanged = this.transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
        const unsubOnMessage = this.transport.onMessage(this.handleTransportMessage.bind(this));
        this._transportSubscriptions.push(unsubConnectionChanged);
        this._transportSubscriptions.push(unsubOnMessage);
        return this._targetAuth;
    }
    prepareDefaultSwap() {
        this._transportSubscriptions.forEach((unsub) => unsub());
        this._transportSubscriptions = [];
        this.transport.close().catch((error) => this.logger.warn(`Error closing the ${this.transport.name()} transport after a failed connection attempt: ${JSON.stringify(error)}`));
        this._targetTransport = this._defaultTransport;
        this._targetAuth = this._defaultAuth;
        this._swapTransport = true;
    }
    processStringMessage(message) {
        const msg = JSON.parse(message, (key, value) => {
            if (typeof value !== "string") {
                return value;
            }
            if (value.length < this.dateMinLen) {
                return value;
            }
            if (!value.startsWith(this.datePrefixFirstChar)) {
                return value;
            }
            if (value.substring(0, this.datePrefixLen) !== this.datePrefix) {
                return value;
            }
            try {
                const milliseconds = parseInt(value.substring(this.datePrefixLen, value.length), 10);
                if (isNaN(milliseconds)) {
                    return value;
                }
                return new Date(milliseconds);
            }
            catch (ex) {
                return value;
            }
        });
        return {
            msg,
            msgType: msg.type,
        };
    }
    createStringMessage(message) {
        const oldToJson = Date.prototype.toJSON;
        try {
            const datePrefix = this.datePrefix;
            Date.prototype.toJSON = function () {
                return datePrefix + this.getTime();
            };
            const result = JSON.stringify(message);
            return result;
        }
        finally {
            Date.prototype.toJSON = oldToJson;
        }
    }
    processObjectMessage(message) {
        if (!message.type) {
            throw new Error("Object should have type property");
        }
        return {
            msg: message,
            msgType: message.type,
        };
    }
    createObjectMessage(message) {
        return message;
    }
    async loginCore(config, reconnect) {
        this.logger.info("logging in...");
        this.loginConfig = config;
        if (!this.loginConfig) {
            this.loginConfig = { username: "", password: "" };
        }
        this.shouldTryLogin = true;
        const authentication = await this.setupAuthConfig(config, reconnect);
        const helloMsg = {
            type: "hello",
            identity: this.settings.identity,
            authentication
        };
        if (config.sessionId) {
            helloMsg.request_id = config.sessionId;
        }
        this.globalDomain = domainSession("global", this, this.logger.subLogger("global-domain"), [
            "welcome",
            "token",
            "authentication-request"
        ]);
        const sendOptions = { skipPeerId: true };
        if (this.initialLogin) {
            sendOptions.retryInterval = this.settings.reconnectInterval;
            sendOptions.maxRetries = this.settings.reconnectAttempts;
        }
        try {
            const welcomeMsg = await this.tryAuthenticate(this.globalDomain, helloMsg, sendOptions, config);
            this.initialLogin = false;
            this.logger.info("login successful with peerId " + welcomeMsg.peer_id);
            this.peerId = welcomeMsg.peer_id;
            this.resolvedIdentity = welcomeMsg.resolved_identity;
            this.availableDomains = welcomeMsg.available_domains;
            if (welcomeMsg.options) {
                this.token = welcomeMsg.options.access_token;
                this.info = welcomeMsg.options.info;
            }
            this.setLoggedIn(true);
            return welcomeMsg.resolved_identity;
        }
        catch (err) {
            this.logger.error("error sending hello message - " + (err.message || err.msg || err.reason || err), err);
            throw err;
        }
        finally {
            if (config?.flowCallback && config.sessionId) {
                config.flowCallback(config.sessionId, null);
            }
        }
    }
    async tryAuthenticate(globalDomain, helloMsg, sendOptions, config) {
        let welcomeMsg;
        while (true) {
            const msg = await globalDomain.send(helloMsg, undefined, sendOptions);
            if (msg.type === "authentication-request") {
                const token = Buffer.from(msg.authentication.token, "base64");
                if (config.flowCallback && config.sessionId) {
                    helloMsg.authentication.token =
                        (await config.flowCallback(config.sessionId, token))
                            .data
                            .toString("base64");
                }
                helloMsg.request_id = config.sessionId;
            }
            else if (msg.type === "welcome") {
                welcomeMsg = msg;
                break;
            }
            else if (msg.type === "error") {
                throw new Error("Authentication failed: " + msg.reason);
            }
            else {
                throw new Error("Unexpected message type during authentication: " + msg.type);
            }
        }
        return welcomeMsg;
    }
    async setupAuthConfig(config, reconnect) {
        const authentication = {};
        this.gatewayToken = config.gatewayToken;
        if (config.gatewayToken) {
            if (reconnect) {
                try {
                    config.gatewayToken = await this.getNewGWToken();
                }
                catch (e) {
                    this.logger.warn(`failed to get GW token when reconnecting ${e?.message || e}`);
                }
            }
            authentication.method = "gateway-token";
            authentication.token = config.gatewayToken;
            this.gatewayToken = config.gatewayToken;
        }
        else if (config.flowName === "sspi") {
            authentication.provider = "win";
            authentication.method = "access-token";
            if (config.flowCallback && config.sessionId) {
                authentication.token =
                    (await config.flowCallback(config.sessionId, null))
                        .data
                        .toString("base64");
            }
            else {
                throw new Error("Invalid SSPI config");
            }
        }
        else if (config.token) {
            authentication.method = "access-token";
            authentication.token = config.token;
        }
        else if (config.username) {
            authentication.method = "secret";
            authentication.login = config.username;
            authentication.secret = config.password;
        }
        else if (config.provider) {
            authentication.provider = config.provider;
            authentication.providerContext = config.providerContext;
        }
        else {
            throw new Error("invalid auth message" + JSON.stringify(config));
        }
        return authentication;
    }
    async logoutCore() {
        this.logger.debug("logging out...");
        this.shouldTryLogin = false;
        if (this.pingTimer) {
            clearTimeout(this.pingTimer);
        }
        const promises = this.sessions.map((session) => {
            session.leave();
        });
        await Promise.all(promises);
    }
    getNewGWToken() {
        if (typeof window !== "undefined") {
            const glue42gd = window.glue42gd;
            if (glue42gd) {
                return glue42gd.getGWToken();
            }
        }
        return Promise.reject(new Error("not running in GD"));
    }
    ping() {
        if (!this.shouldTryLogin) {
            return;
        }
        if (this._isLoggedIn) {
            this.send({ type: "ping" });
        }
        this.pingTimer = setTimeout(() => {
            this.ping();
        }, 30 * 1000);
    }
}

const order = ["trace", "debug", "info", "warn", "error", "off"];
class Logger {
    name;
    parent;
    static Interop;
    static InteropMethodName = "T42.AppLogger.Log";
    static Instance;
    path;
    subLoggers = [];
    _consoleLevel;
    _publishLevel;
    loggerFullName;
    includeTimeAndLevel;
    logFn = console;
    customLogFn = false;
    constructor(name, parent, logFn) {
        this.name = name;
        this.parent = parent;
        this.name = name;
        if (parent) {
            this.path = `${parent.path}.${name}`;
        }
        else {
            this.path = name;
        }
        this.loggerFullName = `[${this.path}]`;
        this.includeTimeAndLevel = !logFn;
        if (logFn) {
            this.logFn = logFn;
            this.customLogFn = true;
        }
    }
    subLogger(name) {
        const existingSub = this.subLoggers.filter((subLogger) => {
            return subLogger.name === name;
        })[0];
        if (existingSub !== undefined) {
            return existingSub;
        }
        Object.keys(this).forEach((key) => {
            if (key === name) {
                throw new Error("This sub logger name is not allowed.");
            }
        });
        const sub = new Logger(name, this, this.customLogFn ? this.logFn : undefined);
        this.subLoggers.push(sub);
        return sub;
    }
    publishLevel(level) {
        if (level) {
            this._publishLevel = level;
        }
        return this._publishLevel || this.parent?.publishLevel();
    }
    consoleLevel(level) {
        if (level) {
            this._consoleLevel = level;
        }
        return this._consoleLevel || this.parent?.consoleLevel();
    }
    log(message, level, error) {
        this.publishMessage(level || "info", message, error);
    }
    trace(message) {
        this.log(message, "trace");
    }
    debug(message) {
        this.log(message, "debug");
    }
    info(message) {
        this.log(message, "info");
    }
    warn(message) {
        this.log(message, "warn");
    }
    error(message, err) {
        this.log(message, "error", err);
    }
    canPublish(level, compareWith) {
        const levelIdx = order.indexOf(level);
        const restrictionIdx = order.indexOf(compareWith || this.consoleLevel() || "trace");
        return levelIdx >= restrictionIdx;
    }
    publishMessage(level, message, error) {
        const loggerName = this.loggerFullName;
        if (level === "error" && !error) {
            const e = new Error();
            if (e.stack) {
                message =
                    message +
                        "\n" +
                        e.stack
                            .split("\n")
                            .slice(4)
                            .join("\n");
            }
        }
        if (this.canPublish(level, this.publishLevel())) {
            const interop = Logger.Interop;
            if (interop) {
                try {
                    if (interop.methods({ name: Logger.InteropMethodName }).length > 0) {
                        const args = {
                            msg: message,
                            logger: loggerName,
                            level
                        };
                        if (error && error instanceof Error) {
                            args.error = {
                                message: error.message,
                                stack: error.stack ?? ""
                            };
                        }
                        interop.invoke(Logger.InteropMethodName, args)
                            .catch((e) => {
                            this.logFn.error(`Unable to send log message to the platform: ${e.message}`, e);
                        });
                    }
                }
                catch {
                }
            }
        }
        if (this.canPublish(level)) {
            let prefix = "";
            if (this.includeTimeAndLevel) {
                const date = new Date();
                const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
                prefix = `[${time}] [${level}] `;
            }
            const toPrint = `${prefix}${loggerName}: ${message}`;
            switch (level) {
                case "trace":
                    this.logFn.debug(toPrint);
                    break;
                case "debug":
                    if (this.logFn.debug) {
                        this.logFn.debug(toPrint);
                    }
                    else {
                        this.logFn.log(toPrint);
                    }
                    break;
                case "info":
                    this.logFn.info(toPrint);
                    break;
                case "warn":
                    this.logFn.warn(toPrint);
                    break;
                case "error":
                    this.logFn.error(toPrint, error);
                    break;
            }
        }
    }
}

const GW_MESSAGE_CREATE_CONTEXT = "create-context";
const GW_MESSAGE_ACTIVITY_CREATED = "created";
const GW_MESSAGE_ACTIVITY_DESTROYED = "destroyed";
const GW_MESSAGE_CONTEXT_CREATED = "context-created";
const GW_MESSAGE_CONTEXT_ADDED = "context-added";
const GW_MESSAGE_SUBSCRIBE_CONTEXT = "subscribe-context";
const GW_MESSAGE_SUBSCRIBED_CONTEXT = "subscribed-context";
const GW_MESSAGE_UNSUBSCRIBE_CONTEXT = "unsubscribe-context";
const GW_MESSAGE_DESTROY_CONTEXT = "destroy-context";
const GW_MESSAGE_CONTEXT_DESTROYED = "context-destroyed";
const GW_MESSAGE_UPDATE_CONTEXT = "update-context";
const GW_MESSAGE_CONTEXT_UPDATED = "context-updated";
const GW_MESSAGE_JOINED_ACTIVITY = "joined";

const ContextMessageReplaySpec = {
    get name() {
        return "context";
    },
    get types() {
        return [
            GW_MESSAGE_CREATE_CONTEXT,
            GW_MESSAGE_ACTIVITY_CREATED,
            GW_MESSAGE_ACTIVITY_DESTROYED,
            GW_MESSAGE_CONTEXT_CREATED,
            GW_MESSAGE_CONTEXT_ADDED,
            GW_MESSAGE_SUBSCRIBE_CONTEXT,
            GW_MESSAGE_SUBSCRIBED_CONTEXT,
            GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            GW_MESSAGE_DESTROY_CONTEXT,
            GW_MESSAGE_CONTEXT_DESTROYED,
            GW_MESSAGE_UPDATE_CONTEXT,
            GW_MESSAGE_CONTEXT_UPDATED,
            GW_MESSAGE_JOINED_ACTIVITY
        ];
    }
};

var version = "6.6.0";

function prepareConfig (configuration, ext, glue42gd) {
    let nodeStartingContext;
    if (Utils.isNode()) {
        const startingContextString = process.env._GD_STARTING_CONTEXT_;
        if (startingContextString) {
            try {
                nodeStartingContext = JSON.parse(startingContextString);
            }
            catch {
            }
        }
    }
    function getConnection() {
        const gwConfig = configuration.gateway;
        const protocolVersion = gwConfig?.protocolVersion ?? 3;
        const reconnectInterval = gwConfig?.reconnectInterval;
        const reconnectAttempts = gwConfig?.reconnectAttempts;
        const defaultWs = "ws://localhost:8385";
        let ws = gwConfig?.ws;
        const sharedWorker = gwConfig?.sharedWorker;
        const inproc = gwConfig?.inproc;
        const webPlatform = gwConfig?.webPlatform ?? undefined;
        if (glue42gd) {
            ws = glue42gd.gwURL;
        }
        if (Utils.isNode() && nodeStartingContext && nodeStartingContext.gwURL) {
            ws = nodeStartingContext.gwURL;
        }
        if (!ws && !sharedWorker && !inproc) {
            ws = defaultWs;
        }
        let instanceId;
        let windowId;
        let pid;
        let environment;
        let region;
        const appName = getApplication();
        let uniqueAppName = appName;
        if (typeof glue42gd !== "undefined") {
            windowId = glue42gd.windowId;
            pid = glue42gd.pid;
            if (glue42gd.env) {
                environment = glue42gd.env.env;
                region = glue42gd.env.region;
            }
            uniqueAppName = glue42gd.application ?? "glue-app";
            instanceId = glue42gd.appInstanceId;
        }
        else if (Utils.isNode()) {
            pid = process.pid;
            if (nodeStartingContext) {
                environment = nodeStartingContext.env;
                region = nodeStartingContext.region;
                instanceId = nodeStartingContext.instanceId;
            }
        }
        else if (typeof window?.glue42electron !== "undefined") {
            windowId = window?.glue42electron.instanceId;
            pid = window?.glue42electron.pid;
            environment = window?.glue42electron.env;
            region = window?.glue42electron.region;
            uniqueAppName = window?.glue42electron.application ?? "glue-app";
            instanceId = window?.glue42electron.instanceId;
        }
        else ;
        const replaySpecs = configuration.gateway?.replaySpecs ?? [];
        replaySpecs.push(ContextMessageReplaySpec);
        let identity = {
            application: uniqueAppName,
            applicationName: appName,
            windowId,
            instance: instanceId,
            process: pid,
            region,
            environment,
            api: ext.version || version
        };
        if (configuration.identity) {
            identity = Object.assign(identity, configuration.identity);
        }
        return {
            identity,
            reconnectInterval,
            ws,
            sharedWorker,
            webPlatform,
            inproc,
            protocolVersion,
            reconnectAttempts,
            replaySpecs,
        };
    }
    function getContexts() {
        if (typeof configuration.contexts === "undefined") {
            return { reAnnounceKnownContexts: true };
        }
        if (typeof configuration.contexts === "boolean" && configuration.contexts) {
            return { reAnnounceKnownContexts: true };
        }
        if (typeof configuration.contexts === "object") {
            return Object.assign({}, { reAnnounceKnownContexts: true }, configuration.contexts);
        }
        return false;
    }
    function getApplication() {
        if (configuration.application) {
            return configuration.application;
        }
        if (glue42gd) {
            return glue42gd.applicationName;
        }
        if (typeof window !== "undefined" && typeof window.glue42electron !== "undefined") {
            return window.glue42electron.application;
        }
        const uid = nanoid(10);
        if (Utils.isNode()) {
            if (nodeStartingContext) {
                return nodeStartingContext.applicationConfig.name;
            }
            return "NodeJS" + uid;
        }
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            return document.title + ` (${uid})`;
        }
        return uid;
    }
    function getAuth() {
        if (typeof configuration.auth === "string") {
            return {
                token: configuration.auth
            };
        }
        if (configuration.auth) {
            return configuration.auth;
        }
        if (Utils.isNode() && nodeStartingContext && nodeStartingContext.gwToken) {
            return {
                gatewayToken: nodeStartingContext.gwToken
            };
        }
        if (configuration.gateway?.webPlatform || configuration.gateway?.inproc || configuration.gateway?.sharedWorker) {
            return {
                username: "glue42", password: "glue42"
            };
        }
    }
    function getLogger() {
        let config = configuration.logger;
        const defaultLevel = "warn";
        if (!config) {
            config = defaultLevel;
        }
        let gdConsoleLevel;
        if (glue42gd) {
            gdConsoleLevel = glue42gd.consoleLogLevel;
        }
        if (typeof config === "string") {
            return { console: gdConsoleLevel ?? config, publish: defaultLevel };
        }
        return {
            console: gdConsoleLevel ?? config.console ?? defaultLevel,
            publish: config.publish ?? defaultLevel
        };
    }
    const connection = getConnection();
    let application = getApplication();
    if (typeof window !== "undefined") {
        const windowAsAny = window;
        const containerApplication = windowAsAny.htmlContainer ?
            `${windowAsAny.htmlContainer.containerName}.${windowAsAny.htmlContainer.application}` :
            windowAsAny?.glue42gd?.application;
        if (containerApplication) {
            application = containerApplication;
        }
    }
    return {
        bus: configuration.bus ?? false,
        application,
        auth: getAuth(),
        logger: getLogger(),
        connection,
        metrics: configuration.metrics ?? true,
        contexts: getContexts(),
        version: ext.version || version,
        libs: ext.libs ?? [],
        customLogger: configuration.customLogger
    };
}

class GW3ContextData {
    name;
    contextId;
    context;
    isAnnounced;
    joinedActivity;
    updateCallbacks = {};
    activityId;
    sentExplicitSubscription;
    hasReceivedSnapshot;
    constructor(contextId, name, isAnnounced, activityId) {
        this.contextId = contextId;
        this.name = name;
        this.isAnnounced = isAnnounced;
        this.activityId = activityId;
        this.context = {};
    }
    hasCallbacks() {
        return Object.keys(this.updateCallbacks).length > 0;
    }
    getState() {
        if (this.isAnnounced && this.hasCallbacks()) {
            return 3;
        }
        if (this.isAnnounced) {
            return 2;
        }
        if (this.hasCallbacks()) {
            return 1;
        }
        return 0;
    }
}

var lodash_clonedeep = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
lodash_clonedeep.exports;

(function (module, exports) {
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/**
	 * Adds the key-value `pair` to `map`.
	 *
	 * @private
	 * @param {Object} map The map to modify.
	 * @param {Array} pair The key-value pair to add.
	 * @returns {Object} Returns `map`.
	 */
	function addMapEntry(map, pair) {
	  // Don't return `map.set` because it's not chainable in IE 11.
	  map.set(pair[0], pair[1]);
	  return map;
	}

	/**
	 * Adds `value` to `set`.
	 *
	 * @private
	 * @param {Object} set The set to modify.
	 * @param {*} value The value to add.
	 * @returns {Object} Returns `set`.
	 */
	function addSetEntry(set, value) {
	  // Don't return `set.add` because it's not chainable in IE 11.
	  set.add(value);
	  return set;
	}

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array ? array.length : 0;
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    getPrototype = overArg(Object.getPrototypeOf, Object),
	    objectCreate = Object.create,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols,
	    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	    nativeKeys = overArg(Object.keys, Object);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView'),
	    Map = getNative(root, 'Map'),
	    Promise = getNative(root, 'Promise'),
	    Set = getNative(root, 'Set'),
	    WeakMap = getNative(root, 'WeakMap'),
	    nativeCreate = getNative(Object, 'create');

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache) {
	    var pairs = cache.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      return this;
	    }
	    cache = this.__data__ = new MapCache(pairs);
	  }
	  cache.set(key, value);
	  return this;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];

	  var length = result.length,
	      skipIndexes = !!length;

	  for (var key in value) {
	    if ((hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && copyObject(source, keys(source), object);
	}

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {boolean} [isFull] Specify a clone including symbols.
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
	  var result;
	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      if (isHostObject(value)) {
	        return object ? value : {};
	      }
	      result = initCloneObject(isFunc ? {} : value);
	      if (!isDeep) {
	        return copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, baseClone, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (!isArr) {
	    var props = isFull ? getAllKeys(value) : keys(value);
	  }
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
	  });
	  return result;
	}

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	function baseCreate(proto) {
	  return isObject(proto) ? objectCreate(proto) : {};
	}

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	/**
	 * The base implementation of `getTag`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  return objectToString.call(value);
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var result = new buffer.constructor(buffer.length);
	  buffer.copy(result);
	  return result;
	}

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	/**
	 * Creates a clone of `map`.
	 *
	 * @private
	 * @param {Object} map The map to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned map.
	 */
	function cloneMap(map, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
	  return arrayReduce(array, addMapEntry, new map.constructor);
	}

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	/**
	 * Creates a clone of `set`.
	 *
	 * @private
	 * @param {Object} set The set to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned set.
	 */
	function cloneSet(set, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
	  return arrayReduce(array, addSetEntry, new set.constructor);
	}

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = undefined;

	    assignValue(object, key, newValue === undefined ? source[key] : newValue);
	  }
	  return object;
	}

	/**
	 * Copies own symbol properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return copyObject(source, getSymbols(source), object);
	}

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	/**
	 * Creates an array of the own enumerable symbol properties of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge < 14, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, cloneFunc, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return cloneArrayBuffer(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case dataViewTag:
	      return cloneDataView(object, isDeep);

	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      return cloneTypedArray(object, isDeep);

	    case mapTag:
	      return cloneMap(object, isDeep, cloneFunc);

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      return cloneRegExp(object);

	    case setTag:
	      return cloneSet(object, isDeep, cloneFunc);

	    case symbolTag:
	      return cloneSymbol(object);
	  }
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, true, true);
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = cloneDeep; 
} (lodash_clonedeep, lodash_clonedeep.exports));

var lodash_clonedeepExports = lodash_clonedeep.exports;
var cloneDeep = /*@__PURE__*/getDefaultExportFromCjs(lodash_clonedeepExports);

function applyContextDelta(context, delta, logger) {
    try {
        if (logger?.canPublish("trace")) {
            logger?.trace(`applying context delta ${JSON.stringify(delta)} on context ${JSON.stringify(context)}`);
        }
        if (!delta) {
            return context;
        }
        if (delta.reset) {
            context = { ...delta.reset };
            return context;
        }
        context = deepClone(context, undefined);
        if (delta.commands) {
            for (const command of delta.commands) {
                if (command.type === "remove") {
                    deletePath(context, command.path);
                }
                else if (command.type === "set") {
                    setValueToPath(context, command.value, command.path);
                }
            }
            return context;
        }
        const added = delta.added;
        const updated = delta.updated;
        const removed = delta.removed;
        if (added) {
            Object.keys(added).forEach((key) => {
                context[key] = added[key];
            });
        }
        if (updated) {
            Object.keys(updated).forEach((key) => {
                mergeObjectsProperties(key, context, updated);
            });
        }
        if (removed) {
            removed.forEach((key) => {
                delete context[key];
            });
        }
        return context;
    }
    catch (e) {
        logger?.error(`error applying context delta ${JSON.stringify(delta)} on context ${JSON.stringify(context)}`, e);
        return context;
    }
}
function deepClone(obj, hash) {
    return cloneDeep(obj);
}
const mergeObjectsProperties = (key, what, withWhat) => {
    const right = withWhat[key];
    if (right === undefined) {
        return what;
    }
    const left = what[key];
    if (!left || !right) {
        what[key] = right;
        return what;
    }
    if (typeof left === "string" ||
        typeof left === "number" ||
        typeof left === "boolean" ||
        typeof right === "string" ||
        typeof right === "number" ||
        typeof right === "boolean" ||
        Array.isArray(left) ||
        Array.isArray(right)) {
        what[key] = right;
        return what;
    }
    what[key] = Object.assign({}, left, right);
    return what;
};
function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    if (x.constructor !== y.constructor) {
        return false;
    }
    for (const p in x) {
        if (!x.hasOwnProperty(p)) {
            continue;
        }
        if (!y.hasOwnProperty(p)) {
            return false;
        }
        if (x[p] === y[p]) {
            continue;
        }
        if (typeof (x[p]) !== "object") {
            return false;
        }
        if (!deepEqual(x[p], y[p])) {
            return false;
        }
    }
    for (const p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}
function setValueToPath(obj, value, path) {
    const pathArr = path.split(".");
    let i;
    for (i = 0; i < pathArr.length - 1; i++) {
        if (!obj[pathArr[i]]) {
            obj[pathArr[i]] = {};
        }
        if (typeof obj[pathArr[i]] !== "object") {
            obj[pathArr[i]] = {};
        }
        obj = obj[pathArr[i]];
    }
    obj[pathArr[i]] = value;
}
function isSubset(superObj, subObj) {
    return Object.keys(subObj).every((ele) => {
        if (typeof subObj[ele] === "object") {
            return isSubset(superObj?.[ele] || {}, subObj[ele] || {});
        }
        return subObj[ele] === superObj?.[ele];
    });
}
function deletePath(obj, path) {
    const pathArr = path.split(".");
    let i;
    for (i = 0; i < pathArr.length - 1; i++) {
        if (!obj[pathArr[i]]) {
            return;
        }
        obj = obj[pathArr[i]];
    }
    delete obj[pathArr[i]];
}

class GW3Bridge {
    _logger;
    _connection;
    _trackAllContexts;
    _reAnnounceKnownContexts;
    _gw3Session;
    _contextNameToData = {};
    _gw3Subscriptions = [];
    _nextCallbackSubscriptionNumber = 0;
    _creationPromises = {};
    _contextNameToId = {};
    _contextIdToName = {};
    _protocolVersion = undefined;
    _contextsTempCache = {};
    _contextsSubscriptionsCache = [];
    _systemContextsSubKey;
    get protocolVersion() {
        if (!this._protocolVersion) {
            const contextsDomainInfo = this._connection.availableDomains.find((d) => d.uri === "context");
            this._protocolVersion = contextsDomainInfo?.version ?? 1;
        }
        return this._protocolVersion;
    }
    get setPathSupported() {
        return this.protocolVersion >= 2;
    }
    constructor(config) {
        this._connection = config.connection;
        this._logger = config.logger;
        this._trackAllContexts = config.trackAllContexts;
        this._reAnnounceKnownContexts = config.reAnnounceKnownContexts;
        this._gw3Session = this._connection.domain("global", [
            GW_MESSAGE_CONTEXT_CREATED,
            GW_MESSAGE_SUBSCRIBED_CONTEXT,
            GW_MESSAGE_CONTEXT_DESTROYED,
            GW_MESSAGE_CONTEXT_UPDATED,
        ]);
        this._gw3Session.disconnected(this.resetState.bind(this));
        this._gw3Session.onJoined((wasReconnect) => {
            if (!wasReconnect) {
                return;
            }
            if (!this._reAnnounceKnownContexts) {
                return this._connection.setLibReAnnounced({ name: "contexts" });
            }
            this.reInitiateState().then(() => this._connection.setLibReAnnounced({ name: "contexts" }));
        });
        this.subscribeToContextCreatedMessages();
        this.subscribeToContextUpdatedMessages();
        this.subscribeToContextDestroyedMessages();
        this._connection.replayer?.drain(ContextMessageReplaySpec.name, (message) => {
            const type = message.type;
            if (!type) {
                return;
            }
            if (type === GW_MESSAGE_CONTEXT_CREATED ||
                type === GW_MESSAGE_CONTEXT_ADDED ||
                type === GW_MESSAGE_ACTIVITY_CREATED) {
                this.handleContextCreatedMessage(message);
            }
            else if (type === GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                type === GW_MESSAGE_CONTEXT_UPDATED ||
                type === GW_MESSAGE_JOINED_ACTIVITY) {
                this.handleContextUpdatedMessage(message);
            }
            else if (type === GW_MESSAGE_CONTEXT_DESTROYED ||
                type === GW_MESSAGE_ACTIVITY_DESTROYED) {
                this.handleContextDestroyedMessage(message);
            }
        });
    }
    dispose() {
        for (const sub of this._gw3Subscriptions) {
            this._connection.off(sub);
        }
        this._gw3Subscriptions.length = 0;
        for (const contextName in this._contextNameToData) {
            if (this._contextNameToId.hasOwnProperty(contextName)) {
                delete this._contextNameToData[contextName];
            }
        }
    }
    createContext(name, data) {
        if (name in this._creationPromises) {
            return this._creationPromises[name];
        }
        this._creationPromises[name] =
            this._gw3Session
                .send({
                type: GW_MESSAGE_CREATE_CONTEXT,
                domain: "global",
                name,
                data,
                lifetime: "retained",
            })
                .then((createContextMsg) => {
                this._contextNameToId[name] = createContextMsg.context_id;
                this._contextIdToName[createContextMsg.context_id] = name;
                const contextData = this._contextNameToData[name] || new GW3ContextData(createContextMsg.context_id, name, true, undefined);
                contextData.isAnnounced = true;
                contextData.name = name;
                contextData.contextId = createContextMsg.context_id;
                contextData.context = createContextMsg.data || deepClone(data);
                contextData.hasReceivedSnapshot = true;
                this._contextNameToData[name] = contextData;
                delete this._creationPromises[name];
                return createContextMsg.context_id;
            });
        return this._creationPromises[name];
    }
    all() {
        return Object.keys(this._contextNameToData)
            .filter((name) => this._contextNameToData[name].isAnnounced);
    }
    async update(name, delta) {
        if (delta) {
            delta = deepClone(delta);
        }
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, delta);
        }
        let currentContext = contextData.context;
        if (!contextData.hasCallbacks()) {
            currentContext = await this.get(contextData.name);
        }
        const calculatedDelta = this.setPathSupported ?
            this.calculateContextDeltaV2(currentContext, delta) :
            this.calculateContextDeltaV1(currentContext, delta);
        if (!Object.keys(calculatedDelta.added).length
            && !Object.keys(calculatedDelta.updated).length
            && !calculatedDelta.removed.length
            && !calculatedDelta.commands?.length) {
            return Promise.resolve();
        }
        return this._gw3Session
            .send({
            type: GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: calculatedDelta,
        }, {}, { skipPeerId: false })
            .then((gwResponse) => {
            this.handleUpdated(contextData, calculatedDelta, {
                updaterId: gwResponse.peer_id
            });
        });
    }
    async set(name, data) {
        if (data) {
            data = deepClone(data);
        }
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return this.createContext(name, data);
        }
        return this._gw3Session
            .send({
            type: GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: { reset: data },
        }, {}, { skipPeerId: false })
            .then((gwResponse) => {
            this.handleUpdated(contextData, {
                reset: data,
                added: {},
                removed: [],
                updated: {}
            }, {
                updaterId: gwResponse.peer_id
            });
        });
    }
    setPath(name, path, value) {
        if (!this.setPathSupported) {
            return Promise.reject("glue.contexts.setPath operation is not supported, use Glue42 3.10 or later");
        }
        return this.setPaths(name, [{ path, value }]);
    }
    async setPaths(name, pathValues) {
        if (!this.setPathSupported) {
            return Promise.reject("glue.contexts.setPaths operation is not supported, use Glue42 3.10 or later");
        }
        if (pathValues) {
            pathValues = deepClone(pathValues);
        }
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            const obj = {};
            for (const pathValue of pathValues) {
                setValueToPath(obj, pathValue.value, pathValue.path);
            }
            return this.createContext(name, obj);
        }
        const commands = [];
        for (const pathValue of pathValues) {
            if (pathValue.value === null) {
                commands.push({ type: "remove", path: pathValue.path });
            }
            else {
                commands.push({ type: "set", path: pathValue.path, value: pathValue.value });
            }
        }
        return this._gw3Session
            .send({
            type: GW_MESSAGE_UPDATE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
            delta: { commands }
        }, {}, { skipPeerId: false })
            .then((gwResponse) => {
            this.handleUpdated(contextData, {
                added: {},
                removed: [],
                updated: {},
                commands
            }, {
                updaterId: gwResponse.peer_id
            });
        });
    }
    async get(name) {
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const contextData = this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            return Promise.resolve({});
        }
        if (contextData && (!contextData.hasCallbacks() || !contextData.hasReceivedSnapshot)) {
            return new Promise((resolve) => {
                this.subscribe(name, (data, _d, _r, un) => {
                    this.unsubscribe(un);
                    resolve(data);
                });
            });
        }
        const context = contextData?.context ?? {};
        return Promise.resolve(deepClone(context));
    }
    async subscribe(name, callback, subscriptionKey) {
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const thisCallbackSubscriptionNumber = typeof subscriptionKey === "undefined" ? this._nextCallbackSubscriptionNumber : subscriptionKey;
        if (typeof subscriptionKey === "undefined") {
            this._nextCallbackSubscriptionNumber += 1;
        }
        if (this._contextsSubscriptionsCache.every((subscription) => subscription.subKey !== this._nextCallbackSubscriptionNumber)) {
            this._contextsSubscriptionsCache.push({ contextName: name, subKey: thisCallbackSubscriptionNumber, callback });
        }
        let contextData = this._contextNameToData[name];
        if (!contextData ||
            !contextData.isAnnounced) {
            contextData = contextData || new GW3ContextData(undefined, name, false, undefined);
            this._contextNameToData[name] = contextData;
            contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
            return Promise.resolve(thisCallbackSubscriptionNumber);
        }
        const hadCallbacks = contextData.hasCallbacks();
        contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
        if (!hadCallbacks) {
            if (!contextData.joinedActivity) {
                if (contextData.context && contextData.sentExplicitSubscription) {
                    if (contextData.hasReceivedSnapshot) {
                        const clone = deepClone(contextData.context);
                        callback(clone, clone, [], thisCallbackSubscriptionNumber);
                    }
                    return Promise.resolve(thisCallbackSubscriptionNumber);
                }
                return this.sendSubscribe(contextData)
                    .then(() => thisCallbackSubscriptionNumber);
            }
            else {
                if (contextData.hasReceivedSnapshot) {
                    const clone = deepClone(contextData.context);
                    callback(clone, clone, [], thisCallbackSubscriptionNumber);
                }
                return Promise.resolve(thisCallbackSubscriptionNumber);
            }
        }
        else {
            if (contextData.hasReceivedSnapshot) {
                const clone = deepClone(contextData.context);
                callback(clone, clone, [], thisCallbackSubscriptionNumber);
            }
            return Promise.resolve(thisCallbackSubscriptionNumber);
        }
    }
    unsubscribe(subscriptionKey) {
        this._contextsSubscriptionsCache = this._contextsSubscriptionsCache.filter((subscription) => subscription.subKey !== subscriptionKey);
        for (const name of Object.keys(this._contextNameToData)) {
            const contextData = this._contextNameToData[name];
            if (!contextData) {
                return;
            }
            const hadCallbacks = contextData.hasCallbacks();
            delete contextData.updateCallbacks[subscriptionKey];
            if (contextData.isAnnounced &&
                hadCallbacks &&
                !contextData.hasCallbacks() &&
                contextData.sentExplicitSubscription) {
                this.sendUnsubscribe(contextData).catch(() => { });
            }
            if (!contextData.isAnnounced &&
                !contextData.hasCallbacks()) {
                delete this._contextNameToData[name];
            }
        }
    }
    async destroy(name) {
        if (name in this._creationPromises) {
            await this._creationPromises[name];
        }
        const contextData = this._contextNameToData[name];
        if (!contextData) {
            return Promise.reject(`context with ${name} does not exist`);
        }
        return this._gw3Session
            .send({
            type: GW_MESSAGE_DESTROY_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then((_) => undefined);
    }
    handleUpdated(contextData, delta, extraData) {
        const oldContext = contextData.context;
        contextData.context = applyContextDelta(contextData.context, delta, this._logger);
        contextData.hasReceivedSnapshot = true;
        if (this._contextNameToData[contextData.name] === contextData &&
            !deepEqual(oldContext, contextData.context)) {
            this.invokeUpdateCallbacks(contextData, delta, extraData);
        }
    }
    subscribeToContextCreatedMessages() {
        const createdMessageTypes = [
            GW_MESSAGE_CONTEXT_ADDED,
            GW_MESSAGE_CONTEXT_CREATED,
            GW_MESSAGE_ACTIVITY_CREATED,
        ];
        for (const createdMessageType of createdMessageTypes) {
            const sub = this._connection.on(createdMessageType, this.handleContextCreatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    }
    handleContextCreatedMessage(contextCreatedMsg) {
        const createdMessageType = contextCreatedMsg.type;
        if (createdMessageType === GW_MESSAGE_ACTIVITY_CREATED) {
            this._contextNameToId[contextCreatedMsg.activity_id] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.activity_id;
        }
        else if (createdMessageType === GW_MESSAGE_CONTEXT_ADDED) {
            this._contextNameToId[contextCreatedMsg.name] = contextCreatedMsg.context_id;
            this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.name;
        }
        else ;
        const name = this._contextIdToName[contextCreatedMsg.context_id];
        if (!name) {
            throw new Error("Received created event for context with unknown name: " + contextCreatedMsg.context_id);
        }
        if (!this._contextNameToId[name]) {
            throw new Error("Received created event for context with unknown id: " + contextCreatedMsg.context_id);
        }
        let contextData = this._contextNameToData[name];
        if (contextData) {
            if (contextData.isAnnounced) {
                return;
            }
            else {
                if (!contextData.hasCallbacks()) {
                    throw new Error("Assertion failure: contextData.hasCallbacks()");
                }
                contextData.isAnnounced = true;
                contextData.contextId = contextCreatedMsg.context_id;
                contextData.activityId = contextCreatedMsg.activity_id;
                if (!contextData.sentExplicitSubscription) {
                    this.sendSubscribe(contextData);
                }
            }
        }
        else {
            this._contextNameToData[name] = contextData =
                new GW3ContextData(contextCreatedMsg.context_id, name, true, contextCreatedMsg.activity_id);
            if (this._trackAllContexts) {
                this.subscribe(name, () => { }).then((subKey) => this._systemContextsSubKey = subKey);
            }
        }
    }
    subscribeToContextUpdatedMessages() {
        const updatedMessageTypes = [
            GW_MESSAGE_CONTEXT_UPDATED,
            GW_MESSAGE_SUBSCRIBED_CONTEXT,
            GW_MESSAGE_JOINED_ACTIVITY,
        ];
        for (const updatedMessageType of updatedMessageTypes) {
            const sub = this._connection.on(updatedMessageType, this.handleContextUpdatedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    }
    handleContextUpdatedMessage(contextUpdatedMsg) {
        const updatedMessageType = contextUpdatedMsg.type;
        const contextId = contextUpdatedMsg.context_id;
        let contextData = this._contextNameToData[this._contextIdToName[contextId]];
        const justSeen = !contextData || !contextData.isAnnounced;
        if (updatedMessageType === GW_MESSAGE_JOINED_ACTIVITY) {
            if (!contextData) {
                contextData =
                    this._contextNameToData[contextUpdatedMsg.activity_id] ||
                        new GW3ContextData(contextId, contextUpdatedMsg.activity_id, true, contextUpdatedMsg.activity_id);
            }
            this._contextNameToData[contextUpdatedMsg.activity_id] = contextData;
            this._contextIdToName[contextId] = contextUpdatedMsg.activity_id;
            this._contextNameToId[contextUpdatedMsg.activity_id] = contextId;
            contextData.contextId = contextId;
            contextData.isAnnounced = true;
            contextData.activityId = contextUpdatedMsg.activity_id;
            contextData.joinedActivity = true;
        }
        else {
            if (!contextData || !contextData.isAnnounced) {
                if (updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                    contextData = contextData || new GW3ContextData(contextId, contextUpdatedMsg.name, true, undefined);
                    contextData.sentExplicitSubscription = true;
                    this._contextNameToData[contextUpdatedMsg.name] = contextData;
                    this._contextIdToName[contextId] = contextUpdatedMsg.name;
                    this._contextNameToId[contextUpdatedMsg.name] = contextId;
                }
                else {
                    this._logger.error(`Received 'update' for unknown context: ${contextId}`);
                }
                return;
            }
        }
        const oldContext = contextData.context;
        contextData.hasReceivedSnapshot = true;
        if (updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            contextData.context = contextUpdatedMsg.data || {};
        }
        else if (updatedMessageType === GW_MESSAGE_JOINED_ACTIVITY) {
            contextData.context = contextUpdatedMsg.context_snapshot || {};
        }
        else if (updatedMessageType === GW_MESSAGE_CONTEXT_UPDATED) {
            contextData.context = applyContextDelta(contextData.context, contextUpdatedMsg.delta, this._logger);
        }
        else {
            throw new Error("Unrecognized context update message " + updatedMessageType);
        }
        if (justSeen ||
            !deepEqual(contextData.context, oldContext) ||
            updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
            this.invokeUpdateCallbacks(contextData, contextUpdatedMsg.delta, { updaterId: contextUpdatedMsg.updater_id });
        }
    }
    invokeUpdateCallbacks(contextData, delta, extraData) {
        delta = delta || { added: {}, updated: {}, reset: {}, removed: [] };
        if (delta.commands) {
            delta.added = delta.updated = delta.reset = {};
            delta.removed = [];
            for (const command of delta.commands) {
                if (command.type === "remove") {
                    if (command.path.indexOf(".") === -1) {
                        delta.removed.push(command.path);
                    }
                    setValueToPath(delta.updated, null, command.path);
                }
                else if (command.type === "set") {
                    setValueToPath(delta.updated, command.value, command.path);
                }
            }
        }
        for (const updateCallbackIndex in contextData.updateCallbacks) {
            if (contextData.updateCallbacks.hasOwnProperty(updateCallbackIndex)) {
                try {
                    const updateCallback = contextData.updateCallbacks[updateCallbackIndex];
                    updateCallback(deepClone(contextData.context), deepClone(Object.assign({}, delta.added || {}, delta.updated || {}, delta.reset || {})), delta.removed, parseInt(updateCallbackIndex, 10), extraData);
                }
                catch (err) {
                    this._logger.debug("callback error: " + JSON.stringify(err));
                }
            }
        }
    }
    subscribeToContextDestroyedMessages() {
        const destroyedMessageTypes = [
            GW_MESSAGE_CONTEXT_DESTROYED,
            GW_MESSAGE_ACTIVITY_DESTROYED,
        ];
        for (const destroyedMessageType of destroyedMessageTypes) {
            const sub = this._connection.on(destroyedMessageType, this.handleContextDestroyedMessage.bind(this));
            this._gw3Subscriptions.push(sub);
        }
    }
    handleContextDestroyedMessage(destroyedMsg) {
        const destroyedMessageType = destroyedMsg.type;
        let contextId;
        let name;
        if (destroyedMessageType === GW_MESSAGE_ACTIVITY_DESTROYED) {
            name = destroyedMsg.activity_id;
            contextId = this._contextNameToId[name];
            if (!contextId) {
                this._logger.error(`Received 'destroyed' for unknown activity: ${destroyedMsg.activity_id}`);
                return;
            }
        }
        else {
            contextId = destroyedMsg.context_id;
            name = this._contextIdToName[contextId];
            if (!name) {
                this._logger.error(`Received 'destroyed' for unknown context: ${destroyedMsg.context_id}`);
                return;
            }
        }
        delete this._contextIdToName[contextId];
        delete this._contextNameToId[name];
        const contextData = this._contextNameToData[name];
        delete this._contextNameToData[name];
        if (!contextData || !contextData.isAnnounced) {
            this._logger.error(`Received 'destroyed' for unknown context: ${contextId}`);
            return;
        }
    }
    sendSubscribe(contextData) {
        contextData.sentExplicitSubscription = true;
        return this._gw3Session
            .send({
            type: GW_MESSAGE_SUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then((_) => undefined);
    }
    sendUnsubscribe(contextData) {
        contextData.sentExplicitSubscription = false;
        return this._gw3Session
            .send({
            type: GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
            domain: "global",
            context_id: contextData.contextId,
        }).then((_) => undefined);
    }
    calculateContextDeltaV1(from, to) {
        const delta = { added: {}, updated: {}, removed: [], reset: undefined };
        if (from) {
            for (const x of Object.keys(from)) {
                if (Object.keys(to).indexOf(x) !== -1
                    && to[x] !== null
                    && !deepEqual(from[x], to[x])) {
                    delta.updated[x] = to[x];
                }
            }
        }
        for (const x of Object.keys(to)) {
            if (!from || (Object.keys(from).indexOf(x) === -1)) {
                if (to[x] !== null) {
                    delta.added[x] = to[x];
                }
            }
            else if (to[x] === null) {
                delta.removed.push(x);
            }
        }
        return delta;
    }
    calculateContextDeltaV2(from, to) {
        const delta = { added: {}, updated: {}, removed: [], reset: undefined, commands: [] };
        for (const x of Object.keys(to)) {
            if (to[x] !== null) {
                const fromX = from ? from[x] : null;
                if (!deepEqual(fromX, to[x])) {
                    delta.commands?.push({ type: "set", path: x, value: to[x] });
                }
            }
            else {
                delta.commands?.push({ type: "remove", path: x });
            }
        }
        return delta;
    }
    resetState() {
        for (const sub of this._gw3Subscriptions) {
            this._connection.off(sub);
        }
        if (this._systemContextsSubKey) {
            this.unsubscribe(this._systemContextsSubKey);
            delete this._systemContextsSubKey;
        }
        this._gw3Subscriptions = [];
        this._contextNameToId = {};
        this._contextIdToName = {};
        delete this._protocolVersion;
        this._contextsTempCache = Object.keys(this._contextNameToData).reduce((cacheSoFar, ctxName) => {
            cacheSoFar[ctxName] = this._contextNameToData[ctxName].context;
            return cacheSoFar;
        }, {});
        this._contextNameToData = {};
    }
    async reInitiateState() {
        this.subscribeToContextCreatedMessages();
        this.subscribeToContextUpdatedMessages();
        this.subscribeToContextDestroyedMessages();
        this._connection.replayer?.drain(ContextMessageReplaySpec.name, (message) => {
            const type = message.type;
            if (!type) {
                return;
            }
            if (type === GW_MESSAGE_CONTEXT_CREATED ||
                type === GW_MESSAGE_CONTEXT_ADDED ||
                type === GW_MESSAGE_ACTIVITY_CREATED) {
                this.handleContextCreatedMessage(message);
            }
            else if (type === GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                type === GW_MESSAGE_CONTEXT_UPDATED ||
                type === GW_MESSAGE_JOINED_ACTIVITY) {
                this.handleContextUpdatedMessage(message);
            }
            else if (type === GW_MESSAGE_CONTEXT_DESTROYED ||
                type === GW_MESSAGE_ACTIVITY_DESTROYED) {
                this.handleContextDestroyedMessage(message);
            }
        });
        await Promise.all(this._contextsSubscriptionsCache.map((subscription) => this.subscribe(subscription.contextName, subscription.callback, subscription.subKey)));
        await this.flushQueue();
        for (const ctxName in this._contextsTempCache) {
            if (typeof this._contextsTempCache[ctxName] !== "object" || Object.keys(this._contextsTempCache[ctxName]).length === 0) {
                continue;
            }
            const lastKnownData = this._contextsTempCache[ctxName];
            this._logger.info(`Re-announcing known context: ${ctxName}`);
            await this.flushQueue();
            await this.update(ctxName, lastKnownData);
        }
        this._contextsTempCache = {};
        this._logger.info("Contexts are re-announced");
    }
    flushQueue() {
        return new Promise((resolve) => setTimeout(() => resolve(), 0));
    }
}

class ContextsModule {
    initTime;
    initStartTime;
    initEndTime;
    _bridge;
    constructor(config) {
        this._bridge = new GW3Bridge(config);
    }
    all() {
        return this._bridge.all();
    }
    update(name, data) {
        this.checkName(name);
        this.checkData(data);
        return this._bridge.update(name, data);
    }
    set(name, data) {
        this.checkName(name);
        this.checkData(data);
        return this._bridge.set(name, data);
    }
    setPath(name, path, data) {
        this.checkName(name);
        this.checkPath(path);
        const isTopLevelPath = path === "";
        if (isTopLevelPath) {
            this.checkData(data);
            return this.set(name, data);
        }
        return this._bridge.setPath(name, path, data);
    }
    setPaths(name, paths) {
        this.checkName(name);
        if (!Array.isArray(paths)) {
            throw new Error("Please provide the paths as an array of PathValues!");
        }
        for (const { path, value } of paths) {
            this.checkPath(path);
            const isTopLevelPath = path === "";
            if (isTopLevelPath) {
                this.checkData(value);
            }
        }
        return this._bridge.setPaths(name, paths);
    }
    subscribe(name, callback) {
        this.checkName(name);
        if (typeof callback !== "function") {
            throw new Error("Please provide the callback as a function!");
        }
        return this._bridge
            .subscribe(name, (data, delta, removed, key, extraData) => callback(data, delta, removed, () => this._bridge.unsubscribe(key), extraData))
            .then((key) => () => {
            this._bridge.unsubscribe(key);
        });
    }
    get(name) {
        this.checkName(name);
        return this._bridge.get(name);
    }
    ready() {
        return Promise.resolve(this);
    }
    destroy(name) {
        this.checkName(name);
        return this._bridge.destroy(name);
    }
    get setPathSupported() {
        return this._bridge.setPathSupported;
    }
    checkName(name) {
        if (typeof name !== "string" || name === "") {
            throw new Error("Please provide the name as a non-empty string!");
        }
    }
    checkPath(path) {
        if (typeof path !== "string") {
            throw new Error("Please provide the path as a dot delimited string!");
        }
    }
    checkData(data) {
        if (typeof data !== "object") {
            throw new Error("Please provide the data as an object!");
        }
    }
}

function promisify (promise, successCallback, errorCallback) {
    if (typeof successCallback !== "function" && typeof errorCallback !== "function") {
        return promise;
    }
    if (typeof successCallback !== "function") {
        successCallback = () => { };
    }
    else if (typeof errorCallback !== "function") {
        errorCallback = () => { };
    }
    return promise.then(successCallback, errorCallback);
}

function rejectAfter(ms = 0, promise, error) {
    let timeout;
    const clearTimeoutIfThere = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
    };
    promise
        .then(() => {
        clearTimeoutIfThere();
    })
        .catch(() => {
        clearTimeoutIfThere();
    });
    return new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(error), ms);
    });
}

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map = function (f, r) {
    return r.ok === true ? ok(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError = function (f, r) {
    return r.ok === true ? r : err(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray = function (json) { return Array.isArray(json); };
var isJsonObject = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray(json);
};
var typeString = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot = function (expected, got) {
    return "expected " + expected + ", got " + typeString(got);
};
var printPath = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt = function (newAt, _a) {
    var at = _a.at, rest = __rest(_a, ["at"]);
    return (__assign({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok(json)
                : err({ message: expectedGot('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok(json)
                : err({ message: expectedGot('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok(json)
                : err({ message: expectedGot('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual(json, value)
                ? ok(value)
                : err({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else if (isJsonObject(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError(function (err$$1) { return prependAt("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok([]));
            }
            else if (isJsonArray(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray(json)) {
                if (json.length !== decoders.length) {
                    return err({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err(prependAt("[" + i + "]", nth.error));
                    }
                }
                return ok(result);
            }
            else {
                return err({ message: expectedGot("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2(Object.assign, acc, decoder.decode(json)); }, ok({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok(withDefault(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath(paths), message: 'path does not exist' }
                    : prependAt(printPath(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string = Decoder.string;
/** See `Decoder.number` */
var number = Decoder.number;
/** See `Decoder.boolean` */
var boolean = Decoder.boolean;
/** See `Decoder.anyJson` */
var anyJson = Decoder.anyJson;
/** See `Decoder.unknownJson` */
Decoder.unknownJson;
/** See `Decoder.constant` */
var constant = Decoder.constant;
/** See `Decoder.object` */
var object = Decoder.object;
/** See `Decoder.array` */
var array = Decoder.array;
/** See `Decoder.tuple` */
Decoder.tuple;
/** See `Decoder.dict` */
Decoder.dict;
/** See `Decoder.optional` */
var optional = Decoder.optional;
/** See `Decoder.oneOf` */
Decoder.oneOf;
/** See `Decoder.union` */
var union = Decoder.union;
/** See `Decoder.intersection` */
Decoder.intersection;
/** See `Decoder.withDefault` */
Decoder.withDefault;
/** See `Decoder.valueAt` */
Decoder.valueAt;
/** See `Decoder.succeed` */
Decoder.succeed;
/** See `Decoder.fail` */
var fail = Decoder.fail;
/** See `Decoder.lazy` */
Decoder.lazy;

const functionCheck = (input, propDescription) => {
    const providedType = typeof input;
    return providedType === "function" ?
        anyJson() :
        fail(`The provided argument as ${propDescription} should be of type function, provided: ${typeof providedType}`);
};
const nonEmptyStringDecoder = string().where((s) => s.length > 0, "Expected a non-empty string");
const nonNegativeNumberDecoder = number().where((num) => num >= 0, "Expected a non-negative number or 0");
const positiveNumberDecoder = number().where((num) => num > 0, "Expected a positive number");
const methodDefinitionDecoder = object({
    name: nonEmptyStringDecoder,
    objectTypes: optional(array(nonEmptyStringDecoder)),
    displayName: optional(nonEmptyStringDecoder),
    accepts: optional(nonEmptyStringDecoder),
    returns: optional(nonEmptyStringDecoder),
    description: optional(nonEmptyStringDecoder),
    version: optional(nonNegativeNumberDecoder),
    supportsStreaming: optional(boolean()),
    flags: optional(object()),
    getServers: optional(anyJson().andThen((result) => functionCheck(result, "method definition getServers")))
});
const methodFilterDecoder = union(nonEmptyStringDecoder, methodDefinitionDecoder);
const instanceDecoder = object({
    application: optional(nonEmptyStringDecoder),
    applicationName: optional(nonEmptyStringDecoder),
    pid: optional(nonNegativeNumberDecoder),
    machine: optional(nonEmptyStringDecoder),
    user: optional(nonEmptyStringDecoder),
    environment: optional(nonEmptyStringDecoder),
    region: optional(nonEmptyStringDecoder),
    service: optional(nonEmptyStringDecoder),
    instance: optional(nonEmptyStringDecoder),
    windowId: optional(nonEmptyStringDecoder),
    peerId: optional(nonEmptyStringDecoder),
    isLocal: optional(boolean()),
    api: optional(nonEmptyStringDecoder),
    getMethods: optional(anyJson().andThen((result) => functionCheck(result, "instance getMethods"))),
    getStreams: optional(anyJson().andThen((result) => functionCheck(result, "instance getStreams")))
});
const targetDecoder = union(constant("best"), constant("all"), constant("skipMine"), instanceDecoder, array(instanceDecoder));
const invokeOptionsDecoder = object({
    waitTimeoutMs: optional(positiveNumberDecoder),
    methodResponseTimeoutMs: optional(positiveNumberDecoder)
});

var InvokeStatus;
(function (InvokeStatus) {
    InvokeStatus[InvokeStatus["Success"] = 0] = "Success";
    InvokeStatus[InvokeStatus["Error"] = 1] = "Error";
})(InvokeStatus || (InvokeStatus = {}));
class Client {
    protocol;
    repo;
    instance;
    configuration;
    constructor(protocol, repo, instance, configuration) {
        this.protocol = protocol;
        this.repo = repo;
        this.instance = instance;
        this.configuration = configuration;
    }
    subscribe(method, options, successCallback, errorCallback, existingSub) {
        const callProtocolSubscribe = (targetServers, stream, successProxy, errorProxy) => {
            options.methodResponseTimeout = options.methodResponseTimeout ?? options.waitTimeoutMs;
            this.protocol.client.subscribe(stream, options, targetServers, successProxy, errorProxy, existingSub);
        };
        const promise = new Promise((resolve, reject) => {
            const successProxy = (sub) => {
                resolve(sub);
            };
            const errorProxy = (err) => {
                reject(err);
            };
            if (!method) {
                reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
                return;
            }
            let methodDef;
            if (typeof method === "string") {
                methodDef = { name: method };
            }
            else {
                methodDef = method;
            }
            if (!methodDef.name) {
                reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
                return;
            }
            if (options === undefined) {
                options = {};
            }
            let target = options.target;
            if (target === undefined) {
                target = "best";
            }
            if (typeof target === "string" && target !== "all" && target !== "best") {
                reject(new Error(`"${target}" is not a valid target. Valid targets are "all", "best", or an instance.`));
                return;
            }
            if (options.methodResponseTimeout === undefined) {
                options.methodResponseTimeout = options.method_response_timeout;
                if (options.methodResponseTimeout === undefined) {
                    options.methodResponseTimeout = this.configuration.methodResponseTimeout;
                }
            }
            if (options.waitTimeoutMs === undefined) {
                options.waitTimeoutMs = options.wait_for_method_timeout;
                if (options.waitTimeoutMs === undefined) {
                    options.waitTimeoutMs = this.configuration.waitTimeoutMs;
                }
            }
            const delayStep = 500;
            let delayTillNow = 0;
            let currentServers = this.getServerMethodsByFilterAndTarget(methodDef, target);
            if (currentServers.length > 0) {
                callProtocolSubscribe(currentServers, currentServers[0].methods[0], successProxy, errorProxy);
            }
            else {
                const retry = () => {
                    if (!target || !(options.waitTimeoutMs)) {
                        return;
                    }
                    delayTillNow += delayStep;
                    currentServers = this.getServerMethodsByFilterAndTarget(methodDef, target);
                    if (currentServers.length > 0) {
                        const streamInfo = currentServers[0].methods[0];
                        callProtocolSubscribe(currentServers, streamInfo, successProxy, errorProxy);
                    }
                    else if (delayTillNow >= options.waitTimeoutMs) {
                        const def = typeof method === "string" ? { name: method } : method;
                        callProtocolSubscribe(currentServers, def, successProxy, errorProxy);
                    }
                    else {
                        setTimeout(retry, delayStep);
                    }
                };
                setTimeout(retry, delayStep);
            }
        });
        return promisify(promise, successCallback, errorCallback);
    }
    servers(methodFilter) {
        const filterCopy = methodFilter === undefined
            ? undefined
            : { ...methodFilter };
        return this.getServers(filterCopy).map((serverMethodMap) => {
            return serverMethodMap.server.instance;
        });
    }
    methods(methodFilter) {
        if (typeof methodFilter === "string") {
            methodFilter = { name: methodFilter };
        }
        else {
            methodFilter = { ...methodFilter };
        }
        return this.getMethods(methodFilter);
    }
    methodsForInstance(instance) {
        return this.getMethodsForInstance(instance);
    }
    methodAdded(callback) {
        return this.repo.onMethodAdded(callback);
    }
    methodRemoved(callback) {
        return this.repo.onMethodRemoved(callback);
    }
    serverAdded(callback) {
        return this.repo.onServerAdded(callback);
    }
    serverRemoved(callback) {
        return this.repo.onServerRemoved((server, reason) => {
            callback(server, reason);
        });
    }
    serverMethodAdded(callback) {
        return this.repo.onServerMethodAdded((server, method) => {
            callback({ server, method });
        });
    }
    serverMethodRemoved(callback) {
        return this.repo.onServerMethodRemoved((server, method) => {
            callback({ server, method });
        });
    }
    async invoke(methodFilter, argumentObj, target, additionalOptions, success, error) {
        const getInvokePromise = async () => {
            const methodDefinition = typeof methodFilter === "string" ? { name: methodFilter } : { ...methodFilter };
            if (!argumentObj) {
                argumentObj = {};
            }
            if (!target) {
                target = "best";
            }
            if (!additionalOptions) {
                additionalOptions = {};
            }
            const methodFilterDecoderResult = methodFilterDecoder.run(methodDefinition);
            if (!methodFilterDecoderResult.ok) {
                const message = `The provided 'method' argument is invalid. Error: ${JSON.stringify(methodFilterDecoderResult.error)}.`;
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            if (typeof argumentObj !== "object") {
                const message = "The provided 'argumentObj' argument is invalid. Error: The argumentObj should be an instance of an object";
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            const targetDecoderResult = targetDecoder.run(target);
            if (!targetDecoderResult.ok) {
                const message = `The provided 'target' argument is invalid. Error: ${JSON.stringify(targetDecoderResult.error)}.`;
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            const invokeOptionsDecoderResult = invokeOptionsDecoder.run(additionalOptions);
            if (!invokeOptionsDecoderResult.ok) {
                const message = `The provided 'options' argument is invalid. Error: ${JSON.stringify(invokeOptionsDecoderResult.error)}.`;
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            if (success && typeof success !== "function") {
                const message = "The provided 'success' function is invalid. Error: The success should be a valid function";
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            if (error && typeof error !== "function") {
                const message = "The provided 'error' function is invalid. Error: The error should be a valid function";
                return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
            }
            if (additionalOptions.methodResponseTimeoutMs === undefined) {
                additionalOptions.methodResponseTimeoutMs = additionalOptions.method_response_timeout;
                if (additionalOptions.methodResponseTimeoutMs === undefined) {
                    additionalOptions.methodResponseTimeoutMs = this.configuration.methodResponseTimeout;
                }
            }
            if (additionalOptions.waitTimeoutMs === undefined) {
                additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout;
                if (additionalOptions.waitTimeoutMs === undefined) {
                    additionalOptions.waitTimeoutMs = this.configuration.waitTimeoutMs;
                }
            }
            let serversMethodMap = this.getServerMethodsByFilterAndTarget(methodDefinition, target);
            if (serversMethodMap.length === 0) {
                try {
                    serversMethodMap = await this.tryToAwaitForMethods(methodDefinition, target, additionalOptions);
                }
                catch (err) {
                    const message = `Can not find a method matching ${JSON.stringify(methodFilter)} with server filter ${JSON.stringify(target)}`;
                    return Promise.reject(this.generateInvalidInputInvocationResult(message, methodDefinition, argumentObj));
                }
            }
            const timeout = additionalOptions.methodResponseTimeoutMs;
            const additionalOptionsCopy = additionalOptions;
            const invokePromises = serversMethodMap.map((serversMethodPair) => {
                const invId = nanoid(10);
                const method = serversMethodPair.methods[0];
                const server = serversMethodPair.server;
                const invokePromise = this.protocol.client.invoke(invId, method, argumentObj, server, additionalOptionsCopy);
                return Promise.race([
                    invokePromise,
                    rejectAfter(timeout, invokePromise, {
                        invocationId: invId,
                        message: `Invocation timeout (${timeout} ms) reached for method name: ${method?.name}, target instance: ${JSON.stringify(server.instance)}, options: ${JSON.stringify(additionalOptionsCopy)}`,
                        status: InvokeStatus.Error,
                    })
                ]);
            });
            const invocationMessages = await Promise.all(invokePromises);
            const results = this.getInvocationResultObj(invocationMessages, methodDefinition, argumentObj);
            const allRejected = invocationMessages.every((result) => result.status === InvokeStatus.Error);
            if (allRejected) {
                return Promise.reject(results);
            }
            return results;
        };
        return promisify(getInvokePromise(), success, error);
    }
    generateInvalidInputInvocationResult(message, methodDefinition, argumentObj) {
        const method = {
            ...methodDefinition,
            getServers: () => [],
            supportsStreaming: false,
            objectTypes: methodDefinition.objectTypes ?? [],
            flags: methodDefinition.flags?.metadata ?? {}
        };
        const invokeResultMessage = {
            invocationId: nanoid(10),
            status: InvokeStatus.Error,
            message
        };
        return this.getInvocationResultObj([invokeResultMessage], method, argumentObj);
    }
    getInvocationResultObj(invocationResults, method, calledWith) {
        const all_return_values = invocationResults
            .filter((invokeMessage) => invokeMessage.status === InvokeStatus.Success)
            .reduce((allValues, currentValue) => {
            allValues = [
                ...allValues,
                {
                    executed_by: currentValue.instance,
                    returned: currentValue.result,
                    called_with: calledWith,
                    method,
                    message: currentValue.message,
                    status: currentValue.status,
                }
            ];
            return allValues;
        }, []);
        const all_errors = invocationResults
            .filter((invokeMessage) => invokeMessage.status === InvokeStatus.Error)
            .reduce((allErrors, currError) => {
            allErrors = [
                ...allErrors,
                {
                    executed_by: currError.instance,
                    called_with: calledWith,
                    name: method.name,
                    message: currError.message,
                }
            ];
            return allErrors;
        }, []);
        const invResult = invocationResults[0];
        const result = {
            method,
            called_with: calledWith,
            returned: invResult.result,
            executed_by: invResult.instance,
            all_return_values,
            all_errors,
            message: invResult.message,
            status: invResult.status
        };
        return result;
    }
    tryToAwaitForMethods(methodDefinition, target, additionalOptions) {
        return new Promise((resolve, reject) => {
            if (additionalOptions.waitTimeoutMs === 0) {
                reject();
                return;
            }
            const delayStep = 500;
            let delayTillNow = 0;
            const retry = () => {
                delayTillNow += delayStep;
                const serversMethodMap = this.getServerMethodsByFilterAndTarget(methodDefinition, target);
                if (serversMethodMap.length > 0) {
                    clearInterval(interval);
                    resolve(serversMethodMap);
                }
                else if (delayTillNow >= (additionalOptions.waitTimeoutMs || 10000)) {
                    clearInterval(interval);
                    reject();
                    return;
                }
            };
            const interval = setInterval(retry, delayStep);
        });
    }
    filterByTarget(target, serverMethodMap) {
        if (typeof target === "string") {
            if (target === "all") {
                return [...serverMethodMap];
            }
            else if (target === "best") {
                const localMachine = serverMethodMap
                    .find((s) => s.server.instance.isLocal);
                if (localMachine) {
                    return [localMachine];
                }
                if (serverMethodMap[0] !== undefined) {
                    return [serverMethodMap[0]];
                }
            }
            else if (target === "skipMine") {
                return serverMethodMap.filter(({ server }) => server.instance.peerId !== this.instance.peerId);
            }
        }
        else {
            let targetArray;
            if (!Array.isArray(target)) {
                targetArray = [target];
            }
            else {
                targetArray = target;
            }
            const allServersMatching = targetArray.reduce((matches, filter) => {
                const myMatches = serverMethodMap.filter((serverMethodPair) => {
                    return this.instanceMatch(filter, serverMethodPair.server.instance);
                });
                return matches.concat(myMatches);
            }, []);
            return allServersMatching;
        }
        return [];
    }
    instanceMatch(instanceFilter, instanceDefinition) {
        if (instanceFilter?.peerId && instanceFilter?.instance) {
            instanceFilter = { ...instanceFilter };
            delete instanceFilter.peerId;
        }
        return this.containsProps(instanceFilter, instanceDefinition);
    }
    methodMatch(methodFilter, methodDefinition) {
        return this.containsProps(methodFilter, methodDefinition);
    }
    containsProps(filter, repoMethod) {
        const filterProps = Object.keys(filter)
            .filter((prop) => {
            return filter[prop] !== undefined
                && filter[prop] !== null
                && typeof filter[prop] !== "function"
                && prop !== "object_types"
                && prop !== "display_name"
                && prop !== "id"
                && prop !== "gatewayId"
                && prop !== "identifier"
                && prop[0] !== "_";
        });
        return filterProps.every((prop) => {
            let isMatch;
            const filterValue = filter[prop];
            const repoMethodValue = repoMethod[prop];
            switch (prop) {
                case "objectTypes":
                    isMatch = (filterValue || []).every((filterValueEl) => {
                        return (repoMethodValue || []).includes(filterValueEl);
                    });
                    break;
                case "flags":
                    isMatch = isSubset(repoMethodValue || {}, filterValue || {});
                    break;
                default:
                    isMatch = String(filterValue).toLowerCase() === String(repoMethodValue).toLowerCase();
            }
            return isMatch;
        });
    }
    getMethods(methodFilter) {
        if (methodFilter === undefined) {
            return this.repo.getMethods();
        }
        const methods = this.repo.getMethods().filter((method) => {
            return this.methodMatch(methodFilter, method);
        });
        return methods;
    }
    getMethodsForInstance(instanceFilter) {
        const allServers = this.repo.getServers();
        const matchingServers = allServers.filter((server) => {
            return this.instanceMatch(instanceFilter, server.instance);
        });
        if (matchingServers.length === 0) {
            return [];
        }
        let resultMethodsObject = {};
        if (matchingServers.length === 1) {
            resultMethodsObject = matchingServers[0].methods;
        }
        else {
            matchingServers.forEach((server) => {
                Object.keys(server.methods).forEach((methodKey) => {
                    const method = server.methods[methodKey];
                    resultMethodsObject[method.identifier] = method;
                });
            });
        }
        return Object.keys(resultMethodsObject)
            .map((key) => {
            return resultMethodsObject[key];
        });
    }
    getServers(methodFilter) {
        const servers = this.repo.getServers();
        if (methodFilter === undefined) {
            return servers.map((server) => {
                return { server, methods: [] };
            });
        }
        return servers.reduce((prev, current) => {
            const methodsForServer = Object.values(current.methods);
            const matchingMethods = methodsForServer.filter((method) => {
                return this.methodMatch(methodFilter, method);
            });
            if (matchingMethods.length > 0) {
                prev.push({ server: current, methods: matchingMethods });
            }
            return prev;
        }, []);
    }
    getServerMethodsByFilterAndTarget(methodFilter, target) {
        const serversMethodMap = this.getServers(methodFilter);
        return this.filterByTarget(target, serversMethodMap);
    }
}

class ServerSubscription {
    protocol;
    repoMethod;
    subscription;
    constructor(protocol, repoMethod, subscription) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.subscription = subscription;
    }
    get stream() {
        if (!this.repoMethod.stream) {
            throw new Error("no stream");
        }
        return this.repoMethod.stream;
    }
    get arguments() { return this.subscription.arguments || {}; }
    get branchKey() { return this.subscription.branchKey; }
    get instance() {
        if (!this.subscription.instance) {
            throw new Error("no instance");
        }
        return this.subscription.instance;
    }
    close() {
        this.protocol.server.closeSingleSubscription(this.repoMethod, this.subscription);
    }
    push(data) {
        this.protocol.server.pushDataToSingle(this.repoMethod, this.subscription, data);
    }
}

class Request {
    protocol;
    repoMethod;
    requestContext;
    arguments;
    instance;
    constructor(protocol, repoMethod, requestContext) {
        this.protocol = protocol;
        this.repoMethod = repoMethod;
        this.requestContext = requestContext;
        this.arguments = requestContext.arguments;
        this.instance = requestContext.instance;
    }
    accept() {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, "");
    }
    acceptOnBranch(branch) {
        this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, branch);
    }
    reject(reason) {
        this.protocol.server.rejectRequest(this.requestContext, this.repoMethod, reason);
    }
}

let ServerStreaming$1 = class ServerStreaming {
    protocol;
    server;
    constructor(protocol, server) {
        this.protocol = protocol;
        this.server = server;
        protocol.server.onSubRequest((rc, rm) => this.handleSubRequest(rc, rm));
        protocol.server.onSubAdded((sub, rm) => this.handleSubAdded(sub, rm));
        protocol.server.onSubRemoved((sub, rm) => this.handleSubRemoved(sub, rm));
    }
    handleSubRequest(requestContext, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRequestHandler === "function")) {
            return;
        }
        const request = new Request(this.protocol, repoMethod, requestContext);
        repoMethod.streamCallbacks.subscriptionRequestHandler(request);
    }
    handleSubAdded(subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionAddedHandler === "function")) {
            return;
        }
        const sub = new ServerSubscription(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionAddedHandler(sub);
    }
    handleSubRemoved(subscription, repoMethod) {
        if (!(repoMethod &&
            repoMethod.streamCallbacks &&
            typeof repoMethod.streamCallbacks.subscriptionRemovedHandler === "function")) {
            return;
        }
        const sub = new ServerSubscription(this.protocol, repoMethod, subscription);
        repoMethod.streamCallbacks.subscriptionRemovedHandler(sub);
    }
};

class ServerBranch {
    key;
    protocol;
    repoMethod;
    constructor(key, protocol, repoMethod) {
        this.key = key;
        this.protocol = protocol;
        this.repoMethod = repoMethod;
    }
    subscriptions() {
        const subList = this.protocol.server.getSubscriptionList(this.repoMethod, this.key);
        return subList.map((sub) => {
            return new ServerSubscription(this.protocol, this.repoMethod, sub);
        });
    }
    close() {
        this.protocol.server.closeAllSubscriptions(this.repoMethod, this.key);
    }
    push(data) {
        this.protocol.server.pushData(this.repoMethod, data, [this.key]);
    }
}

class ServerStream {
    _protocol;
    _repoMethod;
    _server;
    name;
    constructor(_protocol, _repoMethod, _server) {
        this._protocol = _protocol;
        this._repoMethod = _repoMethod;
        this._server = _server;
        this.name = this._repoMethod.definition.name;
    }
    branches(key) {
        const bList = this._protocol.server.getBranchList(this._repoMethod);
        if (key) {
            if (bList.indexOf(key) > -1) {
                return new ServerBranch(key, this._protocol, this._repoMethod);
            }
            return undefined;
        }
        else {
            return bList.map((branchKey) => {
                return new ServerBranch(branchKey, this._protocol, this._repoMethod);
            });
        }
    }
    branch(key) {
        return this.branches(key);
    }
    subscriptions() {
        const subList = this._protocol.server.getSubscriptionList(this._repoMethod);
        return subList.map((sub) => {
            return new ServerSubscription(this._protocol, this._repoMethod, sub);
        });
    }
    get definition() {
        const def2 = this._repoMethod.definition;
        return {
            accepts: def2.accepts,
            description: def2.description,
            displayName: def2.displayName,
            name: def2.name,
            objectTypes: def2.objectTypes,
            returns: def2.returns,
            supportsStreaming: def2.supportsStreaming,
            flags: def2.flags?.metadata,
        };
    }
    close() {
        this._protocol.server.closeAllSubscriptions(this._repoMethod);
        this._server.unregister(this._repoMethod.definition, true);
    }
    push(data, branches) {
        if (typeof branches !== "string" && !Array.isArray(branches) && branches !== undefined) {
            throw new Error("invalid branches should be string or string array");
        }
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        this._protocol.server.pushData(this._repoMethod, data, branches);
    }
    updateRepoMethod(repoMethod) {
        this._repoMethod = repoMethod;
    }
}

class Server {
    protocol;
    serverRepository;
    streaming;
    invocations = 0;
    currentlyUnregistering = {};
    constructor(protocol, serverRepository) {
        this.protocol = protocol;
        this.serverRepository = serverRepository;
        this.streaming = new ServerStreaming$1(protocol, this);
        this.protocol.server.onInvoked(this.onMethodInvoked.bind(this));
    }
    createStream(streamDef, callbacks, successCallback, errorCallback, existingStream) {
        const promise = new Promise((resolve, reject) => {
            if (!streamDef) {
                reject("The stream name must be unique! Please, provide either a unique string for a stream name to “glue.interop.createStream()” or a “methodDefinition” object with a unique “name” property for the stream.");
                return;
            }
            let streamMethodDefinition;
            if (typeof streamDef === "string") {
                streamMethodDefinition = { name: "" + streamDef };
            }
            else {
                streamMethodDefinition = { ...streamDef };
            }
            if (!streamMethodDefinition.name) {
                return reject(`The “name” property is required for the “streamDefinition” object and must be unique. Stream definition: ${JSON.stringify(streamMethodDefinition)}`);
            }
            const nameAlreadyExists = this.serverRepository.getList()
                .some((serverMethod) => serverMethod.definition.name === streamMethodDefinition.name);
            if (nameAlreadyExists) {
                return reject(`A stream with the name "${streamMethodDefinition.name}" already exists! Please, provide a unique name for the stream.`);
            }
            streamMethodDefinition.supportsStreaming = true;
            if (!callbacks) {
                callbacks = {};
            }
            if (typeof callbacks.subscriptionRequestHandler !== "function") {
                callbacks.subscriptionRequestHandler = (request) => {
                    request.accept();
                };
            }
            const repoMethod = this.serverRepository.add({
                definition: streamMethodDefinition,
                streamCallbacks: callbacks,
                protocolState: {},
            });
            this.protocol.server.createStream(repoMethod)
                .then(() => {
                let streamUserObject;
                if (existingStream) {
                    streamUserObject = existingStream;
                    existingStream.updateRepoMethod(repoMethod);
                }
                else {
                    streamUserObject = new ServerStream(this.protocol, repoMethod, this);
                }
                repoMethod.stream = streamUserObject;
                resolve(streamUserObject);
            })
                .catch((err) => {
                if (repoMethod.repoId) {
                    this.serverRepository.remove(repoMethod.repoId);
                }
                reject(err);
            });
        });
        return promisify(promise, successCallback, errorCallback);
    }
    register(methodDefinition, callback) {
        if (!methodDefinition) {
            return Promise.reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
        }
        if (typeof callback !== "function") {
            return Promise.reject(`The second parameter must be a callback function. Method: ${typeof methodDefinition === "string" ? methodDefinition : methodDefinition.name}`);
        }
        const wrappedCallbackFunction = async (context, resultCallback) => {
            try {
                const result = callback(context.args, context.instance);
                if (result && typeof result.then === "function") {
                    const resultValue = await result;
                    resultCallback(undefined, resultValue);
                }
                else {
                    resultCallback(undefined, result);
                }
            }
            catch (e) {
                resultCallback(e ?? "", e ?? "");
            }
        };
        wrappedCallbackFunction.userCallback = callback;
        return this.registerCore(methodDefinition, wrappedCallbackFunction);
    }
    registerAsync(methodDefinition, callback) {
        if (!methodDefinition) {
            return Promise.reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
        }
        if (typeof callback !== "function") {
            return Promise.reject(`The second parameter must be a callback function. Method: ${typeof methodDefinition === "string" ? methodDefinition : methodDefinition.name}`);
        }
        const wrappedCallback = async (context, resultCallback) => {
            try {
                let resultCalled = false;
                const success = (result) => {
                    if (!resultCalled) {
                        resultCallback(undefined, result);
                    }
                    resultCalled = true;
                };
                const error = (e) => {
                    if (!resultCalled) {
                        if (!e) {
                            e = "";
                        }
                        resultCallback(e, e);
                    }
                    resultCalled = true;
                };
                const methodResult = callback(context.args, context.instance, success, error);
                if (methodResult && typeof methodResult.then === "function") {
                    methodResult
                        .then(success)
                        .catch(error);
                }
            }
            catch (e) {
                resultCallback(e, undefined);
            }
        };
        wrappedCallback.userCallbackAsync = callback;
        return this.registerCore(methodDefinition, wrappedCallback);
    }
    async unregister(methodFilter, forStream = false) {
        if (methodFilter === undefined) {
            return Promise.reject("Please, provide either a unique string for a name or an object containing a “name” property.");
        }
        if (typeof methodFilter === "function") {
            await this.unregisterWithPredicate(methodFilter, forStream);
            return;
        }
        let methodDefinition;
        if (typeof methodFilter === "string") {
            methodDefinition = { name: methodFilter };
        }
        else {
            methodDefinition = methodFilter;
        }
        if (methodDefinition.name === undefined) {
            return Promise.reject("Method name is required. Cannot find a method if the method name is undefined!");
        }
        const methodToBeRemoved = this.serverRepository.getList().find((serverMethod) => {
            return serverMethod.definition.name === methodDefinition.name
                && (serverMethod.definition.supportsStreaming || false) === forStream;
        });
        if (!methodToBeRemoved) {
            return Promise.reject(`Method with a name "${methodDefinition.name}" does not exist or is not registered by your application!`);
        }
        await this.removeMethodsOrStreams([methodToBeRemoved]);
    }
    async unregisterWithPredicate(filterPredicate, forStream) {
        const methodsOrStreamsToRemove = this.serverRepository.getList()
            .filter((sm) => filterPredicate(sm.definition))
            .filter((serverMethod) => (serverMethod.definition.supportsStreaming || false) === forStream);
        if (!methodsOrStreamsToRemove || methodsOrStreamsToRemove.length === 0) {
            return Promise.reject(`Could not find a ${forStream ? "stream" : "method"} matching the specified condition!`);
        }
        await this.removeMethodsOrStreams(methodsOrStreamsToRemove);
    }
    removeMethodsOrStreams(methodsToRemove) {
        const methodUnregPromises = [];
        methodsToRemove.forEach((method) => {
            const promise = this.protocol.server.unregister(method)
                .then(() => {
                if (method.repoId) {
                    this.serverRepository.remove(method.repoId);
                }
            });
            methodUnregPromises.push(promise);
            this.addAsCurrentlyUnregistering(method.definition.name, promise);
        });
        return Promise.all(methodUnregPromises);
    }
    async addAsCurrentlyUnregistering(methodName, promise) {
        const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
        this.currentlyUnregistering[methodName] = Promise.race([promise, timeout]).then(() => {
            delete this.currentlyUnregistering[methodName];
        });
    }
    async registerCore(method, theFunction) {
        let methodDefinition;
        if (typeof method === "string") {
            methodDefinition = { name: "" + method };
        }
        else {
            methodDefinition = { ...method };
        }
        if (!methodDefinition.name) {
            return Promise.reject(`Please, provide a (unique) string value for the “name” property in the “methodDefinition” object: ${JSON.stringify(method)}`);
        }
        const unregisterInProgress = this.currentlyUnregistering[methodDefinition.name];
        if (typeof unregisterInProgress !== "undefined") {
            await unregisterInProgress;
        }
        const nameAlreadyExists = this.serverRepository.getList()
            .some((serverMethod) => serverMethod.definition.name === methodDefinition.name);
        if (nameAlreadyExists) {
            return Promise.reject(`A method with the name "${methodDefinition.name}" already exists! Please, provide a unique name for the method.`);
        }
        if (methodDefinition.supportsStreaming) {
            return Promise.reject(`When you create methods with “glue.interop.register()” or “glue.interop.registerAsync()” the property “supportsStreaming” cannot be “true”. If you want “${methodDefinition.name}” to be a stream, please use the “glue.interop.createStream()” method.`);
        }
        const repoMethod = this.serverRepository.add({
            definition: methodDefinition,
            theFunction,
            protocolState: {},
        });
        return this.protocol.server.register(repoMethod)
            .catch((err) => {
            if (repoMethod?.repoId) {
                this.serverRepository.remove(repoMethod.repoId);
            }
            throw err;
        });
    }
    onMethodInvoked(methodToExecute, invocationId, invocationArgs) {
        if (!methodToExecute || !methodToExecute.theFunction) {
            return;
        }
        methodToExecute.theFunction(invocationArgs, (err, result) => {
            if (err !== undefined && err !== null) {
                if (err.message && typeof err.message === "string") {
                    err = err.message;
                }
                else if (typeof err !== "string") {
                    try {
                        err = JSON.stringify(err);
                    }
                    catch (unStrException) {
                        err = `un-stringifyable error in onMethodInvoked! Top level prop names: ${Object.keys(err)}`;
                    }
                }
            }
            if (!result) {
                result = {};
            }
            else if (typeof result !== "object" || Array.isArray(result)) {
                result = { _value: result };
            }
            this.protocol.server.methodInvocationResult(methodToExecute, invocationId, err, result);
        });
    }
}

class InstanceWrapper {
    wrapped = {};
    constructor(API, instance, connection) {
        this.wrapped.getMethods = function () {
            return API.methodsForInstance(this);
        };
        this.wrapped.getStreams = function () {
            return API.methodsForInstance(this).filter((m) => m.supportsStreaming);
        };
        if (instance) {
            this.refreshWrappedObject(instance);
        }
        if (connection) {
            connection.loggedIn(() => {
                this.refresh(connection);
            });
            this.refresh(connection);
        }
    }
    unwrap() {
        return this.wrapped;
    }
    refresh(connection) {
        if (!connection) {
            return;
        }
        const resolvedIdentity = connection?.resolvedIdentity;
        const instance = Object.assign({}, resolvedIdentity ?? {}, { peerId: connection?.peerId });
        this.refreshWrappedObject(instance);
    }
    refreshWrappedObject(resolvedIdentity) {
        Object.keys(resolvedIdentity).forEach((key) => {
            this.wrapped[key] = resolvedIdentity[key];
        });
        this.wrapped.user = resolvedIdentity.user;
        this.wrapped.instance = resolvedIdentity.instance;
        this.wrapped.application = resolvedIdentity.application ?? nanoid(10);
        this.wrapped.applicationName = resolvedIdentity.applicationName;
        this.wrapped.pid = resolvedIdentity.pid ?? resolvedIdentity.process ?? Math.floor(Math.random() * 10000000000);
        this.wrapped.machine = resolvedIdentity.machine;
        this.wrapped.environment = resolvedIdentity.environment;
        this.wrapped.region = resolvedIdentity.region;
        this.wrapped.windowId = resolvedIdentity.windowId;
        this.wrapped.isLocal = resolvedIdentity.isLocal ?? true;
        this.wrapped.api = resolvedIdentity.api;
        this.wrapped.service = resolvedIdentity.service;
        this.wrapped.peerId = resolvedIdentity.peerId;
    }
}

const hideMethodSystemFlags = (method) => {
    return {
        ...method,
        flags: method.flags.metadata || {}
    };
};
class ClientRepository {
    logger;
    API;
    servers = {};
    myServer;
    methodsCount = {};
    callbacks = CallbackRegistryFactory();
    constructor(logger, API) {
        this.logger = logger;
        this.API = API;
        const peerId = this.API.instance.peerId;
        this.myServer = {
            id: peerId,
            methods: {},
            instance: this.API.instance,
            wrapper: this.API.unwrappedInstance,
        };
        this.servers[peerId] = this.myServer;
    }
    addServer(info, serverId) {
        this.logger.debug(`adding server ${serverId}`);
        const current = this.servers[serverId];
        if (current) {
            return current.id;
        }
        const wrapper = new InstanceWrapper(this.API, info);
        const serverEntry = {
            id: serverId,
            methods: {},
            instance: wrapper.unwrap(),
            wrapper,
        };
        this.servers[serverId] = serverEntry;
        this.callbacks.execute("onServerAdded", serverEntry.instance);
        return serverId;
    }
    removeServerById(id, reason) {
        const server = this.servers[id];
        if (!server) {
            this.logger.warn(`not aware of server ${id}, my state ${JSON.stringify(Object.keys(this.servers))}`);
            return;
        }
        else {
            this.logger.debug(`removing server ${id}`);
        }
        Object.keys(server.methods).forEach((methodId) => {
            this.removeServerMethod(id, methodId);
        });
        delete this.servers[id];
        this.callbacks.execute("onServerRemoved", server.instance, reason);
    }
    addServerMethod(serverId, method) {
        const server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        if (server.methods[method.id]) {
            return;
        }
        const identifier = this.createMethodIdentifier(method);
        const that = this;
        const methodDefinition = {
            identifier,
            gatewayId: method.id,
            name: method.name,
            displayName: method.display_name,
            description: method.description,
            version: method.version,
            objectTypes: method.object_types || [],
            accepts: method.input_signature,
            returns: method.result_signature,
            supportsStreaming: typeof method.flags !== "undefined" ? method.flags.streaming : false,
            flags: method.flags ?? {},
            getServers: () => {
                return that.getServersByMethod(identifier);
            }
        };
        methodDefinition.object_types = methodDefinition.objectTypes;
        methodDefinition.display_name = methodDefinition.displayName;
        methodDefinition.version = methodDefinition.version;
        server.methods[method.id] = methodDefinition;
        const clientMethodDefinition = hideMethodSystemFlags(methodDefinition);
        if (!this.methodsCount[identifier]) {
            this.methodsCount[identifier] = 0;
            this.callbacks.execute("onMethodAdded", clientMethodDefinition);
        }
        this.methodsCount[identifier] = this.methodsCount[identifier] + 1;
        this.callbacks.execute("onServerMethodAdded", server.instance, clientMethodDefinition);
        return methodDefinition;
    }
    removeServerMethod(serverId, methodId) {
        const server = this.servers[serverId];
        if (!server) {
            throw new Error("server does not exists");
        }
        const method = server.methods[methodId];
        delete server.methods[methodId];
        const clientMethodDefinition = hideMethodSystemFlags(method);
        this.methodsCount[method.identifier] = this.methodsCount[method.identifier] - 1;
        if (this.methodsCount[method.identifier] === 0) {
            this.callbacks.execute("onMethodRemoved", clientMethodDefinition);
        }
        this.callbacks.execute("onServerMethodRemoved", server.instance, clientMethodDefinition);
    }
    getMethods() {
        return this.extractMethodsFromServers(Object.values(this.servers)).map(hideMethodSystemFlags);
    }
    getServers() {
        return Object.values(this.servers).map(this.hideServerMethodSystemFlags);
    }
    onServerAdded(callback) {
        const unsubscribeFunc = this.callbacks.add("onServerAdded", callback);
        const serversWithMethodsToReplay = this.getServers().map((s) => s.instance);
        return this.returnUnsubWithDelayedReplay(unsubscribeFunc, serversWithMethodsToReplay, callback);
    }
    onMethodAdded(callback) {
        const unsubscribeFunc = this.callbacks.add("onMethodAdded", callback);
        const methodsToReplay = this.getMethods();
        return this.returnUnsubWithDelayedReplay(unsubscribeFunc, methodsToReplay, callback);
    }
    onServerMethodAdded(callback) {
        const unsubscribeFunc = this.callbacks.add("onServerMethodAdded", callback);
        let unsubCalled = false;
        const servers = this.getServers();
        setTimeout(() => {
            servers.forEach((server) => {
                const methods = server.methods;
                Object.keys(methods).forEach((methodId) => {
                    if (!unsubCalled) {
                        callback(server.instance, methods[methodId]);
                    }
                });
            });
        }, 0);
        return () => {
            unsubCalled = true;
            unsubscribeFunc();
        };
    }
    onMethodRemoved(callback) {
        const unsubscribeFunc = this.callbacks.add("onMethodRemoved", callback);
        return unsubscribeFunc;
    }
    onServerRemoved(callback) {
        const unsubscribeFunc = this.callbacks.add("onServerRemoved", callback);
        return unsubscribeFunc;
    }
    onServerMethodRemoved(callback) {
        const unsubscribeFunc = this.callbacks.add("onServerMethodRemoved", callback);
        return unsubscribeFunc;
    }
    getServerById(id) {
        const server = this.servers[id];
        if (!server) {
            return undefined;
        }
        return this.hideServerMethodSystemFlags(this.servers[id]);
    }
    reset() {
        Object.keys(this.servers).forEach((key) => {
            this.removeServerById(key, "reset");
        });
        this.servers = {
            [this.myServer.id]: this.myServer
        };
        this.methodsCount = {};
    }
    createMethodIdentifier(methodInfo) {
        const accepts = methodInfo.input_signature ?? "";
        const returns = methodInfo.result_signature ?? "";
        return (methodInfo.name + accepts + returns).toLowerCase();
    }
    getServersByMethod(identifier) {
        const allServers = [];
        Object.values(this.servers).forEach((server) => {
            Object.values(server.methods).forEach((method) => {
                if (method.identifier === identifier) {
                    allServers.push(server.instance);
                }
            });
        });
        return allServers;
    }
    returnUnsubWithDelayedReplay(unsubscribeFunc, collectionToReplay, callback) {
        let unsubCalled = false;
        setTimeout(() => {
            collectionToReplay.forEach((item) => {
                if (!unsubCalled) {
                    callback(item);
                }
            });
        }, 0);
        return () => {
            unsubCalled = true;
            unsubscribeFunc();
        };
    }
    hideServerMethodSystemFlags(server) {
        const clientMethods = {};
        Object.entries(server.methods).forEach(([name, method]) => {
            clientMethods[name] = hideMethodSystemFlags(method);
        });
        return {
            ...server,
            methods: clientMethods
        };
    }
    extractMethodsFromServers(servers) {
        const methods = Object.values(servers).reduce((clientMethods, server) => {
            return [...clientMethods, ...Object.values(server.methods)];
        }, []);
        return methods;
    }
}

class ServerRepository {
    nextId = 0;
    methods = [];
    add(method) {
        method.repoId = String(this.nextId);
        this.nextId += 1;
        this.methods.push(method);
        return method;
    }
    remove(repoId) {
        if (typeof repoId !== "string") {
            return new TypeError("Expecting a string");
        }
        this.methods = this.methods.filter((m) => {
            return m.repoId !== repoId;
        });
    }
    getById(id) {
        if (typeof id !== "string") {
            return undefined;
        }
        return this.methods.find((m) => {
            return m.repoId === id;
        });
    }
    getList() {
        return this.methods.map((m) => m);
    }
    length() {
        return this.methods.length;
    }
    reset() {
        this.methods = [];
    }
}

const SUBSCRIPTION_REQUEST = "onSubscriptionRequest";
const SUBSCRIPTION_ADDED = "onSubscriptionAdded";
const SUBSCRIPTION_REMOVED = "onSubscriptionRemoved";
class ServerStreaming {
    session;
    repository;
    serverRepository;
    ERR_URI_SUBSCRIPTION_FAILED = "com.tick42.agm.errors.subscription.failure";
    callbacks = CallbackRegistryFactory();
    nextStreamId = 0;
    constructor(session, repository, serverRepository) {
        this.session = session;
        this.repository = repository;
        this.serverRepository = serverRepository;
        session.on("add-interest", (msg) => {
            this.handleAddInterest(msg);
        });
        session.on("remove-interest", (msg) => {
            this.handleRemoveInterest(msg);
        });
    }
    acceptRequestOnBranch(requestContext, streamingMethod, branch) {
        if (typeof branch !== "string") {
            branch = "";
        }
        if (typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            throw new TypeError("The streaming method is missing its subscriptions.");
        }
        if (!Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            throw new TypeError("The streaming method is missing its branches.");
        }
        const streamId = this.getStreamId(streamingMethod, branch);
        const key = requestContext.msg.subscription_id;
        const subscription = {
            id: key,
            arguments: requestContext.arguments,
            instance: requestContext.instance,
            branchKey: branch,
            streamId,
            subscribeMsg: requestContext.msg,
        };
        streamingMethod.protocolState.subscriptionsMap[key] = subscription;
        this.session.sendFireAndForget({
            type: "accepted",
            subscription_id: key,
            stream_id: streamId,
        });
        this.callbacks.execute(SUBSCRIPTION_ADDED, subscription, streamingMethod);
    }
    rejectRequest(requestContext, streamingMethod, reason) {
        if (typeof reason !== "string") {
            reason = "";
        }
        this.sendSubscriptionFailed("Subscription rejected by user. " + reason, requestContext.msg.subscription_id);
    }
    pushData(streamingMethod, data, branches) {
        if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
            return;
        }
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        if (typeof branches === "string") {
            branches = [branches];
        }
        else if (!Array.isArray(branches) || branches.length <= 0) {
            branches = [];
        }
        const streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
            .filter((br) => {
            if (!branches || branches.length === 0) {
                return true;
            }
            return branches.indexOf(br.key) >= 0;
        }).map((br) => {
            return br.streamId;
        });
        streamIdList.forEach((streamId) => {
            const publishMessage = {
                type: "publish",
                stream_id: streamId,
                data,
            };
            this.session.sendFireAndForget(publishMessage);
        });
    }
    pushDataToSingle(method, subscription, data) {
        if (typeof data !== "object") {
            throw new Error("Invalid arguments. Data must be an object.");
        }
        const postMessage = {
            type: "post",
            subscription_id: subscription.id,
            data,
        };
        this.session.sendFireAndForget(postMessage);
    }
    closeSingleSubscription(streamingMethod, subscription) {
        if (streamingMethod.protocolState.subscriptionsMap) {
            delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
        }
        const dropSubscriptionMessage = {
            type: "drop-subscription",
            subscription_id: subscription.id,
            reason: "Server dropping a single subscription",
        };
        this.session.sendFireAndForget(dropSubscriptionMessage);
        subscription.instance;
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    }
    closeMultipleSubscriptions(streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object" || typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
            return;
        }
        if (!streamingMethod.protocolState.subscriptionsMap) {
            return;
        }
        const subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
        let subscriptionsToClose = Object.keys(subscriptionsMap)
            .map((key) => {
            return subscriptionsMap[key];
        });
        if (typeof branchKey === "string") {
            subscriptionsToClose = subscriptionsToClose.filter((sub) => {
                return sub.branchKey === branchKey;
            });
        }
        subscriptionsToClose.forEach((subscription) => {
            delete subscriptionsMap[subscription.id];
            const drop = {
                type: "drop-subscription",
                subscription_id: subscription.id,
                reason: "Server dropping all subscriptions on stream_id: " + subscription.streamId,
            };
            this.session.sendFireAndForget(drop);
        });
    }
    getSubscriptionList(streamingMethod, branchKey) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        let subscriptions = [];
        if (!streamingMethod.protocolState.subscriptionsMap) {
            return [];
        }
        const subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
        const allSubscriptions = Object.keys(subscriptionsMap)
            .map((key) => {
            return subscriptionsMap[key];
        });
        if (typeof branchKey !== "string") {
            subscriptions = allSubscriptions;
        }
        else {
            subscriptions = allSubscriptions.filter((sub) => {
                return sub.branchKey === branchKey;
            });
        }
        return subscriptions;
    }
    getBranchList(streamingMethod) {
        if (typeof streamingMethod !== "object") {
            return [];
        }
        if (!streamingMethod.protocolState.subscriptionsMap) {
            return [];
        }
        const subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
        const allSubscriptions = Object.keys(subscriptionsMap)
            .map((key) => {
            return subscriptionsMap[key];
        });
        const result = [];
        allSubscriptions.forEach((sub) => {
            let branch = "";
            if (typeof sub === "object" && typeof sub.branchKey === "string") {
                branch = sub.branchKey;
            }
            if (result.indexOf(branch) === -1) {
                result.push(branch);
            }
        });
        return result;
    }
    onSubAdded(callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_ADDED, callback);
    }
    onSubRequest(callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REQUEST, callback);
    }
    onSubRemoved(callback) {
        this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REMOVED, callback);
    }
    handleRemoveInterest(msg) {
        const streamingMethod = this.serverRepository.getById(msg.method_id);
        if (typeof msg.subscription_id !== "string" ||
            typeof streamingMethod !== "object") {
            return;
        }
        if (!streamingMethod.protocolState.subscriptionsMap) {
            return;
        }
        if (typeof streamingMethod.protocolState.subscriptionsMap[msg.subscription_id] !== "object") {
            return;
        }
        const subscription = streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        delete streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
        this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
    }
    onSubscriptionLifetimeEvent(eventName, handlerFunc) {
        this.callbacks.add(eventName, handlerFunc);
    }
    getNextStreamId() {
        return this.nextStreamId++ + "";
    }
    handleAddInterest(msg) {
        const caller = this.repository.getServerById(msg.caller_id);
        const instance = caller?.instance ?? {};
        const requestContext = {
            msg,
            arguments: msg.arguments_kv || {},
            instance,
        };
        const streamingMethod = this.serverRepository.getById(msg.method_id);
        if (streamingMethod === undefined) {
            const errorMsg = "No method with id " + msg.method_id + " on this server.";
            this.sendSubscriptionFailed(errorMsg, msg.subscription_id);
            return;
        }
        if (streamingMethod.protocolState.subscriptionsMap &&
            streamingMethod.protocolState.subscriptionsMap[msg.subscription_id]) {
            this.sendSubscriptionFailed("A subscription with id " + msg.subscription_id + " already exists.", msg.subscription_id);
            return;
        }
        this.callbacks.execute(SUBSCRIPTION_REQUEST, requestContext, streamingMethod);
    }
    sendSubscriptionFailed(reason, subscriptionId) {
        const errorMessage = {
            type: "error",
            reason_uri: this.ERR_URI_SUBSCRIPTION_FAILED,
            reason,
            request_id: subscriptionId,
        };
        this.session.sendFireAndForget(errorMessage);
    }
    getStreamId(streamingMethod, branchKey) {
        if (typeof branchKey !== "string") {
            branchKey = "";
        }
        if (!streamingMethod.protocolState.branchKeyToStreamIdMap) {
            throw new Error(`streaming ${streamingMethod.definition.name} method without protocol state`);
        }
        const needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter((branch) => {
            return branch.key === branchKey;
        })[0];
        let streamId = (needleBranch ? needleBranch.streamId : undefined);
        if (typeof streamId !== "string" || streamId === "") {
            streamId = this.getNextStreamId();
            streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId });
        }
        return streamId;
    }
}

class ServerProtocol {
    session;
    clientRepository;
    serverRepository;
    logger;
    callbacks = CallbackRegistryFactory();
    streaming;
    constructor(session, clientRepository, serverRepository, logger) {
        this.session = session;
        this.clientRepository = clientRepository;
        this.serverRepository = serverRepository;
        this.logger = logger;
        this.streaming = new ServerStreaming(session, clientRepository, serverRepository);
        this.session.on("invoke", (msg) => this.handleInvokeMessage(msg));
    }
    createStream(repoMethod) {
        repoMethod.protocolState.subscriptionsMap = {};
        repoMethod.protocolState.branchKeyToStreamIdMap = [];
        return this.register(repoMethod, true);
    }
    register(repoMethod, isStreaming) {
        const methodDef = repoMethod.definition;
        const flags = Object.assign({}, { metadata: methodDef.flags ?? {} }, { streaming: isStreaming || false });
        const registerMsg = {
            type: "register",
            methods: [{
                    id: repoMethod.repoId,
                    name: methodDef.name,
                    display_name: methodDef.displayName,
                    description: methodDef.description,
                    version: methodDef.version,
                    flags,
                    object_types: methodDef.objectTypes || methodDef.object_types,
                    input_signature: methodDef.accepts,
                    result_signature: methodDef.returns,
                    restrictions: undefined,
                }],
        };
        return this.session.send(registerMsg, { methodId: repoMethod.repoId })
            .then(() => {
            this.logger.debug("registered method " + repoMethod.definition.name + " with id " + repoMethod.repoId);
        })
            .catch((msg) => {
            this.logger.warn(`failed to register method ${repoMethod.definition.name} with id ${repoMethod.repoId} - ${JSON.stringify(msg)}`);
            throw msg;
        });
    }
    onInvoked(callback) {
        this.callbacks.add("onInvoked", callback);
    }
    methodInvocationResult(method, invocationId, err, result) {
        let msg;
        if (err || err === "") {
            msg = {
                type: "error",
                request_id: invocationId,
                reason_uri: "agm.errors.client_error",
                reason: err,
                context: result,
                peer_id: undefined,
            };
        }
        else {
            msg = {
                type: "yield",
                invocation_id: invocationId,
                peer_id: this.session.peerId,
                result,
                request_id: undefined,
            };
        }
        this.session.sendFireAndForget(msg);
    }
    async unregister(method) {
        const msg = {
            type: "unregister",
            methods: [method.repoId],
        };
        await this.session.send(msg);
    }
    getBranchList(method) {
        return this.streaming.getBranchList(method);
    }
    getSubscriptionList(method, branchKey) {
        return this.streaming.getSubscriptionList(method, branchKey);
    }
    closeAllSubscriptions(method, branchKey) {
        this.streaming.closeMultipleSubscriptions(method, branchKey);
    }
    pushData(method, data, branches) {
        this.streaming.pushData(method, data, branches);
    }
    pushDataToSingle(method, subscription, data) {
        this.streaming.pushDataToSingle(method, subscription, data);
    }
    closeSingleSubscription(method, subscription) {
        this.streaming.closeSingleSubscription(method, subscription);
    }
    acceptRequestOnBranch(requestContext, method, branch) {
        this.streaming.acceptRequestOnBranch(requestContext, method, branch);
    }
    rejectRequest(requestContext, method, reason) {
        this.streaming.rejectRequest(requestContext, method, reason);
    }
    onSubRequest(callback) {
        this.streaming.onSubRequest(callback);
    }
    onSubAdded(callback) {
        this.streaming.onSubAdded(callback);
    }
    onSubRemoved(callback) {
        this.streaming.onSubRemoved(callback);
    }
    handleInvokeMessage(msg) {
        const invocationId = msg.invocation_id;
        const callerId = msg.caller_id;
        const methodId = msg.method_id;
        const args = msg.arguments_kv;
        const methodList = this.serverRepository.getList();
        const method = methodList.filter((m) => {
            return m.repoId === methodId;
        })[0];
        if (method === undefined) {
            return;
        }
        const client = this.clientRepository.getServerById(callerId)?.instance;
        const invocationArgs = { args, instance: client };
        this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
    }
}

class UserSubscription {
    repository;
    subscriptionData;
    get requestArguments() {
        return this.subscriptionData.params.arguments || {};
    }
    get servers() {
        return this.subscriptionData.trackedServers.reduce((servers, pair) => {
            if (pair.subscriptionId) {
                const server = this.repository.getServerById(pair.serverId)?.instance;
                if (server) {
                    servers.push(server);
                }
            }
            return servers;
        }, []);
    }
    get serverInstance() {
        return this.servers[0];
    }
    get stream() {
        return this.subscriptionData.method;
    }
    constructor(repository, subscriptionData) {
        this.repository = repository;
        this.subscriptionData = subscriptionData;
    }
    onData(dataCallback) {
        if (typeof dataCallback !== "function") {
            throw new TypeError("The data callback must be a function.");
        }
        this.subscriptionData.handlers.onData.push(dataCallback);
        if (this.subscriptionData.handlers.onData.length === 1 && this.subscriptionData.queued.data.length > 0) {
            this.subscriptionData.queued.data.forEach((dataItem) => {
                dataCallback(dataItem);
            });
        }
    }
    onClosed(closedCallback) {
        if (typeof closedCallback !== "function") {
            throw new TypeError("The callback must be a function.");
        }
        this.subscriptionData.handlers.onClosed.push(closedCallback);
    }
    onFailed(callback) {
    }
    onConnected(callback) {
        if (typeof callback !== "function") {
            throw new TypeError("The callback must be a function.");
        }
        this.subscriptionData.handlers.onConnected.push(callback);
    }
    close() {
        this.subscriptionData.close();
    }
    setNewSubscription(newSub) {
        this.subscriptionData = newSub;
    }
}

class TimedCache {
    config;
    cache = [];
    timeoutIds = [];
    constructor(config) {
        this.config = config;
    }
    add(element) {
        const id = nanoid(10);
        this.cache.push({ id, element });
        const timeoutId = setTimeout(() => {
            const elementIdx = this.cache.findIndex((entry) => entry.id === id);
            if (elementIdx < 0) {
                return;
            }
            this.cache.splice(elementIdx, 1);
        }, this.config.ELEMENT_TTL_MS);
        this.timeoutIds.push(timeoutId);
    }
    flush() {
        const elements = this.cache.map((entry) => entry.element);
        this.timeoutIds.forEach((id) => clearInterval(id));
        this.cache = [];
        this.timeoutIds = [];
        return elements;
    }
}

const STATUS_AWAITING_ACCEPT = "awaitingAccept";
const STATUS_SUBSCRIBED = "subscribed";
const ERR_MSG_SUB_FAILED = "Subscription failed.";
const ERR_MSG_SUB_REJECTED = "Subscription rejected.";
const ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
const ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
class ClientStreaming {
    session;
    repository;
    logger;
    subscriptionsList = {};
    timedCache = new TimedCache({ ELEMENT_TTL_MS: 10000 });
    subscriptionIdToLocalKeyMap = {};
    nextSubLocalKey = 0;
    constructor(session, repository, logger) {
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        session.on("subscribed", this.handleSubscribed);
        session.on("event", this.handleEventData);
        session.on("subscription-cancelled", this.handleSubscriptionCancelled);
    }
    subscribe(streamingMethod, params, targetServers, success, error, existingSub) {
        if (targetServers.length === 0) {
            error({
                method: streamingMethod,
                called_with: params.arguments,
                message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
            });
            return;
        }
        const subLocalKey = this.getNextSubscriptionLocalKey();
        const pendingSub = this.registerSubscription(subLocalKey, streamingMethod, params, success, error, params.methodResponseTimeout || 10000, existingSub);
        if (typeof pendingSub !== "object") {
            error({
                method: streamingMethod,
                called_with: params.arguments,
                message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
            });
            return;
        }
        targetServers.forEach((target) => {
            const serverId = target.server.id;
            const method = target.methods.find((m) => m.name === streamingMethod.name);
            if (!method) {
                this.logger.error(`can not find method ${streamingMethod.name} for target ${target.server.id}`);
                return;
            }
            pendingSub.trackedServers.push({
                serverId,
                subscriptionId: undefined,
            });
            const msg = {
                type: "subscribe",
                server_id: serverId,
                method_id: method.gatewayId,
                arguments_kv: params.arguments,
            };
            this.session.send(msg, { serverId, subLocalKey })
                .then((m) => this.handleSubscribed(m))
                .catch((err) => this.handleErrorSubscribing(err));
        });
    }
    drainSubscriptions() {
        const existing = Object.values(this.subscriptionsList);
        this.subscriptionsList = {};
        this.subscriptionIdToLocalKeyMap = {};
        return existing;
    }
    drainSubscriptionsCache() {
        return this.timedCache.flush();
    }
    getNextSubscriptionLocalKey() {
        const current = this.nextSubLocalKey;
        this.nextSubLocalKey += 1;
        return current;
    }
    registerSubscription(subLocalKey, method, params, success, error, timeout, existingSub) {
        const subsInfo = {
            localKey: subLocalKey,
            status: STATUS_AWAITING_ACCEPT,
            method,
            params,
            success,
            error,
            trackedServers: [],
            handlers: {
                onData: existingSub?.handlers.onData || [],
                onClosed: existingSub?.handlers.onClosed || [],
                onConnected: existingSub?.handlers.onConnected || [],
            },
            queued: {
                data: [],
                closers: [],
            },
            timeoutId: undefined,
            close: () => this.closeSubscription(subLocalKey),
            subscription: existingSub?.subscription
        };
        if (!existingSub) {
            if (params.onData) {
                subsInfo.handlers.onData.push(params.onData);
            }
            if (params.onClosed) {
                subsInfo.handlers.onClosed.push(params.onClosed);
            }
            if (params.onConnected) {
                subsInfo.handlers.onConnected.push(params.onConnected);
            }
        }
        this.subscriptionsList[subLocalKey] = subsInfo;
        subsInfo.timeoutId = setTimeout(() => {
            if (this.subscriptionsList[subLocalKey] === undefined) {
                return;
            }
            const pendingSub = this.subscriptionsList[subLocalKey];
            if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                error({
                    method,
                    called_with: params.arguments,
                    message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + " ms.",
                });
                delete this.subscriptionsList[subLocalKey];
            }
            else if (pendingSub.status === STATUS_SUBSCRIBED && pendingSub.trackedServers.length > 0) {
                pendingSub.trackedServers = pendingSub.trackedServers.filter((server) => {
                    return (typeof server.subscriptionId !== "undefined");
                });
                delete pendingSub.timeoutId;
                if (pendingSub.trackedServers.length <= 0) {
                    this.callOnClosedHandlers(pendingSub);
                    delete this.subscriptionsList[subLocalKey];
                }
            }
        }, timeout);
        return subsInfo;
    }
    handleErrorSubscribing = (errorResponse) => {
        const tag = errorResponse._tag;
        const subLocalKey = tag.subLocalKey;
        const pendingSub = this.subscriptionsList[subLocalKey];
        if (typeof pendingSub !== "object") {
            return;
        }
        pendingSub.trackedServers = pendingSub.trackedServers.filter((server) => {
            return server.serverId !== tag.serverId;
        });
        if (pendingSub.trackedServers.length <= 0) {
            clearTimeout(pendingSub.timeoutId);
            if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                const reason = (typeof errorResponse.reason === "string" && errorResponse.reason !== "") ?
                    ' Publisher said "' + errorResponse.reason + '".' :
                    " No reason given.";
                const callArgs = typeof pendingSub.params.arguments === "object" ?
                    JSON.stringify(pendingSub.params.arguments) :
                    "{}";
                pendingSub.error({
                    message: ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs,
                    called_with: pendingSub.params.arguments,
                    method: pendingSub.method,
                });
            }
            else if (pendingSub.status === STATUS_SUBSCRIBED) {
                this.callOnClosedHandlers(pendingSub);
            }
            delete this.subscriptionsList[subLocalKey];
        }
    };
    handleSubscribed = (msg) => {
        const subLocalKey = msg._tag.subLocalKey;
        const pendingSub = this.subscriptionsList[subLocalKey];
        if (typeof pendingSub !== "object") {
            return;
        }
        const serverId = msg._tag.serverId;
        const acceptingServer = pendingSub.trackedServers
            .filter((server) => {
            return server.serverId === serverId;
        })[0];
        if (typeof acceptingServer !== "object") {
            return;
        }
        acceptingServer.subscriptionId = msg.subscription_id;
        this.subscriptionIdToLocalKeyMap[msg.subscription_id] = subLocalKey;
        const isFirstResponse = (pendingSub.status === STATUS_AWAITING_ACCEPT);
        pendingSub.status = STATUS_SUBSCRIBED;
        if (isFirstResponse) {
            let reconnect = false;
            let sub = pendingSub.subscription;
            if (sub) {
                sub.setNewSubscription(pendingSub);
                pendingSub.success(sub);
                reconnect = true;
            }
            else {
                sub = new UserSubscription(this.repository, pendingSub);
                pendingSub.subscription = sub;
                pendingSub.success(sub);
            }
            for (const handler of pendingSub.handlers.onConnected) {
                try {
                    handler(sub.serverInstance, reconnect);
                }
                catch (e) {
                }
            }
        }
    };
    handleEventData = (msg) => {
        const subLocalKey = this.subscriptionIdToLocalKeyMap[msg.subscription_id];
        if (typeof subLocalKey === "undefined") {
            return;
        }
        const subscription = this.subscriptionsList[subLocalKey];
        if (typeof subscription !== "object") {
            return;
        }
        const trackedServersFound = subscription.trackedServers.filter((s) => {
            return s.subscriptionId === msg.subscription_id;
        });
        if (trackedServersFound.length !== 1) {
            return;
        }
        const isPrivateData = msg.oob;
        const sendingServerId = trackedServersFound[0].serverId;
        const server = this.repository.getServerById(sendingServerId);
        const receivedStreamData = () => {
            return {
                data: msg.data,
                server: server?.instance ?? {},
                requestArguments: subscription.params.arguments,
                message: undefined,
                private: isPrivateData,
            };
        };
        const onDataHandlers = subscription.handlers.onData;
        const queuedData = subscription.queued.data;
        if (onDataHandlers.length > 0) {
            onDataHandlers.forEach((callback) => {
                if (typeof callback === "function") {
                    callback(receivedStreamData());
                }
            });
        }
        else {
            queuedData.push(receivedStreamData());
        }
    };
    handleSubscriptionCancelled = (msg) => {
        const subLocalKey = this.subscriptionIdToLocalKeyMap[msg.subscription_id];
        if (typeof subLocalKey === "undefined") {
            return;
        }
        const subscription = this.subscriptionsList[subLocalKey];
        if (typeof subscription !== "object") {
            return;
        }
        const expectedNewLength = subscription.trackedServers.length - 1;
        subscription.trackedServers = subscription.trackedServers.filter((server) => {
            if (server.subscriptionId === msg.subscription_id) {
                subscription.queued.closers.push(server.serverId);
                return false;
            }
            else {
                return true;
            }
        });
        if (subscription.trackedServers.length !== expectedNewLength) {
            return;
        }
        if (subscription.trackedServers.length <= 0) {
            this.timedCache.add(subscription);
            clearTimeout(subscription.timeoutId);
            this.callOnClosedHandlers(subscription);
            delete this.subscriptionsList[subLocalKey];
        }
        delete this.subscriptionIdToLocalKeyMap[msg.subscription_id];
    };
    callOnClosedHandlers(subscription, reason) {
        const closersCount = subscription.queued.closers.length;
        const closingServerId = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
        let closingServer;
        if (closingServerId !== undefined && typeof closingServerId === "string") {
            closingServer = this.repository.getServerById(closingServerId)?.instance ?? {};
        }
        subscription.handlers.onClosed.forEach((callback) => {
            if (typeof callback !== "function") {
                return;
            }
            callback({
                message: reason || ON_CLOSE_MSG_SERVER_INIT,
                requestArguments: subscription.params.arguments || {},
                server: closingServer,
                stream: subscription.method,
            });
        });
    }
    closeSubscription(subLocalKey) {
        const subscription = this.subscriptionsList[subLocalKey];
        if (typeof subscription !== "object") {
            return;
        }
        subscription.trackedServers.forEach((server) => {
            if (typeof server.subscriptionId === "undefined") {
                return;
            }
            subscription.queued.closers.push(server.serverId);
            this.session.sendFireAndForget({
                type: "unsubscribe",
                subscription_id: server.subscriptionId,
                reason_uri: "",
                reason: ON_CLOSE_MSG_CLIENT_INIT,
            });
            delete this.subscriptionIdToLocalKeyMap[server.subscriptionId];
        });
        subscription.trackedServers = [];
        this.callOnClosedHandlers(subscription, ON_CLOSE_MSG_CLIENT_INIT);
        delete this.subscriptionsList[subLocalKey];
    }
}

class ClientProtocol {
    session;
    repository;
    logger;
    streaming;
    constructor(session, repository, logger) {
        this.session = session;
        this.repository = repository;
        this.logger = logger;
        session.on("peer-added", (msg) => this.handlePeerAdded(msg));
        session.on("peer-removed", (msg) => this.handlePeerRemoved(msg));
        session.on("methods-added", (msg) => this.handleMethodsAddedMessage(msg));
        session.on("methods-removed", (msg) => this.handleMethodsRemovedMessage(msg));
        this.streaming = new ClientStreaming(session, repository, logger);
    }
    subscribe(stream, options, targetServers, success, error, existingSub) {
        this.streaming.subscribe(stream, options, targetServers, success, error, existingSub);
    }
    invoke(id, method, args, target) {
        const serverId = target.id;
        const methodId = method.gatewayId;
        const msg = {
            type: "call",
            server_id: serverId,
            method_id: methodId,
            arguments_kv: args,
        };
        return this.session.send(msg, { invocationId: id, serverId })
            .then((m) => this.handleResultMessage(m))
            .catch((err) => this.handleInvocationError(err));
    }
    drainSubscriptions() {
        return this.streaming.drainSubscriptions();
    }
    drainSubscriptionsCache() {
        return this.streaming.drainSubscriptionsCache();
    }
    handlePeerAdded(msg) {
        const newPeerId = msg.new_peer_id;
        const remoteId = msg.identity;
        const isLocal = msg.meta ? msg.meta.local : true;
        const pid = Number(remoteId.process);
        const serverInfo = {
            machine: remoteId.machine,
            pid: isNaN(pid) ? remoteId.process : pid,
            instance: remoteId.instance,
            application: remoteId.application,
            applicationName: remoteId.applicationName,
            environment: remoteId.environment,
            region: remoteId.region,
            user: remoteId.user,
            windowId: remoteId.windowId,
            peerId: newPeerId,
            api: remoteId.api,
            isLocal
        };
        this.repository.addServer(serverInfo, newPeerId);
    }
    handlePeerRemoved(msg) {
        const removedPeerId = msg.removed_id;
        const reason = msg.reason;
        this.repository.removeServerById(removedPeerId, reason);
    }
    handleMethodsAddedMessage(msg) {
        const serverId = msg.server_id;
        const methods = msg.methods;
        methods.forEach((method) => {
            this.repository.addServerMethod(serverId, method);
        });
    }
    handleMethodsRemovedMessage(msg) {
        const serverId = msg.server_id;
        const methodIdList = msg.methods;
        const server = this.repository.getServerById(serverId);
        if (server) {
            const serverMethodKeys = Object.keys(server.methods);
            serverMethodKeys.forEach((methodKey) => {
                const method = server.methods[methodKey];
                if (methodIdList.indexOf(method.gatewayId) > -1) {
                    this.repository.removeServerMethod(serverId, methodKey);
                }
            });
        }
    }
    handleResultMessage(msg) {
        const invocationId = msg._tag.invocationId;
        const result = msg.result;
        const serverId = msg._tag.serverId;
        const server = this.repository.getServerById(serverId);
        return {
            invocationId,
            result,
            instance: server?.instance,
            status: InvokeStatus.Success,
            message: ""
        };
    }
    handleInvocationError(msg) {
        this.logger.debug(`handle invocation error ${JSON.stringify(msg)}`);
        if ("_tag" in msg) {
            const invocationId = msg._tag.invocationId;
            const serverId = msg._tag.serverId;
            const server = this.repository.getServerById(serverId);
            const message = msg.reason;
            const context = msg.context;
            return {
                invocationId,
                result: context,
                instance: server?.instance,
                status: InvokeStatus.Error,
                message
            };
        }
        else {
            return {
                invocationId: "",
                message: msg.message,
                status: InvokeStatus.Error,
                error: msg
            };
        }
    }
}

function gW3ProtocolFactory (instance, connection, clientRepository, serverRepository, libConfig, interop) {
    const logger = libConfig.logger.subLogger("gw3-protocol");
    let resolveReadyPromise;
    const readyPromise = new Promise((resolve) => {
        resolveReadyPromise = resolve;
    });
    const session = connection.domain("agm", ["subscribed"]);
    const server = new ServerProtocol(session, clientRepository, serverRepository, logger.subLogger("server"));
    const client = new ClientProtocol(session, clientRepository, logger.subLogger("client"));
    async function handleReconnect() {
        logger.info("reconnected - will replay registered methods and subscriptions");
        client.drainSubscriptionsCache().forEach((sub) => {
            const methodInfo = sub.method;
            const params = Object.assign({}, sub.params);
            logger.info(`trying to soft-re-subscribe to method ${methodInfo.name}, with params: ${JSON.stringify(params)}`);
            interop.client.subscribe(methodInfo, params, undefined, undefined, sub).then(() => logger.info(`soft-subscribing to method ${methodInfo.name} DONE`)).catch((error) => logger.warn(`subscribing to method ${methodInfo.name} failed: ${JSON.stringify(error)}}`));
        });
        const reconnectionPromises = [];
        const existingSubscriptions = client.drainSubscriptions();
        for (const sub of existingSubscriptions) {
            const methodInfo = sub.method;
            const params = Object.assign({}, sub.params);
            logger.info(`trying to re-subscribe to method ${methodInfo.name}, with params: ${JSON.stringify(params)}`);
            reconnectionPromises.push(interop.client.subscribe(methodInfo, params, undefined, undefined, sub).then(() => logger.info(`subscribing to method ${methodInfo.name} DONE`)));
        }
        const registeredMethods = serverRepository.getList();
        serverRepository.reset();
        for (const method of registeredMethods) {
            const def = method.definition;
            if (method.stream) {
                reconnectionPromises.push(interop.server.createStream(def, method.streamCallbacks, undefined, undefined, method.stream)
                    .then(() => logger.info(`subscribing to method ${def.name} DONE`))
                    .catch(() => logger.warn(`subscribing to method ${def.name} FAILED`)));
            }
            else if (method?.theFunction?.userCallback) {
                reconnectionPromises.push(interop.register(def, method.theFunction.userCallback)
                    .then(() => logger.info(`registering method ${def.name} DONE`))
                    .catch(() => logger.warn(`registering method ${def.name} FAILED`)));
            }
            else if (method?.theFunction?.userCallbackAsync) {
                reconnectionPromises.push(interop.registerAsync(def, method.theFunction.userCallbackAsync)
                    .then(() => logger.info(`registering method ${def.name} DONE`))
                    .catch(() => logger.warn(`registering method ${def.name} FAILED`)));
            }
        }
        await Promise.all(reconnectionPromises);
        logger.info("Interop is re-announced");
    }
    function handleInitialJoin() {
        if (resolveReadyPromise) {
            resolveReadyPromise({
                client,
                server,
            });
            resolveReadyPromise = undefined;
        }
    }
    session.onJoined((reconnect) => {
        clientRepository.addServer(instance, connection.peerId);
        if (reconnect) {
            handleReconnect().then(() => connection.setLibReAnnounced({ name: "interop" })).catch((error) => logger.warn(`Error while re-announcing interop: ${JSON.stringify(error)}`));
        }
        else {
            handleInitialJoin();
        }
    });
    session.onLeft(() => {
        clientRepository.reset();
    });
    session.join();
    return readyPromise;
}

class Interop {
    instance;
    readyPromise;
    client;
    server;
    unwrappedInstance;
    protocol;
    clientRepository;
    serverRepository;
    constructor(configuration) {
        if (typeof configuration === "undefined") {
            throw new Error("configuration is required");
        }
        if (typeof configuration.connection === "undefined") {
            throw new Error("configuration.connections is required");
        }
        const connection = configuration.connection;
        if (typeof configuration.methodResponseTimeout !== "number") {
            configuration.methodResponseTimeout = 30 * 1000;
        }
        if (typeof configuration.waitTimeoutMs !== "number") {
            configuration.waitTimeoutMs = 30 * 1000;
        }
        this.unwrappedInstance = new InstanceWrapper(this, undefined, connection);
        this.instance = this.unwrappedInstance.unwrap();
        this.clientRepository = new ClientRepository(configuration.logger.subLogger("cRep"), this);
        this.serverRepository = new ServerRepository();
        let protocolPromise;
        if (connection.protocolVersion === 3) {
            protocolPromise = gW3ProtocolFactory(this.instance, connection, this.clientRepository, this.serverRepository, configuration, this);
        }
        else {
            throw new Error(`protocol ${connection.protocolVersion} not supported`);
        }
        this.readyPromise = protocolPromise.then((protocol) => {
            this.protocol = protocol;
            this.client = new Client(this.protocol, this.clientRepository, this.instance, configuration);
            this.server = new Server(this.protocol, this.serverRepository);
            return this;
        });
    }
    ready() {
        return this.readyPromise;
    }
    serverRemoved(callback) {
        return this.client.serverRemoved(callback);
    }
    serverAdded(callback) {
        return this.client.serverAdded(callback);
    }
    serverMethodRemoved(callback) {
        return this.client.serverMethodRemoved(callback);
    }
    serverMethodAdded(callback) {
        return this.client.serverMethodAdded(callback);
    }
    methodRemoved(callback) {
        return this.client.methodRemoved(callback);
    }
    methodAdded(callback) {
        return this.client.methodAdded(callback);
    }
    methodsForInstance(instance) {
        return this.client.methodsForInstance(instance);
    }
    methods(methodFilter) {
        return this.client.methods(methodFilter);
    }
    servers(methodFilter) {
        return this.client.servers(methodFilter);
    }
    subscribe(method, options, successCallback, errorCallback) {
        return this.client.subscribe(method, options, successCallback, errorCallback);
    }
    createStream(streamDef, callbacks, successCallback, errorCallback) {
        return this.server.createStream(streamDef, callbacks, successCallback, errorCallback);
    }
    unregister(methodFilter) {
        return this.server.unregister(methodFilter);
    }
    registerAsync(methodDefinition, callback) {
        return this.server.registerAsync(methodDefinition, callback);
    }
    register(methodDefinition, callback) {
        return this.server.register(methodDefinition, callback);
    }
    invoke(methodFilter, argumentObj, target, additionalOptions, success, error) {
        return this.client.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
    }
    waitForMethod(name) {
        const pw = new PromiseWrapper();
        const unsubscribe = this.client.methodAdded((m) => {
            if (m.name === name) {
                unsubscribe();
                pw.resolve(m);
            }
        });
        return pw.promise;
    }
}

const successMessages = ["subscribed", "success"];
class MessageBus {
    connection;
    logger;
    peerId;
    session;
    subscriptions;
    readyPromise;
    constructor(connection, logger) {
        this.connection = connection;
        this.logger = logger;
        this.peerId = connection.peerId;
        this.subscriptions = [];
        this.session = connection.domain("bus", successMessages);
        this.readyPromise = this.session.join();
        this.readyPromise.then(() => {
            this.watchOnEvent();
        });
    }
    ready() {
        return this.readyPromise;
    }
    publish = (topic, data, options) => {
        const { routingKey, target } = options || {};
        const args = this.removeEmptyValues({
            type: "publish",
            topic,
            data,
            peer_id: this.peerId,
            routing_key: routingKey,
            target_identity: target
        });
        this.session.send(args);
    };
    subscribe = (topic, callback, options) => {
        return new Promise((resolve, reject) => {
            const { routingKey, target } = options || {};
            const args = this.removeEmptyValues({
                type: "subscribe",
                topic,
                peer_id: this.peerId,
                routing_key: routingKey,
                source: target
            });
            this.session.send(args)
                .then((response) => {
                const { subscription_id } = response;
                this.subscriptions.push({ subscription_id, topic, callback, source: target });
                resolve({
                    unsubscribe: () => {
                        this.session.send({ type: "unsubscribe", subscription_id, peer_id: this.peerId });
                        this.subscriptions = this.subscriptions.filter((s) => s.subscription_id !== subscription_id);
                        return Promise.resolve();
                    }
                });
            })
                .catch((error) => reject(error));
        });
    };
    watchOnEvent = () => {
        this.session.on("event", (args) => {
            const { data, subscription_id } = args;
            const source = args["publisher-identity"];
            const subscription = this.subscriptions.find((s) => s.subscription_id === subscription_id);
            if (subscription) {
                if (!subscription.source) {
                    subscription.callback(data, subscription.topic, source);
                }
                else {
                    if (this.keysMatch(subscription.source, source)) {
                        subscription.callback(data, subscription.topic, source);
                    }
                }
            }
        });
    };
    removeEmptyValues(obj) {
        const cleaned = {};
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== undefined && obj[key] !== null) {
                cleaned[key] = obj[key];
            }
        });
        return cleaned;
    }
    keysMatch(obj1, obj2) {
        const keysObj1 = Object.keys(obj1);
        let allMatch = true;
        keysObj1.forEach((key) => {
            if (obj1[key] !== obj2[key]) {
                allMatch = false;
            }
        });
        return allMatch;
    }
}

const IOConnectCoreFactory = (userConfig, ext) => {
    const iodesktop = typeof window === "object" ? (window.iodesktop ?? window.glue42gd) : undefined;
    const preloadPromise = typeof window === "object" ? (window.gdPreloadPromise ?? Promise.resolve()) : Promise.resolve();
    const glueInitTimer = timer("glue");
    userConfig = userConfig || {};
    ext = ext || {};
    const internalConfig = prepareConfig(userConfig, ext, iodesktop);
    let _connection;
    let _interop;
    let _logger;
    let _metrics;
    let _contexts;
    let _bus;
    let _allowTrace;
    const libs = {};
    function registerLib(name, inner, t) {
        _allowTrace = _logger.canPublish("trace");
        if (_allowTrace) {
            _logger.trace(`registering ${name} module`);
        }
        const done = (e) => {
            inner.initTime = t.stop();
            inner.initEndTime = t.endTime;
            inner.marks = t.marks;
            if (!_allowTrace) {
                return;
            }
            const traceMessage = e ?
                `${name} failed - ${e.message}` :
                `${name} is ready - ${t.endTime - t.startTime}`;
            _logger.trace(traceMessage);
        };
        inner.initStartTime = t.startTime;
        if (inner.ready) {
            inner.ready()
                .then(() => {
                done();
            })
                .catch((e) => {
                const error = typeof e === "string" ? new Error(e) : e;
                done(error);
            });
        }
        else {
            done();
        }
        if (!Array.isArray(name)) {
            name = [name];
        }
        name.forEach((n) => {
            libs[n] = inner;
            IOConnectCoreFactory[n] = inner;
        });
    }
    function setupConnection() {
        const initTimer = timer("connection");
        _connection = new Connection(internalConfig.connection, _logger.subLogger("connection"));
        let authPromise = Promise.resolve(internalConfig.auth);
        if (internalConfig.connection && !internalConfig.auth) {
            if (iodesktop) {
                authPromise = iodesktop.getGWToken()
                    .then((token) => {
                    return {
                        gatewayToken: token
                    };
                });
            }
            else if (typeof window !== "undefined" && window?.glue42electron) {
                if (typeof window.glue42electron.gwToken === "string") {
                    authPromise = Promise.resolve({
                        gatewayToken: window.glue42electron.gwToken
                    });
                }
            }
            else {
                authPromise = Promise.reject("You need to provide auth information");
            }
        }
        return authPromise
            .then((authConfig) => {
            initTimer.mark("auth-promise-resolved");
            let authRequest;
            if (Object.prototype.toString.call(authConfig) === "[object Object]") {
                authRequest = authConfig;
            }
            else {
                throw new Error("Invalid auth object - " + JSON.stringify(authConfig));
            }
            return _connection.login(authRequest);
        })
            .then(() => {
            registerLib("connection", _connection, initTimer);
            return internalConfig;
        })
            .catch((e) => {
            if (_connection) {
                _connection.logout();
            }
            throw e;
        });
    }
    function setupLogger() {
        const initTimer = timer("logger");
        _logger = new Logger(`${internalConfig.connection.identity?.application}`, undefined, internalConfig.customLogger);
        _logger.consoleLevel(internalConfig.logger.console);
        _logger.publishLevel(internalConfig.logger.publish);
        if (_logger.canPublish("debug")) {
            _logger.debug("initializing glue...");
        }
        registerLib("logger", _logger, initTimer);
        return Promise.resolve(undefined);
    }
    function setupMetrics() {
        const initTimer = timer("metrics");
        const config = internalConfig.metrics;
        const metricsPublishingEnabledFunc = iodesktop?.getMetricsPublishingEnabled;
        const identity = internalConfig.connection.identity;
        const canUpdateMetric = metricsPublishingEnabledFunc ? metricsPublishingEnabledFunc : () => true;
        const disableAutoAppSystem = (typeof config !== "boolean" && config.disableAutoAppSystem) ?? false;
        _metrics = metrics({
            connection: config ? _connection : undefined,
            logger: _logger.subLogger("metrics"),
            canUpdateMetric,
            system: "Glue42",
            service: identity?.service ?? iodesktop?.applicationName ?? internalConfig.application,
            instance: identity?.instance ?? identity?.windowId ?? nanoid(10),
            disableAutoAppSystem,
            pagePerformanceMetrics: typeof config !== "boolean" ? config?.pagePerformanceMetrics : undefined
        });
        registerLib("metrics", _metrics, initTimer);
        return Promise.resolve();
    }
    function setupInterop() {
        const initTimer = timer("interop");
        const agmConfig = {
            connection: _connection,
            logger: _logger.subLogger("interop"),
        };
        _interop = new Interop(agmConfig);
        Logger.Interop = _interop;
        registerLib(["interop", "agm"], _interop, initTimer);
        return Promise.resolve();
    }
    function setupContexts() {
        const hasActivities = (internalConfig.activities && _connection.protocolVersion === 3);
        const needsContexts = internalConfig.contexts || hasActivities;
        if (needsContexts) {
            const initTimer = timer("contexts");
            _contexts = new ContextsModule({
                connection: _connection,
                logger: _logger.subLogger("contexts"),
                trackAllContexts: typeof internalConfig.contexts === "object" ? internalConfig.contexts.trackAllContexts : false,
                reAnnounceKnownContexts: typeof internalConfig.contexts === "object" ? internalConfig.contexts.reAnnounceKnownContexts : false
            });
            registerLib("contexts", _contexts, initTimer);
            return _contexts;
        }
        else {
            const replayer = _connection.replayer;
            if (replayer) {
                replayer.drain(ContextMessageReplaySpec.name);
            }
        }
    }
    async function setupBus() {
        if (!internalConfig.bus) {
            return Promise.resolve();
        }
        const initTimer = timer("bus");
        _bus = new MessageBus(_connection, _logger.subLogger("bus"));
        registerLib("bus", _bus, initTimer);
        return Promise.resolve();
    }
    function setupExternalLibs(externalLibs) {
        try {
            externalLibs.forEach((lib) => {
                setupExternalLib(lib.name, lib.create);
            });
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    function setupExternalLib(name, createCallback) {
        const initTimer = timer(name);
        const lib = createCallback(libs);
        if (lib) {
            registerLib(name, lib, initTimer);
        }
    }
    function waitForLibs() {
        const libsReadyPromises = Object.keys(libs).map((key) => {
            const lib = libs[key];
            return lib.ready ?
                lib.ready() : Promise.resolve();
        });
        return Promise.all(libsReadyPromises);
    }
    function constructGlueObject() {
        const feedbackFunc = (feedbackInfo) => {
            if (!_interop) {
                return;
            }
            _interop.invoke("T42.ACS.Feedback", feedbackInfo, "best");
        };
        const info = {
            coreVersion: version,
            version: internalConfig.version
        };
        glueInitTimer.stop();
        const glue = {
            feedback: feedbackFunc,
            info,
            logger: _logger,
            interop: _interop,
            agm: _interop,
            connection: _connection,
            metrics: _metrics,
            contexts: _contexts,
            bus: _bus,
            version: internalConfig.version,
            userConfig,
            done: () => {
                _logger?.info("done called by user...");
                return _connection.logout();
            }
        };
        glue.performance = {
            get glueVer() {
                return internalConfig.version;
            },
            get glueConfig() {
                return JSON.stringify(userConfig);
            },
            get browser() {
                return window.performance.timing.toJSON();
            },
            get memory() {
                return window.performance.memory;
            },
            get initTimes() {
                const all = getAllTimers();
                return Object.keys(all).map((key) => {
                    const t = all[key];
                    return {
                        name: key,
                        duration: t.endTime - t.startTime,
                        marks: t.marks,
                        startTime: t.startTime,
                        endTime: t.endTime
                    };
                });
            }
        };
        Object.keys(libs).forEach((key) => {
            const lib = libs[key];
            glue[key] = lib;
        });
        glue.config = {};
        Object.keys(internalConfig).forEach((k) => {
            glue.config[k] = internalConfig[k];
        });
        if (ext && ext.extOptions) {
            Object.keys(ext.extOptions).forEach((k) => {
                glue.config[k] = ext?.extOptions[k];
            });
        }
        if (ext?.enrichGlue) {
            ext.enrichGlue(glue);
        }
        if (iodesktop && iodesktop.updatePerfData) {
            iodesktop.updatePerfData(glue.performance);
        }
        if (glue.agm) {
            const deprecatedDecorator = (fn, wrong, proper) => {
                return function () {
                    glue.logger.warn(`glue.js - 'glue.agm.${wrong}' method is deprecated, use 'glue.interop.${proper}' instead.`);
                    return fn.apply(glue.agm, arguments);
                };
            };
            const agmAny = glue.agm;
            agmAny.method_added = deprecatedDecorator(glue.agm.methodAdded, "method_added", "methodAdded");
            agmAny.method_removed = deprecatedDecorator(glue.agm.methodRemoved, "method_removed", "methodRemoved");
            agmAny.server_added = deprecatedDecorator(glue.agm.serverAdded, "server_added", "serverAdded");
            agmAny.server_method_aded = deprecatedDecorator(glue.agm.serverMethodAdded, "server_method_aded", "serverMethodAdded");
            agmAny.server_method_removed = deprecatedDecorator(glue.agm.serverMethodRemoved, "server_method_removed", "serverMethodRemoved");
        }
        return glue;
    }
    async function registerInstanceIfNeeded() {
        const RegisterInstanceMethodName = "T42.ACS.RegisterInstance";
        if (Utils.isNode() && typeof process.env._GD_STARTING_CONTEXT_ === "undefined" && typeof userConfig?.application !== "undefined") {
            const isMethodAvailable = _interop.methods({ name: RegisterInstanceMethodName }).length > 0;
            if (isMethodAvailable) {
                try {
                    await _interop.invoke(RegisterInstanceMethodName, { appName: userConfig?.application, pid: process.pid });
                }
                catch (error) {
                    const typedError = error;
                    _logger.error(`Cannot register as an instance: ${JSON.stringify(typedError.message)}`);
                }
            }
        }
    }
    return preloadPromise
        .then(setupLogger)
        .then(setupConnection)
        .then(() => Promise.all([setupMetrics(), setupInterop(), setupContexts(), setupBus()]))
        .then(() => _interop.readyPromise)
        .then(() => registerInstanceIfNeeded())
        .then(() => {
        return setupExternalLibs(internalConfig.libs || []);
    })
        .then(waitForLibs)
        .then(constructGlueObject)
        .catch((err) => {
        return Promise.reject({
            err,
            libs
        });
    });
};
if (typeof window !== "undefined") {
    window.IOConnectCore = IOConnectCoreFactory;
}
IOConnectCoreFactory.version = version;
IOConnectCoreFactory.default = IOConnectCoreFactory;

const iOConnectBrowserFactory = createFactoryFunction(IOConnectCoreFactory);
if (typeof window !== "undefined") {
    const windowAny = window;
    windowAny.IOBrowser = iOConnectBrowserFactory;
    delete windowAny.GlueCore;
    delete windowAny.IOConnectCore;
}
const legacyGlobal = window.glue42gd || window.glue42core;
const ioGlobal = window.iodesktop || window.iobrowser;
if (!legacyGlobal && !ioGlobal) {
    window.iobrowser = { webStarted: false };
}
if (!window.iodesktop && !window.iobrowser.system) {
    window.iobrowser.system = setupGlobalSystem();
}
iOConnectBrowserFactory.version = version$1;

export { iOConnectBrowserFactory as default };
//# sourceMappingURL=browser.es.js.map
