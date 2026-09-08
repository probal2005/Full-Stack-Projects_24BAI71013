package com.probal.backend_optimization_api.service;

import com.probal.backend_optimization_api.entity.Department;

import com.probal.backend_optimization_api.repository.DepartmentRepository;

import org.springframework.stereotype.Service;


@Service
public class DepartmentService {

    private final DepartmentRepository
            departmentRepository;


    public DepartmentService(

            DepartmentRepository
            departmentRepository

    ) {

        this.departmentRepository =
                departmentRepository;

    }


    public Department
    createDepartment(
            Department department
    ) {

        return departmentRepository.save(
                department
        );

    }

}