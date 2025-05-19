// Scale font-sizes from html to the scalingFactor
export default function scaleFontSizes (html: string, scalingFactor: number): string {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Function to parse font size and return numeric value and unit
  const parseFontSize = (fontSize: string | null): { value: number; unit: string } => {
    if (!fontSize) {
      return { value: 16, unit: 'px' }; // Default font size if not specified
    }

    const value = parseFloat(fontSize);
    const unit = fontSize.replace(String(value), '');

    return { value, unit: unit || 'px' }; // Default to 'px' if no unit specified
  };

  // Function to apply scaling to a single element
  const applyScaling = (element: HTMLElement) => {
    const style = element.style;
    const fontSize = style.fontSize;

    const { value, unit } = parseFontSize(fontSize);
    const newFontSize = value * scalingFactor;

    element.style.fontSize = `${newFontSize}${unit}`;
  };

  // Select all elements with a style attribute
  const elementsWithStyle = tempDiv.querySelectorAll<HTMLElement>('[style]');

  // Apply scaling to elements with inline styles
  elementsWithStyle.forEach(element => {
    if (element.style.fontSize) {
      applyScaling(element);
    }
  });

  // Apply scaling to elements with font-size in style blocks
  const allElements = tempDiv.querySelectorAll<HTMLElement>('*');
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);
    if (style.fontSize) {
      applyScaling(element);
    }
  });

  // Return the modified HTML
  return tempDiv.innerHTML;
};