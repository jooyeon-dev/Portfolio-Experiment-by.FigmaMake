import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { projects as staticProjects } from "../data/projects";

export interface ListProject {
  id: string;
  title: string;
  company: string;
  period: string | null;
  description: string;
  image: string;
  tags: string[];
}

interface UseProjectsResult {
  projects: ListProject[];
  loading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<ListProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        const fallback: ListProject[] = staticProjects.map((p) => ({
          id: p.id,
          title: p.title,
          company: p.client,
          period: p.year,
          description: p.description,
          image: p.image,
          tags: p.tags,
        }));

        if (!isMounted) return;

        setProjects(fallback);
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("portfolio_projects")
        .select(
          "id, title, company, period, overview_title, overview_content, hero_images, tags",
        )
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      const mapped: ListProject[] =
        data?.map((row: any) => {
          const heroImages: string[] = Array.isArray(row.hero_images)
            ? row.hero_images.map((img: any) => String(img))
            : [];
          const description =
            String(row.overview_title ?? "").trim() ||
            String(row.overview_content ?? "").trim();
          const tags: string[] = Array.isArray(row.tags)
            ? row.tags.map((t: any) => String(t))
            : [];

          return {
            id: String(row.id ?? ""),
            title: String(row.title ?? ""),
            company: String(row.company ?? ""),
            period: row.period != null ? String(row.period) : null,
            description,
            image: heroImages[0] ?? "",
            tags,
          };
        }) ?? [];

      setProjects(mapped);
      setLoading(false);
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading, error };
}
