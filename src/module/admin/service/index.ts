import { IUpdateUserForm, User } from "../../user/model";
import { IAdminRepository, IAdminService } from "../interface";

export class AdminService implements IAdminService {
    constructor(private readonly adminRepository: IAdminRepository ) {}
    async update (id: string, form: IUpdateUserForm) : Promise<User | null>{
        const result = await this.adminRepository.update(id, form);
        return result;
    }
}