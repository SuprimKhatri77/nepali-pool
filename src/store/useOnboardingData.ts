import { create } from "zustand";

export interface UserInputs {
  country?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
  sex?: string;
  resume?: string;
  citizenshipPhotoUrl?: string;
  currentUserId?: string;
  nationality?: string;
  bio?: string;
  imageUrl?: string;
}

interface UserInputsStore {
  inputs: UserInputs;
  setInput: (key: keyof UserInputs, value: string) => void;
  setInputs: (values: Partial<UserInputs>) => void;
  resetInputs: () => void;
}

export const useUserInputsStore = create<UserInputsStore>((set) => ({
  inputs: {},
  setInput: (key, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [key]: value },
    })),
  setInputs: (values) =>
    set((state) => ({
      inputs: { ...state.inputs, ...values },
    })),
  resetInputs: () => set({ inputs: {} }),
}));
