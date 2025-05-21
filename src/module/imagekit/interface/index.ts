export interface IImageKitService {
    generateImageToken: (payload: any) => Promise<string | null>;
}