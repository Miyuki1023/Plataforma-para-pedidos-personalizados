import { apiService } from '../lib/api';

export const favoritesService = {
  getAll() {
    return apiService.get<any[]>('/favorites');
  },

  add(productId: string | number) {
    return apiService.post(`/favorites/${productId}`, {});
  },

  remove(productId: string | number) {
    return apiService.delete(`/favorites/${productId}`);
  },
};