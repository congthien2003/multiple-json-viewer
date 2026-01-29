export class JSONFormatter {
  static validateJSON(text: string): { valid: boolean; error?: string } {
    try {
      if (!text.trim()) {
        return { valid: false, error: 'JSON is empty' };
      }
      JSON.parse(text);
      return { valid: true };
    } catch (error) {
      const message =
        error instanceof SyntaxError ? error.message : 'Invalid JSON';
      return { valid: false, error: message };
    }
  }

  static formatJSON(text: string, spaces: number = 2): string {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, spaces);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  static parseJSON(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Failed to parse JSON');
    }
  }

  static minifyJSON(text: string): string {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  static isValidJSON(text: string): boolean {
    return this.validateJSON(text).valid;
  }

  static getJSONSize(text: string): {
    chars: number;
    lines: number;
    size: string;
  } {
    const chars = text.length;
    const lines = text.split('\n').length;
    const bytes = new Blob([text]).size;

    let size: string;
    if (bytes < 1024) {
      size = `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      size = `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      size = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return { chars, lines, size };
  }
}
