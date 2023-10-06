const Logout = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log('Data:',data);
        if (data.success) {
            window.localStorage.clear();
            window.location.href = '/';
        } else {
            console.error('logout failed');
            alert('登出失敗');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};


export default Logout;
