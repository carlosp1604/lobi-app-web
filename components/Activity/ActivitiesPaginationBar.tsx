'use client'

import { useRouter } from 'next/router'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'

export interface GetActivitiesPaginationDto {
  page: number
  perPage: number
}

interface ActivitiesPaginationProps {
  pagination: GetActivitiesPaginationDto
  total: number
}

export const ActivitiesPaginationBar = ({ pagination, total }: ActivitiesPaginationProps) => {
  const router = useRouter()
  const { page, perPage } = pagination

  const totalPages = Math.ceil(total / perPage)

  if (totalPages <= 1) {
    return null
  }

  const maxVisiblePages = 4

  const startPage = Math.max(1, Math.min(page - 1, totalPages - (maxVisiblePages - 1)))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  const visiblePages = []

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i)
  }

  const createPageUrl = (newPage: number) => {
    const searchParams = new URLSearchParams(router.query as Record<string, string>)

    searchParams.set('page', String(newPage))

    const basePath = router.asPath.split('?')[0]
    const pathWithSlash = basePath.endsWith('/') ? basePath : `${basePath}/`

    return `${pathWithSlash}?${searchParams.toString()}`
  }

  return (
    <Pagination className="mt-8 mb-4">
      <PaginationContent>
        { /* Botón Anterior */ }
        <PaginationItem>
          <PaginationPrevious
            href={ page > 1 ? createPageUrl(page - 1) : '#' }
            className={ page <= 1 ? 'pointer-events-none opacity-50' : '' }
          />
        </PaginationItem>

        { visiblePages.map((p) => (
          <PaginationItem key={ p }>
            <PaginationLink
              href={ createPageUrl(p) }
              isActive={ page === p }
            >
              { p }
            </PaginationLink>
          </PaginationItem>
        )) }

        <PaginationItem>
          <PaginationNext
            href={ page < totalPages ? createPageUrl(page + 1) : '#' }
            className={ page >= totalPages ? 'pointer-events-none opacity-50' : '' }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
