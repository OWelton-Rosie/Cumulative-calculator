        // Warn the user if they try to leave the page
        window.addEventListener('beforeunload', function (event) {
            const confirmationMessage = "The times entered will not be saved. Do you wish to continue?.";
            
            // Standardize the warning message across browsers
            event.returnValue = confirmationMessage; // For most modern browsers
            return confirmationMessage; // For some older browsers
        });
