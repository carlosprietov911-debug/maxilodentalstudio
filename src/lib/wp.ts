// src/lib/wordpress.ts
export async function getImageUrl(id: number | null): Promise<string | null> {
  if (!id) return null;
  const res = await fetch(`https://cms.maxilodentalstudio.com/wp-json/wp/v2/media/${id}`);
  const data = await res.json();
  return data.source_url;
}