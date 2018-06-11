export function alert(message: string): void {
  alert(message);
}

export function confirm(message: string): boolean {
  return confirm(message);
}

export function prompt(message: string, value?: string): string | null {
  return prompt(message, value);
}