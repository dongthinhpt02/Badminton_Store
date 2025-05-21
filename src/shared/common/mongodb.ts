import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import appConfig from "./config";
import { ITokenPayload } from "../interface";
import { User } from "../../module/user/model";
import { Brand } from "../../module/brand/model";
import { Cate } from "../../module/category/model";
import { Size } from "../../module/size/model";
import { Color } from "../../module/color/model";
import { Product } from "../../module/product/model";
import { ProductItem } from "../../module/productitem/model";
import { CartItem } from "../../module/cartitem/model";
import { Cart } from "../../module/cart/model";
import { Address } from "../../module/address/model";
import { Discount } from "../../module/discount/model";
import { Payment } from "../../module/payment/model";
import { Province } from "../../module/province/model";
import { District } from "../../module/district/model";
import { Ward } from "../../module/ward/model";

const uri = 'mongodb+srv://trandongthinh:Kirito123456@badmintonstore.jygkj.mongodb.net/?retryWrites=true&w=majority'

class MongoDatabaseService {
  private client: MongoClient;
  private db: Db;
    ObjectId: any;

  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(appConfig.db.mongodbName);
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (err) {
      console.dir(err);
      await this.close();
      throw err;
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }

  async close() {
    console.log("Disconnecting MongoDB!");
    await this.client.close();
    console.log("MongoDB disconnected");
  }

  get users(): Collection<User> {
    return this.db.collection("users");
  }
  get refreshTokens(): Collection<{ token: string }> {
    return this.db.collection("refresh_tokens");
  }

  get cart(): Collection<Cart> {
    return this.db.collection("cart");
  }

  get cartitem(): Collection<CartItem> {
    return this.db.collection("cartitem");
  }
  get address(): Collection<Address> {
    return this.db.collection("address"); 
  }
  get brand(): Collection<Brand> {
    return this.db.collection("brand");
  }
  get cate(): Collection<Cate> {
    return this.db.collection("category");
  }
  get size(): Collection<Size> {
    return this.db.collection("size");
  }
  get color(): Collection<Color>{
    return this.db.collection("color");
  }
  get product(): Collection<Product> {
    return this.db.collection("product");
  }
  get productitem (): Collection<ProductItem> {
    return this.db.collection("productitem");
  }
  get discount (): Collection<Discount> {
    return this.db.collection("discount");
  }
  get payment (): Collection<Payment> {
    return this.db.collection("payment");
  }
  get province() : Collection<Province> {
    return this.db.collection("province");
  }
  get district() : Collection<District>{
    return this.db.collection("district");
  }
  get ward() : Collection<Ward>{
    return this.db.collection("ward");
  }
}

export const mongodbService = new MongoDatabaseService();

export const database = mongodbService;
