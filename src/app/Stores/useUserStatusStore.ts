import { create } from "zustand"

type userStatusStore = {
    isLoggedIn: boolean,
    changeStatus: () => void
}
export  const useUserStatusStore = create<userStatusStore>((set) => ({
    isLoggedIn : false,
    changeStatus: () => set((state) => ({isLoggedIn: !state.isLoggedIn}))
}))