import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useFeaturedProjects } from "../hooks/useFeaturedProjects";
import { useHomeContent } from "../hooks/useHomeContent";

export function Home() {
  const navigate = useNavigate();
  const { projects: featuredProjects, loading: projectsLoading, error } =
    useFeaturedProjects(3);
  const { how, currently, values, about, hero, loading } = useHomeContent();

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl">
          {loading ? (
            <div className="space-y-4 max-w-4xl">
              <div className="h-16 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="flex gap-3 mt-4">
                <div className="h-12 w-36 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-12 w-36 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
                {hero?.headline ??
                  "Product Designer crafting meaningful digital experiences"}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                {hero?.description ??
                  "I design user-centered products that solve real problems and delight users."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {hero?.ctaPrimary ?? "View my work"}
                  <ArrowRight size={20} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/about");
                    setTimeout(() => {
                      const tryScroll = (attempts: number) => {
                        const el = document.getElementById("connect");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        } else if (attempts > 0) {
                          setTimeout(() => tryScroll(attempts - 1), 100);
                        }
                      };
                      tryScroll(5);
                    }, 250);
                  }}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full border border-gray-300 hover:border-gray-900 transition-colors"
                >
                  {hero?.ctaSecondary ?? "Get in touch"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How I Work */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl mb-3">How I Work</h2>
              <p className="text-gray-600 max-w-xl">
                A snapshot of how I approach complex problems and collaborate
                with teams.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {how.map((item, index) => (
                <div key={item.id} className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Currently */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="border border-gray-200 rounded-2xl px-6 py-6 md:px-8 md:py-8 bg-white flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="md:w-1/3">
            <h2 className="text-xl md:text-2xl mb-2">Currently</h2>
            <p className="text-gray-600 text-sm">
              A few things I&apos;m exploring, learning, or building right now.
            </p>
          </div>
          <div className="md:flex-1">
            {loading ? (
              <ul className="space-y-2 w-full">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {currently.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm text-gray-700">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                    <span>{item.item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl mb-4">Featured Projects</h2>
            <p className="text-gray-600">A selection of my recent work</p>
          </div>
          <Link
            to="/projects"
            className="hidden md:inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all"
          >
            View All Projects
            <ArrowRight size={20} />
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">
            Failed to load projects. Please try again later.
          </p>
        )}

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse space-y-4 rounded-lg bg-gray-100 p-4"
              >
                <div className="aspect-[4/3] rounded-md bg-gray-200" />
                <div className="h-5 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group"
              >
                <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h3>
                  <ArrowRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all"
                  />
                </div>
                <p className="text-gray-600 mb-2">{project.category}</p>
                <p className="text-gray-500 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        )}

        <Link
          to="/projects"
          className="md:hidden mt-8 inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all"
        >
          View All Projects
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Principles & Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl mb-10">Principles & Values</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
                  <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.id} className="space-y-3">
                  <div className="text-sm text-gray-500 uppercase tracking-[0.18em]">
                    {value.number}
                  </div>
                  <h3 className="text-xl">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beyond the Portfolio */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <h2 className="text-3xl md:text-4xl mb-4">
                Beyond the Portfolio
              </h2>
              <p className="text-gray-600 text-sm">
                A bit more about how I spend my time when I&apos;m not pushing
                pixels.
              </p>
            </div>
            {loading ? (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase mb-2">
                    Off the clock
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">
                    {about?.off_the_clock}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase mb-2">
                    Also me
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">
                    {about?.also_me}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase mb-2">
                    Current obsession
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">
                    {about?.current_obsession}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
