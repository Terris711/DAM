export const GetRequest = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        return response.json();
      } else {
        console.error('Server responded with non-OK status:', response.status);
        const text = await response.text();
        console.log(text);
      }
    } catch (error) {
      console.error('Error occurred during GET request:', error);
      throw error;
    }
  }