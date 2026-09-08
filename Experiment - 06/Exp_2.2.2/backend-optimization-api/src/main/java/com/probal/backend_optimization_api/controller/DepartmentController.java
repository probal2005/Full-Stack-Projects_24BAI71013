package com.probal.backend_optimization_api.controller;

import com.probal.backend_optimization_api.entity.Department;

import com.probal.backend_optimization_api.service.DepartmentService;

import org.springframework.web.bind.annotation.*;


@RestController

@RequestMapping(
        "/api/departments"
)
public class DepartmentController {


    private final DepartmentService
            departmentService;


    public DepartmentController(

            DepartmentService
            departmentService

    ) {

        this.departmentService =
                departmentService;

    }


    @PostMapping

    public Department
    createDepartment(

            @RequestBody
            Department department

    ) {

        return departmentService
                .createDepartment(
                        department
                );

    }

}