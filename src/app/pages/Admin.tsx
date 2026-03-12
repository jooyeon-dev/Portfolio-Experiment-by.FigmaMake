import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type AdminTab =
  | "site"
  | "how"
  | "currently"
  | "projects"
  | "about"
  | "values";

type MetricInput = {
  value: string;
  description: string;
};

type ContributionInput = {
  number: string;
  title: string;
  description: string;
};

type SystemDecisionInput = {
  title: string;
  before: string;
  after: string;
};

type AdminProject = {
  id: string;
  title: string;
  company: string | null;
  location_period: string | null;
  description: string | null;
  highlights: string[];
  tags: string[];
  hero_images: string[];
  is_featured: boolean;
  order_index: number;
  subtitle: string | null;
  overview_title: string | null;
  overview_content: string | null;
  metrics: MetricInput[];
  challenge_title: string | null;
  challenge_content: string | null;
  my_role_title: string | null;
  my_role_content: string | null;
  contributions: ContributionInput[];
  system_decisions_title: string | null;
  system_decisions: SystemDecisionInput[];
  focus_title: string | null;
  focus_content: string | null;
  impact_title: string | null;
  impact_items: string[];
  reflection: string | null;
  next_project_title: string | null;
  next_project_id: string | null;
};

type ProjectFormValues = {
  id: string | null;
  title: string;
  company: string;
  location_period: string;
  description: string;
  highlights: string[];
  tags: string[];
  hero_images: string[];
  is_featured: boolean;
  order_index: number;
  subtitle: string;
  overview_title: string;
  overview_content: string;
  metrics: MetricInput[];
  challenge_title: string;
  challenge_content: string;
  my_role_title: string;
  my_role_content: string;
  contributions: ContributionInput[];
  system_decisions_title: string;
  system_decisions: SystemDecisionInput[];
  focus_title: string;
  focus_content: string;
  impact_title: string;
  impact_items: string[];
  reflection: string;
  next_project_title: string;
  next_project_id: string;
};

type SiteInfo = {
  id: string | null;
  name: string;
  role: string;
  location: string;
  hero_headline: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  contact_email: string;
  linkedin_url: string;
  github_url: string;
  dribbble_url: string;
};

type HowItem = {
  id: string;
  title: string;
  description: string;
  order_index: number;
};

type CurrentlyItem = {
  id: string;
  item: string;
  order_index: number;
};

type AboutInfo = {
  id: string | null;
  photo_url: string;
  intro_text: string;
  resume_url: string;
  based_in: string;
  languages: string;
  studies: string;
  off_the_clock: string;
  also_me: string;
  current_obsession: string;
  colleague_tags: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  skills: string[];
  tools: string[];
};

type ValueItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  order_index: number;
};

const EMPTY_METRICS: MetricInput[] = [
  { value: "", description: "" },
  { value: "", description: "" },
  { value: "", description: "" },
];

const DEFAULT_PROJECT: ProjectFormValues = {
  id: null,
  title: "",
  company: "",
  location_period: "",
  description: "",
  highlights: [],
  tags: [],
  hero_images: [],
  is_featured: false,
  order_index: 0,
  subtitle: "",
  overview_title: "",
  overview_content: "",
  metrics: EMPTY_METRICS,
  challenge_title: "",
  challenge_content: "",
  my_role_title: "",
  my_role_content: "",
  contributions: [],
  system_decisions_title: "",
  system_decisions: [],
  focus_title: "",
  focus_content: "",
  impact_title: "",
  impact_items: [],
  reflection: "",
  next_project_title: "",
  next_project_id: "",
};

const DEFAULT_SITE_INFO: SiteInfo = {
  id: null,
  name: "",
  role: "",
  location: "",
  hero_headline: "",
  hero_description: "",
  hero_cta_primary: "",
  hero_cta_secondary: "",
  contact_email: "",
  linkedin_url: "",
  github_url: "",
  dribbble_url: "",
};

