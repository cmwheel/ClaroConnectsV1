import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Claro Connects",
    short_name: "Claro",
    description: "Mapping the Physical Future of Autonomy",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#1a1a1a",
  };
}
