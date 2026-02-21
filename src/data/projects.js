export const projects = [
  {
    id: "ece361-chat-system",
    title: "Multi-User Chat System (C, TCP)",
    short: "Terminal-based multi-user chat system using TCP sockets and threads.",
    description:
      "A client–server chat application built in C using TCP sockets and POSIX threads. Supports authenticated users, multiple chat sessions, real-time messaging, and user invitations. Built to explore networking, concurrency, and protocol design.",
    tech: ["C", "TCP Sockets", "pthread", "Networking", "Client–Server"],
    year: 2024,
    links: {
      live: null,
      code: "https://github.com/Kynnnnnna/Multi-User-Chat-System-ECE361-Computer-Networks"
    },
    cover: "/assets/images/projects/ece361-chat-system/cover.jpg",
    gallery: [
      "/assets/images/projects/ece361-chat-system/01.jpg"
    ]
  },
  {
    id: "portfolio-v1",
    title: "Personal Portfolio Website",
    short: "Design-focused portfolio with frosted glass UI.",
    description:
      "A lightweight, responsive personal site with modular architecture and progressive enhancement for 3D content.",
    tech: ["HTML", "CSS", "JavaScript", "Vite"],
    year: 2025,
    links: {
      live: "https://kynnnnnna.github.io/",
      code: "https://github.com/Kynnnnnna/Kynnnnnna.github.io"
    },
    cover: "/assets/images/projects/portfolio.jpg"
  }
];
