'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { api2 } from '@/lib/api'

type ResponseItem = {
  id: number
  response_id: number
  question_id: number
  answer_text: string
  created_at: string
  updated_at: string
}

type TextResponsePaginated = {
  question_id: number
  responses: ResponseItem[]
  totalPages: number
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionId: number | null
}

export default function TextResponseDialog({ open, onOpenChange, questionId }: Props) {
  const [responses, setResponses] = useState<ResponseItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!questionId || !open) return

    const fetchResponses = async () => {
      setLoading(true)
      try {
        const res = await api2.get<TextResponsePaginated>(`/api/surveys/results/text-responses/${questionId}`, {
          params: { page, limit: 10 },
        })
        setResponses(res.data.responses)
        setTotalPages(res.data.totalPages)
      } catch (error) {
        console.error('Failed to fetch responses:', error)
        setResponses([])
        setTotalPages(1)
      }
      setLoading(false)
    }

    fetchResponses()
  }, [questionId, page, open])

  // Reset to page 1 when questionId changes or dialog opens
  useEffect(() => {
    if (open) setPage(1)
  }, [questionId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Text Responses for Question ID {questionId}</DialogTitle>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto border rounded p-4 bg-white dark:bg-gray-800">
        {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading responses...</p>
        ) : responses.length === 0 ? (
            <p className="text-muted-foreground italic dark:text-gray-400">No text responses found.</p>
        ) : (
            responses.map((resp) => (
            <div key={resp.id} className="mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                <p className="text-gray-900 dark:text-gray-100">{resp.answer_text}</p>
                <small className="text-gray-500 dark:text-gray-400">
                {new Date(resp.created_at).toLocaleString()}
                </small>
            </div>
            ))
        )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="btn btn-outline"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <span className="self-center">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
