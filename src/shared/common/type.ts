type ProductDimension = {
    width: number;
    height: number;
    length: number;
    weight: number;
};

export async function getDimensionForProduct(name: string): Promise<ProductDimension> {
    const nameLower = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (nameLower.includes("vot")) {
        return { width: 25, height: 6, length: 75, weight: 500 };
    }

    if (nameLower.includes("ao") || nameLower.includes("thun")) {
        return { width: 25, height: 3, length: 30, weight: 150 };
    }

    if (nameLower.includes("giay")) {
        return { width: 30, height: 12, length: 20, weight: 1000 };
    }

    if (nameLower.includes("quan")) {
        return { width: 25, height: 3, length: 30, weight: 350 };
    }


    return { width: 20, height: 10, length: 20, weight: 300 };
}

type OrderProductDimentsion = {
    width: number;
    height: number;
    length: number;
    weight: number;
    category: {
        level1: string;
    }
}

export async function getDimensionForOrder(name: string): Promise<OrderProductDimentsion> {
    const nameLower = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (nameLower.includes("vot")) {
        return { width: 25, height: 6, length: 75, weight: 500, category: { level1: "vot" }  };
    }

    if (nameLower.includes("ao") || nameLower.includes("thun")) {
        return { width: 25, height: 3, length: 30, weight: 150, category: { level1: "ao" } };
    }

    if (nameLower.includes("giay")) {
        return { width: 30, height: 12, length: 20, weight: 1000, category: { level1: "giay" } };
    }

    if (nameLower.includes("quan")) {
        return { width: 25, height: 3, length: 30, weight: 350, category: { level1: "quan" }};
    }


    return { width: 20, height: 10, length: 20, weight: 300, category: { level1: "phu kien" } };
}
