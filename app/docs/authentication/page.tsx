"use client"
import { MethodBadge, CodeBlock } from "../components"

interface Endpoint {
    method: "POST" | "GET" | "PUT" | "DELETE"
    path: string
    description: string
    body?: string
    response: string
    pathParams?: string
    auth?: boolean
}

const section: { title: string; slug: string; endpoints: Endpoint[] } = {
    title: "Authentication",
    slug: "authentication",
    endpoints: [
        {
            method: "POST" as const,
            path: "/login",
            description: "Authenticate a user and return a JWT token",
            body: `{
  "email": "user@example.com",
  "password": "password123"
}`,
            response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
        },
        {
            method: "POST" as const,
            path: "/register",
            description: "Register a new user account",
            body: `{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}`,
            response: `{
  "message": "I created your account! Check your inbox to verify it",
  "email": "user@example.com"
}`,
        },
        {
            method: "GET" as const,
            path: "/verify-email",
            description: "Verify a user's email address using a token",
            pathParams: "token=string",
            response: `{
  "message": "I verified your email! You can now log in"
}`,
        },
    ],
}

export default function AuthenticationPage() {
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
