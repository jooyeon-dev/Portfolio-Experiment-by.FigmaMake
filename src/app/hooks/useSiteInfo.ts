import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type SiteInfo = {
  name: string;
  role: string;
  contactEmail: string;
  linkedinUrl: string;
  footerDescription: string;
  showLinkedin: boolean;
  showEmail: boolean;
};

const FALLBACK_SITE_INFO: SiteInfo = {
  name: "Alex Morgan",
  role: "Product Designer crafting meaningful digital experiences through user-centered design.",
  contactEmail: "alex@example.com",
  linkedinUrl: "https://linkedin.com",
  footerDescription:
    "Product Designer crafting meaningful digital experiences through user-centered design.",
  showLinkedin: true,
  showEmail: true,
};

export type UseSiteInfoResult = SiteInfo & { loading: boolean };

export function useSiteInfo(): UseSiteInfoResult {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(FALLBACK_SITE_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("site_info")
        .select(
          "name, role, contact_email, linkedin_url, footer_description, footer_show_linkedin, footer_show_email",
        )
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data) {
        setSiteInfo({
          name: (data.name as string | null) || FALLBACK_SITE_INFO.name,
          role: (data.role as string | null) || FALLBACK_SITE_INFO.role,
          contactEmail:
            (data.contact_email as string | null) ||
            FALLBACK_SITE_INFO.contactEmail,
          linkedinUrl:
            (data.linkedin_url as string | null) ||
            FALLBACK_SITE_INFO.linkedinUrl,
          footerDescription:
            (data.footer_description as string | null) ??
            FALLBACK_SITE_INFO.footerDescription,
          showLinkedin:
            typeof data.footer_show_linkedin === "boolean"
              ? data.footer_show_linkedin
              : FALLBACK_SITE_INFO.showLinkedin,
          showEmail:
            typeof data.footer_show_email === "boolean"
              ? data.footer_show_email
              : FALLBACK_SITE_INFO.showEmail,
        });
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...siteInfo, loading };
}

