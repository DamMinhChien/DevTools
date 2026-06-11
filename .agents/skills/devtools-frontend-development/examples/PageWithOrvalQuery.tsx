// evoppa-fe — pattern: page + TanStack Query hook từ Orval (tên hook thay theo swagger)
import { useGetMyRequests } from '@/api/generated'
import { DataTable } from '@/components/DataTable'

export function ExampleMyRequestsPage() {
  const { data, isLoading, error, refetch } = useGetMyRequests(
    { page: 1, pageSize: 20 },
    { query: { staleTime: 30_000 } },
  )

  if (isLoading) return <div>Đang tải…</div>
  if (error) return <div>Không tải được danh sách đơn.</div>

  return (
    <DataTable
      data={data?.items ?? []}
      onRefresh={() => void refetch()}
    />
  )
}
