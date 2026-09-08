const API_URL = "/api/students";


let currentPage = 0;

let totalPages = 0;


// Load Students

async function loadStudents() {

    const size =
        document.getElementById("pageSize").value;

    const sortBy =
        document.getElementById("sortBy").value;

    const direction =
        document.getElementById("direction").value;


    const url =
        `${API_URL}?page=${currentPage}&size=${size}&sortBy=${sortBy}&direction=${direction}`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        const data =
            await response.json();


        displayStudents(data);


    } catch (error) {

        showMessage(
            "Error loading students: " +
            error.message,
            "error"
        );

    }

}


// Display Students

function displayStudents(data) {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    tableBody.innerHTML = "";


    if (data.content.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No students found
                </td>
            </tr>
        `;

    } else {

        data.content.forEach(student => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.uid}</td>

                <td>${student.department}</td>

                <td>${student.year}</td>

                <td>${student.age}</td>

                <td>${student.universityName}</td>

            `;


            tableBody.appendChild(row);

        });

    }


    totalPages =
        data.totalPages;


    document.getElementById(
        "pageInfo"
    ).textContent =

        data.totalElements === 0
            ? "No student records"
            : `Page ${data.number + 1} of ${data.totalPages}`;


    document.getElementById(
        "previousButton"
    ).disabled =
        data.first;


    document.getElementById(
        "nextButton"
    ).disabled =
        data.last;

}


// Add Student

document
    .getElementById("studentForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const student = {

                name:
                    document
                        .getElementById("name")
                        .value,

                uid:
                    document
                        .getElementById("uid")
                        .value,

                department:
                    document
                        .getElementById("department")
                        .value,

                year:
                    Number(
                        document
                            .getElementById("year")
                            .value
                    ),

                age:
                    Number(
                        document
                            .getElementById("age")
                            .value
                    ),

                universityName:
                    document
                        .getElementById(
                            "universityName"
                        )
                        .value

            };


            try {

                const response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    student
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to add student"
                    );

                }


                showMessage(
                    "Student added successfully!",
                    "success"
                );


                document
                    .getElementById(
                        "studentForm"
                    )
                    .reset();


                currentPage = 0;


                loadStudents();


            } catch (error) {

                showMessage(
                    "Error adding student: " +
                    error.message,
                    "error"
                );

            }

        }
    );


// Apply Pagination and Sorting

document
    .getElementById("applyButton")
    .addEventListener(
        "click",
        function () {

            currentPage = 0;

            loadStudents();

        }
    );


// Previous Page

document
    .getElementById(
        "previousButton"
    )
    .addEventListener(
        "click",
        function () {

            if (
                currentPage > 0
            ) {

                currentPage--;

                loadStudents();

            }

        }
    );


// Next Page

document
    .getElementById(
        "nextButton"
    )
    .addEventListener(
        "click",
        function () {

            if (
                currentPage <
                totalPages - 1
            ) {

                currentPage++;

                loadStudents();

            }

        }
    );


// Message Function

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    if (
        type === "success"
    ) {

        message.style.color =
            "green";

    } else {

        message.style.color =
            "red";

    }


    setTimeout(
        function () {

            message.textContent =
                "";

        },
        3000
    );

}


// Load Students

loadStudents();