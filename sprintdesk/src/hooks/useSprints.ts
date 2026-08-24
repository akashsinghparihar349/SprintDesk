import { useQuery } from "@tanstack/react-query";

async function getSprints() {
  const response = await fetch(
    "http://localhost:8000/sprints"
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