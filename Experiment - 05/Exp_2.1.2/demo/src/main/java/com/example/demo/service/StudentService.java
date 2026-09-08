package com.example.demo.service;

import com.example.demo.exception.DuplicateEmailException;
import com.example.demo.exception.StudentNotFoundException;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // ⬇️ অ্যাপ্লিকেশন স্টার্ট হলে এই ডেটা ডেটাবেসে যোগ হবে (যদি খালি থাকে)
    @PostConstruct
    public void init() {
        if (studentRepository.count() == 0) {
            Student defaultStudent = new Student();
            defaultStudent.setName("Probal Dhali");
            defaultStudent.setEmail("24BAI71013@CUCHD.IN");
            defaultStudent.setDepartment("AIT CSE AI ML");
            studentRepository.save(defaultStudent);
            log.info("✅ Default student added: Probal Dhali");
        }
    }

    public List<Student> getAll() {
        log.info("Fetching all students");
        return studentRepository.findAll();
    }

    public Student getById(Long id) {
        log.info("Fetching student id: {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    public Student create(Student student) {
        log.info("Creating student with email: {}", student.getEmail());
        if (studentRepository.existsByEmailIgnoreCase(student.getEmail())) {
            throw new DuplicateEmailException("Email " + student.getEmail() + " already exists!");
        }
        return studentRepository.save(student);
    }

    public Student update(Long id, Student details) {
        log.info("Updating student id: {}", id);
        Student existing = getById(id);
        existing.setName(details.getName());
        existing.setEmail(details.getEmail());
        existing.setDepartment(details.getDepartment());
        return studentRepository.save(existing);
    }

    public void delete(Long id) {
        log.info("Deleting student id: {}", id);
        Student student = getById(id);
        studentRepository.delete(student);
    }
}