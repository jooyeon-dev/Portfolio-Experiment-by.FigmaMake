import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type AboutExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export type AboutEducationItem = {
  school: string;
  major: string;
  period: string;
  location: string;
  description: string;
};

export type AboutData = {
  photo_url: string | null;
  intro_text: string | null;
  intro_subtitle: string | null;
  resume_url: string | null;
  based_in: string | null;
  languages: string | null;
  studies: string | null;
  off_the_clock: string | null;
  also_me: string | null;
  current_obsession: string | null;
  experience: AboutExperienceItem[];
  education: AboutEducationItem[];
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

const FALLBACK_EDUCATION: AboutEducationItem[] = [
  {
    school: "Seoul National University",
    major: "Visual Communication Design",
    period: "2018 – 2022",
    location: "Seoul, South Korea",
    description:
      "Focused on interaction design, typography, and user-centered design methodology while collaborating on cross-disciplinary projects.",
  },
  {
    school: "Interaction Design Foundation",
    major: "Human-Computer Interaction (Online Courses)",
    period: "2022 – Present",
    location: "Remote",
    description:
      "Continuous learning in UX research, information architecture, and service design to deepen product thinking.",
  },
];

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
        // eslint-disable-next-line no-console
        console.log(
          "[useAboutPageContent] Supabase client is not configured, skipping fetch.",
        );
        setLoading(false);
        return;
      }

      setLoading(true);

      const [aboutRes, siteRes] = await Promise.all([
        supabase.from("about").select("*").limit(1).maybeSingle(),
        supabase.from("site_info").select("*").limit(1).maybeSingle(),
      ]);

      // eslint-disable-next-line no-console
      console.log("[useAboutPageContent] aboutRes", {
        error: aboutRes.error,
        data: aboutRes.data,
      });
      // eslint-disable-next-line no-console
      console.log("[useAboutPageContent] siteRes", {
        error: siteRes.error,
        data: siteRes.data,
      });

      if (cancelled) return;

      if (!aboutRes.error && aboutRes.data) {
        const row = aboutRes.data as any;
        const experienceArray: AboutExperienceItem[] = Array.isArray(row.experience)
          ? row.experience.map((item: any) => ({
              role: String(item.role ?? ""),
              company: String(item.company ?? ""),
              period: String(item.period ?? ""),
              location: String(item.location ?? ""),
              description: String(item.description ?? ""),
            }))
          : [];
        const educationArraySrc: any[] | null = Array.isArray(row.education)
          ? row.education
          : null;
        const educationArray: AboutEducationItem[] =
          educationArraySrc && educationArraySrc.length > 0
            ? educationArraySrc.map((item: any) => ({
                school: String(item.school ?? ""),
                major: String(item.major ?? ""),
                period: String(item.period ?? ""),
                location: String(item.location ?? ""),
                description: String(item.description ?? ""),
              }))
            : FALLBACK_EDUCATION;
        const skillsArray: string[] = Array.isArray(row.skills)
          ? row.skills.map((s: any) => String(s))
          : [];
        const toolsArray: string[] = Array.isArray(row.tools)
          ? row.tools.map((t: any) => String(t))
          : [];

        setAbout({
          photo_url: row.photo_url ?? null,
          intro_text: row.intro_text ?? null,
          intro_subtitle: row.intro_subtitle ?? null,
          resume_url: row.resume_url ?? null,
          based_in: row.based_in ?? null,
          languages: row.languages ?? null,
          studies: row.studies ?? null,
          off_the_clock: row.off_the_clock ?? null,
          also_me: row.also_me ?? null,
          current_obsession: row.current_obsession ?? null,
          experience: experienceArray,
          education: educationArray,
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

