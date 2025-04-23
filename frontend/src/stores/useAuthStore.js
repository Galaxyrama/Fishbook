import { create } from "zustand";

const useAuthStore = create((set) => ({
  userId: null,
  loading: true,

  setUserId: (id) => set({ userId: id }),
  setLoading: (state) => set({ loading: state }),
  clearUserId: () => set({ userId: null })
}));

export default useAuthStore;