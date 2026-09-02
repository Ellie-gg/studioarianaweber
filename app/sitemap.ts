import type { MetadataRoute } from "next";
import { site, TODO_CLIENTE } from "@/src/config/site";
export default function sitemap(): MetadataRoute.Sitemap { return site.canonical === TODO_CLIENTE ? [] : [{ url: site.canonical, lastModified: new Date() }]; }
