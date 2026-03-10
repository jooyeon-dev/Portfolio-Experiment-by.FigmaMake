import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { projects } from "../data/projects";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
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

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">{project.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project Image */}
      <div className="relative aspect-[16/10] mb-12 overflow-hidden rounded-lg bg-gray-100">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-gray-200">
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Role
          </h3>
          <p className="text-lg">{project.role}</p>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Client
          </h3>
          <p className="text-lg">{project.client}</p>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Year
          </h3>
          <p className="text-lg">{project.year}</p>
        </div>
      </div>

      {/* Project Content */}
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl mb-4">Overview</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {project.overview}
          </p>
        </section>

        <section>
          <h2 className="text-3xl mb-4">The Challenge</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {project.challenge}
          </p>
        </section>

        <section>
          <h2 className="text-3xl mb-4">The Solution</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {project.solution}
          </p>
        </section>

        <section>
          <h2 className="text-3xl mb-4">Outcome</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {project.outcome}
          </p>
        </section>
      </div>

      {/* Next Project */}
      <div className="mt-20 pt-12 border-t border-gray-200">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all"
        >
          View All Projects
          <ArrowLeft size={20} className="rotate-180" />
        </Link>
      </div>
    </div>
  );
}
