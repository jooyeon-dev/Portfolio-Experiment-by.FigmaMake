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
  tags: string[];
  company: string;
  location: string | null;
  period: string | null;
  confidentiality_notice: string | null;
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
  hero_images: string[];
  next_project_title: string | null;
  next_project_id: string | null;
};

type ProjectFormValues = {
  id: string | null;
  title: string;
  tags: string[];
  company: string;
  location: string;
  period: string;
  confidentiality_notice: string;
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
  hero_images: string[];
  next_project_title: string;
  next_project_id: string;
};

const EMPTY_METRICS: MetricInput[] = [
  { value: "", description: "" },
  { value: "", description: "" },
  { value: "", description: "" },
];

const DEFAULT_VALUES: ProjectFormValues = {
  id: null,
  title: "",
  tags: [],
  company: "",
  location: "",
  period: "",
  confidentiality_notice: "",
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
  hero_images: [],
  next_project_title: "",
  next_project_id: "",
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as
  | string
  | undefined;
const STORAGE_BUCKET = "portfolio-projects";

export function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formMethods = useForm<ProjectFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const form = formMethods;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty },
  } = form;

  const heroImages = watch("hero_images");
  const tags = watch("tags");
  const contributions = watch("contributions");
  const systemDecisions = watch("system_decisions");
  const impactItems = watch("impact_items");

  const disabledBecauseNoSupabase = !supabase;

  useEffect(() => {
    if (!supabase || !authorized) {
      setLoadingProjects(false);
      return;
    }

    let isMounted = true;

    async function load() {
      setLoadingProjects(true);
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setLoadingProjects(false);
        return;
      }

      setProjects(
        (data as AdminProject[] | null)?.map((row) => ({
          ...row,
          tags: row.tags ?? [],
          metrics: (row.metrics as MetricInput[] | null) ?? EMPTY_METRICS,
          contributions: (row.contributions as ContributionInput[] | null) ?? [],
          system_decisions:
            (row.system_decisions as SystemDecisionInput[] | null) ?? [],
          impact_items: row.impact_items ?? [],
          hero_images: row.hero_images ?? [],
        })) ?? [],
      );
      setLoadingProjects(false);
    }

    load();

    return () => {
      isMounted = false;
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

  function handleSelectProject(project: AdminProject) {
    setSelectedId(project.id);
    setActiveStep(1);
    reset({
      id: project.id,
      title: project.title ?? "",
      tags: project.tags ?? [],
      company: project.company ?? "",
      location: project.location ?? "",
      period: project.period ?? "",
      confidentiality_notice: project.confidentiality_notice ?? "",
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
      hero_images: project.hero_images ?? [],
      next_project_title: project.next_project_title ?? "",
      next_project_id: project.next_project_id ?? "",
    });
  }

  function handleNewProject() {
    setSelectedId(null);
    setActiveStep(1);
    reset(DEFAULT_VALUES);
  }

  async function onSubmit(values: ProjectFormValues) {
    if (!supabase) return;
    setSaving(true);

    const id = values.id ?? crypto.randomUUID();

    const payload = {
      id,
      title: values.title,
      tags: values.tags,
      company: values.company,
      location: values.location || null,
      period: values.period || null,
      confidentiality_notice: values.confidentiality_notice || null,
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
      hero_images: values.hero_images ?? [],
      next_project_title: values.next_project_title || null,
      next_project_id: values.next_project_id || null,
    };

    const { error } = await supabase
      .from("portfolio_projects")
      .upsert(payload, { onConflict: "id" });

    setSaving(false);

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    setSelectedId(id);
    reset({ ...values, id });

    // Refresh list
    const { data: refreshed } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(
      (refreshed as AdminProject[] | null)?.map((row) => ({
        ...row,
        tags: row.tags ?? [],
        metrics: (row.metrics as MetricInput[] | null) ?? EMPTY_METRICS,
        contributions: (row.contributions as ContributionInput[] | null) ?? [],
        system_decisions:
          (row.system_decisions as SystemDecisionInput[] | null) ?? [],
        impact_items: row.impact_items ?? [],
        hero_images: row.hero_images ?? [],
      })) ?? [],
    );
  }

  async function handleDelete(id: string) {
    if (!supabase) return;
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id);
    setDeletingId(null);

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      handleNewProject();
    }
  }

  async function handleHeroImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const currentId = getValues("id") ?? crypto.randomUUID();

    if (!getValues("id")) {
      setValue("id", currentId);
    }

    const path = `hero/${currentId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error(uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    const url = publicUrlData.publicUrl;

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

  function handleAddContribution() {
    setValue(
      "contributions",
      [
        ...contributions,
        { number: String(contributions.length + 1).padStart(2, "0"), title: "", description: "" },
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

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
          <h1 className="text-2xl mb-2">Admin Access</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter the admin password to manage portfolio projects.
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
      <div className="flex items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2">Admin – Projects</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage Supabase portfolio projects and case study content.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleNewProject}>
          <Plus className="w-4 h-4" />
          New project
        </Button>
      </div>

      {disabledBecauseNoSupabase && (
        <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          Supabase is not configured. Set{" "}
          <span className="font-mono">VITE_SUPABASE_URL</span> and{" "}
          <span className="font-mono">VITE_SUPABASE_ANON_KEY</span> to enable
          admin actions.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] gap-10 items-start">
        {/* Left: list */}
        <div className="border border-gray-200 rounded-xl p-4 md:p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Projects</h2>
            {loadingProjects && (
              <span className="text-xs text-gray-500">Loading…</span>
            )}
          </div>
          <div className="space-y-3 max-h-[480px] overflow-auto pr-1">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelectProject(project)}
                className={`w-full text-left px-3 py-3 rounded-lg border flex items-center justify-between gap-3 text-sm transition-colors ${
                  selectedId === project.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`truncate ${
                      selectedId === project.id ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {project.title}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      selectedId === project.id
                        ? "text-gray-200"
                        : "text-gray-500"
                    }`}
                  >
                    {project.company}
                    {project.period ? ` · ${project.period}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`${
                    selectedId === project.id
                      ? "text-gray-100 hover:text-white hover:bg-white/10"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  disabled={deletingId === project.id || disabledBecauseNoSupabase}
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

        {/* Right: form (3 steps) */}
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
                  onClick={() => setActiveStep(step as 1 | 2 | 3)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                    activeStep === step
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-300 text-gray-600 hover:border-gray-900"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          <FormProvider {...formMethods}>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                {activeStep === 1 && (
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

                      {/* Company / location / period */}
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
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="period"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Period</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="2024–2026" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name="confidentiality_notice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confidentiality notice</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                placeholder="Short note about anonymized or modified details."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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

                {activeStep === 2 && (
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
                                    onClick={() => handleRemoveContribution(index)}
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

                {activeStep === 3 && (
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
                          <p className="text-sm font-medium">System decisions</p>
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
                                  Capture before/after changes that illustrate
                                  system-level decisions.
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
                        <div className="flex items-center justify-between gap-2">
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
                    {activeStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveStep(
                            (prev) => (prev - 1) as 1 | 2 | 3,
                          )
                        }
                      >
                        Back
                      </Button>
                    )}
                    {activeStep < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveStep(
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
                    disabled={saving || disabledBecauseNoSupabase || !isDirty}
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
    </div>
  );
}

