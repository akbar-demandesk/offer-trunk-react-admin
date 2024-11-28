import axios from 'axios';

export const ApiCall = (method, url, data) => {
  axios({
    method: method,
    headers: localStorage.getItem(token),
    url: url,
    data: data,
  }).then((response) => {
    return response;
  });
};
