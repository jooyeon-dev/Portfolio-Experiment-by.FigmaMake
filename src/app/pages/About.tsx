import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Download } from "lucide-react";

export function About() {
  const skills = [
    "User Research",
    "User Interface Design",
    "User Experience Design",
    "Prototyping",
    "Wireframing",
    "Design Systems",
    "Interaction Design",
    "Usability Testing",
    "Information Architecture",
    "Visual Design",
  ];

  const tools = [
    "Figma",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Principle",
    "Framer",
    "Miro",
    "Adobe Creative Suite",
    "Notion",
    "Jira",
  ];

  const experience = [
    {
      title: "Senior Product Designer",
      company: "Tech Innovators Inc.",
      period: "2023 - Present",
      description:
        "Leading design initiatives for B2B SaaS platform, managing end-to-end product design from research to delivery.",
    },
    {
      title: "Product Designer",
      company: "Digital Solutions Co.",
      period: "2021 - 2023",
      description:
        "Designed mobile and web applications for various clients across fintech, e-commerce, and healthcare industries.",
    },
    {
      title: "UX Designer",
      company: "Creative Agency",
      period: "2019 - 2021",
      description:
        "Collaborated with cross-functional teams to create user-centered designs for startups and established brands.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">About Me</h1>
        <p className="text-xl text-gray-600">
          Passionate about creating intuitive and delightful user experiences
        </p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1767439567636-792a76f6e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyODUwMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Alex Morgan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl mb-6">Hello, I'm Alex Morgan</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            I'm a product designer with over 6 years of experience creating
            digital products that people love to use. My approach combines
            user research, strategic thinking, and visual design to solve
            complex problems.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            I believe great design is invisible—it just works. I'm passionate
            about accessibility, design systems, and mentoring junior designers.
            When I'm not designing, you can find me hiking, photography, or
            exploring new coffee shops.
          </p>
          <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors self-start">
            <Download size={20} />
            Download Resume
          </button>
        </div>
      </div>

      {/* Experience */}
      <section className="mb-20">
        <h2 className="text-3xl mb-8">Experience</h2>
        <div className="space-y-8">
          {experience.map((job, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <h3 className="text-xl">{job.title}</h3>
                <span className="text-gray-500">{job.period}</span>
              </div>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-20">
        <h2 className="text-3xl mb-8">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-3xl mb-8">Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tools.map((tool) => (
            <div
              key={tool}
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
            >
              {tool}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
