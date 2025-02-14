import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  user: any | null
  setUser: (user: any) => void
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null)

  return <AuthContext.Provider value={{ user, setUser, children }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

