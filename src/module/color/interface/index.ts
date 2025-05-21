import { Color, ICreateColorForm, IUpdateColorForm } from "../model";

export interface IColorRepository {
    insert(color: Color): Promise<Color>;
    update(id: string, form: IUpdateColorForm): Promise<Color | null>;
    delete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
    findById(id: string): Promise<Color | null>;
    findByIdAdmin(id: string): Promise<Color | null>;
    findByName(nameColor: string): Promise<Color[] | null>;
    findByNameAdmin(nameColor: string): Promise<Color[] | null>;
    findAllColorActive(): Promise<Color[]>;
    findAllColorInactive(): Promise<Color[]>;
    findAllColor(): Promise<Color[]>;
}
export interface IColorService {
    create(form: ICreateColorForm): Promise<Color>;
    update(id: string, form: IUpdateColorForm): Promise<Color | null>;
    delete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
    getById(id: string): Promise<Color | null>;
    getByIdAdmin(id: string): Promise<Color | null>;
    getByName(nameColor: string): Promise<Color[] | null>;
    getByNameAdmin(nameColor: string): Promise<Color[] | null>;
    getAllColorActive(): Promise<Color[]>;
    getAllColorInactive(): Promise<Color[]>;
    getAllColor(): Promise<Color[]>;
}