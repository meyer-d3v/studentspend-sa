import React from "react";
// @ts-ignore
import FallbackUI from "../pages/FallbackUI/fallbackUI";
//import * as Sentry from "@sentry/react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {

    

    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    // Update state when an error is caught
    static getDerivedStateFromError(error: any) {
        return { error: error, hasError: true };
    }

    // Log the error (optional but recommended)
    componentDidCatch(error: any, errorInfo: any) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        // You can also send this to your logging system, e.g., Firebase or Sentry
        /*
        Sentry.captureException(error, {
            extra: errorInfo,
        });
        */

        /*
        const eventId = Sentry.captureException(error, {
            extra: errorInfo,
        });

        {Sentry.showReportDialog({ eventId })}
        */ 
        
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.children !== this.props.children && this.state.hasError) {
          this.setState({ hasError: false });
        }
    }
      

    render() {
        if (this.state.hasError) {
        // Fallback UI instead of crashing the app

        return (
            <>
             <FallbackUI /> 
            </>
        );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
