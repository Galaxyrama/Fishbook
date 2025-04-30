import { create } from "zustand";

const userProfile = create((set) => ({
  currentProfile: null,
  currentUsername: null,

  changeProfile: (img) => set({ currentProfile: img }),
  changeUsername: (user) => set({ currentUsername: user }),

  deleteProfile: () => set({ currentProfile: null }),
  deleteUsername: () => set({ currentUsername: null }),
}));

export default userProfile;