import { useState, useEffect, useRef } from "react";

const useDetectClickOutside = (initialIsVisible) => {
    const [isComponentVisible, setIsComponentVisible] =
        useState(initialIsVisible);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsComponentVisible(false);
            }
        };

        document.addEventListener("click", handleClickOutside, true);

        return () =>
            document.removeEventListener("click", handleClickOutside, true);
    }, []);

    return { ref, isComponentVisible, setIsComponentVisible };
};

export default useDetectClickOutside;
