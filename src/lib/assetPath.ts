const basePath = process.env.NODE_ENV === "production" ? "/granfort" : "";

export function assetPath(path: string) {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
