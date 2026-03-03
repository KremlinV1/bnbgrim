import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(file: File): Promise<string | null> {
  if (!file) return null

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate a unique filename
  const extension = path.extname(file.name)
  const uniqueFilename = `${uuidv4()}${extension}`
  
  // Create relative and absolute paths
  const relativePath = `/uploads/${uniqueFilename}`
  const absolutePath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename)

  try {
    await writeFile(absolutePath, buffer)
    return relativePath
  } catch (error) {
    console.error('Error saving file:', error)
    return null
  }
}

export async function deleteFile(relativePath: string): Promise<boolean> {
  try {
    const filename = path.basename(relativePath)
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', filename)
    await unlink(absolutePath)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}
