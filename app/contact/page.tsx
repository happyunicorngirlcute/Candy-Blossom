"use client"

import { useState, FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4l-10 8L2 4" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const SendIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await fetch("https://formsubmit.co/nahildiabi8@gmail.com", {
        method: "POST",
        body: formData,
      })
      setSubmitted(true)
    } catch {
      // FormSubmit may redirect; treat as success
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] select-none flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        >
          {/* Left – Contact Info */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="lg:col-span-2 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[var(--bg)] border-b lg:border-b-0 lg:border-r border-[var(--border)]"
          >
            <div>
              <motion.h1
                custom={1}
                variants={fadeUp}
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              >
                Get in touch
              </motion.h1>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="text-[var(--muted)] text-sm leading-relaxed mb-10"
              >
                Have a question, suggestion? 
              </motion.p>

              <div className="space-y-6">
                <motion.div custom={3} variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                    <MailIcon />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] mb-1">Email</p>
                    <p className="text-sm font-medium">nahildiabi8@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div custom={4} variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                    <LocationIcon />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] mb-1">Location</p>
                    <p className="text-sm font-medium">Saint Etienne - France</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div custom={5} variants={fadeUp} className="mt-10 lg:mt-0">
              <div className="h-px bg-[var(--border)] mb-6" />
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                Ill respond when I can - happyunicorngirlcute
              </p>
            </motion.div>
          </motion.div>

          {/* Right – Form */}
          <motion.div custom={1} variants={fadeUp} className="lg:col-span-3 p-6 sm:p-8 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center text-center h-full min-h-[400px] gap-6"
                >
                  <div>
                    <h2 className="text-2xl text-[var(--muted)] mb-2">Your message has been sent, I'll check it soon!</h2>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div custom={2} variants={fadeUp}>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className={inputClass}
                      />
                    </motion.div>

                    <motion.div custom={3} variants={fadeUp}>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className={inputClass}
                      />
                    </motion.div>
                  </div>

                  <motion.div custom={4} variants={fadeUp}>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="_subject"
                      required
                      className={inputClass}
                    />
                  </motion.div>

                  <motion.div custom={5} variants={fadeUp}>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />
                  </motion.div>

                  <motion.div custom={6} variants={fadeUp}>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-[var(--accent)] px-8 py-3 text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SendIcon />
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
