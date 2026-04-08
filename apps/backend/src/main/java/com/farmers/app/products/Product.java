package com.farmers.app.products;

import com.farmers.app.common.util.AuditableEntity;
import com.farmers.app.farmers.FarmerProfile;
import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import com.farmers.app.products.ProductEnums.ModerationStatus;
import com.farmers.app.products.ProductEnums.Unit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product extends AuditableEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "farmer_id", nullable = false)
  private FarmerProfile farmer;

  @Column(nullable = false, length = 160)
  private String title;

  @Column(nullable = false, length = 700)
  private String description;

  @Column(nullable = false, length = 80)
  private String category;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal price;

  @Column(nullable = false, length = 10)
  private String currency;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal quantity;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private Unit unit;

  @Column(name = "harvest_date")
  private LocalDate harvestDate;

  @Column(nullable = false, length = 120)
  private String location;

  @Enumerated(EnumType.STRING)
  @Column(name = "availability_status", nullable = false, length = 30)
  private AvailabilityStatus availabilityStatus;

  @Column(name = "is_published", nullable = false)
  private boolean published;

  @Enumerated(EnumType.STRING)
  @Column(name = "moderation_status", nullable = false, length = 30)
  private ModerationStatus moderationStatus = ModerationStatus.PENDING;

  @Column(length = 260)
  private String tags;
}
