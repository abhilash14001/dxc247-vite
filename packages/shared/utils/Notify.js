import { toast } from 'react-toastify';

const Notify = function(text, callback, close_callback, style) {
    const isError = style === 'danger';
    
    const toastOptions = {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        onClick: callback,
        closeButton: true,
        className: 'custom-toast custom-toast-compact',
        
    };

    if (isError) {
        toast.error(text, toastOptions);
    } else {
        toast.success(text, toastOptions);
    }
};

export default Notify;