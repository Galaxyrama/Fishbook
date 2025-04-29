import { create } from "zustand";

const IsOnSetup = create((set) => ({
  isOnSetup: false,

  setIsOnSetup: () => set({ isOnSetup: true }),
  setIsNotOnSetup: () => set({ isOnSetup: false }),
}));

export default IsOnSetup;