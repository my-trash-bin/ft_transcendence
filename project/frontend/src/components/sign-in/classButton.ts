export function classButton(isActive: boolean): string {
  return isActive
    ? 'bg-chat-color1 text-white w-md h-xs text-lg'
    : 'bg-gray text-white w-md h-xs text-lg';
}
