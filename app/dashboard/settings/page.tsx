"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { motion } from "framer-motion"
import { fetchBackend } from "@/lib/fetchApi"

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] placeholder:text-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/40 transition-all"

export default function SettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetchBackend("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setName(data.name)
        if (data.email) setEmail(data.email)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileSaved(false)

    const token = localStorage.getItem("token")
    if (!token) {
      setProfileError("You must be logged in.")
      return
    }

    try {
      const res = await fetchBackend("/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.message || "Failed to update profile")
      }
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSaved(false)

    const token = localStorage.getItem("token")
    if (!token) {
      setPasswordError("You must be logged in.")
      return
    }

    try {
      const res = await fetchBackend("/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.message || "Failed to update password")
      }
      setPasswordSaved(true)
      setCurrentPassword("")
      setNewPassword("")
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 sm:p-6 md:p-8 max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--muted)]/70">Manage your profile and account preferences.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">Profile Information</h2>
              <p className="text-xs text-[var(--muted)]/60 mt-0.5">Update your name and email address.</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
              {profileError && (
                <p className="text-xs text-red-500">{profileError}</p>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2"
              >
                {profileSaved ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Saved
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">Security</h2>
              <p className="text-xs text-[var(--muted)]/60 mt-0.5">Change your password.</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={inputClass}
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 active:brightness-95 transition-all flex items-center gap-2"
              >
                {passwordSaved ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Password Updated
                  </>
                ) : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-red-500/10">
          <h2 className="text-sm font-semibold text-red-500">Danger Zone</h2>
          <p className="text-xs text-red-400/60 mt-0.5">Irreversible account actions.</p>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Log out</p>
            <p className="text-xs text-[var(--muted)]/60 mt-0.5">Sign out and return to the home page.</p>
          </div>
          <button
            type="button"
            onClick={() => { logout(); router.push('/') }}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
          >
            Log out
          </button>
        </div>
      </div>
    </motion.div>
  )
}
