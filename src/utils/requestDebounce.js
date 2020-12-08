import { useRef, useCallback } from 'react';

export default function useRequestDebounce(func, wait) {
    const waitRef = useRef();
    waitRef.current = wait;
    const lastData = useRef({});
    var timeout;
    return useCallback(function () {
        var context = this, args = arguments;
        if ((args[0] === lastData.current) || Object.keys(args[0]).every(key => args[0][key] === lastData.current[key])) return;
        lastData.current = args[0];
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, waitRef.current);
    }, []);
};