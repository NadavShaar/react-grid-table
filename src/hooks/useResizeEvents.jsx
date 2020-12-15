import { useEffect } from 'react';

export default (resizeHandleRef, column, onResizeStart, onResize, onResizeEnd) => {

    useEffect(() => {
        if(resizeHandleRef.current) resizeHandleRef.current.addEventListener('mousedown', onMouseDown);

        return () => {
            if (resizeHandleRef.current) resizeHandleRef.current.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    }, [resizeHandleRef.current, column, onResizeStart, onResize, onResizeEnd])

    const onMouseDown = (e) => {
        e.stopPropagation();
        onResizeStart({ e, target: resizeHandleRef.current, column });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    const onMouseMove = (e) => {
        onResize({e, target: resizeHandleRef.current, column});
    }
    
    const onMouseUp = (e) => {
        onResizeEnd({ e, target: resizeHandleRef.current, column });
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
}