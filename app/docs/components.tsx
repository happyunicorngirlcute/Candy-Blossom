import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export const MethodBadge = ({ method }: { method: string }) => {
    const colors = {
        GET: "text-blue-500 bg-blue-500/10",
        POST: "text-green-500 bg-green-500/10",
        DELETE: "text-red-500 bg-red-500/10",
        PUT: "text-yellow-500 bg-yellow-500/10",
    }
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[method as keyof typeof colors]}`}>
            {method}
        </span>
    )
}

export const CodeBlock = ({ code, label, className, language = "json" }: { code: string; label?: string; className?: string; language?: string }) => (
    <div className={`my-4 ${className}`}>
        {label && <div className="text-xs font-medium mb-1.5 opacity-50 uppercase tracking-wider">{label}</div>}
        <div className="rounded-lg border border-[var(--border)] overflow-hidden font-mono text-sm">
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    background: "var(--surface)",
                }}
                codeTagProps={{
                    style: {
                        fontFamily: "inherit",
                    },
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    </div>
)
