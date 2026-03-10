import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">Projects</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore my portfolio of design projects spanning mobile apps, web
          platforms, and enterprise solutions.
        </p>
      </div>

      {/* Filter */}
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
                <p className="text-gray-600 mb-3">{project.category} • {project.year}</p>
              </div>
              <ArrowRight
                size={24}
                className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
