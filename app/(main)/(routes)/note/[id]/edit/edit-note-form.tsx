'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'
import { editNote } from '@/actions/update/edit-note'
import { Note } from '@prisma/client'

const formSchema = z.object({
  title: z.string().min(1).max(50),
  content: z
    .string()
    .min(1, {
      message: 'Content cannot be empty.',
    })
    .max(255, {
      message: 'Content must not be longer than 255 characters.',
    }),
})

type EditNoteType = {
  note: Note
  noteId: string
}

const EditNoteForm = ({ note, noteId }: EditNoteType) => {
  const { title, content } = note

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      content,
    },
  })

  const action: () => void = form.handleSubmit(async (data) => {
    const response = await editNote(Number(noteId), data)
    if (response.error) {
      alert(response.error)
    } else {
      alert(response.success)
      redirect(`/note/${noteId}`)
    }
  })

  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form action={action} className="space-y-8 w-64">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default EditNoteForm
