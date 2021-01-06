import { useEffect } from 'react';

const useResizeEvents = (resizeHandleRef, column, onResizeStart, onResize, onResizeEnd) => {

    useEffect(() => {
        if(resizeHandleRef.current) resizeHandleRef.current.addEventListener('mousedown', onMouseDown);

        return () => {
            if (resizeHandleRef.current) resizeHandleRef.current.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    }, [resizeHandleRef.current, column, onResizeStart, onResize, onResizeEnd])

    const onMouseDown = event => {
        onResizeStart({ event, target: resizeHandleRef.current, column });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    const onMouseMove = event => {
        onResize({event, target: resizeHandleRef.current, column});
    }
    
    const onMouseUp = event => {
        onResizeEnd({ event, target: resizeHandleRef.current, column });
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
}

export default useResizeEvents;