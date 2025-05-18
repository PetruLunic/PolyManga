/**
 * Inverts a color string in HEX, RGB, or RGBA format.
 * Returns the inverted color in the same format.
 *
 * Supports:
 * - HEX: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
 * - rgb(r, g, b)
 * - rgba(r, g, b, a)
 *
 * Throws error if input format is invalid.
 */
export default function invertColor(color: string): string {
  interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number; // alpha 0..1
  }

  // Parse hex color string to RGBA
  function hexToRgba(hex: string): RGBA | null {
    hex = hex.trim();
    if (!hex.startsWith('#')) return null;

    // Expand shorthand (#RGB or #RGBA) to full form
    if (hex.length === 4) {
      hex = '#' + [...hex.slice(1)].map(c => c + c).join('') + 'ff';
    } else if (hex.length === 5) {
      hex = '#' + [...hex.slice(1, 4)].map(c => c + c).join('') + hex.slice(4) + hex.slice(4);
    } else if (hex.length === 7) {
      hex += 'ff'; // add full opacity alpha if missing
    } else if (hex.length !== 9) {
      return null;
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;

    if ([r, g, b].some(c => isNaN(c)) || isNaN(a)) return null;

    return { r, g, b, a };
  }

  // Convert RGBA to hex string (#RRGGBBAA)
  function rgbaToHex({ r, g, b, a }: RGBA): string {
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const alpha = Math.round(a * 255);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
  }

  // Parse rgb() or rgba() string to RGBA object
  function parseRgbOrRgba(str: string): RGBA | null {
    const rgbRegex = /^rgba?\(\s*([\d]{1,3})\s*,\s*([\d]{1,3})\s*,\s*([\d]{1,3})(?:\s*,\s*(0|0?\.\d+|1(\.0)?))?\s*\)$/i;
    const match = rgbRegex.exec(str.trim());
    if (!match) return null;

    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    if ([r, g, b].some(c => c < 0 || c > 255) || a < 0 || a > 1) return null;

    return { r, g, b, a };
  }

  // Invert RGB channels, keep alpha unchanged
  function invertRgba({ r, g, b, a }: RGBA): RGBA {
    return {
      r: 255 - r,
      g: 255 - g,
      b: 255 - b,
      a,
    };
  }

  const input = color.trim();

  let rgba: RGBA | null = null;
  let format: 'hex' | 'rgb' | 'rgba' | null = null;

  if (input.startsWith('#')) {
    rgba = hexToRgba(input);
    format = 'hex';
  } else if (/^rgba?\(/i.test(input)) {
    rgba = parseRgbOrRgba(input);
    format = input.toLowerCase().startsWith('rgba') ? 'rgba' : 'rgb';
  } else {
    throw new Error('Unsupported color format. Use HEX (#RRGGBB or #RRGGBBAA) or rgb()/rgba().');
  }

  if (!rgba) throw new Error('Invalid color value.');

  const inverted = invertRgba(rgba);

  if (format === 'hex') {
    // Return #RRGGBB or #RRGGBBAA depending on alpha
    if (inverted.a === 1) {
      // Omit alpha if fully opaque
      const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(inverted.r)}${toHex(inverted.g)}${toHex(inverted.b)}`;
    } else {
      return rgbaToHex(inverted);
    }
  } else if (format === 'rgb') {
    // Return rgb(r, g, b) ignoring alpha
    return `rgb(${inverted.r}, ${inverted.g}, ${inverted.b})`;
  } else {
    // rgba format: include alpha with up to 3 decimals
    const alphaStr = inverted.a.toFixed(3).replace(/\.?0+$/, '');
    return `rgba(${inverted.r}, ${inverted.g}, ${inverted.b}, ${alphaStr})`;
  }
}