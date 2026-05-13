"use client"

import { motion } from "framer-motion"
import { CodeBlock } from "./components"

export default function DocsPage() {
    const fetchExample = `const response = await fetch('https://api.candyblossom.com/plants', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
console.log(data);`

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">API Documentation</h1>
                <p className="text-lg opacity-60 max-w-2xl leading-relaxed">
                    Welcome to Candy Blossom's API. Our API is designed around REST,
                    returning JSON-encoded responses and using standard HTTP response codes
                </p>
            </header>

            <section id="getting-started" className="mb-24 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
                <p className="opacity-70 mb-6 leading-relaxed">
                    You should authentificate in order to use most endpoints.
                    You can obtain this token by calling the <code className="bg-[var(--surface)] px-1 rounded">/login</code> endpoint.
                </p>
                <CodeBlock label="Example Request" code={fetchExample} language="javascript" />
            </section>
        </motion.div>
    )
}
