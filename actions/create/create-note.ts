'use server'
import db from '@/lib/db'
import { auth } from '@clerk/nextjs'
import * as z from 'zod'
import { revalidatePath } from 'next/cache'
import { getProfile } from '@/actions/get/get-profile'

type FormData = {
  title: string
  content: string
}

// author id is userId
export async function createNote(formData: FormData) {
  const res = await getProfile()

  const { title, content } = formData
  const schema = z.object({
    authorId: z.number(),
    authorName: z.string(),
    title: z.string().min(1).max(50),
    content: z.string().min(1).max(255),
  })

  // safe parse so we can handle errors when validation fails
  const parse = schema.safeParse({
    authorId: res.success?.id,
    authorName: res.success?.name,
    title,
    content,
  })

  if (!parse.success) {
    return { error: 'Failed to parse note data' }
  }

  const data = parse.data

  try {
    await db.note.create({
      data,
    })
    revalidatePath('/')
    return { success: `Created note: ${data.title}` }
  } catch (e) {
    return { error: 'Failed to create note' }
  }
}
