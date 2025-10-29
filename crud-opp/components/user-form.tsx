"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addUser, updateUser, setEditingId } from "@/lib/redux/slices/usersSlice"
import type { User } from "@/lib/redux/slices/usersSlice"
import {
  validateName,
  validateEmail,
  validateLinkedInUrl,
  validatePin,
  validateGender,
  validateAddressLine,
  validateState,
  validateCity,
} from "@/lib/validations"
import masterData from "@/lib/master-data.json"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormErrors {
  name?: string
  email?: string
  linkedinUrl?: string
  gender?: string
  addressLine1?: string
  addressLine2?: string
  state?: string
  city?: string
  pin?: string
}

export function UserForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const editingId = useAppSelector((state) => state.users.editingId)
  const users = useAppSelector((state) => state.users.users)
  const editingUser = users.find((u) => u.id === editingId)

  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    linkedinUrl: "",
    gender: "",
    address: {
      line1: "",
      line2: "",
      state: "",
      city: "",
      pin: "",
    },
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedState, setSelectedState] = useState<string>("")

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        linkedinUrl: editingUser.linkedinUrl,
        gender: editingUser.gender,
        address: editingUser.address,
      })
      setSelectedState(editingUser.address.state)
    }
  }, [editingUser])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const linkedinError = validateLinkedInUrl(formData.linkedinUrl)
    if (linkedinError) newErrors.linkedinUrl = linkedinError

    const genderError = validateGender(formData.gender)
    if (genderError) newErrors.gender = genderError

    const line1Error = validateAddressLine(formData.address.line1, "Address Line 1")
    if (line1Error) newErrors.addressLine1 = line1Error

    const line2Error = validateAddressLine(formData.address.line2, "Address Line 2")
    if (line2Error) newErrors.addressLine2 = line2Error

    const stateError = validateState(formData.address.state)
    if (stateError) newErrors.state = stateError

    const cityError = validateCity(formData.address.city)
    if (cityError) newErrors.city = cityError

    const pinError = validatePin(formData.address.pin)
    if (pinError) newErrors.pin = pinError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (editingId) {
      dispatch(updateUser({ id: editingId, ...formData }))
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
      }
      dispatch(addUser(newUser))
    }

    handleClose()
  }

  const handleClose = () => {
    dispatch(setEditingId(null))
    setFormData({
      name: "",
      email: "",
      linkedinUrl: "",
      gender: "",
      address: {
        line1: "",
        line2: "",
        state: "",
        city: "",
        pin: "",
      },
    })
    setSelectedState("")
    setErrors({})
    onClose()
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        state,
        city: "",
      },
    })
  }

  const getCitiesForState = (state: string) => {
    const stateData = masterData.states.find((s) => s.id === state)
    return stateData?.cities || []
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{editingId ? "Edit User" : "Add New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL *</Label>
              <Input
                id="linkedin"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className={errors.linkedinUrl ? "border-destructive" : ""}
              />
              {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Address</h3>

            <div className="space-y-2">
              <Label htmlFor="line1">Address Line 1 *</Label>
              <Input
                id="line1"
                value={formData.address.line1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, line1: e.target.value },
                  })
                }
                placeholder="Street address"
                className={errors.addressLine1 ? "border-destructive" : ""}
              />
              {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="line2">Address Line 2 *</Label>
              <Input
                id="line2"
                value={formData.address.line2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, line2: e.target.value },
                  })
                }
                placeholder="Apartment, suite, etc."
                className={errors.addressLine2 ? "border-destructive" : ""}
              />
              {errors.addressLine2 && <p className="text-sm text-destructive">{errors.addressLine2}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterData.states.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select
                  value={formData.address.city}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: value },
                    })
                  }
                >
                  <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForState(selectedState).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN *</Label>
              <Input
                id="pin"
                value={formData.address.pin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, pin: e.target.value },
                  })
                }
                placeholder="6-digit PIN code"
                maxLength={6}
                className={errors.pin ? "border-destructive" : ""}
              />
              {errors.pin && <p className="text-sm text-destructive">{errors.pin}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Update User" : "Add User"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
