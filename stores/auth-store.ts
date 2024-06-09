import { create } from 'zustand'

export interface IAuth {
    token: string
    setToken: (token: string)=> void
    unAuth: ()=> void
}

export const useAuthStore = create<IAuth>()((set) => ({
  token: '',
  setToken: (token: string) => set(() => ({ token })),
  unAuth: () => set({ token: '' }),
}))