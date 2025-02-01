const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('access-token');
        return token || null; // Ensure a valid return
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
};

export default getToken;