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
import { createNote } from '@/actions/create/create-note'
import { useRouter } from 'next/navigation'

const CreateNote = () => {
  const router = useRouter()
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const action: () => void = form.handleSubmit(async (data) => {
    const response = await createNote(data)
    if (response.error) {
      alert(response.error)
    } else {
      alert(response.success)
      router.push('/')
    }
  })

  return (
    <div className="flex h-full flex-col items-center text-hub-600">
      <h1 className="text-hub-h1 mb-6">Create Note</h1>
      <Form {...form}>
        <form action={action} className="w-64 space-y-8">
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
          <Button variant="hub" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateNote
