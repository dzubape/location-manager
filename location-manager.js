const LocationManager = function() {

    this.parseLocation = function() {

        let url = window.location;
        let params = url.search.slice(1).split('&');

        let options = {};

        for(let param of params) {

            if(!param) {

                continue;
            }

            let [key, value] = param.split('=');
            options[key] = decodeURIComponent(value);
        }

        return options;
    };

    this.getGroup = function(prefix) {

        prefix += '-';
        let options = this.parseLocation();
        let group = Object.entries(options).filter(([key,]) => key.startsWith(prefix));
        group = group.map(([key, value])=>[key.replace(prefix,''), value]);
        return Object.fromEntries(group);
    };

    let replace = (keyValuePairs) => {

        let currentParams = this.parseLocation();
        let updatedParams = {...currentParams, ...keyValuePairs};
        let url = new URL(window.location.href);
        url.search = '?' + Object.entries(updatedParams).map(([key, value])=> {

            if(typeof value == 'number') {

                value = isNaN(value) ? 0 : (value).toFixed(_numFloatDigits);
            }
            return key + '=' + encodeURIComponent(value);
        }).join('&');

        window.history.replaceState(null, '', url);
    };

    this.replace = function() {

        let _timer = null;
        let _keyValuePairs = {};
        let _delay = 0;

        return function() {

            let prefix;
            let argIdx = 0;
            let keyValuePairs;
            if(typeof arguments[argIdx] === 'string') {

                prefix =  arguments[argIdx++] + '-';
            }
            keyValuePairs = arguments[argIdx++];
            keyValuePairs = Object.fromEntries(Object.entries(keyValuePairs).map(([key, v]) => [prefix + key, v]));
            // keyValuePairs = mapKeys(keyValuePairs, (key) => prefix + key);

            if(arguments.length > argIdx) {

                let delay = arguments[argIdx++];
                _delay = Math.max(_delay, delay);
            }

            _keyValuePairs = {..._keyValuePairs, ...keyValuePairs};

            if(_delay) {

                if(_timer) {

                    clearTimeout(_timer);
                }
                _timer = setTimeout(() => {

                    replace(_keyValuePairs);
                    _keyValuePairs = {};
                }, _delay);
            }
            else {

                replace(_keyValuePairs);
                _keyValuePairs = {};
            }
        }
    }();

    let _numFloatDigits = -1;
    this.trimFloat = function(digits) {

        _numFloatDigits = digits;
    }
};

export default LocationManager;
