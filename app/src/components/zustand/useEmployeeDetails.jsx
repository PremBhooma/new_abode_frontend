import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware"
import { enc, AES } from 'crypto-js'

// ✅ Correct way to access environment variable in Vite
const encryptKey = import.meta.env.VITE_ENCRYPT_KEY || "Abodeeiyrvbih"

if (!encryptKey) {
  console.error("❌ VITE_ENCRYPT_KEY is not defined in .env file!")
}

// ✅ Encrypted Local Storage Wrapper
const storage = {
  getItem: (name) => {
    try {
      const encryptedData = localStorage.getItem(name)
      if (encryptedData && encryptKey) {
        const decryptedData = AES.decrypt(encryptedData, encryptKey).toString(enc.Utf8)
        return JSON.parse(decryptedData)
      }
    } catch (error) {
      console.error("🔐 Decryption failed:", error.message)
    }
    return null
  },
  setItem: (name, value) => {
    try {
      if (!encryptKey) throw new Error("VITE_ENCRYPT_KEY is not defined")
      const encryptedData = AES.encrypt(JSON.stringify(value), encryptKey).toString()
      localStorage.setItem(name, encryptedData)
    } catch (error) {
      console.error("🔐 Encryption failed:", error.message)
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}

// ✅ Zustand store with persistence
let store = (set, get) => ({
  employeeInfo: null,
  isLogged: false,
  access_token: null,
  permissions: null,

  updateEmployeeAuthDetails: (data, access_token, permission) => {
    set({
      employeeInfo: data,
      isLogged: true,
      access_token,
      permissions: permission
    })
  },

  updatePermissions: (permission) => {
    set({
      permissions: permission
    })
  },

  resetEmployeeAuthdetails: () => {
    set({
      employeeInfo: null,
      isLogged: false,
      access_token: null,
      permissions: null
    })
    storage.removeItem("employeeAuthDetails")
  }
})

// ✅ Apply persistence middleware with encrypted storage
store = persist(store, {
  name: "employeeAuthDetails",
  storage: createJSONStorage(() => storage)
})

// ✅ Export the hook
export const useEmployeeDetails = create(store)
