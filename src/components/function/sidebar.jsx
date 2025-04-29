"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react'

// This would typically come from an API or file system scan
const DOCS_STRUCTURE = [
    {
        title: "关于docs文档",
        slug: "about",
        type: "file",
    },
    {
        title: "新golang基础文档",
        slug: "golang-basics",
        type: "folder",
        children: [
            {
                title: "1.环境搭建",
                slug: "golang-basics/environment-setup",
                type: "file",
            },
            {
                title: "2.变量定义与输入输出",
                slug: "golang-basics/variables",
                type: "file",
            },
            {
                title: "3.基本数据类型",
                slug: "golang-basics/data-types",
                type: "file",
            },
            // Add more items as needed
        ],
    },
    // Add more top-level items as needed
]

export function Sidebar({ currentSlug = [] }) {
    const pathname = usePathname()
    const [expandedFolders, setExpandedFolders] = useState({})

    // Initialize expanded state based on current path
    useEffect(() => {
        if (currentSlug && currentSlug.length > 0) {
            const newExpandedState = {}

            // Expand all parent folders of the current document
            let currentPath = ""
            for (const segment of currentSlug) {
                currentPath = currentPath ? `${currentPath}/${segment}` : segment
                newExpandedState[currentPath] = true
            }

            setExpandedFolders(newExpandedState)
        }
    }, [currentSlug])

    const toggleFolder = (slug) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [slug]: !prev[slug],
        }))
    }

    const renderItems = (items, level = 0) => {
        return items.map((item) => {
            const isActive = pathname === `/docs/${item.slug}`
            const isExpanded = expandedFolders[item.slug] || false

            return (
                <div key={item.slug} style={{ marginLeft: `${level * 16}px` }}>
                    {item.type === "folder" ? (
                        <div className="space-y-1">
                            <button
                                onClick={() => toggleFolder(item.slug)}
                                className="flex items-center w-full text-left py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                                )}
                                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{item.title}</span>
                            </button>
                            {isExpanded && item.children && <div className="mt-1">{renderItems(item.children, level + 1)}</div>}
                        </div>
                    ) : (
                        <Link href={`/docs/${item.slug}`}>
                            <div
                                className={`flex items-center py-1 px-2 rounded ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{item.title}</span>
                            </div>
                        </Link>
                    )}
                </div>
            )
        })
    }

    return (
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 h-screen overflow-y-auto p-4 bg-white dark:bg-gray-950 shrink-0">
            <div className="text-xl font-bold mb-6 text-gray-800 dark:text-white">枫枫知道</div>
            <div className="space-y-1">{renderItems(DOCS_STRUCTURE)}</div>
        </aside>
    )
}