const DEFAULT_ABOUT: AboutInfo = {
  id: null,
  photo_url: "",
  intro_text: "",
  resume_url: "",
  based_in: "",
  languages: "",
  studies: "",
  off_the_clock: "",
  also_me: "",
  current_obsession: "",
  colleague_tags: [],
  experience: [],
  skills: [],
  tools: [],
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as
  | string
  | undefined;
const STORAGE_BUCKET = "portfolio-projects";

export function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [siteSaving, setSiteSaving] = useState(false);

  const [howItems, setHowItems] = useState<HowItem[]>([]);
  const [howInitialIds, setHowInitialIds] = useState<string[]>([]);
  const [howSaving, setHowSaving] = useState(false);

  const [currentItems, setCurrentItems] = useState<CurrentlyItem[]>([]);
  const [currentInitialIds, setCurrentInitialIds] = useState<string[]>([]);
  const [currentSaving, setCurrentSaving] = useState(false);

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [activeProjectStep, setActiveProjectStep] = useState<1 | 2 | 3>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(DEFAULT_ABOUT);
  const [aboutSaving, setAboutSaving] = useState(false);

  const [valuesItems, setValuesItems] = useState<ValueItem[]>([]);
  const [valuesInitialIds, setValuesInitialIds] = useState<string[]>([]);
  const [valuesSaving, setValuesSaving] = useState(false);

  const projectFormMethods = useForm<ProjectFormValues>({
    defaultValues: DEFAULT_PROJECT,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty: projectDirty },
  } = projectFormMethods;

  const heroImages = watch("hero_images");
  const tags = watch("tags");
  const highlights = watch("highlights");
  const contributions = watch("contributions");
  const systemDecisions = watch("system_decisions");
  const impactItems = watch("impact_items");

  const disabledBecauseNoSupabase = !supabase;

  useEffect(() => {
    if (!supabase || !authorized) return;

    let cancelled = false;

    async function loadAll() {
      // site_info
      const [siteRes, howRes, currRes, projRes, aboutRes, valuesRes] =
        await Promise.all([
          supabase.from("site_info").select("*").limit(1).maybeSingle(),
          supabase
            .from("how_i_work")
            .select("*")
            .order("order_index", { ascending: true }),
          supabase
            .from("currently")
            .select("*")
            .order("order_index", { ascending: true }),
          supabase
            .from("projects")
            .select("*")
            .order("order_index", { ascending: true }),
          supabase.from("about").select("*").limit(1).maybeSingle(),
          supabase
            .from("values")
            .select("*")
            .order("order_index", { ascending: true }),
        ]);

      if (cancelled) return;

      if (!siteRes.error && siteRes.data) {
        const row = siteRes.data as any;
        setSiteInfo({
          id: row.id,
          name: row.name ?? "",
          role: row.role ?? "",
          location: row.location ?? "",
          hero_headline: row.hero_headline ?? "",
          hero_description: row.hero_description ?? "",
          hero_cta_primary: row.hero_cta_primary ?? "",
          hero_cta_secondary: row.hero_cta_secondary ?? "",
          contact_email: row.contact_email ?? "",
          linkedin_url: row.linkedin_url ?? "",
          github_url: row.github_url ?? "",
          dribbble_url: row.dribbble_url ?? "",
        });
      } else {
        setSiteInfo(DEFAULT_SITE_INFO);
      }

      if (!howRes.error && howRes.data) {
        const items = (howRes.data as any[]).map((row) => ({
          id: row.id as string,
          title: row.title ?? "",
          description: row.description ?? "",
          order_index: row.order_index ?? 0,
        }));
        setHowItems(items);
        setHowInitialIds(items.map((i) => i.id));
      }

      if (!currRes.error && currRes.data) {
        const items = (currRes.data as any[]).map((row) => ({
          id: row.id as string,
          item: row.item ?? "",
          order_index: row.order_index ?? 0,
        }));
        setCurrentItems(items);
        setCurrentInitialIds(items.map((i) => i.id));
      }

      if (!projRes.error && projRes.data) {
        const items = (projRes.data as any[]).map((row) => ({
          ...(row as AdminProject),
          highlights: row.highlights ?? [],
          tags: row.tags ?? [],
          hero_images: row.hero_images ?? [],
          metrics: (row.metrics as MetricInput[] | null) ?? EMPTY_METRICS,
          contributions:
            (row.contributions as ContributionInput[] | null) ?? [],
          system_decisions:
            (row.system_decisions as SystemDecisionInput[] | null) ?? [],
          impact_items: row.impact_items ?? [],
        }));
        setProjects(items);
        setLoadingProjects(false);
      } else {
        setLoadingProjects(false);
      }

      if (!aboutRes.error && aboutRes.data) {
        const row = aboutRes.data as any;
        setAboutInfo({
          id: row.id,
          photo_url: row.photo_url ?? "",
          intro_text: row.intro_text ?? "",
          resume_url: row.resume_url ?? "",
          based_in: row.based_in ?? "",
          languages: row.languages ?? "",
          studies: row.studies ?? "",
          off_the_clock: row.off_the_clock ?? "",
          also_me: row.also_me ?? "",
          current_obsession: row.current_obsession ?? "",
          colleague_tags: row.colleague_tags ?? [],
          experience: (row.experience as any[] | null) ?? [],
          skills: row.skills ?? [],
          tools: row.tools ?? [],
        });
      } else {
        setAboutInfo(DEFAULT_ABOUT);
      }

      if (!valuesRes.error && valuesRes.data) {
        const items = (valuesRes.data as any[]).map((row) => ({
          id: row.id as string,
          number: row.number ?? "",
          title: row.title ?? "",
          description: row.description ?? "",
          order_index: row.order_index ?? 0,
        }));
        setValuesItems(items);
        setValuesInitialIds(items.map((i) => i.id));
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [authorized]);

  const currentProjectTitle = useMemo(() => {
    const id = getValues("id");
    if (!id) return "New project";
    const existing = projects.find((p) => p.id === id);
    return existing?.title ?? "Edit project";
  }, [projects, getValues]);

  function handleAuthorize(e: React.FormEvent) {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setAuthorized(true);
      return;
    }
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthorized(true);
      setAuthError(null);
    } else {
      setAuthError("Incorrect password");
    }
  }

  async function uploadToStorage(folder: string, file: File) {
    if (!supabase) return null;
    const id = crypto.randomUUID();
    const path = `${folder}/${id}-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // ------- site_info -------

  async function handleSaveSiteInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSiteSaving(true);
    const id = siteInfo.id ?? crypto.randomUUID();
    const payload = { id, ...siteInfo };
    const { error } = await supabase.from("site_info").upsert(payload, {
      onConflict: "id",
    });
    setSiteSaving(false);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }
    setSiteInfo((prev) => ({ ...prev, id }));
  }

  // ------- how_i_work -------

  function handleAddHowItem() {
    const next: HowItem = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      order_index: howItems.length,
    };
    setHowItems((prev) => [...prev, next]);
  }

  function handleRemoveHowItem(id: string) {
    setHowItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveHowItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= howItems.length) return;
    const next = [...howItems];
    const [moved] = next.splice(index, 1);
    next.splice(newIndex, 0, moved);
    setHowItems(
      next.map((item, i) => ({
        ...item,
        order_index: i,
      })),
    );
  }

  async function handleSaveHow() {
    if (!supabase) return;
    setHowSaving(true);

    const idsNow = howItems.map((i) => i.id);
    const idsToDelete = howInitialIds.filter((id) => !idsNow.includes(id));

    if (idsToDelete.length > 0) {
      await supabase.from("how_i_work").delete().in("id", idsToDelete);
    }

    if (howItems.length > 0) {
      const payload = howItems.map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        order_index: index,
      }));
      const { error } = await supabase
        .from("how_i_work")
        .upsert(payload, { onConflict: "id" });
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setHowInitialIds(idsNow);
    setHowSaving(false);
  }

  // ------- currently -------

  function handleAddCurrentItem() {
    const next: CurrentlyItem = {
      id: crypto.randomUUID(),
      item: "",
      order_index: currentItems.length,
    };
    setCurrentItems((prev) => [...prev, next]);
  }

  function handleRemoveCurrentItem(id: string) {
    setCurrentItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveCurrentItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentItems.length) return;
    const next = [...currentItems];
    const [moved] = next.splice(index, 1);
    next.splice(newIndex, 0, moved);
    setCurrentItems(
      next.map((item, i) => ({
        ...item,
        order_index: i,
      })),
    );
  }

  async function handleSaveCurrent() {
    if (!supabase) return;
    setCurrentSaving(true);

    const idsNow = currentItems.map((i) => i.id);
    const idsToDelete = currentInitialIds.filter(
      (id) => !idsNow.includes(id),
    );

    if (idsToDelete.length > 0) {
      await supabase.from("currently").delete().in("id", idsToDelete);
    }

    if (currentItems.length > 0) {
      const payload = currentItems.map((item, index) => ({
        id: item.id,
        item: item.item,
        order_index: index,
      }));
      const { error } = await supabase
        .from("currently")
        .upsert(payload, { onConflict: "id" });
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setCurrentInitialIds(idsNow);
    setCurrentSaving(false);
  }

  // ------- projects (case study) -------

  function handleSelectProject(project: AdminProject) {
    setSelectedProjectId(project.id);
    setActiveProjectStep(1);
    reset({
      id: project.id,
      title: project.title ?? "",
      company: project.company ?? "",
      location_period: project.location_period ?? "",
      description: project.description ?? "",
      highlights: project.highlights ?? [],
      tags: project.tags ?? [],
      hero_images: project.hero_images ?? [],
      is_featured: project.is_featured ?? false,
      order_index: project.order_index ?? 0,
      subtitle: project.subtitle ?? "",
      overview_title: project.overview_title ?? "",
      overview_content: project.overview_content ?? "",
      metrics:
        (project.metrics && project.metrics.length > 0
          ? project.metrics
          : EMPTY_METRICS) ?? EMPTY_METRICS,
      challenge_title: project.challenge_title ?? "",
      challenge_content: project.challenge_content ?? "",
      my_role_title: project.my_role_title ?? "",
      my_role_content: project.my_role_content ?? "",
      contributions: project.contributions ?? [],
      system_decisions_title: project.system_decisions_title ?? "",
      system_decisions: project.system_decisions ?? [],
      focus_title: project.focus_title ?? "",
      focus_content: project.focus_content ?? "",
      impact_title: project.impact_title ?? "",
      impact_items: project.impact_items ?? [],
      reflection: project.reflection ?? "",
      next_project_title: project.next_project_title ?? "",
      next_project_id: project.next_project_id ?? "",
    });
  }

  function handleNewProject() {
    setSelectedProjectId(null);
    setActiveProjectStep(1);
    reset(DEFAULT_PROJECT);
  }

  async function onSubmitProject(values: ProjectFormValues) {
    if (!supabase) return;
    setSavingProject(true);

    const id = values.id ?? crypto.randomUUID();

    const payload = {
      id,
      title: values.title,
      company: values.company,
      location_period: values.location_period || null,
      description: values.description || null,
      highlights: values.highlights ?? [],
      tags: values.tags ?? [],
      hero_images: values.hero_images ?? [],
      is_featured: values.is_featured ?? false,
      order_index: values.order_index ?? 0,
      subtitle: values.subtitle || null,
      overview_title: values.overview_title || null,
      overview_content: values.overview_content || null,
      metrics: values.metrics ?? EMPTY_METRICS,
      challenge_title: values.challenge_title || null,
      challenge_content: values.challenge_content || null,
      my_role_title: values.my_role_title || null,
      my_role_content: values.my_role_content || null,
      contributions: values.contributions ?? [],
      system_decisions_title: values.system_decisions_title || null,
      system_decisions: values.system_decisions ?? [],
      focus_title: values.focus_title || null,
      focus_content: values.focus_content || null,
      impact_title: values.impact_title || null,
      impact_items: values.impact_items ?? [],
      reflection: values.reflection || null,
      next_project_title: values.next_project_title || null,
      next_project_id: values.next_project_id || null,
    };

    const { error } = await supabase
      .from("projects")
      .upsert(payload, { onConflict: "id" });

    setSavingProject(false);

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    setSelectedProjectId(id);
    reset({ ...values, id });

    const { data: refreshed } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    setProjects(
      (refreshed as AdminProject[] | null)?.map((row: any) => ({
        ...(row as AdminProject),
        highlights: row.highlights ?? [],
        tags: row.tags ?? [],
        hero_images: row.hero_images ?? [],
        metrics: (row.metrics as MetricInput[] | null) ?? EMPTY_METRICS,
        contributions:
          (row.contributions as ContributionInput[] | null) ?? [],
        system_decisions:
          (row.system_decisions as SystemDecisionInput[] | null) ?? [],
        impact_items: row.impact_items ?? [],
      })) ?? [],
    );
  }

  async function handleDeleteProject(id: string) {
    if (!supabase) return;
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    setDeletingProjectId(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setDeletingProjectId(null);

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) {
      handleNewProject();
    }
  }

  async function handleHeroImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!supabase) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = await uploadToStorage("hero", file);
    if (!url) return;

    setValue("hero_images", [...heroImages, url], { shouldDirty: true });
  }

  function handleRemoveHeroImage(index: number) {
    const next = heroImages.filter((_, i) => i !== index);
    setValue("hero_images", next, { shouldDirty: true });
  }

  function handleAddTag() {
    setValue("tags", [...tags, ""], { shouldDirty: true });
  }

  function handleUpdateTag(index: number, value: string) {
    const next = [...tags];
    next[index] = value;
    setValue("tags", next, { shouldDirty: true });
  }

  function handleRemoveTag(index: number) {
    const next = tags.filter((_, i) => i !== index);
    setValue("tags", next, { shouldDirty: true });
  }

  function handleAddHighlight() {
    setValue("highlights", [...highlights, ""], { shouldDirty: true });
  }

  function handleUpdateHighlight(index: number, value: string) {
    const next = [...highlights];
    next[index] = value;
    setValue("highlights", next, { shouldDirty: true });
  }

  function handleRemoveHighlight(index: number) {
    const next = highlights.filter((_, i) => i !== index);
    setValue("highlights", next, { shouldDirty: true });
  }

  function handleAddContribution() {
    setValue(
      "contributions",
      [
        ...contributions,
        {
          number: String(contributions.length + 1).padStart(2, "0"),
          title: "",
          description: "",
        },
      ],
      { shouldDirty: true },
    );
  }

  function handleRemoveContribution(index: number) {
    const next = contributions.filter((_, i) => i !== index);
    setValue("contributions", next, { shouldDirty: true });
  }

  function handleAddSystemDecision() {
    setValue(
      "system_decisions",
      [...systemDecisions, { title: "", before: "", after: "" }],
      { shouldDirty: true },
    );
  }

  function handleRemoveSystemDecision(index: number) {
    const next = systemDecisions.filter((_, i) => i !== index);
    setValue("system_decisions", next, { shouldDirty: true });
  }

  function handleAddImpactItem() {
    setValue("impact_items", [...impactItems, ""], { shouldDirty: true });
  }

  function handleRemoveImpactItem(index: number) {
    const next = impactItems.filter((_, i) => i !== index);
    setValue("impact_items", next, { shouldDirty: true });
  }

  // ------- about -------

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAboutSaving(true);
    const id = aboutInfo.id ?? crypto.randomUUID();
    const payload = {
      id,
      ...aboutInfo,
    };
    const { error } = await supabase.from("about").upsert(payload, {
      onConflict: "id",
    });
    setAboutSaving(false);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }
    setAboutInfo((prev) => ({ ...prev, id }));
  }

  async function handleUploadAboutPhoto(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadToStorage("about-photo", file);
    if (!url) return;
    setAboutInfo((prev) => ({ ...prev, photo_url: url }));
  }

  async function handleUploadResume(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadToStorage("resume", file);
    if (!url) return;
    setAboutInfo((prev) => ({ ...prev, resume_url: url }));
  }

  // ------- values -------

  function handleAddValue() {
    const next: ValueItem = {
      id: crypto.randomUUID(),
      number: String(valuesItems.length + 1).padStart(2, "0"),
      title: "",
      description: "",
      order_index: valuesItems.length,
    };
    setValuesItems((prev) => [...prev, next]);
  }

  function handleRemoveValue(id: string) {
    setValuesItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveValue(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= valuesItems.length) return;
    const next = [...valuesItems];
    const [moved] = next.splice(index, 1);
    next.splice(newIndex, 0, moved);
    setValuesItems(
      next.map((item, i) => ({
        ...item,
        order_index: i,
      })),
    );
  }

  async function handleSaveValues() {
    if (!supabase) return;
    setValuesSaving(true);

    const idsNow = valuesItems.map((i) => i.id);
    const idsToDelete = valuesInitialIds.filter(
      (id) => !idsNow.includes(id),
    );

    if (idsToDelete.length > 0) {
      await supabase.from("values").delete().in("id", idsToDelete);
    }

    if (valuesItems.length > 0) {
      const payload = valuesItems.map((item, index) => ({
        id: item.id,
        number: item.number,
        title: item.title,
        description: item.description,
        order_index: index,
      }));
      const { error } = await supabase
        .from("values")
        .upsert(payload, { onConflict: "id" });
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setValuesInitialIds(idsNow);
    setValuesSaving(false);
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
          <h1 className="text-2xl mb-2">Admin Access</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter the admin password to manage your portfolio content.
          </p>
          <form onSubmit={handleAuthorize} className="space-y-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {authError && (
              <p className="text-sm text-red-500">{authError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={passwordInput.length === 0}
            >
              Enter
            </Button>
            {!ADMIN_PASSWORD && (
              <p className="text-xs text-gray-500">
                VITE_ADMIN_PASSWORD is not set. Any password will work in this
                environment.
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Admin</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage portfolio content stored in Supabase.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "site", label: "사이트 기본 정보" },
          { id: "how", label: "How I Work" },
          { id: "currently", label: "Currently" },
          { id: "projects", label: "프로젝트 관리" },
          { id: "about", label: "About" },
          { id: "values", label: "Values" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              activeTab === tab.id
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-700 hover:border-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {disabledBecauseNoSupabase && (
        <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          Supabase is not configured. Set{" "}
          <span className="font-mono">VITE_SUPABASE_URL</span> and{" "}
          <span className="font-mono">VITE_SUPABASE_ANON_KEY</span> to enable
          admin actions.
        </div>
      )}

      {/* 1. site_info */}
      {activeTab === "site" && (
        <form
          className="max-w-3xl space-y-6"
          onSubmit={handleSaveSiteInfo}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={siteInfo.name}
                onChange={(e) =>
                  setSiteInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Input
                value={siteInfo.role}
                onChange={(e) =>
                  setSiteInfo((prev) => ({ ...prev, role: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Location
              </label>
              <Input
                value={siteInfo.location}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Contact email
              </label>
              <Input
                type="email"
                value={siteInfo.contact_email}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    contact_email: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mb-1 block">
              Hero headline
            </label>
            <Input
              value={siteInfo.hero_headline}
              onChange={(e) =>
                setSiteInfo((prev) => ({
                  ...prev,
                  hero_headline: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mb-1 block">
              Hero description
            </label>
            <Textarea
              rows={4}
              value={siteInfo.hero_description}
              onChange={(e) =>
                setSiteInfo((prev) => ({
                  ...prev,
                  hero_description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Primary CTA label
              </label>
              <Input
                value={siteInfo.hero_cta_primary}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    hero_cta_primary: e.target.value,
                  }))
                }
                placeholder="View my work"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Secondary CTA label
              </label>
              <Input
                value={siteInfo.hero_cta_secondary}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    hero_cta_secondary: e.target.value,
                  }))
                }
                placeholder="Get in touch"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                LinkedIn URL
              </label>
              <Input
                value={siteInfo.linkedin_url}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    linkedin_url: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                GitHub URL
              </label>
              <Input
                value={siteInfo.github_url}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    github_url: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Dribbble URL
              </label>
              <Input
                value={siteInfo.dribbble_url}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    dribbble_url: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              size="sm"
              disabled={siteSaving || disabledBecauseNoSupabase}
            >
              Save site info
            </Button>
          </div>
        </form>
      )}

      {/* 2. how_i_work */}
      {activeTab === "how" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">How I Work</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddHowItem}
            >
              <Plus className="w-4 h-4" />
              Add item
            </Button>
          </div>
          <div className="space-y-4">
            {howItems.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">
                    Order {index + 1}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveHowItem(index, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveHowItem(index, 1)}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveHowItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    setHowItems((prev) =>
                      prev.map((h) =>
                        h.id === item.id ? { ...h, title: e.target.value } : h,
                      ),
                    )
                  }
                  placeholder="Title"
                  className="mb-2"
                />
                <Textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    setHowItems((prev) =>
                      prev.map((h) =>
                        h.id === item.id
                          ? { ...h, description: e.target.value }
                          : h,
                      ),
                    )
                  }
                  placeholder="Description"
                />
              </div>
            ))}
            {howItems.length === 0 && (
              <p className="text-sm text-gray-500">
                No items yet. Add how you work, step by step.
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveHow}
              disabled={howSaving || disabledBecauseNoSupabase}
            >
              Save How I Work
            </Button>
          </div>
        </div>
      )}

      {/* 3. currently */}
      {activeTab === "currently" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Currently</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddCurrentItem}
            >
              <Plus className="w-4 h-4" />
              Add item
            </Button>
          </div>
          <div className="space-y-3">
            {currentItems.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-white"
              >
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveCurrentItem(index, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveCurrentItem(index, 1)}
                  >
                    ↓
                  </Button>
                </div>
                <Input
                  value={item.item}
                  onChange={(e) =>
                    setCurrentItems((prev) =>
                      prev.map((c) =>
                        c.id === item.id ? { ...c, item: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="Currently..."
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveCurrentItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {currentItems.length === 0 && (
              <p className="text-sm text-gray-500">
                Add what you&apos;re currently working on, reading, exploring,
                etc.
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveCurrent}
              disabled={currentSaving || disabledBecauseNoSupabase}
            >
              Save Currently
            </Button>
          </div>
        </div>
      )}

      {/* 4. projects (case study) */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] gap-10 items-start">
          {/* Left: list */}
          <div className="border border-gray-200 rounded-xl p-4 md:p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium">Projects</h2>
                <p className="text-xs text-gray-500">
                  Select a project to edit or create a new one.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4" />
                New project
              </Button>
            </div>
            <div className="space-y-3 max-h-[480px] overflow-auto pr-1">
              {loadingProjects && (
                <p className="text-xs text-gray-500">Loading…</p>
              )}
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleSelectProject(project)}
                  className={`w-full text-left px-3 py-3 rounded-lg border flex items-center justify-between gap-3 text-sm transition-colors ${
                    selectedProjectId === project.id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`truncate ${
                        selectedProjectId === project.id
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {project.title}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        selectedProjectId === project.id
                          ? "text-gray-200"
                          : "text-gray-500"
                      }`}
                    >
                      {project.company}
                      {project.location_period
                        ? ` · ${project.location_period}`
                        : ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`${
                      selectedProjectId === project.id
                        ? "text-gray-100 hover:text-white hover:bg-white/10"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    disabled={
                      deletingProjectId === project.id ||
                      disabledBecauseNoSupabase
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </button>
              ))}
              {!loadingProjects && projects.length === 0 && (
                <p className="text-sm text-gray-500">
                  No projects yet. Create your first project on the right.
                </p>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.16em] mb-1">
                  Editing
                </p>
                <p className="text-lg font-medium">{currentProjectTitle}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveProjectStep(step as 1 | 2 | 3)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                      activeProjectStep === step
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-900"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            <FormProvider {...projectFormMethods}>
              <Form {...projectFormMethods}>
                <form
                  className="space-y-8"
                  onSubmit={handleSubmit(onSubmitProject)}
                  autoComplete="off"
                >
                  {activeProjectStep === 1 && (
                    <div className="space-y-6">
                      {/* Basic info */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="subtitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subtitle</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Highlights */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Highlights</p>
                          <div className="space-y-2">
                            {highlights.map((highlight, index) => (
                              <div
                                key={`${highlight}-${index}`}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={highlight}
                                  onChange={(e) =>
                                    handleUpdateHighlight(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Highlight bullet"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRemoveHighlight(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddHighlight}
                            >
                              <Plus className="w-4 h-4" />
                              Add highlight
                            </Button>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Tags</p>
                          <div className="space-y-2">
                            {tags.map((tag, index) => (
                              <div
                                key={`${tag}-${index}`}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={tag}
                                  onChange={(e) =>
                                    handleUpdateTag(index, e.target.value)
                                  }
                                  placeholder="# tag"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRemoveTag(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddTag}
                            >
                              <Plus className="w-4 h-4" />
                              Add tag
                            </Button>
                          </div>
                        </div>

                        {/* Company / location_period / order */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="location_period"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location · Period</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="France · 2024–2026"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="order_index"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value ?? 0}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Featured + short description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <FormField
                            control={control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Featured on home</FormLabel>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                  />
                                  <span className="text-sm text-gray-600">
                                    Show in Featured Projects
                                  </span>
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="overview_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overview subtitle</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="overview_content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overview content</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={6}
                                  placeholder="Use line breaks to separate paragraphs."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Hero images */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Hero images</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          disabled={disabledBecauseNoSupabase}
                        />
                        {heroImages.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {heroImages.map((src, index) => (
                              <div key={src + index} className="space-y-2">
                                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                                  <ImageWithFallback
                                    src={src}
                                    alt={`Hero image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveHeroImage(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeProjectStep === 2 && (
                    <div className="space-y-8">
                      {/* Metrics */}
                      <div className="space-y-4">
                        <p className="text-sm font-medium">Key metrics (3)</p>
                        <Controller
                          control={control}
                          name="metrics"
                          render={({ field }) => (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {field.value.map((metric, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded-lg p-3 space-y-2"
                                >
                                  <Input
                                    value={metric.value}
                                    onChange={(e) => {
                                      const next = [...field.value];
                                      next[index] = {
                                        ...next[index],
                                        value: e.target.value,
                                      };
                                      field.onChange(next);
                                    }}
                                    placeholder="Value"
                                  />
                                  <Textarea
                                    value={metric.description}
                                    onChange={(e) => {
                                      const next = [...field.value];
                                      next[index] = {
                                        ...next[index],
                                        description: e.target.value,
                                      };
                                      field.onChange(next);
                                    }}
                                    rows={3}
                                    placeholder="Short description"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      </div>

                      {/* Challenge */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="challenge_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>The Challenge subtitle</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="challenge_content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>The Challenge content</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={6}
                                  placeholder="Use line breaks to separate paragraphs."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* My Role */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="my_role_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>My Role subtitle</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="my_role_content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>My Role content</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={6}
                                  placeholder="Explain your responsibilities and collaboration."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contributions */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">Contributions</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddContribution}
                          >
                            <Plus className="w-4 h-4" />
                            Add item
                          </Button>
                        </div>
                        <Controller
                          control={control}
                          name="contributions"
                          render={({ field }) => (
                            <div className="space-y-3">
                              {field.value.map((item, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded-lg p-3 space-y-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={item.number}
                                      onChange={(e) => {
                                        const next = [...field.value];
                                        next[index] = {
                                          ...next[index],
                                          number: e.target.value,
                                        };
                                        field.onChange(next);
                                      }}
                                      placeholder="01"
                                      className="w-20"
                                    />
                                    <Input
                                      value={item.title}
                                      onChange={(e) => {
                                        const next = [...field.value];
                                        next[index] = {
                                          ...next[index],
                                          title: e.target.value,
                                        };
                                        field.onChange(next);
                                      }}
                                      placeholder="Title"
                                    />
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        handleRemoveContribution(index)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => {
                                      const next = [...field.value];
                                      next[index] = {
                                        ...next[index],
                                        description: e.target.value,
                                      };
                                      field.onChange(next);
                                    }}
                                    rows={3}
                                    placeholder="Description"
                                  />
                                </div>
                              ))}
                              {field.value.length === 0 && (
                                <p className="text-xs text-gray-500">
                                  Add numbered contributions describing what you
                                  did on this project.
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {activeProjectStep === 3 && (
                    <div className="space-y-8">
                      {/* System decisions */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="system_decisions_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>System decisions title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              System decisions
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddSystemDecision}
                            >
                              <Plus className="w-4 h-4" />
                              Add decision
                            </Button>
                          </div>
                          <Controller
                            control={control}
                            name="system_decisions"
                            render={({ field }) => (
                              <div className="space-y-3">
                                {field.value.map((item, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-3 space-y-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={item.title}
                                        onChange={(e) => {
                                          const next = [...field.value];
                                          next[index] = {
                                            ...next[index],
                                            title: e.target.value,
                                          };
                                          field.onChange(next);
                                        }}
                                        placeholder="Decision title"
                                      />
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleRemoveSystemDecision(index)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <Textarea
                                        value={item.before}
                                        onChange={(e) => {
                                          const next = [...field.value];
                                          next[index] = {
                                            ...next[index],
                                            before: e.target.value,
                                          };
                                          field.onChange(next);
                                        }}
                                        rows={3}
                                        placeholder="Before"
                                      />
                                      <Textarea
                                        value={item.after}
                                        onChange={(e) => {
                                          const next = [...field.value];
                                          next[index] = {
                                            ...next[index],
                                            after: e.target.value,
                                          };
                                          field.onChange(next);
                                        }}
                                        rows={3}
                                        placeholder="After"
                                      />
                                    </div>
                                  </div>
                                ))}
                                {field.value.length === 0 && (
                                  <p className="text-xs text-gray-500">
                                    Capture before/after changes that
                                    illustrate system-level decisions.
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      {/* Focus */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="focus_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Focus title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="focus_content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Focus content</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder="Explain what you chose to focus on: clarity, speed, AI, etc."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Impact */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="impact_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Impact title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3">
                          <div className="flex items-center justify_between gap-2">
                            <p className="text-sm font-medium">Impact items</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddImpactItem}
                            >
                              <Plus className="w-4 h-4" />
                              Add impact
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {impactItems.map((item, index) => (
                              <div
                                key={`${item}-${index}`}
                                className="flex items-center gap-2"
                              >
                                <Textarea
                                  value={item}
                                  onChange={(e) => {
                                    const next = [...impactItems];
                                    next[index] = e.target.value;
                                    setValue("impact_items", next, {
                                      shouldDirty: true,
                                    });
                                  }}
                                  rows={2}
                                  placeholder="Impact item"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRemoveImpactItem(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            {impactItems.length === 0 && (
                              <p className="text-xs text-gray-500">
                                List concrete outcomes or signals of impact.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reflection */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="reflection"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reflection</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={5}
                                  placeholder="What did this project sharpen for you? What would you do differently next time?"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Next project */}
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="next_project_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Next project title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="next_project_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Next project id (UUID)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      {activeProjectStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setActiveProjectStep(
                              (prev) => (prev - 1) as 1 | 2 | 3,
                            )
                          }
                        >
                          Back
                        </Button>
                      )}
                      {activeProjectStep < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setActiveProjectStep(
                              (prev) => (prev + 1) as 1 | 2 | 3,
                            )
                          }
                        >
                          Next
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        savingProject || disabledBecauseNoSupabase || !projectDirty
                      }
                    >
                      Save project
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </div>
        </div>
      )}

      {/* 5. About */}
      {activeTab === "about" && (
        <form
          className="space-y-6 max-w-4xl"
          onSubmit={handleSaveAbout}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">
                  Intro text
                </label>
                <Textarea
                  rows={4}
                  value={aboutInfo.intro_text}
                  onChange={(e) =>
                    setAboutInfo((prev) => ({
                      ...prev,
                      intro_text: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Based in
                  </label>
                  <Input
                    value={aboutInfo.based_in}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        based_in: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Languages
                  </label>
                  <Input
                    value={aboutInfo.languages}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        languages: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Studies
                  </label>
                  <Textarea
                    rows={3}
                    value={aboutInfo.studies}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        studies: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Off the clock
                  </label>
                  <Textarea
                    rows={3}
                    value={aboutInfo.off_the_clock}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        off_the_clock: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Also me
                  </label>
                  <Textarea
                    rows={3}
                    value={aboutInfo.also_me}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        also_me: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Current obsession
                  </label>
                  <Textarea
                    rows={3}
                    value={aboutInfo.current_obsession}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        current_obsession: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAboutPhoto}
                  disabled={disabledBecauseNoSupabase}
                />
                {aboutInfo.photo_url && (
                  <div className="mt-3 w-full max-w-xs">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={aboutInfo.photo_url}
                        alt="About photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">
                  Resume file
                </label>
                <input
                  type="file"
                  onChange={handleUploadResume}
                  disabled={disabledBecauseNoSupabase}
                />
                {aboutInfo.resume_url && (
                  <p className="text-xs text-gray-600 mt-1 break-all">
                    {aboutInfo.resume_url}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Colleague tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">
                Colleague tags
              </label>
              <Textarea
                rows={2}
                value={aboutInfo.colleague_tags.join(", ")}
                onChange={(e) =>
                  setAboutInfo((prev) => ({
                    ...prev,
                    colleague_tags: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Comma-separated, e.g. Reliable, System thinker, Calm under pressure"
              />
            </div>

            {/* Skills / tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Skills
                </label>
                <Textarea
                  rows={3}
                  value={aboutInfo.skills.join(", ")}
                  onChange={(e) =>
                    setAboutInfo((prev) => ({
                      ...prev,
                      skills: e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Comma-separated list"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Tools
                </label>
                <Textarea
                  rows={3}
                  value={aboutInfo.tools.join(", ")}
                  onChange={(e) =>
                    setAboutInfo((prev) => ({
                      ...prev,
                      tools: e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Comma-separated list"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              size="sm"
              disabled={aboutSaving || disabledBecauseNoSupabase}
            >
              Save About
            </Button>
          </div>
        </form>
      )}

      {/* 6. Values */}
      {activeTab === "values" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Values</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddValue}
            >
              <Plus className="w-4 h-4" />
              Add value
            </Button>
          </div>
          <div className="space-y-4">
            {valuesItems.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.number}
                      onChange={(e) =>
                        setValuesItems((prev) =>
                          prev.map((v) =>
                            v.id === item.id
                              ? { ...v, number: e.target.value }
                              : v,
                          ),
                        )
                      }
                      className="w-16"
                    />
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setValuesItems((prev) =>
                          prev.map((v) =>
                            v.id === item.id
                              ? { ...v, title: e.target.value }
                              : v,
                          ),
                        )
                      }
                      placeholder="Title"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveValue(index, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveValue(index, 1)}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveValue(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    setValuesItems((prev) =>
                      prev.map((v) =>
                        v.id === item.id
                          ? { ...v, description: e.target.value }
                          : v,
                      ),
                    )
                  }
                  placeholder="Description"
                />
              </div>
            ))}
            {valuesItems.length === 0 && (
              <p className="text-sm text-gray-500">
                Add values that describe how you work and make decisions.
              </p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveValues}
              disabled={valuesSaving || disabledBecauseNoSupabase}
            >
              Save Values
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

