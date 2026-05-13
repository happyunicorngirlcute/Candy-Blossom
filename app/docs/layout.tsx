"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { sections } from "./constants"

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] pt-16">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-16 bottom-0 border-r border-[var(--border)] p-6 hidden md:block overflow-y-auto">
                <div className="space-y-8">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Introduction</h4>
                        <nav className="flex flex-col gap-1 mb-8">
                            <Link
                                href="/docs"
                                className={`text-sm py-1.5 px-3 rounded-md transition-colors ${pathname === "/docs" ? "bg-[var(--surface)] font-medium" : "opacity-60 hover:opacity-100"
                                    }`}
                            >
                                Getting Started
                            </Link>
                        </nav>

                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">API Reference</h4>
                        <nav className="flex flex-col gap-1">
                            {sections.map((section) => {
                                const href = `/docs/${section.slug}`
                                const isActive = pathname === href
                                return (
                                    <Link
                                        key={section.slug}
                                        href={href}
                                        className={`text-sm py-1.5 px-3 rounded-md transition-colors ${isActive ? "bg-[var(--surface)] font-medium" : "opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        {section.title}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 md:p-16 max-w-5xl">
                {children}
            </main>
        </div>
    )
}
