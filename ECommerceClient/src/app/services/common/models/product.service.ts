import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { Product_Pagination } from 'src/app/contracts/product_pagination';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage) => void) {
    this.httpClientService.post({
      controller: "products"
    }, product).subscribe(result => {
      successCallBack();
    }, (errorResponse: HttpErrorResponse) => {
      const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        })
      })
      errorCallBack(message);
    });

  }

  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage) => void): Promise<Product_Pagination> {
    const promiseData: Promise<Product_Pagination> = this.httpClientService.get<Product_Pagination>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id)

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      actions: "getProductImages",
      controller: "product"
    }, id)

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return images;
  }

  async deleteImages(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      actions: "deleteProductImage",
      controller: "products",
      queryString: `imageId=${imageId}`
    }, id);
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcase(imageId: string, productId: string, successCallBack?: () => void) {
    const observable = this.httpClientService.get({
      controller: "products",
      actions: "ChangeShowCase",
      queryString: `imageId=${imageId}&productId=${productId}`
    });

    await firstValueFrom(observable);
    successCallBack();
  }

}
