import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api.js'

export function useApi(endpoint, options = {}) {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: [endpoint],
    queryFn: () => api.get(endpoint).then(res => res.data),
    ...options.list,
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] })
    },
    ...options.create,
  })

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`${endpoint}${data.id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] })
    },
    ...options.update,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${endpoint}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] })
    },
    ...options.delete,
  })

  return {
    data: listQuery.data || [],
    loading: listQuery.isLoading,
    error: listQuery.error,
    
    create: createMutation.mutate,
    createLoading: createMutation.isPending,
    
    update: updateMutation.mutate,
    updateLoading: updateMutation.isPending,
    
    del: deleteMutation.mutate,
    deleteLoading: deleteMutation.isPending,
  }
}

