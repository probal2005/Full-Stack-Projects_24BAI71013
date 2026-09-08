package com.probal.pagination_api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;

private String uid;

private String department;

@Column(name = "student_year")
private Integer year;

private Integer age;

@Column(name = "university_name")
private String universityName;

public Student() {
}

public Student(
        String name,
        String uid,
        String department,
        Integer year,
        Integer age,
        String universityName
) {
    this.name = name;
    this.uid = uid;
    this.department = department;
    this.year = year;
    this.age = age;
    this.universityName = universityName;
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}

public String getUid() {
    return uid;
}

public void setUid(String uid) {
    this.uid = uid;
}

public String getDepartment() {
    return department;
}

public void setDepartment(String department) {
    this.department = department;
}

public Integer getYear() {
    return year;
}

public void setYear(Integer year) {
    this.year = year;
}

public Integer getAge() {
    return age;
}

public void setAge(Integer age) {
    this.age = age;
}

public String getUniversityName() {
    return universityName;
}

public void setUniversityName(String universityName) {
    this.universityName = universityName;
}

}
