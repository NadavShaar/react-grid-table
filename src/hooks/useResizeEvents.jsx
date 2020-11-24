import { useEffect, useRef } from 'react';

export default (column, sortCallback, sortEndCallback) => {
    let resizeHandleRef = useRef(null);

    useEffect(() => {
        if(resizeHandleRef.current) resizeHandleRef.current.addEventListener('mousedown', onResize);

        return () => {
            if(resizeHandleRef.current) resizeHandleRef.current.removeEventListener('mousedown', onResize)
            window.removeEventListener('mousemove', handleResize);
            window.removeEventListener('mouseup', removeResizeListeners);
        }
    }, [resizeHandleRef.current, column, sortCallback, sortEndCallback])

    const onResize = (e) => {
        e.stopPropagation()
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', removeResizeListeners);
    }

    const handleResize = (e) => {
        sortCallback({e, target: resizeHandleRef.current, column});
    }
    
    const removeResizeListeners = (e) => {
        sortEndCallback();
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', removeResizeListeners);
    }

    return resizeHandleRef;
}