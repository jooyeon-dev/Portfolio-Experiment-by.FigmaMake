export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  role: string;
  client: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "mobile-banking-app",
    title: "Mobile Banking App",
    category: "Mobile App Design",
    description: "Redesigning the mobile banking experience for a leading financial institution",
    image: "https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzcyODYzNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2025",
    role: "Lead UX/UI Designer",
    client: "FinTech Bank",
    overview: "A comprehensive redesign of a mobile banking application focusing on improving user experience, accessibility, and modern design patterns.",
    challenge: "Users found the existing app confusing and difficult to navigate. The design was outdated and didn't meet modern accessibility standards.",
    solution: "Conducted extensive user research, created user personas, and redesigned the entire information architecture. Implemented a clean, modern interface with intuitive navigation and enhanced accessibility features.",
    outcome: "Post-launch metrics showed a 45% increase in user engagement, 60% reduction in support tickets, and a 4.8/5 app store rating.",
    tags: ["Mobile Design", "User Research", "Prototyping", "Design System"]
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    category: "Web Design",
    description: "Creating a seamless shopping experience for a sustainable fashion brand",
    image: "https://images.unsplash.com/photo-1644984875410-e11486d2b94f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwc2hvcHBpbmclMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcyOTU2MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2024",
    role: "Senior Product Designer",
    client: "GreenStyle Co.",
    overview: "Designed a modern e-commerce platform that emphasizes sustainability while providing an exceptional shopping experience.",
    challenge: "The brand wanted to communicate their sustainability message while maintaining a premium shopping experience that could compete with major retailers.",
    solution: "Developed a design system that balanced eco-friendly aesthetics with luxury. Implemented features like product sustainability ratings, virtual try-on, and a streamlined checkout process.",
    outcome: "Achieved 35% increase in conversion rate, 28% higher average order value, and received industry recognition for sustainable design.",
    tags: ["E-Commerce", "Design System", "User Testing", "Responsive Design"]
  },
  {
    id: "fitness-tracking-app",
    title: "Fitness Tracking App",
    category: "Mobile App Design",
    description: "Empowering users to achieve their health goals through intuitive design",
    image: "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGFwcCUyMHBob25lfGVufDF8fHx8MTc3Mjk1NjE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2024",
    role: "UX/UI Designer",
    client: "FitLife Tech",
    overview: "A comprehensive fitness tracking application that helps users monitor workouts, nutrition, and overall wellness.",
    challenge: "Users needed a simple way to track complex health data without feeling overwhelmed by metrics and features.",
    solution: "Created a progressive disclosure design that shows relevant information at the right time. Developed personalized dashboards and implemented gamification to encourage consistent use.",
    outcome: "App reached 100K+ downloads in first 3 months, with 70% daily active users and featured as 'App of the Day' on major app stores.",
    tags: ["Mobile App", "Data Visualization", "Gamification", "User Research"]
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    category: "SaaS Product",
    description: "Transforming complex data into actionable insights",
    image: "https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcyODYyNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2025",
    role: "Product Designer",
    client: "DataViz Inc.",
    overview: "Designed an enterprise analytics dashboard that makes complex business intelligence accessible to all team members.",
    challenge: "Business users struggled to extract insights from raw data. The existing interface required extensive training and technical knowledge.",
    solution: "Implemented intuitive data visualization, customizable widgets, and natural language queries. Created role-based views for different user types.",
    outcome: "Reduced time-to-insight by 55%, increased user adoption across teams by 80%, and won 'Best Enterprise UX' award.",
    tags: ["Dashboard Design", "Data Visualization", "Enterprise UX", "Accessibility"]
  }
];
