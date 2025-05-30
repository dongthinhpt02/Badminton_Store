import axios from 'axios'
import appConfig from '../../../shared/common/config'

export class ImagekitService {
    async uploadFile(fileBuffer: Buffer, fileName: string, folder = '/products') {
        const privateKey = appConfig.imagekit.privateKey
        const base64Auth = Buffer.from(`${privateKey}:`).toString('base64')

        const form = new FormData()
        form.append('file', new Blob([fileBuffer]), fileName)
        form.append('fileName', fileName)
        form.append('folder', folder)

        try {
            const res = await axios.post(
                'https://upload.imagekit.io/api/v2/files/upload',
                form,
                {
                    headers: {
                        Authorization: `Basic ${base64Auth}`,
                    },
                }
            )

            return {
                url: res.data.url,
                fileId: res.data.fileId,
                thumbnailUrl: res.data.thumbnailUrl,
            }
        } catch (err: any) {
            console.error('Upload failed:', err.response?.data || err.message)
            return null
        }
    }
}
