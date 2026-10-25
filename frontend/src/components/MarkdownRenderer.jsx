
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg
        border border-white/10 bg-white/[0.04] px-3 py-1.5
        text-xs font-medium text-zinc-300
        transition hover:bg-white/10 hover:text-white"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <span className="text-emerald-400">✓</span>
          Copied
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
          </svg>
          Copy code
        </>
      )}
    </button>
  );
};

const MarkdownRenderer = ({ content = "" }) => {
  return (
    <div
      className="markdown-content w-full min-w-0
        break-words text-[14px] leading-7
        text-zinc-300 sm:text-[15px]
        [&>*:first-child]:mt-0"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-7 text-2xl font-bold
              leading-tight tracking-tight text-white
              sm:text-3xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 border-b
              border-white/[0.08] pb-2 text-xl
              font-semibold tracking-tight text-zinc-100
              sm:text-2xl">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-lg
              font-semibold text-zinc-100 sm:text-xl">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 text-base
              font-semibold text-zinc-100">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-4 whitespace-pre-wrap
              leading-7 text-zinc-300 last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-zinc-200">{children}</em>
          ),

          del: ({ children }) => (
            <del className="text-zinc-500">{children}</del>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5
              pl-6 marker:text-zinc-500">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5
              pl-6 marker:text-zinc-500">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-7 text-zinc-300">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-5 rounded-r-lg
              border-l-[3px] border-violet-500
              bg-white/[0.035] py-2 pl-4 pr-3
              text-zinc-400">
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-6 border-white/10" />
          ),

          a: ({ href, children }) => {
            const safeHref =
              /^(https?:\/\/|mailto:|\/|#)/i.test(href || "")
                ? href
                : undefined;

            return (
              <a
                href={safeHref}
                target={
                  safeHref?.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  safeHref?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="break-all text-violet-400
                  underline decoration-violet-400/30
                  underline-offset-4 transition
                  hover:text-violet-300
                  hover:decoration-violet-300"
              >
                {children}
              </a>
            );
          },

          table: ({ children }) => (
            <div className="my-5 w-full overflow-x-auto
              rounded-xl border border-white/10
              bg-[#111318]">
              <table className="w-full border-collapse
                text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-white/[0.055]">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/[0.07]">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="transition hover:bg-white/[0.025]">
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th className="whitespace-nowrap border-b
              border-white/10 px-4 py-3 font-semibold
              text-zinc-100">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-3 align-top
              text-zinc-300">
              {children}
            </td>
          ),

          input: ({ checked, type }) => (
            <input
              type={type}
              checked={checked ?? false}
              readOnly
              className="mr-2 accent-violet-500"
            />
          ),

          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || "AI response image"}
              loading="lazy"
              className="my-4 max-h-[480px] max-w-full
                rounded-xl border border-white/10
                object-contain"
            />
          ),

          pre: ({ children }) => {
            const child = React.Children.toArray(children)
              .find(React.isValidElement);

            const code = child?.props?.children;

            const codeText = Array.isArray(code)
              ? code.join("")
              : String(code ?? "");

            const className = child?.props?.className || "";

            const language =
              className.match(/language-([\w-]+)/)?.[1]
                || "code";

            return (
              <div className="my-5 min-w-0 overflow-hidden
                rounded-xl border border-white/[0.09]
                bg-[#0d0f14] shadow-lg shadow-black/10">
                <div className="flex items-center
                  justify-between gap-3 border-b
                  border-white/[0.08] bg-[#15171e]
                  px-3 py-2">
                  <div className="flex min-w-0
                    items-center gap-2">
                    <span className="h-2 w-2 shrink-0
                      rounded-full bg-violet-400/80" />
                    <span className="truncate text-xs
                      font-medium text-zinc-400">
                      {language}
                    </span>
                  </div>

                  <CopyButton code={codeText} />
                </div>

                <pre className="m-0 max-w-full
                  overflow-x-auto bg-transparent
                  p-4 text-[13px] leading-6
                  text-zinc-200">
                  {children}
                </pre>
              </div>
            );
          },

          code: ({ className, children }) => {
            const isBlock = /language-/.test(className || "");

            if (isBlock) {
              return (
                <code className={`${className || ""} font-mono`}>
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded-md border
                border-white/[0.07] bg-white/[0.07]
                px-1.5 py-0.5 font-mono
                text-[0.88em] text-violet-300
                break-words">
                {children}
              </code>
            );
          },
        }}
      >
        {typeof content === "string" ? content : ""}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
