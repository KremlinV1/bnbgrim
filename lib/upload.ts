export async function uploadFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Get mime type from file
    const mimeType = file.type || 'image/jpeg'
    
    // Convert to base64 data URL
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    return dataUrl
  } catch (error) {
    console.error('Error processing file:', error)
    return null
  }
}

export async function deleteFile(url: string): Promise<boolean> {
  // No-op for base64 data URLs - they're stored in DB and deleted with the record
  return true
}
