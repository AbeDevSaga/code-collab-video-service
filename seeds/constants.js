const projects = [
    // Organization 1: Tech Innovators
    {
      name: "E-commerce Platform",
      description: "Develop a scalable e-commerce platform for online shopping.",
      status: "active",
      startDate: new Date(2023, 0, 1), // January 1, 2023
      endDate: new Date(2023, 11, 31), // December 31, 2023
      tags: ["web", "e-commerce", "backend"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
    {
      name: "AI Chatbot",
      description: "Create an AI-powered chatbot for customer support.",
      status: "inactive",
      startDate: new Date(2023, 1, 1), // February 1, 2023
      endDate: new Date(2023, 6, 30), // June 30, 2023
      tags: ["AI", "chatbot", "backend"],
      labels: ["low-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
  
    // Organization 2: Green Solutions
    {
      name: "Renewable Energy Tracker",
      description: "Build a system to track renewable energy usage.",
      status: "active",
      startDate: new Date(2023, 2, 15), // March 15, 2023
      endDate: new Date(2023, 8, 30), // September 30, 2023
      tags: ["energy", "sustainability", "backend"],
      labels: ["medium-priority"],
      isPublic: false,
      allowExternalContributors: true,
    },
    {
      name: "Eco-Friendly Product Marketplace",
      description: "Develop a marketplace for eco-friendly products.",
      status: "active",
      startDate: new Date(2023, 3, 1), // April 1, 2023
      endDate: new Date(2023, 9, 30), // October 30, 2023
      tags: ["e-commerce", "sustainability", "frontend"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
  
    // Organization 3: Health Plus
    {
      name: "Health Tracker App",
      description: "Build a mobile app to track health metrics and fitness goals.",
      status: "active",
      startDate: new Date(2023, 2, 15), // March 15, 2023
      endDate: new Date(2023, 8, 30), // September 30, 2023
      tags: ["mobile", "health", "fitness"],
      labels: ["medium-priority"],
      isPublic: false,
      allowExternalContributors: true,
    },
    {
      name: "Telemedicine Platform",
      description: "Develop a platform for remote medical consultations.",
      status: "active",
      startDate: new Date(2023, 4, 1), // May 1, 2023
      endDate: new Date(2023, 10, 30), // November 30, 2023
      tags: ["health", "telemedicine", "backend"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
  
    // Organization 4: EduTech
    {
      name: "Online Learning Platform",
      description: "Develop an online platform for educational courses.",
      status: "completed",
      startDate: new Date(2022, 9, 1), // October 1, 2022
      endDate: new Date(2023, 3, 30), // April 30, 2023
      tags: ["web", "education", "frontend"],
      labels: ["completed"],
      isPublic: true,
      allowExternalContributors: true,
    },
    {
      name: "Student Management System",
      description: "Build a system to manage student records and progress.",
      status: "active",
      startDate: new Date(2023, 5, 1), // June 1, 2023
      endDate: new Date(2023, 11, 31), // December 31, 2023
      tags: ["education", "management", "backend"],
      labels: ["medium-priority"],
      isPublic: false,
      allowExternalContributors: false,
    },
  
    // Organization 5: Foodies Delight
    {
      name: "Food Delivery App",
      description: "Build a mobile app for food delivery services.",
      status: "active",
      startDate: new Date(2023, 6, 1), // July 1, 2023
      endDate: new Date(2023, 12, 31), // December 31, 2023
      tags: ["mobile", "food", "delivery"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: true,
    },
    {
      name: "Recipe Sharing Platform",
      description: "Develop a platform for sharing and discovering recipes.",
      status: "active",
      startDate: new Date(2023, 7, 1), // August 1, 2023
      endDate: new Date(2023, 12, 31), // December 31, 2023
      tags: ["web", "food", "community"],
      labels: ["medium-priority"],
      isPublic: true,
      allowExternalContributors: true,
    },
  
    // Organization 6: Fashion Forward
    {
      name: "Fashion E-commerce Platform",
      description: "Develop an e-commerce platform for fashion products.",
      status: "active",
      startDate: new Date(2023, 8, 1), // September 1, 2023
      endDate: new Date(2023, 12, 31), // December 31, 2023
      tags: ["web", "fashion", "e-commerce"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
    {
      name: "Virtual Try-On App",
      description: "Build a mobile app for virtual try-on of fashion items.",
      status: "inactive",
      startDate: new Date(2023, 9, 1), // October 1, 2023
      endDate: new Date(2023, 12, 31), // December 31, 2023
      tags: ["mobile", "fashion", "AR"],
      labels: ["low-priority"],
      isPublic: false,
      allowExternalContributors: false,
    },
  
    // Organization 7: Travel Masters
    {
      name: "Travel Booking System",
      description: "Build a system for booking flights, hotels, and tours.",
      status: "archived",
      startDate: new Date(2022, 5, 1), // June 1, 2022
      endDate: new Date(2022, 11, 31), // December 31, 2022
      tags: ["web", "travel", "backend"],
      labels: ["archived"],
      isPublic: false,
      allowExternalContributors: false,
    },
    {
      name: "Travel Itinerary Planner",
      description: "Develop a platform for planning travel itineraries.",
      status: "active",
      startDate: new Date(2023, 10, 1), // November 1, 2023
      endDate: new Date(2023, 12, 31), // December 31, 2023
      tags: ["web", "travel", "planning"],
      labels: ["medium-priority"],
      isPublic: true,
      allowExternalContributors: true,
    },
  
    // Organization 8: Fitness Zone
    {
      name: "Fitness Tracker App",
      description: "Build a mobile app to track fitness activities.",
      status: "active",
      startDate: new Date(2023, 11, 1), // December 1, 2023
      endDate: new Date(2024, 5, 31), // May 31, 2024
      tags: ["mobile", "fitness", "health"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
    {
      name: "Gym Management System",
      description: "Develop a system to manage gym memberships and schedules.",
      status: "active",
      startDate: new Date(2023, 11, 1), // December 1, 2023
      endDate: new Date(2024, 5, 31), // May 31, 2024
      tags: ["web", "fitness", "management"],
      labels: ["medium-priority"],
      isPublic: false,
      allowExternalContributors: false,
    },
  
    // Organization 9: Artistry Hub
    {
      name: "Art Gallery Platform",
      description: "Develop a platform for showcasing and selling art.",
      status: "active",
      startDate: new Date(2023, 0, 1), // January 1, 2023
      endDate: new Date(2023, 6, 30), // June 30, 2023
      tags: ["web", "art", "e-commerce"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: true,
    },
    {
      name: "Art Class Booking System",
      description: "Build a system for booking art classes and workshops.",
      status: "active",
      startDate: new Date(2023, 1, 1), // February 1, 2023
      endDate: new Date(2023, 7, 31), // July 31, 2023
      tags: ["web", "art", "education"],
      labels: ["medium-priority"],
      isPublic: true,
      allowExternalContributors: true,
    },
  
    // Organization 10: Finance Pro
    {
      name: "Personal Finance Tracker",
      description: "Build a mobile app to track personal finances.",
      status: "active",
      startDate: new Date(2023, 2, 1), // March 1, 2023
      endDate: new Date(2023, 8, 30), // August 30, 2023
      tags: ["mobile", "finance", "tracking"],
      labels: ["high-priority"],
      isPublic: true,
      allowExternalContributors: false,
    },
    {
      name: "Investment Portfolio Manager",
      description: "Develop a platform for managing investment portfolios.",
      status: "active",
      startDate: new Date(2023, 3, 1), // April 1, 2023
      endDate: new Date(2023, 9, 30), // September 30, 2023
      tags: ["web", "finance", "investment"],
      labels: ["medium-priority"],
      isPublic: false,
      allowExternalContributors: false,
    },
  ];
  
  module.exports = { projects };