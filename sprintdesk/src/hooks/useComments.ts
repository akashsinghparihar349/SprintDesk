import { useQuery } from "@tanstack/react-query";
import { getCommentsByTaskId } from "../services/comment.service";

export function useComments(
  taskId: string | null
) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () =>
      getCommentsByTaskId(taskId!),
    enabled: Boolean(taskId),
  });
}