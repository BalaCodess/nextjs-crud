"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Address {
  line1: string
  line2: string
  state: string
  city: string
  pin: string
}

export interface User {
  id: string
  name: string
  email: string
  linkedinUrl: string
  gender: string
  address: Address
}

interface UsersState {
  users: User[]
  editingId: string | null
}

const initialState: UsersState = {
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      gender: "Male",
      address: {
        line1: "123 Main St",
        line2: "Apt 4B",
        state: "CA",
        city: "Los Angeles",
        pin: "900001",
      },
    },
  ],
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload
    },
  },
})

export const { addUser, updateUser, deleteUser, setEditingId } = usersSlice.actions
export default usersSlice.reducer
