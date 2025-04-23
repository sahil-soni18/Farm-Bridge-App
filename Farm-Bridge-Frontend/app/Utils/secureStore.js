import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync('access-token', token);
    console.log('Token saved successfully in SecureStore');
  } catch (error) {
    console.error('Error saving token in SecureStore:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('access-token');
    return token;
  } catch (error) {
    console.error('Error fetching token from SecureStore:', error);
    return null;
  }
};

export const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync('access-token');
        console.log('Token removed successfully from SecureStore');
    } catch (error) {
        console.error('Error deleting token from SecureStore:', error);
    }
}


// export const saveToken = (token) => {
//   try {
//     localStorage.setItem('access-token', token);
//     console.log('Token saved successfully in localStorage');
//   } catch (error) {
//     console.error('Error saving token in localStorage:', error);
//   }
// };

// export const getToken = () => {
//   try {
//     return localStorage.getItem('access-token');
//   } catch (error) {
//     console.error('Error fetching token from localStorage:', error);
//     return null;
//   }
// };

// export const removeToken = () => {
//   try {
//     localStorage.removeItem('access-token');
//     console.log('Token removed successfully from localStorage');
//   } catch (error) {
//     console.error('Error deleting token from localStorage:', error);
//   }
// };
