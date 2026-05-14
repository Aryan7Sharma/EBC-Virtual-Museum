import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEOHead({
  title = "Educational Broadcasting Cambodia Museum - Digital Artifact Collection",
  description = "Explore our curated collection of artifacts from around the world. Experience history through interactive 3D models and curated exhibitions.",
  image,
  url,
  type = "website",
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta("og:title", title);
    updateMeta("og:description", description);
    updateMeta("og:type", type);
    if (url) updateMeta("og:url", url);
    if (image) updateMeta("og:image", image);

    updateMetaName("twitter:card", image ? "summary_large_image" : "summary");
    updateMetaName("twitter:title", title);
    updateMetaName("twitter:description", description);
    if (image) updateMetaName("twitter:image", image);

    updateMetaName("description", description);

    return () => {
      document.title = "Educational Broadcasting Cambodia Museum - Digital Artifact Collection";
    };
  }, [title, description, image, url, type]);

  return null;
}
