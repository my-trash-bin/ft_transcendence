export function avatarToUrl(avatar: string): string {
  return avatar.startsWith('/')
    ? avatar
    : `${process.env.NEXT_PUBLIC_UPLOADS_BASE}/uploads/${avatar}`;
}
