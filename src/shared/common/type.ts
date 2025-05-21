type ProductDimension = {
    width: number;
    height: number;
    length: number;
    weight: number;
};

export async function getDimensionForProduct(name: string): Promise<ProductDimension> {
    const nameLower = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (nameLower.includes("vot")) {
        return { width: 25, height: 6, length: 70, weight: 500 };
    }

    if (nameLower.includes("ao") || nameLower.includes("thun")) {
        return { width: 25, height: 5, length: 25, weight: 200 };
    }

    if (nameLower.includes("giay")) {
        return { width: 30, height: 15, length: 25, weight: 700 };
    }

    if (nameLower.includes("quan")) {
        return { width: 25, height: 5, length: 30, weight: 200 };
    }


    return { width: 20, height: 10, length: 20, weight: 300 };
}