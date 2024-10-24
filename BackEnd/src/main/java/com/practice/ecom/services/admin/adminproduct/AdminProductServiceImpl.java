package com.practice.ecom.services.admin.adminproduct;

import com.practice.ecom.dto.ProductDto;
import com.practice.ecom.entity.Category;
import com.practice.ecom.entity.Product;
import com.practice.ecom.repository.CategoryRepository;
import com.practice.ecom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public ProductDto addProduct(ProductDto productDto) throws IOException {
        // Create a new Product entity
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImg(productDto.getImg().getBytes());

        // Fetch the Category by ID and associate it with the Product
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        // Save the Product entity and convert it to ProductDto
        return productRepository.save(product).getDto();
    }

    @Override
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(Product::getDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductByName(String name) {
        List<Product> products = productRepository.findAllByNameContaining(name);
        return products.stream()
                .map(Product::getDto)
                .collect(Collectors.toList());
    }

    public boolean deleteProduct(Long id){
        Optional<Product> optionalProduct = productRepository.findById(id);
        if(optionalProduct.isPresent()){
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ProductDto getProductById(Long productId){
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if(optionalProduct.isPresent()){
            return optionalProduct.get().getDto();
        }else{
            return null;
        }
    }

    public ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Optional<Category> optionalCategory = categoryRepository.findById(productDto.getCategoryId());

        if(optionalProduct.isPresent() && optionalCategory.isPresent()){
            Product product = optionalProduct.get();

            product.setName(product.getName());
            product.setPrice(productDto.getPrice());
            product.setDescription(productDto.getDescription());
            product.setCategory(optionalCategory.get());

           if(productDto.getImg() != null){
               product.setImg(productDto.getImg().getBytes());
           }
            return productRepository.save(product).getDto();
        }else{
            return null;
        }
    }
}
