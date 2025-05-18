interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Function to convert hex to RGB object
export default function hexToRgb (hex: string): RGBColor | null {
  if (!hex || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    // Basic validation for #RRGGBB or #RGB format
    return null;
  }

  let r_hex: string, g_hex: string, b_hex: string;

  if (hex.length === 4) { // Handle shorthand #RGB format
    r_hex = hex.substring(1, 2) + hex.substring(1, 2);
    g_hex = hex.substring(2, 3) + hex.substring(2, 3);
    b_hex = hex.substring(3, 4) + hex.substring(3, 4);
  } else { // Handle #RRGGBB format
    r_hex = hex.substring(1, 3);
    g_hex = hex.substring(3, 5);
    b_hex = hex.substring(5, 7);
  }

  const r = parseInt(r_hex, 16);
  const g = parseInt(g_hex, 16);
  const b = parseInt(b_hex, 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b };
};