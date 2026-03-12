import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type AboutExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type AboutData = {
  photo_url: string | null;
  intro_text: string | null;
  resume_url: string | null;
  experience: AboutExperienceItem[];
  skills: string[];
  tools: string[];
};

export type SiteInfoForAbout = {
  name: string | null;
  contact_email: string | null;
  location: string | null;
  linkedin_url: string | null;
  is_available: boolean | null;
  availability_text: string | null;
  role: string | null;
};

type UseAboutPageContentResult = {
  about: AboutData | null;
  siteInfo: SiteInfoForAbout | null;
  loading: boolean;
};

export function useAboutPageContent(): UseAboutPageContentResult {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [siteInfo, setSiteInfo] = useState<SiteInfoForAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [aboutRes, siteRes] = await Promise.all([
        supabase.from("about").select("*").limit(1).maybeSingle(),
        supabase.from("site_info").select("*").limit(1).maybeSingle(),
      ]);

      if (cancelled) return;

      if (!aboutRes.error && aboutRes.data) {
        const row = aboutRes.data as any;
        const experienceArray: AboutExperienceItem[] = Array.isArray(row.experience)
          ? row.experience.map((item: any) => ({
              role: String(item.role ?? ""),
              company: String(item.company ?? ""),
              period: String(item.period ?? ""),
              description: String(item.description ?? ""),
            }))
          : [];
        const skillsArray: string[] = Array.isArray(row.skills)
          ? row.skills.map((s: any) => String(s))
          : [];
        const toolsArray: string[] = Array.isArray(row.tools)
          ? row.tools.map((t: any) => String(t))
          : [];

        setAbout({
          photo_url: row.photo_url ?? null,
          intro_text: row.intro_text ?? null,
          resume_url: row.resume_url ?? null,
          experience: experienceArray,
          skills: skillsArray,
          tools: toolsArray,
        });
      } else {
        setAbout(null);
      }

      if (!siteRes.error && siteRes.data) {
        const row = siteRes.data as any;
        setSiteInfo({
          name: row.name ?? null,
          contact_email: row.contact_email ?? null,
          location: row.location ?? null,
          linkedin_url: row.linkedin_url ?? null,
          is_available:
            typeof row.is_available === "boolean" ? row.is_available : null,
          availability_text: row.availability_text ?? null,
          role: row.role ?? null,
        });
      } else {
        setSiteInfo(null);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { about, siteInfo, loading };
}

