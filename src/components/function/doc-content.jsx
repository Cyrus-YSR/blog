"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export function DocContent({ content }) {
    const [mounted, setMounted] = useState(false)

    // Default content for the home page
    const defaultContent = `
# 欢迎使用文档系统

这是一个使用React和Next.js构建的文档系统，可以显示Markdown文件。

## 特点

- 支持嵌套文档结构
- 语法高亮
- 响应式设计
- 支持表格、列表等Markdown特性

请从左侧边栏选择一个文档开始阅读。
  `

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {content || defaultContent}
            </ReactMarkdown>
        </div>
    )
}
