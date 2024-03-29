'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Note } from '@prisma/client'
import { addNoteToServer } from '@/actions/update/add-note-server'
import { withHydrationError } from '@/components/hoc/with-hydration-error'

type AddNoteToServerModalProps = {
  notes: Note[]
  serverId: number
}

const AddNoteToServerModal = ({
  notes,
  serverId,
}: AddNoteToServerModalProps) => {
  const [open, setOpen] = useState(false)
  const [noteId, setNoteId] = useState<number | null>(null)

  async function handleClick() {
    if (!noteId) return null
    const response = await addNoteToServer(noteId, serverId)
    if (response.error) {
      throw new Error(response.error)
    } else {
      alert(response.success) // replace alert with toast
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hub">Add note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add note to this server</DialogTitle>
        </DialogHeader>
        <div className="max-h-48 overflow-y-scroll">
          {notes
            .filter((note) => note.serverId !== serverId)
            .map(({ id, title }) => {
              return (
                <div
                  key={id}
                  className={`mb-4 border border-current p-4 ${
                    noteId === id ? 'border-2 border-hub-600' : ''
                  }`}
                  onClick={() => setNoteId(id)}
                >
                  <p>{title}</p>
                </div>
              )
            })}
        </div>
        <DialogFooter>
          <Button variant="hub" onClick={handleClick}>
            Add note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default withHydrationError(AddNoteToServerModal)
