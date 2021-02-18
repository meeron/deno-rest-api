export interface ProductViewModel {
  id: number,
  name: string,
  price: number,
  description: string,
}

export interface NewProductRequest {
  name: string,
  price: number,
  description: string,  
}

export interface NewProductResult {
  errorMessage?: string,
  newProduct?: ProductViewModel,
}