package com.practice.ecom.services.customer;

import com.practice.ecom.dto.ProductDto;

import java.util.List;

public interface CustomerProductService {

     List<ProductDto> getAllProducts();
     List<ProductDto> searchProductByTitle(String title);
}
