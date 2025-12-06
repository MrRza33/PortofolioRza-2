
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      // Primary: Blue-600
      primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 border-0',
      // Secondary: Neutral Dark
      secondary: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700',
      // Outline: Neutral Border
      outline: 'border border-neutral-700 bg-transparent hover:bg-neutral-800 text-neutral-200',
      // Ghost: Hover effect only
      ghost: 'hover:bg-neutral-800/50 text-neutral-300 hover:text-white',
      // Danger: Red
      danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    };
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// Card
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-100 shadow-sm', className)} {...props}>
    {children}
  </div>
);

// Label
export const Label = ({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300 mb-2 block', className)} {...props}>
    {children}
  </label>
);

// Markdown Renderer Component (Simple)
export const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;
    
    // Split by lines to process simple formatting
    const lines = content.split('\n');
    
    return (
        <div className="space-y-4">
            {lines.map((line, index) => {
                // Headings
                if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-white mt-6 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-neutral-800 pb-2">{line.replace('## ', '')}</h2>;
                if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-white mt-10 mb-6">{line.replace('# ', '')}</h1>;
                
                // Blockquote
                if (line.startsWith('> ')) return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-neutral-400 my-4 bg-blue-500/5 py-2 rounded-r">{line.replace('> ', '')}</blockquote>;

                // Lists
                if (line.startsWith('- ')) return <li key={index} className="ml-4 list-disc text-neutral-300 pl-2 mb-1">{parseInline(line.replace('- ', ''))}</li>;
                
                // Empty line
                if (line.trim() === '') return <div key={index} className="h-2"></div>;

                // Standard paragraph
                return <p key={index} className="text-neutral-300 leading-relaxed mb-4">{parseInline(line)}</p>;
            })}
        </div>
    );
};

// Helper for inline styles like **bold** or *italic*
const parseInline = (text: string) => {
    // This is a simplified parser. For full markdown, use a library like react-markdown.
    // Replaces **text** with bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};
