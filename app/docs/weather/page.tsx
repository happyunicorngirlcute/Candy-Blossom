"use client"

import { MethodBadge, CodeBlock } from "../components"

interface Endpoint {
    method: "POST" | "GET" | "PUT" | "DELETE"
    path: string
    description: string
    body?: string
    response: string
    auth?: boolean
}

const section: { title: string; slug: string; endpoints: Endpoint[] } = {
    title: "Weather Information",
    slug: "weather",
    endpoints: [
        {
            method: "GET" as const,
            path: "/weather/{city}",
            description: "Get current weather information for a specific city",
            response: `{
  "city": "Paris",
  "temperature": 22,
  "condition": "Sunny"
}`,
        },
    ],
}

export default function WeatherPage() {
    return (
        <div>
            <section className="scroll-mt-24">
                <h2 className="text-3xl  mb-8 pb-2 border-b border-[var(--border)]">
                    {section.title}
                </h2>
                <div className="space-y-24">
                    {section.endpoints.map((endpoint, i) => (
                        <div key={i} className="group">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <MethodBadge method={endpoint.method} />
                                <code className="text-lg font-mono font-bold tracking-tight">{endpoint.path}</code>
                                {endpoint.auth && (
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-yellow-500/50 text-yellow-500 rounded select-none">
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
        </div>
    )
}
