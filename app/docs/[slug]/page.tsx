"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { sections } from "../constants"
import { MethodBadge, CodeBlock } from "../components"
import { notFound } from "next/navigation"

export default function DocSectionPage() {
    const params = useParams()
    const slug = params.slug as string

    const section = sections.find((s) => s.slug === slug)

    if (!section) {
        notFound()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <section className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-8 pb-2 border-b border-[var(--border)]">
                    {section.title}
                </h2>
                <div className="space-y-24">
                    {section.endpoints.map((endpoint, i) => (
                        <div key={i} className="group">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <MethodBadge method={endpoint.method} />
                                <code className="text-lg font-mono font-bold tracking-tight">{endpoint.path}</code>
                                {endpoint.auth && (
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-yellow-500/50 text-yellow-500 rounded">
                                        Auth
                                    </span>
                                )}
                            </div>
                            <p className="text-[var(--text)] opacity-70 mb-6 leading-relaxed">
                                {endpoint.description}
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {endpoint.body && (
                                    <CodeBlock label="Request Body" code={endpoint.body} />
                                )}
                                {endpoint.response && (
                                    <CodeBlock
                                        label="Response"
                                        code={endpoint.response}
                                        className={!endpoint.body ? "lg:col-span-2" : ""}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}
