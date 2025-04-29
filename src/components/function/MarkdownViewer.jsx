'use client'
import React from'react';
import ReactMarkdown from'react-markdown';
import remarkGfm from'remark-gfm';

const MarkdownViewer = ({ markdownContent }) => {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
        </ReactMarkdown>
    );
};

export default MarkdownViewer;