// utils/dateFormat.ts
import crypto from 'crypto';
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const HH = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}


export function sortObject(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}


export function createVnpayChecksum(params: Record<string, any>, secretKey: string): string {
  const filtered = Object.keys(params)
    .filter(key => 
      key !== 'vnp_SecureHash' &&
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ''
    )
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', secretKey);
  hmac.update(filtered, 'utf8');
  return hmac.digest('hex');
}


