
export interface HttpApadter{
    get<T>(url: string):Promise<T>;
}