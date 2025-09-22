import Axios from "axios";


export const addFeedback = (feedbackData) => {
    return Axios.post('/feedback', feedbackData);
}