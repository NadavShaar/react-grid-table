import { useEffect, useCallback } from "react";

const useResizeEvents = (
    resizeHandleRef,
    column,
    onResizeStart,
    onResize,
    onResizeEnd
) => {
    useEffect(() => {
        const resizeEl = resizeHandleRef.current;
        if (resizeEl) resizeEl.addEventListener("mousedown", onMouseDown);

        return () => {
            if (resizeEl)
                resizeEl.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [
        column,
        onResizeStart,
        onResize,
        onResizeEnd,
        resizeHandleRef,
        onMouseDown,
        onMouseMove,
        onMouseUp,
    ]);

    const onMouseDown = useCallback(
        (event) => {
            onResizeStart({ event, target: resizeHandleRef.current, column });
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        },
        [column, onMouseMove, onMouseUp, onResizeStart, resizeHandleRef]
    );

    const onMouseMove = useCallback(
        (event) => {
            onResize({ event, target: resizeHandleRef.current, column });
        },
        [column, onResize, resizeHandleRef]
    );

    const onMouseUp = useCallback(
        (event) => {
            onResizeEnd({ event, target: resizeHandleRef.current, column });
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        },
        [column, onMouseMove, onResizeEnd, resizeHandleRef]
    );
};

export default useResizeEvents;
