package com.probal.backend_optimization_api.controller;

import com.probal.backend_optimization_api.dto.StudentResponse;

import com.probal.backend_optimization_api.entity.Department;

import com.probal.backend_optimization_api.entity.Student;

import com.probal.backend_optimization_api.repository.DepartmentRepository;

import com.probal.backend_optimization_api.service.StudentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController

@RequestMapping(
        "/api/students"
)
public class StudentController {


    private final StudentService
            studentService;


    private final DepartmentRepository
            departmentRepository;


    public StudentController(

            StudentService
            studentService,

            DepartmentRepository
            departmentRepository

    ) {

        this.studentService =
                studentService;

        this.departmentRepository =
                departmentRepository;

    }


    // Normal Query

    @GetMapping(
            "/normal"
    )

    public List<StudentResponse>
    getNormalStudents() {

        return studentService
                .getStudentsNormal();

    }


    // JOIN FETCH

    @GetMapping(
            "/optimized"
    )

    public List<StudentResponse>
    getOptimizedStudents() {

        return studentService
                .getStudentsOptimized();

    }


    // Native Query

    @GetMapping(
            "/native"
    )

    public List<StudentResponse>
    getNativeStudents() {

        return studentService
                .getStudentsNative();

    }


    // Cached Student

    @GetMapping(
            "/cache/{id}"
    )

    public StudentResponse
    getCachedStudent(

            @PathVariable
            Long id

    ) {

        return studentService
                .getStudentById(
                        id
                );

    }


    // Create Student

    @PostMapping

    public Student
    createStudent(

            @RequestBody
            Student student

    ) {

        Long departmentId =
                student
                        .getDepartment()
                        .getId();


        Department department =
                departmentRepository
                        .findById(
                                departmentId
                        )
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "Department not found"
                                )
                        );


        student.setDepartment(
                department
        );


        return studentService
                .createStudent(
                        student
                );

    }

}