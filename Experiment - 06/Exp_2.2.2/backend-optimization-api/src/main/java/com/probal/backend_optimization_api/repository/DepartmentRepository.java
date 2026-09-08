package com.probal.backend_optimization_api.repository;

import com.probal.backend_optimization_api.entity.Department;

import org.springframework.data.jpa.repository.JpaRepository;


public interface DepartmentRepository
        extends JpaRepository<
                Department,
                Long
        > {

}