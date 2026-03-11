import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type HowItem = {
  id: string;
  title: string;
  description: string;
  order_index: number;
};

export type CurrentlyItem = {
  id: string;
  item: string;
  order_index: number;
};

export type ValueItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  order_index: number;
};

export type AboutSummary = {
  off_the_clock: string;
  also_me: string;
  current_obsession: string;
};

type UseHomeContentResult = {
  how: HowItem[];
  currently: CurrentlyItem[];
  values: ValueItem[];
  about: AboutSummary | null;
  loading: boolean;
};

export function useHomeContent(): UseHomeContentResult {
  const [how, setHow] = useState<HowItem[]>([]);
  const [currently, setCurrently] = useState<CurrentlyItem[]>([]);
  const [values, setValues] = useState<ValueItem[]>([]);
  const [about, setAbout] = useState<AboutSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [howRes, curRes, valuesRes, aboutRes] = await Promise.all([
        supabase
          .from("how_i_work")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase
          .from("currently")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase
          .from("values")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase.from("about").select("*").limit(1).maybeSingle(),
      ]);

      if (cancelled) return;

      if (!howRes.error && howRes.data) {
        setHow(
          (howRes.data as any[]).map((row) => ({
            id: String(row.id),
            title: String(row.title ?? ""),
            description: String(row.description ?? ""),
            order_index: Number(row.order_index ?? 0),
          })),
        );
      }

      if (!curRes.error && curRes.data) {
        setCurrently(
          (curRes.data as any[]).map((row) => ({
            id: String(row.id),
            item: String(row.item ?? ""),
            order_index: Number(row.order_index ?? 0),
          })),
        );
      }

      if (!valuesRes.error && valuesRes.data) {
        setValues(
          (valuesRes.data as any[]).map((row) => ({
            id: String(row.id),
            number: String(row.number ?? ""),
            title: String(row.title ?? ""),
            description: String(row.description ?? ""),
            order_index: Number(row.order_index ?? 0),
          })),
        );
      }

      if (!aboutRes.error && aboutRes.data) {
        const row = aboutRes.data as any;
        setAbout({
          off_the_clock: String(row.off_the_clock ?? ""),
          also_me: String(row.also_me ?? ""),
          current_obsession: String(row.current_obsession ?? ""),
        });
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { how, currently, values, about, loading };
}

