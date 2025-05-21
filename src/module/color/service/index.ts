import { ObjectId } from "mongodb";
import { IColorRepository, IColorService } from "../interface";
import { Color, createColorSchema, ICreateColorForm, IUpdateColorForm, Status } from "../model";

export class ColorService implements IColorService {
    constructor(private readonly colorRepository: IColorRepository) {}
    async create(form: ICreateColorForm): Promise<Color> {
        const newColor = createColorSchema.parse(form);

        const colorToInsert = {
            _id: new ObjectId(),
            nameColor: newColor.nameColor,
            description: newColor.description,
            created_at: new Date(),
            status: Status.ACTIVE,
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        };
        const color = await this.colorRepository.insert(colorToInsert);
        return color;
    }
    async update(id: string, form: IUpdateColorForm): Promise<any | null> {
        const result = await this.colorRepository.update(id, form);
        return result;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.colorRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.colorRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<any | null> {
        const result = await this.colorRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<any | null> {
        const result = await this.colorRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(nameColor: string): Promise<any | null> {
        const result = await this.colorRepository.findByName(nameColor);
        return result;
    }
    async getByNameAdmin(nameColor: string): Promise<any | null> {
        const result = await this.colorRepository.findByNameAdmin(nameColor);
        return result;
    }
    async getAllColorActive(): Promise<any[]> {
        const result = await this.colorRepository.findAllColorActive();
        return result;
    }
    async getAllColorInactive(): Promise<any[]> {
        const result = await this.colorRepository.findAllColorInactive();
        return result;
    }
    async getAllColor(): Promise<any[]> {
        const result = await this.colorRepository.findAllColor();
        return result;
    }
}