import { Download, Mail, MapPin, Linkedin as LinkedinIcon } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAboutPageContent } from "../hooks/useAboutPageContent";

const FALLBACK_PHOTO_URL =
  "https://images.unsplash.com/photo-1767439567636-792a76f6e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyODUwMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const FALLBACK_INTRO = [
  "I'm a product designer with over 6 years of experience creating digital products that people love to use. My approach combines user research, strategic thinking, and visual design to solve complex problems.",
  "I believe great design is invisible—it just works. I'm passionate about accessibility, design systems, and mentoring junior designers. When I'm not designing, you can find me hiking, photography, or exploring new coffee shops.",
];

const FALLBACK_EXPERIENCE = [
  {
    role: "Senior Product Designer",
    company: "Tech Innovators Inc.",
    period: "2023 - Present",
    description:
      "Leading design initiatives for B2B SaaS platform, managing end-to-end product design from research to delivery.",
  },
  {
    role: "Product Designer",
    company: "Digital Solutions Co.",
    period: "2021 - 2023",
    description:
      "Designed mobile and web applications for various clients across fintech, e-commerce, and healthcare industries.",
  },
  {
    role: "UX Designer",
    company: "Creative Agency",
    period: "2019 - 2021",
    description:
      "Collaborated with cross-functional teams to create user-centered designs for startups and established brands.",
  },
];

const FALLBACK_SKILLS = [
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

const FALLBACK_TOOLS = [
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

const FALLBACK_NAME = "Alex Morgan";
const FALLBACK_ROLE =
  "Product Designer crafting meaningful digital experiences";
const FALLBACK_LOCATION = "Based in San Francisco, CA";
const FALLBACK_EMAIL = "alex@example.com";
const FALLBACK_LINKEDIN = "https://linkedin.com";
const FALLBACK_AVAILABILITY_TEXT =
  "Currently open to new junior product design opportunities.";

export function About() {
  const { about, siteInfo } = useAboutPageContent();

  const name = siteInfo?.name?.trim() || FALLBACK_NAME;
  const location = siteInfo?.location?.trim() || FALLBACK_LOCATION;
  const role = siteInfo?.role?.trim() || FALLBACK_ROLE;
  const email = siteInfo?.contact_email?.trim() || FALLBACK_EMAIL;
  const linkedinUrl = siteInfo?.linkedin_url?.trim() || FALLBACK_LINKEDIN;
  const isAvailable =
    siteInfo?.is_available == null ? true : Boolean(siteInfo.is_available);
  const availabilityText =
    siteInfo?.availability_text?.trim() || FALLBACK_AVAILABILITY_TEXT;

  const photoUrl = about?.photo_url || FALLBACK_PHOTO_URL;
  const introText = about?.intro_text?.trim()
    ? about.intro_text.trim()
    : FALLBACK_INTRO.join("\n\n");
  const introParagraphs = introText.split("\n\n");
  const resumeUrl = about?.resume_url || null;

  const experience =
    about?.experience && about.experience.length > 0
      ? about.experience
      : FALLBACK_EXPERIENCE;

  const skills =
    about?.skills && about.skills.length > 0 ? about.skills : FALLBACK_SKILLS;

  const tools =
    about?.tools && about.tools.length > 0 ? about.tools : FALLBACK_TOOLS;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">About</h1>
        <p className="text-xl text-gray-600">{role}</p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <ImageWithFallback
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl mb-4">Hello, I'm {name}</h2>
          <p className="text-gray-600 mb-4">{location}</p>
          {introParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-lg text-gray-600 mb-4 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors self-start"
            >
              <Download size={20} />
              Download Resume
            </a>
          )}
        </div>
      </div>

      {/* Experience */}
      <section className="mb-20">
        <h2 className="text-3xl mb-8">Experience</h2>
        <div className="space-y-8">
          {experience.map((job, index) => (
            <div key={`${job.role}-${job.company}-${index}`} className="border-l-2 border-gray-200 pl-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <h3 className="text-xl">{job.role}</h3>
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
      <section className="mb-20">
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

      {/* Contact & Availability */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <h2 className="text-2xl mb-6">Let&apos;s connect</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-gray-900 hover:underline break-all"
              >
                {email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900">{location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <LinkedinIcon className="mt-1 text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">LinkedIn</p>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-900 hover:underline"
              >
                View profile
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isAvailable ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <p className="text-gray-700">{availabilityText}</p>
        </div>
      </section>
    </div>
  );
}

