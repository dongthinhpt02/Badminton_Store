import { ObjectId } from "mongodb";
import { IAddressRepository, IAddressService } from "../interface";
import { Address, createAddressSchema, ICreateAddress, Status } from "../model";
import { string } from "zod";
import { mongodbService } from "../../../shared/common/mongodb";
import appConfig from "../../../shared/common/config";

export class AddressService implements IAddressService {
    constructor(private readonly addressRepository: IAddressRepository) { }
    async create(form: ICreateAddress): Promise<Address> {
        const addressToInsert = {
            _id: new ObjectId(),
            userId: form.userId,
            address: form.address,
            city: form.city,
            province: form.province,
            phone: form.phone,
            created_at: new Date(),
            status: Status.ACTIVE,
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        };
        const result = await this.addressRepository.insert(addressToInsert);
        return result;
    }
    async update(id: string, form: any): Promise<Address | null> {
        const result = this.addressRepository.update(id, form);
        return result;
    }
    async getAllAddressByUserId(userId: string): Promise<Address[]> {
        const result = await this.addressRepository.findAllAddressByUserId(userId);
        return result;
    }
    async getAllAddress(): Promise<Address[]> {
        const result = await this.addressRepository.findAllAddress();
        return result;
    }
    async getAddressById(id: string): Promise<Address[]> {
        const result = await this.addressRepository.findAddressById(id);
        return result;
    }
    // async syncGHNLocation() {
    //     const GHN_TOKEN = appConfig.GHN.token as string;

    //     // Step 1: Lấy Province
    //     const provinceResponse = await fetch(
    //         "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Token: GHN_TOKEN
    //         }
    //     }).then(res => res.json());

    //     const provinces = await provinceResponse.json();
    //     if (provinces.code !== 200) {
    //         throw new Error(`Failed to fetch provinces: ${provinces.message}`);
    //     }

    //     for (const province of provinces.data) {
    //         await mongodbService.province.insertOne(province);

    //         // Step 2: Lấy District theo Province
    //         const districts = await fetch(
    //             "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Token": GHN_TOKEN
    //             },
    //             body: JSON.stringify({ province_id: province.ProvinceID })
    //         }).then(res => res.json());

    //         for (const district of districts.data) {
    //             await mongodbService.district.insertOne({ ...district, ProvinceID: province.ProvinceID });

    //             // Step 3: Lấy Ward theo District
    //             const wards = await fetch(
    //                 "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward${district.DistrictID}", {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Token": GHN_TOKEN
    //                 },
    //                 body: JSON.stringify({ district_id: district.DistrictID })
    //             }).then(res => res.json());

    //             for (const ward of wards.data) {
    //                 await mongodbService.ward.insertOne({ ...ward, DistrictID: district.DistrictID });
    //             }
    //         }
    //     }
    // }

    async syncGHNProvinces() {
        const GHN_TOKEN = appConfig.GHN.token as string;

        // Chọn base URL dựa trên môi trường
        const baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api"

        try {
            // Lấy danh sách Province
            const provinceResponse = await fetch(`${baseURL}/master-data/province`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Token": GHN_TOKEN
                }
            });

            const provinces = await provinceResponse.json();
            if (provinces.code !== 200) {
                throw new Error(`Failed to fetch provinces: ${provinces.message} (Code: ${provinces.code})`);
            }

            console.log(`Fetched ${provinces.data.length} provinces`);

            // Lưu từng province vào MongoDB theo schema
            for (const province of provinces.data) {
                const provinceData = {
                    _id: new ObjectId(),
                    ProvinceID: province.ProvinceID,
                    ProvinceName: province.ProvinceName
                };
                await mongodbService.province.insertOne(provinceData);
            }

            console.log("Successfully synced GHN provinces to MongoDB");
            return provinces.data; // Trả về danh sách provinces để dùng cho bước tiếp theo nếu cần
        } catch (error) {
            console.error("Error syncing GHN provinces:", error);
            throw error;
        }
    }
    async syncGHNDistricts() {
        const provinces = await mongodbService.province.find().toArray();
        if (provinces.length === 0) {
            throw new Error("No provinces found. Please sync provinces first.");
        }

        const GHN_TOKEN = appConfig.GHN.token as string;
        const baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api";

        for (const province of provinces) {
            try {
                const districtsResponse = await fetch(`${baseURL}/master-data/district`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Token": GHN_TOKEN
                    },
                    body: JSON.stringify({ "province_id": province.ProvinceID as number })
                    
                });
                
                const districts = await districtsResponse.json();

                console.log(JSON.stringify({ province_id: province.ProvinceID as number }));
                for (const district of districts.data) {
                    await mongodbService.district.insertOne({
                        _id: new ObjectId(),
                        DistrictID: district.DistrictID,
                        DistrictName: district.DistrictName,
                        ProvinceID: district.ProvinceID
                    });
                }

                console.log(`✅ Synced ${districts.data.length} districts for province ${province.ProvinceName}`);
            } catch (error) {
                console.error(`❌ Error syncing districts for province ${province.ProvinceName}:`, error);
            }
        }
    }
    async syncGHNWards() {
        const districts = await mongodbService.district.find().toArray();
        if (districts.length === 0) {
            throw new Error("No districts found. Please sync districts first.");
        }

        const GHN_TOKEN = appConfig.GHN.token as string;
        const baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api";

        for (const district of districts) {
            try {
                const wardsResponse = await fetch(`${baseURL}/master-data/ward?district_id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Token": GHN_TOKEN
                    },
                    body: JSON.stringify({ "district_id": district.DistrictID as number })
                });

                const wards = await wardsResponse.json();

                for (const ward of wards.data) {
                    await mongodbService.ward.insertOne({
                        _id: new ObjectId(),
                        WardCode: ward.WardCode,
                        WardName: ward.WardName,
                        DistrictID: ward.DistrictID
                    });
                }

                console.log(`✅ Synced ${wards.data.length} wards for district ${district.DistrictName}`);
            } catch (error) {
                console.error(`❌ Error syncing wards for district ${district.DistrictName}:`, error);
            }
        }
    }
}