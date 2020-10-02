import {useEffect} from 'react';

const useResizeEvents = (target, column, sortCallback, sortEndCallback) => {

    useEffect(() => {
        if(target) target.addEventListener('mousedown', onResize);

        return () => {
            if(target) target.removeEventListener('mousedown', onResize)
            window.removeEventListener('mousemove', handleResize);
            window.removeEventListener('mouseup', removeResizeListeners);
        }
    }, [target, column, sortCallback, sortEndCallback])

    const onResize = (e) => {
        e.stopPropagation()
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', removeResizeListeners);
    }

    const handleResize = (e) => {
        sortCallback({e, target, column});
    }
    
    const removeResizeListeners = (e) => {
        sortEndCallback();
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', removeResizeListeners);
    }
}

export default useResizeEvents;