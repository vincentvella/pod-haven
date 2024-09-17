export function getFileExtension(url: string) {
  return url.split(".").pop()?.split(/[\?#]/)[0];
}
