import { useRef } from "react";

const useRequestDebounce = (callback, wait) => {
    const params = useRef({ timeout: null, lastData: {} }).current;

    params.wait = wait;

    return function () {
        if (
            arguments[0].from === params.lastData.from &&
            arguments[0].to === params.lastData.to
        )
            return;

        params.lastData = arguments[0];

        clearTimeout(params.timeout);
        params.timeout = setTimeout(() => {
            params.timeout = null;
            callback(...arguments);
            params.lastData = {};
        }, params.wait);
    };
};

export default useRequestDebounce;
