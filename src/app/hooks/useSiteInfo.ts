import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type SiteInfo = {
  name: string;
  role: string;
  contactEmail: string;
  linkedinUrl: string;
};

const FALLBACK_SITE_INFO: SiteInfo = {
  name: "Alex Morgan",
  role: "Product Designer crafting meaningful digital experiences through user-centered design.",
  contactEmail: "alex@example.com",
  linkedinUrl: "https://linkedin.com",
};

export function useSiteInfo(): SiteInfo {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(FALLBACK_SITE_INFO);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("site_info")
        .select("name, role, contact_email, linkedin_url")
        .limit(1)
        .maybeSingle();

      if (cancelled || error || !data) return;

      setSiteInfo({
        name: (data.name as string | null) || FALLBACK_SITE_INFO.name,
        role: (data.role as string | null) || FALLBACK_SITE_INFO.role,
        contactEmail:
          (data.contact_email as string | null) ||
          FALLBACK_SITE_INFO.contactEmail,
        linkedinUrl:
          (data.linkedin_url as string | null) ||
          FALLBACK_SITE_INFO.linkedinUrl,
      });
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return siteInfo;
}

