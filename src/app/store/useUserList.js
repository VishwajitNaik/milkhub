// store/useUserStore.js
import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  users: [],          // store list of users
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/api/user/getUserList');
      set({ users: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('Error fetching users:', err.message);
    }
  },
}));

export default useUserStore;
