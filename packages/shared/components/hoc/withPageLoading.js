import React, { useEffect } from 'react';
import { useLoading } from '../../hooks/useLoading';

const withPageLoading = (WrappedComponent) => {
    return React.forwardRef((props, ref) => {
        const { showLoading, hideLoading } = useLoading();

        useEffect(() => {
            // Show loading when component mounts
            showLoading();

            // Simulate page load time (you can adjust this or make it dynamic)
            const loadingTimer = setTimeout(() => {
                hideLoading();
            }, 1000); // 1 second loading time

            // Cleanup timer on unmount
            return () => {
                clearTimeout(loadingTimer);
                hideLoading();
            };
        }, [showLoading, hideLoading]);

        return <WrappedComponent ref={ref} {...props} />;
    });
};

export default withPageLoading;