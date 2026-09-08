import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobs, fetchJobById, createJob, updateJob, deleteJob } from '../api/jobsApi';
import type { CreateJobDto, UpdateJobDto } from '../types/job';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    refetchInterval: 10_000,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => fetchJobById(id),
    refetchInterval: 10_000,
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobDto) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobDto }) => updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
