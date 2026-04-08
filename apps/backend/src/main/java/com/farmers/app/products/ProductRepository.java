package com.farmers.app.products;

import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import com.farmers.app.products.ProductEnums.ModerationStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByFarmerUserId(Long userId);
  List<Product> findByFarmerIdAndPublishedTrueAndModerationStatusNotOrderByCreatedAtDesc(Long farmerId, ModerationStatus moderationStatus);
  List<Product> findTop8ByPublishedTrueAndModerationStatusNotOrderByCreatedAtDesc(ModerationStatus moderationStatus);
  List<Product> findTop6ByPublishedTrueAndModerationStatusNotAndCategoryAndIdNotOrderByCreatedAtDesc(
      ModerationStatus moderationStatus, String category, Long id);

  @Query(
      """
      select p from Product p
      where p.published = true
        and p.moderationStatus <> com.farmers.app.products.ProductEnums$ModerationStatus.FLAGGED
        and (:q is null or lower(p.title) like lower(concat('%', :q, '%')) or lower(p.description) like lower(concat('%', :q, '%')))
        and (:category is null or p.category = :category)
        and (:location is null or lower(p.location) like lower(concat('%', :location, '%')))
        and (:availability is null or p.availabilityStatus = :availability)
      """)
  Page<Product> searchPublic(
      @Param("q") String q,
      @Param("category") String category,
      @Param("location") String location,
      @Param("availability") AvailabilityStatus availability,
      Pageable pageable);

  long countByModerationStatus(ModerationStatus moderationStatus);
}
