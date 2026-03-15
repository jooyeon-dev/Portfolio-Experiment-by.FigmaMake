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

type AdminTab = "home" | "projects" | "about" | "settings";

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
  is_available: boolean;
  availability_text: string;
  footer_description: string;
  footer_show_linkedin: boolean;
  footer_show_email: boolean;
  hero_headline: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  contact_email: string;
  linkedin_url: string;
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

type AboutEducationItem = {
  school: string;
  major: string;
  period: string;
  location: string;
  description: string;
};

type AboutInfo = {
  id: string | null;
  photo_url: string;
  intro_text: string;
  intro_subtitle: string;
  resume_url: string;
  off_the_clock: string;
  also_me: string;
  current_obsession: string;
  colleague_tags: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    location: string;
    description: string;
  }[];
  education: AboutEducationItem[];
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
  is_available: true,
  availability_text: "",
  footer_description: "",
  footer_show_linkedin: true,
  footer_show_email: true,
  hero_headline: "",
  hero_description: "",
  hero_cta_primary: "",
  hero_cta_secondary: "",
  contact_email: "",
  linkedin_url: "",
};

const DEFAULT_ABOUT: AboutInfo = {
  id: null,
  photo_url: "",
  intro_text: "",
  intro_subtitle: "",
  resume_url: "",
  off_the_clock: "",
  also_me: "",
  current_obsession: "",
  colleague_tags: [],
  experience: [],
  education: [
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
  ],
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

  const [activeTab, setActiveTab] = useState<AdminTab>("home");

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
  const [aboutSaveStatus, setAboutSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [howSaveStatus, setHowSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [currentSaveStatus, setCurrentSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [siteInfoSaveStatus, setSiteInfoSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [valuesSaveStatus, setValuesSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [projectSaveStatus, setProjectSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");
  const [aboutPhotoFiles, setAboutPhotoFiles] = useState<string[]>([]);
  const [resumeFiles, setResumeFiles] = useState<string[]>([]);

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
          is_available:
            typeof row.is_available === "boolean" ? row.is_available : true,
          availability_text: row.availability_text ?? "",
          footer_description: row.footer_description ?? "",
          footer_show_linkedin:
            typeof row.footer_show_linkedin === "boolean"
              ? row.footer_show_linkedin
              : true,
          footer_show_email:
            typeof row.footer_show_email === "boolean"
              ? row.footer_show_email
              : true,
          hero_headline: row.hero_headline ?? "",
          hero_description: row.hero_description ?? "",
          hero_cta_primary: row.hero_cta_primary ?? "",
          hero_cta_secondary: row.hero_cta_secondary ?? "",
          contact_email: row.contact_email ?? "",
          linkedin_url: row.linkedin_url ?? "",
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
        const educationSrc = row.education as AboutEducationItem[] | null;
        setAboutInfo({
          id: row.id,
          photo_url: row.photo_url ?? "",
          intro_text: row.intro_text ?? "",
          intro_subtitle: row.intro_subtitle ?? "",
          resume_url: row.resume_url ?? "",
          off_the_clock: row.off_the_clock ?? "",
          also_me: row.also_me ?? "",
          current_obsession: row.current_obsession ?? "",
          colleague_tags: row.colleague_tags ?? [],
          experience: ((row.experience as any[] | null) ?? []).map(
            (item: any) => ({
              role: item.role ?? "",
              company: item.company ?? "",
              period: item.period ?? "",
              location: item.location ?? "",
              description: item.description ?? "",
            }),
          ),
          education:
            educationSrc && educationSrc.length > 0
              ? educationSrc.map((item) => ({
                  school: item.school ?? "",
                  major: item.major ?? "",
                  period: item.period ?? "",
                  location: item.location ?? "",
                  description: item.description ?? "",
                }))
              : DEFAULT_ABOUT.education,
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

      // Load existing storage files for About photos and resumes
      const [photoList, resumeList] = await Promise.all([
        supabase.storage.from(STORAGE_BUCKET).list("about-photo"),
        supabase.storage.from(STORAGE_BUCKET).list("resume"),
      ]);

      if (!cancelled) {
        if (photoList.data) {
          setAboutPhotoFiles(
            photoList.data.map((f) =>
              supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(`about-photo/${f.name}`).data.publicUrl,
            ),
          );
        }
        if (resumeList.data) {
          setResumeFiles(
            resumeList.data.map((f) =>
              supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(`resume/${f.name}`).data.publicUrl,
            ),
          );
        }
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

  async function deleteFromStorage(publicUrl: string) {
    if (!supabase) return;
    const prefix = `/object/public/${STORAGE_BUCKET}/`;
    const i = publicUrl.indexOf(prefix);
    if (i === -1) return;
    const path = publicUrl.slice(i + prefix.length);
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
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
      setSiteInfoSaveStatus("error");
      setTimeout(() => setSiteInfoSaveStatus("idle"), 2000);
      return;
    }
    setSiteInfo((prev) => ({ ...prev, id }));
    setSiteInfoSaveStatus("saved");
    setTimeout(() => setSiteInfoSaveStatus("idle"), 2000);
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
    let hadError = false;

    if (idsToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("how_i_work")
        .delete()
        .in("id", idsToDelete);
      if (delErr) {
        // eslint-disable-next-line no-console
        console.error(delErr);
        hadError = true;
      }
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
        hadError = true;
      }
    }

    setHowInitialIds(idsNow);
    setHowSaving(false);
    if (hadError) {
      setHowSaveStatus("error");
      setTimeout(() => setHowSaveStatus("idle"), 2000);
    } else {
      setHowSaveStatus("saved");
      setTimeout(() => setHowSaveStatus("idle"), 2000);
    }
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
    let hadError = false;

    if (idsToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("currently")
        .delete()
        .in("id", idsToDelete);
      if (delErr) {
        // eslint-disable-next-line no-console
        console.error(delErr);
        hadError = true;
      }
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
        hadError = true;
      }
    }

    setCurrentInitialIds(idsNow);
    setCurrentSaving(false);
    if (hadError) {
      setCurrentSaveStatus("error");
      setTimeout(() => setCurrentSaveStatus("idle"), 2000);
    } else {
      setCurrentSaveStatus("saved");
      setTimeout(() => setCurrentSaveStatus("idle"), 2000);
    }
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
      setProjectSaveStatus("error");
      setTimeout(() => setProjectSaveStatus("idle"), 2000);
      return;
    }

    setProjectSaveStatus("saved");
    setTimeout(() => setProjectSaveStatus("idle"), 2000);
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
    setAboutSaveStatus("idle");
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
      setAboutSaveStatus("error");
      setTimeout(() => setAboutSaveStatus("idle"), 2000);
      return;
    }
    setAboutInfo((prev) => ({ ...prev, id }));
    setAboutSaveStatus("saved");
    setTimeout(() => setAboutSaveStatus("idle"), 2000);
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
    setAboutPhotoFiles((prev) => [...prev, url]);
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
    setResumeFiles((prev) => [...prev, url]);
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
    let hadError = false;

    if (idsToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("values")
        .delete()
        .in("id", idsToDelete);
      if (delErr) {
        // eslint-disable-next-line no-console
        console.error(delErr);
        hadError = true;
      }
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
        hadError = true;
      }
    }

    setValuesInitialIds(idsNow);
    setValuesSaving(false);
    if (hadError) {
      setValuesSaveStatus("error");
      setTimeout(() => setValuesSaveStatus("idle"), 2000);
    } else {
      setValuesSaveStatus("saved");
      setTimeout(() => setValuesSaveStatus("idle"), 2000);
    }
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
          { id: "home", label: "Home" },
          { id: "projects", label: "Projects" },
          { id: "about", label: "About" },
          { id: "settings", label: "Settings" },
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

      {/* 1. Home tab: Hero + How I Work + Currently + Values */}
      {activeTab === "home" && (
        <div className="space-y-10">
          {/* Hero section */}
          <form
            className="space-y-6 max-w-3xl border border-gray-200 rounded-xl p-5 bg-white"
            onSubmit={handleSaveSiteInfo}
            autoComplete="off"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Hero</h2>
                <p className="text-xs text-gray-500">
                  Headline, description, and primary calls to action on the
                  home page.
                </p>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={siteSaving || disabledBecauseNoSupabase}
              >
                {siteInfoSaveStatus === "saved"
                  ? "✓ Saved!"
                  : siteInfoSaveStatus === "error"
                    ? "✗ Failed"
                    : "Save hero"}
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
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
                  placeholder="Product Designer crafting meaningful digital experiences"
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
                  placeholder="Short paragraph about what you do and how you work."
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
            </div>
          </form>

          {/* How I Work */}
          <div className="space-y-6 max-w-3xl border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">How I Work</h2>
                <p className="text-xs text-gray-500">
                  Outline your process in a few clear steps.
                </p>
              </div>
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
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {howItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white"
                >
                  <div className="flex items-center justify_between gap-2">
                    <p className="text-xs text-gray-500">
                      Step {index + 1}
                    </p>
                    <div className="flex items-center gap-1 ml-auto">
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
                          h.id === item.id
                            ? { ...h, title: e.target.value }
                            : h,
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
                {howSaveStatus === "saved"
                  ? "✓ Saved!"
                  : howSaveStatus === "error"
                    ? "✗ Failed"
                    : "Save How I Work"}
              </Button>
            </div>
          </div>

          {/* Currently */}
          <div className="space-y-6 max-w-3xl border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Currently</h2>
                <p className="text-xs text-gray-500">
                  What you&apos;re currently working on, reading, or exploring.
                </p>
              </div>
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
            <div className="space-y-3 pt-4 border-t border-gray-200">
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
                          c.id === item.id
                            ? { ...c, item: e.target.value }
                            : c,
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
                {currentSaveStatus === "saved"
                  ? "✓ Saved!"
                  : currentSaveStatus === "error"
                    ? "✗ Failed"
                    : "Save Currently"}
              </Button>
            </div>
          </div>

          {/* Principles & Values */}
          <div className="space-y-6 max-w-3xl border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Principles &amp; Values</h2>
                <p className="text-xs text-gray-500">
                  The principles that guide how you design and work.
                </p>
              </div>
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
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {valuesItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">
                      #{index + 1} Value
                    </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.4fr)_minmax(0,2fr)] gap-3">
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
                      placeholder="01"
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
                      placeholder="Value title"
                    />
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
                  No values yet. Add the principles that matter most to you.
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
                {valuesSaveStatus === "saved"
                  ? "✓ Saved!"
                  : valuesSaveStatus === "error"
                    ? "✗ Failed"
                    : "Save values"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Projects (case study) */}
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
                      {projectSaveStatus === "saved"
                        ? "✓ Saved!"
                        : projectSaveStatus === "error"
                          ? "✗ Failed"
                          : "Save project"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </FormProvider>
          </div>
        </div>
      )}

      {/* 3. About */}
      {activeTab === "about" && (
        <form
          className="space-y-8 max-w-4xl"
          onSubmit={handleSaveAbout}
          autoComplete="off"
        >
          {/* Profile */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Profile</h2>
              <p className="text-xs text-gray-500">
                Photo, short introduction, and resume file.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start pt-4 border-t border-gray-200">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">
                    Page subtitle
                  </label>
                  <Input
                    value={aboutInfo.intro_subtitle}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        intro_subtitle: e.target.value,
                      }))
                    }
                    placeholder="Passionate about creating intuitive and delightful user experiences"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">
                    Photo
                  </label>

                  {/* Existing files */}
                  {aboutPhotoFiles.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">
                        또는 기존 파일에서 선택
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {aboutPhotoFiles.map((url) => {
                          const isSelected = aboutInfo.photo_url === url;
                          return (
                            <button
                              key={url}
                              type="button"
                              onClick={() =>
                                setAboutInfo((prev) => ({
                                  ...prev,
                                  photo_url: url,
                                }))
                              }
                              className={`relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border ${
                                isSelected
                                  ? "border-2 border-gray-900"
                                  : "border-transparent"
                              }`}
                            >
                              <ImageWithFallback
                                src={url}
                                alt="About photo option"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFromStorage(url);
                                  setAboutPhotoFiles((prev) =>
                                    prev.filter((f) => f !== url)
                                  );
                                  if (aboutInfo.photo_url === url) {
                                    setAboutInfo((prev) => ({
                                      ...prev,
                                      photo_url: "",
                                    }));
                                  }
                                }}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                                aria-label="Delete photo"
                              >
                                ×
                              </button>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Upload new */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAboutPhoto}
                    disabled={disabledBecauseNoSupabase}
                  />
                  {aboutInfo.photo_url && (
                    <div className="mt-3 w-full max-w-xs space-y-2">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={aboutInfo.photo_url}
                          alt="About photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setAboutInfo((prev) => ({
                            ...prev,
                            photo_url: "",
                          }))
                        }
                      >
                        Remove photo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">
                    Resume file
                  </label>

                  {/* Existing resume files */}
                  {resumeFiles.length > 0 && (
                    <div className="mb-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        또는 기존 파일에서 선택
                      </p>
                      <ul className="space-y-1 text-xs">
                        {resumeFiles.map((url) => {
                          const fileName =
                            url.split("/").pop()?.split("-").slice(3).join("-") ??
                            url;
                          const isSelected = aboutInfo.resume_url === url;
                          return (
                            <li key={url}>
                              <button
                                type="button"
                                onClick={() =>
                                  setAboutInfo((prev) => ({
                                    ...prev,
                                    resume_url: url,
                                  }))
                                }
                                className={`text-left hover:text-gray-900 ${
                                  isSelected
                                    ? "font-medium text-gray-900"
                                    : "text-gray-600"
                                }`}
                              >
                                {fileName}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Upload new */}
                  <input
                    type="file"
                    onChange={handleUploadResume}
                    disabled={disabledBecauseNoSupabase}
                  />
                  {aboutInfo.resume_url && (
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="text-emerald-600 font-medium">
                        ✓ Resume uploaded
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="h-6 px-2 text-gray-500 hover:text-gray-900"
                        onClick={() =>
                          setAboutInfo((prev) => ({
                            ...prev,
                            resume_url: "",
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Education</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setAboutInfo((prev) => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      {
                        school: "",
                        major: "",
                        period: "",
                        location: "",
                        description: "",
                      },
                    ],
                  }))
                }
              >
                <Plus className="w-4 h-4" />
                Add education
              </Button>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {aboutInfo.education.map((item, index) => (
                <div
                  key={`${item.school}-${item.period}-${index}`}
                  className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">
                      #{index + 1} Education
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          education: prev.education.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="School"
                      value={item.school}
                      onChange={(e) =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          education: prev.education.map((edu, i) =>
                            i === index
                              ? { ...edu, school: e.target.value }
                              : edu,
                          ),
                        }))
                      }
                    />
                    <Input
                      placeholder="Major"
                      value={item.major}
                      onChange={(e) =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          education: prev.education.map((edu, i) =>
                            i === index
                              ? { ...edu, major: e.target.value }
                              : edu,
                          ),
                        }))
                      }
                    />
                  </div>
                  <Input
                    placeholder="Period"
                    value={item.period}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        education: prev.education.map((edu, i) =>
                          i === index
                            ? { ...edu, period: e.target.value }
                            : edu,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        education: prev.education.map((edu, i) =>
                          i === index
                            ? { ...edu, location: e.target.value }
                            : edu,
                        ),
                      }))
                    }
                  />
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        education: prev.education.map((edu, i) =>
                          i === index
                            ? { ...edu, description: e.target.value }
                            : edu,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
              {aboutInfo.education.length === 0 && (
                <p className="text-xs text-gray-500">
                  No education items yet. Add your degrees and programs here.
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Experience</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setAboutInfo((prev) => ({
                    ...prev,
                    experience: [
                      ...prev.experience,
                      {
                        role: "",
                        company: "",
                        period: "",
                        location: "",
                        description: "",
                      },
                    ],
                  }))
                }
              >
                <Plus className="w-4 h-4" />
                Add experience
              </Button>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-200">
              {aboutInfo.experience.map((item, index) => (
                <div
                  key={`${item.role}-${item.company}-${index}`}
                  className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">
                      #{index + 1} Experience
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          experience: prev.experience.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Role"
                      value={item.role}
                      onChange={(e) =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          experience: prev.experience.map((exp, i) =>
                            i === index
                              ? { ...exp, role: e.target.value }
                              : exp,
                          ),
                        }))
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={item.company}
                      onChange={(e) =>
                        setAboutInfo((prev) => ({
                          ...prev,
                          experience: prev.experience.map((exp, i) =>
                            i === index
                              ? { ...exp, company: e.target.value }
                              : exp,
                          ),
                        }))
                      }
                    />
                  </div>
                  <Input
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        experience: prev.experience.map((exp, i) =>
                          i === index
                            ? { ...exp, location: e.target.value }
                            : exp,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Period"
                    value={item.period}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        experience: prev.experience.map((exp, i) =>
                          i === index
                            ? { ...exp, period: e.target.value }
                            : exp,
                        ),
                      }))
                    }
                  />
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setAboutInfo((prev) => ({
                        ...prev,
                        experience: prev.experience.map((exp, i) =>
                          i === index
                            ? { ...exp, description: e.target.value }
                            : exp,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
              {aboutInfo.experience.length === 0 && (
                <p className="text-xs text-gray-500">
                  No experience items yet. Add your roles and responsibilities
                  here.
                </p>
              )}
            </div>
          </div>

          {/* Skills & Tools */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-lg font-medium">Skills &amp; Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div className="space-y-2">
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
              <div className="space-y-2">
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

            <div className="space-y-2 pt-4 border-t border-gray-200">
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
          </div>

          {/* Beyond the Portfolio */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-lg font-medium">Beyond the Portfolio</h2>
            <p className="text-xs text-gray-500">
              Details that make you more than just your case studies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              size="sm"
              disabled={aboutSaving || disabledBecauseNoSupabase}
            >
              {aboutSaveStatus === "saved"
                ? "✓ Saved!"
                : aboutSaveStatus === "error"
                  ? "✗ Failed"
                  : "Save About"}
            </Button>
          </div>
        </form>
      )}

      {/* 4. Settings */}
      {activeTab === "settings" && (
        <form
          className="space-y-8 max-w-3xl"
          onSubmit={handleSaveSiteInfo}
          autoComplete="off"
        >
          {/* Profile */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-lg font-medium">Profile</h2>
            <div className="pt-2 border-t border-gray-200">
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={siteInfo.name}
                onChange={(e) =>
                  setSiteInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Contact (includes Location and Availability) */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
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
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                value={siteInfo.location}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g. Seoul, South Korea"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="is_available"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  checked={siteInfo.is_available}
                  onChange={(e) =>
                    setSiteInfo((prev) => ({
                      ...prev,
                      is_available: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="is_available"
                  className="text-sm font-medium text-gray-700 select-none"
                >
                  Currently available
                </label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Availability text
                </label>
                <Textarea
                  rows={2}
                  value={siteInfo.availability_text}
                  onChange={(e) =>
                    setSiteInfo((prev) => ({
                      ...prev,
                      availability_text: e.target.value,
                    }))
                  }
                  placeholder="e.g. Currently open to junior product design opportunities."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-lg font-medium">Footer</h2>
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium mb-1 block">
                Footer description
              </label>
              <Textarea
                rows={3}
                value={siteInfo.footer_description}
                onChange={(e) =>
                  setSiteInfo((prev) => ({
                    ...prev,
                    footer_description: e.target.value,
                  }))
                }
                placeholder="Short sentence to show in footer. If empty, your role will be used."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  checked={siteInfo.footer_show_linkedin}
                  onChange={(e) =>
                    setSiteInfo((prev) => ({
                      ...prev,
                      footer_show_linkedin: e.target.checked,
                    }))
                  }
                />
                Show LinkedIn icon
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  checked={siteInfo.footer_show_email}
                  onChange={(e) =>
                    setSiteInfo((prev) => ({
                      ...prev,
                      footer_show_email: e.target.checked,
                    }))
                  }
                />
                Show email icon
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              size="sm"
              disabled={siteSaving || disabledBecauseNoSupabase}
            >
              {siteInfoSaveStatus === "saved"
                ? "✓ Saved!"
                : siteInfoSaveStatus === "error"
                  ? "✗ Failed"
                  : "Save settings"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

