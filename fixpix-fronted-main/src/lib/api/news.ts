/**
 * Centralized API calls for news fetching
 */
export const fetchNewsApi = async () => {
  // Placeholder mock response
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "New AI Model Released by Startup",
          url: "https://example.com/ai-news-1",
          source: "TechTimes",
          description: "A startup has just unveiled a new AI model that claims to be 10x faster...",
          published_at: new Date().toISOString(),
          fact_check_status: "verified"
        },
        {
          title: "AI takes over the world in 2026",
          url: "https://example.com/ai-news-2",
          source: "SensationalNews",
          description: "Sensational claims state that AI is going to take complete control.",
          published_at: new Date(Date.now() - 86400000).toISOString(),
          fact_check_status: "false"
        },
        {
          title: "Quantum Computing Merges with AI",
          url: "https://example.com/ai-news-3",
          source: "ScienceDaily",
          description: "Researchers report a breakthrough in merging quantum computers with neural networks.",
          published_at: new Date(Date.now() - 172800000).toISOString(),
          fact_check_status: "unverified"
        }
      ]);
    }, 1000);
  });
};
