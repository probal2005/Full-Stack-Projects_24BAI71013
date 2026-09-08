package com.probal.backend_optimization_api.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;

@Column(
        unique = true,
        nullable = false
)
private String uid;

private Integer age;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id")
private Department department;

public Student() {
}

public Student(
        String name,
        String uid,
        Integer age,
        Department department
) {
    this.name = name;
    this.uid = uid;
    this.age = age;
    this.department = department;
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

public Integer getAge() {
    return age;
}

public void setAge(Integer age) {
    this.age = age;
}

public Department getDepartment() {
    return department;
}

public void setDepartment(Department department) {
    this.department = department;
}

}
