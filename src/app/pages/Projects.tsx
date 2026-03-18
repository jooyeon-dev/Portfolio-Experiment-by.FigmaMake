import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProjects } from "../hooks/useProjects";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { projects, loading, error } = useProjects();

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.company).filter(Boolean))),
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.company === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">Projects</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore my portfolio of design projects spanning mobile apps, web
          platforms, and enterprise solutions.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-6">
          Failed to load projects. Please try again later.
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/3] rounded-lg bg-gray-200" />
              <div className="h-6 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Filter */}
          {categories.length > 1 && (
            <div className="mb-12 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group"
              >
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-gray-100">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-2xl mb-2 group-hover:text-gray-600 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      {project.company}
                      {project.period ? ` · ${project.period}` : ""}
                    </p>
                  </div>
                  <ArrowRight
                    size={24}
                    className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0"
                  />
                </div>
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
