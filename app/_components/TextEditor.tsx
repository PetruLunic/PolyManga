import React, {useState, useEffect, useRef, useMemo} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
const Size = Quill.import('attributors/style/size') as any;

interface TextEditorProps extends React.HTMLProps<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const FONT_SIZES = Array.from({ length: 40 }, (_, index) => `${10 + index * 2}px`);
Size.whitelist = FONT_SIZES;
Quill.register(Size, true);

// Helper function to generate CSS for font sizes
const generateFontSizeCss = (sizes: string[]): string => {
  let css = '';
  sizes.forEach(size => {
    // For the items in the dropdown
    css += `.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="${size}"]::before { content: "${size}"; }\n`;
    // For the selected label in the toolbar
    css += `.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="${size}"]::before { content: "${size}"; }\n`;
  });
  return css;
};

export default function TextEditor ({ value, onValueChange, placeholder, ...props }: TextEditorProps) {
  const [editor, setEditor] = useState<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false); // Track initialization
  const previousValue = useRef(value); // Store previous value

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'size': FONT_SIZES }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'indent',
  ], []);

  useEffect(() => {
    // Ensure the Quill editor is only initialized once.
    if (editorRef.current && !editor && !isInitialized.current) {
      isInitialized.current = true; // Mark as initialized

      const newEditor = new Quill(editorRef.current, {
        modules,
        formats,
        placeholder: placeholder || 'Start writing...',
        theme: 'bubble',
      });

      setEditor(newEditor);

      // Initial content set from props
      newEditor.clipboard.dangerouslyPasteHTML(value);
      previousValue.current = value;

      // Listen for changes and emit them to the parent component
      newEditor.on('text-change', (delta, oldDelta, source) => {
        console.log({source, newEditor})
        if (source === 'user') {
          const currentContent = newEditor.root.innerHTML;
          onValueChange(currentContent);
          previousValue.current = currentContent; // Update ref
        }
      });
    }

    // Update the editor content if the 'value' prop changes from the outside
    if (editor && editor.root.innerHTML !== value && previousValue.current !== value) {
      editor.clipboard.dangerouslyPasteHTML(value);
      previousValue.current = value;
    }
  }, [value, onValueChange, placeholder, editor, modules, formats]);

  return (
    <>
      {/* Inject the generated CSS for font sizes */}
      <style type="text/css">
        {generateFontSizeCss(FONT_SIZES)}
      </style>
      <div {...props}> {/* basic styling for the container */}
        <div ref={editorRef} style={{height: '100%', width: '100%'}}/>
      </div>
    </>
  );
};