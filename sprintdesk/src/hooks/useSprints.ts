import { useQuery } from "@tanstack/react-query";

async function getSprints() {
  const response = await fetch(
    "https://sprintdesk-raaa.onrender.com/sprints"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sprints");
  }

  return response.json();
}

export function useSprints() {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: getSprints,
  });
}