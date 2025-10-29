"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { deleteUser, setEditingId } from "@/lib/redux/slices/usersSlice"
import { appConfig } from "@/lib/config"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChevronDown, ChevronUp, Trash2, Edit2 } from "lucide-react"

export function UserTable({ onEdit }: { onEdit: () => void }) {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleEdit = (id: string) => {
    dispatch(setEditingId(id))
    onEdit()
  }

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id))
    setDeleteConfirm(null)
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>LinkedIn URL</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="w-24">Edit</TableHead>
              <TableHead className="w-24">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <div key={user.id}>
                <TableRow>
                  <TableCell>
                    <button onClick={() => toggleRow(user.id)} className="p-1 hover:bg-muted rounded">
                      {expandedRows.has(user.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {user.linkedinUrl}
                    </a>
                  </TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>
                    {appConfig.editable && (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)} className="w-full">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteConfirm(user.id)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Row - Address Details */}
                {expandedRows.has(user.id) && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={7} className="py-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Address Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Line 1</p>
                            <p>{user.address.line1}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Line 2</p>
                            <p>{user.address.line2}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">State</p>
                            <p>{user.address.state}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">City</p>
                            <p>{user.address.city}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">PIN</p>
                            <p>{user.address.pin}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </div>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
