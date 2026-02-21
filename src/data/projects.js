export const projects = [
  {
    id: "ece496-head-up",
    title: "Ergonomic Cell Phone Holder",
    short: "Posture-aware phone holder using real-time face and head-pose tracking.",
    description:
      "A computer vision–driven phone holder that estimates head pose from a live camera feed and uses closed-loop control to reposition a 4-DOF robotic arm for more ergonomic viewing.",
    tech: ["Python", "OpenVINO", "Computer Vision", "Embedded Linux", "Robotics"],
    year: 2026,
    links: {
      live: null,
      code: "https://github.com/GigiaaaChen/ECE496"
    },
    cover: "/assets/images/projects/ece496-head-up/cover.jpg",
    gallery: [
      "/assets/images/projects/ece496-head-up/cover.jpg",
      "/assets/images/projects/ece496-head-up/1.jpg",
      "/assets/images/projects/ece496-head-up/2.jpg",
      "/assets/images/projects/ece496-head-up/3.jpg",
      "/assets/images/projects/ece496-head-up/4.jpg",
      "/assets/images/projects/ece496-head-up/5.jpg"
    ]
  },
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
  }
];
