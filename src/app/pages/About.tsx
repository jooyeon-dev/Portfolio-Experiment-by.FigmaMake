import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Download, Mail, MapPin, Linkedin as LinkedinIcon } from "lucide-react";
import { useAboutPageContent } from "../hooks/useAboutPageContent";

const FALLBACK_NAME = "Alex Morgan";
const FALLBACK_LOCATION = "Seoul, South Korea";
const FALLBACK_EMAIL = "alex@example.com";
const FALLBACK_LINKEDIN = "https://linkedin.com";
const FALLBACK_AVAILABILITY_TEXT = "Currently open to new opportunities.";
const FALLBACK_INTRO_PARAGRAPHS = [
  "I'm a product designer with over 6 years of experience creating digital products that people love to use. My approach combines user research, strategic thinking, and visual design to solve complex problems.",
  "I believe great design is invisible—it just works. I'm passionate about accessibility, design systems, and mentoring junior designers. When I'm not designing, you can find me hiking, photography, or exploring new coffee shops.",
];

const FALLBACK_EXPERIENCE = [
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

function toSimpleIconSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function About() {
  const { about, siteInfo, loading } = useAboutPageContent();

  const name = siteInfo?.name?.trim() || FALLBACK_NAME;
  const location =
    (siteInfo?.location && siteInfo.location.trim()) || FALLBACK_LOCATION;
  const email =
    (siteInfo?.contact_email && siteInfo.contact_email.trim()) ||
    FALLBACK_EMAIL;
  const linkedinUrl =
    (siteInfo?.linkedin_url && siteInfo.linkedin_url.trim()) ||
    FALLBACK_LINKEDIN;
  const isAvailable =
    siteInfo?.is_available == null ? true : Boolean(siteInfo.is_available);
  const availabilityText =
    (siteInfo?.availability_text &&
      siteInfo.availability_text.trim().length > 0 &&
      siteInfo.availability_text.trim()) ||
    FALLBACK_AVAILABILITY_TEXT;

  const photoUrl = about?.photo_url ?? "";

  const introText =
    about?.intro_text && about.intro_text.trim().length > 0
      ? about.intro_text.trim()
      : "";
  const introParagraphs =
    introText.length > 0
      ? introText.split("\n\n")
      : FALLBACK_INTRO_PARAGRAPHS;

  const experienceFromSupabase = Array.isArray(about?.experience)
    ? about.experience
    : [];
  const experience =
    experienceFromSupabase.length > 0
      ? experienceFromSupabase.map((item: any) => ({
          title: String(item.role ?? ""),
          company: String(item.company ?? ""),
          period: String(item.period ?? ""),
          description: String(item.description ?? ""),
        }))
      : FALLBACK_EXPERIENCE;

  const skillsFromSupabase = Array.isArray(about?.skills)
    ? about.skills
    : [];
  const skills =
    skillsFromSupabase.length > 0 ? skillsFromSupabase : FALLBACK_SKILLS;

  const toolsFromSupabase = Array.isArray(about?.tools) ? about.tools : [];
  const tools =
    toolsFromSupabase.length > 0 ? toolsFromSupabase : FALLBACK_TOOLS;

  const resumeUrl =
    about && typeof about.resume_url === "string"
      ? about.resume_url.trim()
      : "";

  const education = Array.isArray(about?.education) ? about.education : [];
  const hasEducation = education.length > 0;

  const headerSubtitle =
    (about?.intro_subtitle && about.intro_subtitle.trim().length > 0
      ? about.intro_subtitle.trim()
      : "") ||
    "Passionate about creating intuitive and delightful user experiences";

  const offTheClock =
    about?.off_the_clock && about.off_the_clock.trim().length > 0
      ? about.off_the_clock.trim()
      : "";
  const alsoMe =
    about?.also_me && about.also_me.trim().length > 0
      ? about.also_me.trim()
      : "";
  const currentObsession =
    about?.current_obsession && about.current_obsession.trim().length > 0
      ? about.current_obsession.trim()
      : "";

  const hasMoreAbout =
    offTheClock.length > 0 ||
    alsoMe.length > 0 ||
    currentObsession.length > 0;

  const hasSkills = skills.length > 0;
  const hasTools = tools.length > 0;
  const hasSkillsOrTools = hasSkills || hasTools;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">About Me</h1>
        <p className="text-xl text-gray-600">{headerSubtitle}</p>
      </div>

      {/* 2. Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {loading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            ) : photoUrl ? (
              <ImageWithFallback
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {loading ? (
            <div className="space-y-4 mb-6">
              <div className="h-8 w-56 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl mb-6">Hello, I'm {name}</h2>
              {introParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg text-gray-600 mb-6 leading-relaxed last:mb-8"
                >
                  {paragraph}
                </p>
              ))}
            </>
          )}
          {resumeUrl && (
            <button
              type="button"
              onClick={() =>
                window.open(resumeUrl, "_blank", "noopener,noreferrer")
              }
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors self-start"
            >
              <Download size={20} />
              Download Resume
            </button>
          )}
        </div>
      </div>

      {/* 3. Education */}
      {loading ? (
        <section className="mb-20">
          <div className="h-8 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-l-2 border-gray-100 pl-6 space-y-2"
              >
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        hasEducation && (
          <section className="mb-20">
            <h2 className="text-3xl mb-8">Education</h2>
            <div className="space-y-8">
              {education.map((item, index) => (
                <div
                  key={`${item.school}-${item.period}-${index}`}
                  className="border-l-2 border-gray-200 pl-6"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                    <h3 className="text-xl">
                      {item.school || "Untitled education"}
                    </h3>
                    {item.period && (
                      <span className="text-gray-500">{item.period}</span>
                    )}
                  </div>
                  {item.major && (
                    <p className="text-gray-600">
                      <span className="font-medium">Major:</span> {item.major}
                    </p>
                  )}
                  {item.location && (
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span>{" "}
                      {item.location}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      )}

      {/* 4. Experience */}
      {loading ? (
        <section className="mb-20">
          <div className="h-8 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-l-2 border-gray-100 pl-6 space-y-2"
              >
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ) : (
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
      )}

      {/* 5. Skills & Tools */}
      {loading ? (
        <section className="mb-20">
          <div className="h-8 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-l-2 border-gray-100 pl-6 space-y-2"
              >
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        hasSkillsOrTools && (
          <section className="mb-20">
            <h2 className="text-3xl mb-8">Skills &amp; Tools</h2>
            {hasSkills && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
                  Skills
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="p-3 bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hasTools && (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
                  Tools
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tools.map((tool) => (
                    <div
                      key={tool}
                      className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                    >
                      <img
                        src={`https://cdn.simpleicons.org/${toSimpleIconSlug(tool)}/000000`}
                        alt={tool}
                        className="w-4 h-4"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                      <span className="text-sm text-gray-700">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      )}

      {/* 6. A bit more about me */}
      {loading ? (
        <section className="mb-20">
          <div className="h-8 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-l-2 border-gray-100 pl-6 space-y-2"
              >
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        hasMoreAbout && (
          <section className="mb-20">
            <h2 className="text-3xl mb-8">A bit more about me</h2>
            <div className="space-y-4 text-gray-700">
              {offTheClock && (
                <p>
                  <span className="font-medium">Off the clock:</span>{" "}
                  {offTheClock}
                </p>
              )}
              {alsoMe && (
                <p>
                  <span className="font-medium">Also me:</span> {alsoMe}
                </p>
              )}
              {currentObsession && (
                <p>
                  <span className="font-medium">Current obsession:</span>{" "}
                  {currentObsession}
                </p>
              )}
            </div>
          </section>
        )
      )}
      </div>

      {/* 7. Contact & Availability (full-width) */}
      <section id="connect" className="w-screen relative left-1/2 -translate-x-1/2 bg-gray-900 px-8 py-22 -mb-24">
        <div className="max-w-4xl mx-auto mb-0 pb-0">
          <h2 className="text-3xl mb-8 text-white">Let&apos;s connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-white hover:underline break-all"
                >
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">{location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LinkedinIcon className="mt-1 text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">LinkedIn</p>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:underline"
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
            <p className="text-gray-300">{availabilityText}</p>
          </div>
        </div>
      </section>
    </>
  );
}
