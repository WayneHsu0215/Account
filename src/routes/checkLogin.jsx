export const checkLoginStatus = async () => {
    try {
        const loggedInFromLocalStorage = localStorage.getItem('loggedIn');
        if (loggedInFromLocalStorage === null) {
            throw new Error('No login status found in local storage.');
        }
        return loggedInFromLocalStorage === 'true';
    } catch (error) {
        console.error('An error occurred:', error);
        return false;
    }
};