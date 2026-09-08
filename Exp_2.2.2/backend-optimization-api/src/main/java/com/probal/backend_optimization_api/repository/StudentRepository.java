package com.probal.backend_optimization_api.repository;

import com.probal.backend_optimization_api.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentRepository
extends JpaRepository<Student, Long> {

// Check duplicate UID
boolean existsByUid(String uid);

// JOIN FETCH Optimization
@Query(
        "SELECT s FROM Student s " +
        "JOIN FETCH s.department"
)
List<Student> findAllWithDepartment();

// Native SQL Query
@Query(
        value =
                "SELECT * FROM students " +
                "ORDER BY age DESC",

        nativeQuery = true
)
List<Student> findStudentsByNativeQuery();

}
