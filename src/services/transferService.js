// src/services/transferService.js

import api from './api';

const transferService = {
  getLocuriDisponibile: async () => {
    const { data } = await api.get('transfers/available/');
    return data;
  }
};

export default transferService;
