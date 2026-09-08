package com.probal.backend_optimization_api.service;

import com.probal.backend_optimization_api.dto.StudentResponse;
import com.probal.backend_optimization_api.entity.Student;
import com.probal.backend_optimization_api.repository.StudentRepository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class StudentService {


    private final StudentRepository studentRepository;


    public StudentService(
            StudentRepository studentRepository
    ) {

        this.studentRepository = studentRepository;

    }


    // =====================================
    // NORMAL QUERY
    // =====================================

    public List<StudentResponse> getStudentsNormal() {

        return studentRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();

    }


    // =====================================
    // JOIN FETCH OPTIMIZED QUERY
    // =====================================

    public List<StudentResponse> getStudentsOptimized() {

        return studentRepository
                .findAllWithDepartment()
                .stream()
                .map(this::convertToResponse)
                .toList();

    }


    // =====================================
    // NATIVE SQL QUERY
    // =====================================

    public List<StudentResponse> getStudentsNative() {

        return studentRepository
                .findStudentsByNativeQuery()
                .stream()
                .map(this::convertToResponse)
                .toList();

    }


    // =====================================
    // CACHED STUDENT QUERY
    // =====================================

    @Cacheable(
            value = "students",
            key = "#id"
    )
    public StudentResponse getStudentById(
            Long id
    ) {

        System.out.println(
                "Fetching Student ID "
                        + id
                        + " from DATABASE..."
        );


        Student student =
                studentRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Student not found with ID: "
                                                        + id
                                        )
                        );


        return convertToResponse(
                student
        );

    }


    // =====================================
    // CREATE STUDENT
    // WITH DUPLICATE UID CHECK
    // =====================================

    public Student createStudent(
            Student student
    ) {

        boolean uidExists =
                studentRepository
                        .existsByUid(
                                student.getUid()
                        );


        if (uidExists) {

            throw new RuntimeException(
                    "Student with UID "
                            + student.getUid()
                            + " already exists!"
            );

        }


        return studentRepository.save(
                student
        );

    }


    // =====================================
    // CONVERT ENTITY TO DTO
    // =====================================

    private StudentResponse convertToResponse(
            Student student
    ) {

        return new StudentResponse(

                student.getId(),

                student.getName(),

                student.getUid(),

                student.getAge(),

                student
                        .getDepartment()
                        .getName()

        );

    }

}