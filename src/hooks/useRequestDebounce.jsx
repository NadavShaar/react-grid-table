import { useRef } from 'react';

export default (func, wait) => {
    const params = useRef({
        timeout: null,
        wait,
        lastData: {}
    }).current;

    params.wait = wait;

    return function () {
        var context = this, args = arguments;

        if ((args[0].from === params.lastData.from) && (args[0].to === params.lastData.to)) return;

        params.lastData = args[0];

        var later = function () {
            params.timeout = null;
            func.apply(context, args);
            params.lastData = {};
        };
        
        clearTimeout(params.timeout);
        params.timeout = setTimeout(later, params.wait);
    };
};