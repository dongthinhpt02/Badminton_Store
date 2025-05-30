import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IPaymentRepository } from "../interface";
import { IUpdatePaymentForm, Payment, Status } from "../model";
import appConfig from "../../../shared/common/config";
import { formatDate, sortObject } from "../../../shared/utils/dateformat";
import qs from "qs";
import crypto from 'crypto';

export class MongodbPaymentRepository implements IPaymentRepository {
    async insert(payment: Payment): Promise<Payment> {
        const result = await mongodbService.payment.insertOne(payment);
        const find = await mongodbService.payment.findOne({ _id: result.insertedId });
        return find as Payment;   
    }
    async update(id: string, form: IUpdatePaymentForm): Promise<Payment | null> {
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: {
            ...form,
            updated_at: new Date()} });
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedPayment = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        return updatedPayment as Payment;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: { deleted_at: new Date(), status: Status.INACTIVE } });
        return true;
    }
    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: { restored_at: new Date(), status: Status.ACTIVE } });
        return true;
    }
    async findAllPayment(): Promise<Payment[]> {
        const result = await mongodbService.payment.find().toArray();
        return result as Payment[];
    }
    async findById(id: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ _id: new ObjectId(id),
            status: Status.ACTIVE
         });
        return result as Payment;
    }
    async findByIdAdmin(id: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        return result as Payment;
    }
    async findByName(name: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ namePayment: name,
            status: Status.ACTIVE
         });
        return result as Payment;
    }
    async findByNameAdmin(name: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ namePayment: name });
        return result as Payment;
    }
    async findAllPaymentActive(): Promise<Payment[]> {
        const result = await mongodbService.payment.find({ status: Status.ACTIVE }).toArray();
        return result as Payment[];
    }
    async findAllPaymentInactive(): Promise<Payment[]> {
        const result = await mongodbService.payment.find({ status: Status.INACTIVE }).toArray();
        return result as Payment[];
    }
    async VNPayPayment(id: string, payload: {
        amount: number
      }): Promise<any> {
        const user = await mongodbService.users.findOne({ _id: new ObjectId(id) });
        if (!user) {
          throw new Error("User not found");
        }
        if (typeof payload.amount !== 'number' || isNaN(payload.amount) || payload.amount <= 0) {
          throw new Error("Invalid amount");
        }
    
        const OrderInfo = new ObjectId();
        
        const body = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: appConfig.VNP.vnpTmnCode,
          vnp_Amount: Math.round(Number(payload.amount) * 100), // Convert to VND
          vnp_CreateDate: formatDate(new Date()),
          vnp_CurrCode: "VND",
          vnp_IpAddr: "127.0.0.1",
          vnp_Locale: 'vn',
          vnp_OrderInfo: OrderInfo.toString(),
          vnp_OrderType: "other",
          vnp_TxnRef: new ObjectId().toHexString(), // Unique transaction reference
          vnp_ReturnUrl: encodeURIComponent(appConfig.VNP.vnpReturnUrl), // encodeURIComponent(appConfig.VNP.vnpReturnUrl,
       
          // vnp_ExpireDate: formatDate(new Date(Date.now() + 15 * 60 * 1000)), // 15 minutes from now
        }
    
        const sortedParams = sortObject(body);
        const signData = qs.stringify(sortedParams, { encode: false });
        const secretKey = appConfig.VNP.vnpHashSecret;
        if (!secretKey) {
          throw new Error("Missing VNPAY Hash Secret");
        }
    
        const hmac = crypto.createHmac('sha512', secretKey);
        const signature = hmac.update(signData, 'utf-8').digest('hex');
    
        sortedParams['vnp_SecureHash'] = signature;
    
        const paymentUrl = `${appConfig.VNP.vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;
        return paymentUrl;
      }
    async CODPayment(id: string, payload: { amount: number; }): Promise<any> {
        return; 
    }
}