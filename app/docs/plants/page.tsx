"use client"


import { MethodBadge, CodeBlock } from "../components"

const section = {
    title: "Plants",
    slug: "plants",
    endpoints: [
        {
            method: "GET" as const,
            path: "/plants",
            description: "Retrieve a list of all plants in the database",
            response: `{
  "message": "Here are all the plants I could find for you",
  "data": [
    {
      "id": 1,
      "common_name": "Rose",
      "watering": "Frequent"
    }
  ]
}`,
        },
        {
            method: "GET" as const,
            path: "/plant/name/{name}",
            description: "Retrieve details for a specific plant by its common name",
            response: `{
  "message": "I found the plant you were looking for",
  "data": {
    "id": 1,
    "common_name": "Rose",
    "watering": "Frequent"
  }
}`,
        },
        {
            method: "GET" as const,
            path: "/api/plants/search/{name}",
            description: "Search for plants using the external Perenual API",
            response: `{
  "data": [...]
}`,
        },
        {
            method: "GET" as const,
            path: "/api/plants/details/{id}",
            description: "Get detailed information for a specific plant from the external Perenual API",
            response: `{
  "data": {
    "id": 1,
    "common_name": "Rose",
    "type": "Flower",
    ...
  }
}`,
        },
    ],
}

export default function PlantsPage() {
    return (
        <div>
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
        </div>
    )
}
