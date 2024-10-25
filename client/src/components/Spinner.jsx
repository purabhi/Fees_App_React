import React, { useEffect, useState } from 'react';

const Spinner = ({ isLoading }) => {
    const [loading, setLoading] = useState('hide');

    useEffect(() => {
        if (isLoading) {
            setLoading('show');
        } else {
            setLoading('hide');
        }
    }, [isLoading]);

    return (
        <div className={`spinner-container ${loading}`}>
            <div className='loading-spinner'></div>
        </div>
    );
};

export default Spinner;
