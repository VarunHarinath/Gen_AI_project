import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const predictSkinCondition = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/api/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'Prediction failed.');
        }
        throw new Error('Network error or server is down.');
    }
};
