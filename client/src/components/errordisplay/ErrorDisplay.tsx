import React from 'react';
import './ErrorDisplay.css'

type ErrorProps = {
    errorCode: number
};

const ErrorDisplay = (props: ErrorProps) => {
    switch (props.errorCode) {
        case 404:
            return <h1>Not Found</h1>;
        default: 
            return <h1>Something went wrong</h1>
    }
}

export default ErrorDisplay;