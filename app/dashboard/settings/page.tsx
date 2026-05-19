"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

export default function SettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updating profile:", { name, email, currentPassword, newPassword })
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b border-[var(--border)] pb-2">Profile Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface)]" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b border-[var(--border)] pb-2">Security</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface)]" />
          </div>
        </section>

        <button type="submit" className="px-4 py-2 bg-[var(--text)] text-[var(--bg)] rounded font-semibold w-fit">
          Save Changes
        </button>
      </form>

      <section className="mt-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <p className="text-sm opacity-70">Sign out and return to the landing page.</p>
        <button
          type="button"
          onClick={() => {
            logout()
            router.push('/')
          }}
          className="mt-4 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Log out
        </button>
      </section>
    </div>
  )
}
