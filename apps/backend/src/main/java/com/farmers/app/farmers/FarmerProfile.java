package com.farmers.app.farmers;

import com.farmers.app.common.util.AuditableEntity;
import com.farmers.app.users.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "farmer_profiles")
public class FarmerProfile extends AuditableEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(name = "full_name", nullable = false, length = 120)
  private String fullName;

  @Column(name = "farm_name", nullable = false, length = 140)
  private String farmName;

  @Column(nullable = false, length = 30)
  private String phone;

  @Column(nullable = false, length = 100)
  private String town;

  @Column(nullable = false, length = 100)
  private String region;

  @Column(length = 500)
  private String bio;

  @Column(name = "avatar_url", length = 300)
  private String avatarUrl;

  @Column(nullable = false)
  private boolean verified = false;
}
