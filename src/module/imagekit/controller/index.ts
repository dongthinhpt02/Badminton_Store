import Elysia from 'elysia'
import { ImagekitService } from '../service'

export class HttpImageKitController {
    constructor(private readonly imagekitService: ImagekitService) {}

    async uploadPicture(ctx: any) {
        const file = ctx.body?.file

        if (!file) return { error: 'No file provided' }

        const arrayBuffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(arrayBuffer)

        const uploadResult = await this.imagekitService.uploadFile(fileBuffer, file.name, '/products')

        if (!uploadResult) return { error: 'Failed to upload file' }

        return {
            message: 'File uploaded successfully',
            url: uploadResult.url,
            thumbnailUrl: uploadResult.thumbnailUrl,
            fileId: uploadResult.fileId,
        }
    }

    getRoutes(mdlFactory: any) {
        const imagekitRoute = new Elysia({ prefix: '/imagekit' })
            .derive(mdlFactory.auth)
            .post('/upload', this.uploadPicture.bind(this))

        return imagekitRoute
    }
}
