"use client"

import { useState } from "react"
import { Providers } from "@/components/providers"
import { UserForm } from "@/components/user-form"
import { UserTable } from "@/components/user-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setEditingId } from "@/lib/redux/slices/usersSlice"

function UserManagementContent() {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useAppDispatch()

  const handleAddClick = () => {
    dispatch(setEditingId(null))
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage your users and their information</p>
          </div>
          <Button onClick={handleAddClick} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {showForm ? <UserForm onClose={handleCloseForm} /> : <UserTable onEdit={() => setShowForm(true)} />}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Providers>
      <UserManagementContent />
    </Providers>
  )
}
