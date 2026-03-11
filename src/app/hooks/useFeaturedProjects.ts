import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { projects as staticProjects } from "../data/projects";

export interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

interface UseFeaturedProjectsResult {
  projects: FeaturedProject[];
  loading: boolean;
  error: string | null;
}

export function useFeaturedProjects(limit = 3): UseFeaturedProjectsResult {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        // Fallback: use local static projects when Supabase is not configured
        const fallback = staticProjects.slice(0, limit).map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          image: p.image,
        }));

        if (!isMounted) return;

        setProjects(fallback);
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("portfolio_projects")
        .select("id, title, company, overview_title, overview_content, hero_images")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!isMounted) return;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      const mapped =
        data?.map((row: any) => {
          const heroImages: string[] = Array.isArray(row.hero_images)
            ? row.hero_images.map((img: any) => String(img))
            : [];

          const description =
            String(row.overview_title ?? "").trim() ||
            String(row.overview_content ?? "").trim();

          return {
            id: String(row.id ?? ""),
            title: String(row.title ?? ""),
            category: String(row.company ?? ""),
            description,
            image: heroImages[0] ?? "",
          };
        }) ?? [];

      setProjects(mapped);
      setLoading(false);
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { projects, loading, error };
}

