import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useFeaturedProjects } from "../hooks/useFeaturedProjects";

export function Home() {
  const { projects: featuredProjects, loading, error } = useFeaturedProjects(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
            Product Designer crafting meaningful digital experiences
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            I design user-centered products that solve real problems and delight users.
            Currently working at a leading tech company in San Francisco.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              View My Work
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full border border-gray-300 hover:border-gray-900 transition-colors"
            >
              Get In Touch
            </Link>
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

        {loading ? (
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

      {/* Skills & Approach */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl mb-12">My Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl">1</span>
              </div>
              <h3 className="text-xl mb-3">Research & Discovery</h3>
              <p className="text-gray-600">
                Understanding user needs, business goals, and technical constraints
                through comprehensive research and stakeholder interviews.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl">2</span>
              </div>
              <h3 className="text-xl mb-3">Design & Iterate</h3>
              <p className="text-gray-600">
                Creating wireframes, prototypes, and high-fidelity designs while
                continuously testing and refining based on user feedback.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl">3</span>
              </div>
              <h3 className="text-xl mb-3">Deliver & Measure</h3>
              <p className="text-gray-600">
                Collaborating with developers for implementation and measuring
                success through analytics and user feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
