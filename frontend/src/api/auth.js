
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
