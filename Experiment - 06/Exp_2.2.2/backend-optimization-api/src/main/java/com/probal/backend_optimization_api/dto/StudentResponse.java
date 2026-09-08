package com.probal.backend_optimization_api.dto;


public class StudentResponse {

    private Long id;

    private String name;

    private String uid;

    private Integer age;

    private String departmentName;


    public StudentResponse() {
    }


    public StudentResponse(

            Long id,

            String name,

            String uid,

            Integer age,

            String departmentName

    ) {

        this.id =
                id;

        this.name =
                name;

        this.uid =
                uid;

        this.age =
                age;

        this.departmentName =
                departmentName;

    }


    public Long getId() {

        return id;

    }


    public String getName() {

        return name;

    }


    public String getUid() {

        return uid;

    }


    public Integer getAge() {

        return age;

    }


    public String getDepartmentName() {

        return departmentName;

    }

}