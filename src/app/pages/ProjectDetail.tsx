import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../lib/supabaseClient";

type Metric = {
  value: string;
  description: string;
};

type Contribution = {
  number: string;
  title: string;
  description: string;
};

type SystemDecision = {
  title: string;
  before: string;
  after: string;
};

interface ProjectDetailData {
  id: string;
  title: string;
  tags: string[];
  company: string;
  location: string | null;
  period: string | null;
  confidentialityNotice: string | null;
  overviewTitle: string | null;
  overviewContent: string | null;
  metrics: Metric[];
  challengeTitle: string | null;
  challengeContent: string | null;
  myRoleTitle: string | null;
  myRoleContent: string | null;
  contributions: Contribution[];
  systemDecisionsTitle: string | null;
  systemDecisions: SystemDecision[];
  focusTitle: string | null;
  focusContent: string | null;
  impactTitle: string | null;
  impactItems: string[];
  reflection: string | null;
  heroImages: string[];
  nextProjectTitle: string | null;
  nextProjectId: string | null;
}

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!id) {
        setError("Missing project id");
        setLoading(false);
        return;
      }

      if (!supabase) {
        setError("Supabase client is not configured.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("portfolio_projects")
        .select(
          [
            "id",
            "title",
            "tags",
            "company",
            "location",
            "period",
            "confidentiality_notice",
            "overview_title",
            "overview_content",
            "metrics",
            "challenge_title",
            "challenge_content",
            "my_role_title",
            "my_role_content",
            "contributions",
            "system_decisions_title",
            "system_decisions",
            "focus_title",
            "focus_content",
            "impact_title",
            "impact_items",
            "reflection",
            "hero_images",
            "next_project_title",
            "next_project_id",
          ].join(", "),
        )
        .eq("id", id)
        .maybeSingle();

      if (!isMounted) return;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      const metricsArray: Metric[] = Array.isArray(data.metrics)
        ? data.metrics.map((m: any) => ({
            value: String(m.value ?? ""),
            description: String(m.description ?? ""),
          }))
        : [];

      const contributionsArray: Contribution[] = Array.isArray(data.contributions)
        ? data.contributions.map((c: any) => ({
            number: String(c.number ?? ""),
            title: String(c.title ?? ""),
            description: String(c.description ?? ""),
          }))
        : [];

      const systemDecisionsArray: SystemDecision[] = Array.isArray(
        data.system_decisions,
      )
        ? data.system_decisions.map((d: any) => ({
            title: String(d.title ?? ""),
            before: String(d.before ?? ""),
            after: String(d.after ?? ""),
          }))
        : [];

      const impactItemsArray: string[] = Array.isArray(data.impact_items)
        ? data.impact_items.map((item: any) => String(item))
        : [];

      const heroImagesArray: string[] = Array.isArray(data.hero_images)
        ? data.hero_images.map((img: any) => String(img))
        : [];

      const mapped: ProjectDetailData = {
        id: data.id as string,
        title: data.title as string,
        tags: (data.tags as string[]) ?? [],
        company: (data.company as string | null) ?? "",
        location: (data.location as string | null) ?? null,
        period: (data.period as string | null) ?? null,
        confidentialityNotice:
          (data.confidentiality_notice as string | null) ?? null,
        overviewTitle: (data.overview_title as string | null) ?? null,
        overviewContent: (data.overview_content as string | null) ?? null,
        metrics: metricsArray.slice(0, 3),
        challengeTitle: (data.challenge_title as string | null) ?? null,
        challengeContent: (data.challenge_content as string | null) ?? null,
        myRoleTitle: (data.my_role_title as string | null) ?? null,
        myRoleContent: (data.my_role_content as string | null) ?? null,
        contributions: contributionsArray,
        systemDecisionsTitle:
          (data.system_decisions_title as string | null) ?? null,
        systemDecisions: systemDecisionsArray,
        focusTitle: (data.focus_title as string | null) ?? null,
        focusContent: (data.focus_content as string | null) ?? null,
        impactTitle: (data.impact_title as string | null) ?? null,
        impactItems: impactItemsArray,
        reflection: (data.reflection as string | null) ?? null,
        heroImages: heroImagesArray,
        nextProjectTitle: (data.next_project_title as string | null) ?? null,
        nextProjectId: data.next_project_id
          ? String(data.next_project_id)
          : null,
      };

      setProject(mapped);
      setLoading(false);
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!loading && !project && !error) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 hover:gap-3 transition-all"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </Link>

      {error ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl mb-2">Couldn’t load project</h1>
          <p className="text-gray-600 mb-6">{error}</p>

          {error.includes("Supabase client is not configured") && (
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p className="font-medium text-gray-900">Fix</p>
              <p>
                Create a <span className="font-mono">.env.local</span> file in
                the project root and set:
              </p>
              <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto text-xs leading-relaxed">
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
              </pre>
              <p>Then restart the dev server.</p>
            </div>
          )}

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all"
          >
            Back to Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : loading || !project ? (
        <div className="space-y-8">
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                key={index}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="aspect-[16/10] w-full rounded-lg bg-gray-200 animate-pulse" />
        </div>
      ) : (
        <>
          {/* 1. Hero images */}
          {project.heroImages.length > 0 && (
            <div className="mb-10 space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                <ImageWithFallback
                  src={project.heroImages[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {project.heroImages.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.heroImages.slice(1).map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100"
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${project.title} visual ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Project basics */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="space-y-1 text-gray-600 mb-4">
              <p className="text-lg font-medium">{project.company}</p>
              {(project.location || project.period) && (
                <p className="text-sm">
                  {[project.location, project.period]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>

            {project.confidentialityNotice && (
              <p className="text-xs text-gray-500 max-w-2xl">
                {project.confidentialityNotice}
              </p>
            )}
          </div>

          {/* 3. Overview */}
          {(project.overviewTitle || project.overviewContent) && (
            <section className="mb-16 pb-12 border-b border-gray-200">
              {project.overviewTitle && (
                <h2 className="text-3xl mb-4">{project.overviewTitle}</h2>
              )}
              {project.overviewContent && (
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.overviewContent}
                </p>
              )}
            </section>
          )}

          {/* 4. Key metrics */}
          {project.metrics.length > 0 && (
            <section className="mb-16 pb-16 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {project.metrics.map((metric, index) => (
                  <div key={`${metric.value}-${index}`} className="space-y-3">
                    <p className="text-4xl md:text-5xl font-semibold">
                      {metric.value}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. The Challenge */}
          {(project.challengeTitle || project.challengeContent) && (
            <section className="mb-16 space-y-4">
              {project.challengeTitle && (
                <h2 className="text-3xl mb-2">The Challenge</h2>
              )}
              {project.challengeTitle && (
                <h3 className="text-xl text-gray-900">
                  {project.challengeTitle}
                </h3>
              )}
              {project.challengeContent && (
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.challengeContent}
                </p>
              )}
            </section>
          )}

          {/* 6. My Role */}
          {(project.myRoleTitle ||
            project.myRoleContent ||
            project.contributions.length > 0) && (
            <section className="mb-16 space-y-8">
              <div>
                <h2 className="text-3xl mb-2">My Role</h2>
                {project.myRoleTitle && (
                  <h3 className="text-xl text-gray-900">
                    {project.myRoleTitle}
                  </h3>
                )}
                {project.myRoleContent && (
                  <p className="text-lg text-gray-600 leading-relaxed mt-3 whitespace-pre-line">
                    {project.myRoleContent}
                  </p>
                )}
              </div>

              {project.contributions.length > 0 && (
                <div className="space-y-4">
                  {project.contributions.map((item) => (
                    <div
                      key={item.number + item.title}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm flex-shrink-0">
                        {item.number}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 7. System Decisions */}
          {(project.systemDecisionsTitle ||
            project.systemDecisions.length > 0) && (
            <section className="mb-16 space-y-6">
              <h2 className="text-3xl">
                {project.systemDecisionsTitle ?? "System Decisions"}
              </h2>

              <div className="space-y-6">
                {project.systemDecisions.map((decision) => (
                  <div
                    key={decision.title}
                    className="border border-gray-200 rounded-lg p-6 md:p-8"
                  >
                    <h3 className="text-xl mb-4">{decision.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2">
                          Before
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {decision.before}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 mb-2">
                          After
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {decision.after}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 8. Focus */}
          {(project.focusTitle || project.focusContent) && (
            <section className="mb-16 space-y-4">
              <h2 className="text-3xl mb-2">Focus</h2>
              {project.focusTitle && (
                <h3 className="text-xl text-gray-900">
                  {project.focusTitle}
                </h3>
              )}
              {project.focusContent && (
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.focusContent}
                </p>
              )}
            </section>
          )}

          {/* 9. Impact */}
          {(project.impactTitle || project.impactItems.length > 0) && (
            <section className="mb-16 space-y-4">
              <h2 className="text-3xl mb-2">Impact</h2>
              {project.impactTitle && (
                <h3 className="text-xl text-gray-900">
                  {project.impactTitle}
                </h3>
              )}
              {project.impactItems.length > 0 && (
                <ul className="space-y-2 text-lg text-gray-600 leading-relaxed">
                  {project.impactItems.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* 10. Reflection */}
          {project.reflection && (
            <section className="mb-16 space-y-4">
              <h2 className="text-3xl mb-2">Reflection</h2>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {project.reflection}
              </p>
            </section>
          )}

          {/* 11. Next project */}
          <div className="mt-20 pt-12 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            {project.nextProjectTitle && project.nextProjectId ? (
              <>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1">
                    Next Project
                  </p>
                  <p className="text-2xl md:text-3xl">
                    {project.nextProjectTitle}
                  </p>
                </div>
                <Link
                  to={`/projects/${project.nextProjectId}`}
                  className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all text-sm md:text-base"
                >
                  VIEW PROJECT
                  <ArrowRight size={18} />
                </Link>
              </>
            ) : (
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all"
              >
                View All Projects
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
