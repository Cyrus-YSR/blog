'use client'
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { DOCUMENTS } from '@/data/docs'; // 导入配置
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

// 创建复制按钮组件
const CopyButton = ({ codeContent }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            // 添加内容有效性检查
            if (typeof codeContent !== 'string' || codeContent.trim() === '') {
                throw new Error('无效的代码内容');
            }

            // 使用更兼容的复制方法
            const textArea = document.createElement('textarea');
            textArea.value = codeContent;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            setCopied(true);
            // 添加清除定时器的安全措施
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        } catch (err) {
            console.error('复制失败:', err);
            setCopied(false); // 确保状态重置
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className="absolute right-2 top-2 p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
        >
            {copied ? (
                <span className="text-sm text-orange-400">✓</span>
            ) : (
                <ClipboardDocumentIcon className="h-4 w-4 text-gray-600" />
            )}
        </button>
    );
};

// 在NotePage组件内部添加自定义代码渲染组件
const components = {
    pre: ({ children, ...props }) => {
        // 使用更可靠的代码提取方式
        const codeContent = React.Children.toArray(children)
            .find(child => React.isValidElement(child) && child.type === 'code')
            ?.props.children || '';

        return (
            <div className="relative">
                <CopyButton codeContent={codeContent} />
                <pre {...props} className="bg-gray-50 p-4 rounded-lg mt-4">
                    {children}
                </pre>
            </div>
        );
    }
};

const NotePage = () => {
    const [selectedDoc, setSelectedDoc] = useState(DOCUMENTS[0]);
    const [content, setContent] = useState('');
    // 新增展开状态管理
    const [expandedIds, setExpandedIds] = useState(new Set(['frontend'])); // 默认展开前端分类

    // 切换展开状态的方法
    const toggleCategory = (docId) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(docId)) {
                newSet.delete(docId);
            } else {
                newSet.add(docId);
            }
            return newSet;
        });
    };
    const renderDocumentList = (documents, level = 0) => {
        return documents.map((doc) => (
            <div key={doc.id}>
                <div
                    onClick={() => doc.type ? toggleCategory(doc.id) : setSelectedDoc(doc)}
                    className={`p-2 mb-4 cursor-pointer rounded transition-colors
            ${doc.type ? 'hover:bg-gray-200' : 'hover:bg-gray-200'}            ${selectedDoc.id === doc.id ? 'bg-orange-300' : ''}`}
                    style={{ paddingLeft: `${level * 20 + 12}px` }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`${doc.type ? 'font-bold text-gray-700' : 'text-gray-900'} ${level > 0 ? 'text-sm' : 'text-base'}`}>
                                {doc.title}
                            </h3>
                            {!doc.type && <p className="text-sm text-gray-500">{doc.createdAt}</p>}
                        </div>
                        {doc.type && (
                            <span className={`text-gray-400 transition-transform ${
                                expandedIds.has(doc.id) ? 'rotate-0' : 'rotate-90'
                            }`}>
                ›
              </span>
                        )}
                    </div>
                </div>

                {/* 根据展开状态显示子项 */}
                {doc.children && expandedIds.has(doc.id) &&
                    renderDocumentList(doc.children, level + 1)}
            </div>
        ));
    };
    // 加载文档内容
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch(selectedDoc.path);
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error('文档加载失败:', error);
                setContent('## 文档加载失败，请检查文件路径');
            }
        };

        loadContent();
    }, [selectedDoc]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 左侧目录 */}
            <div className="w-64 bg-white border-r p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">文档目录</h2>
                {renderDocumentList(DOCUMENTS)}
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 p-32 overflow-y-auto">
                <div className="prose max-w-none custom-tracking custom-leading markdown-body">
                    <h1 className="text-2xl font-bold mb-6 ">{selectedDoc.title}</h1>
                    <ReactMarkdown skipHtml={true} rehypePlugins={[rehypeHighlight]} components={components}>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default NotePage;