import { Linkedin, Mail } from "lucide-react";
import { useSiteInfo } from "../hooks/useSiteInfo";

export function Footer() {
  const {
    name,
    role,
    contactEmail,
    linkedinUrl,
    footerDescription,
    showLinkedin,
    showEmail,
  } = useSiteInfo();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-4">{name}</h3>
            <p className="text-gray-600">
              {footerDescription.trim().length > 0 ? footerDescription : role}
            </p>
          </div>

          <div className="md:pl-12">
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/projects"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-gray-900"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div className="md:pl-12">
            <h3 className="mb-4">Connect</h3>
            <div className="flex gap-4">
              {showLinkedin && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {showEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© 2026 Jooyeon Choi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
