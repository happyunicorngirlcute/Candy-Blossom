import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/components/ThemeProvider"

export const MethodBadge = ({ method }: { method: string }) => {
    const colors = {
        GET: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
        POST: "text-green-600 bg-green-500/10 dark:text-green-400",
        DELETE: "text-red-600 bg-red-500/10 dark:text-red-400",
        PUT: "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400",
    }
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold select-none ${colors[method as keyof typeof colors]}`}>
            {method}
        </span>
    )
}

export const CodeBlock = ({ code, label, className, language = "json" }: { code: string; label?: string; className?: string; language?: string }) => {
    const { dark } = useTheme()

    return (
        <div className={`my-4 ${className}`}>
            {label && <div className="text-xs font-medium mb-1.5 opacity-50 uppercase tracking-wider">{label}</div>}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden font-mono text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={dark ? vscDarkPlus : ghcolors}
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
}
