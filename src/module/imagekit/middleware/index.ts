import formidable from 'formidable'

export const parseMultipart = async (ctx: any, next: any) => {
  const form = formidable({ multiples: false })

  const parsed = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(ctx.req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  ctx.files = parsed.files
  ctx.fields = parsed.fields
  await next()
}
