export interface IImageKitService {
    uploadFile : (fileBuffer: Buffer, fileName: string, folder?: string) => Promise<UploadResult | null>;
}
export interface UploadResult {
    url: string;
    thumbnailUrl: string;
    fileId: string;
}