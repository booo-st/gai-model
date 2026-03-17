export const cdn = (key) =>
  key ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}` : null
