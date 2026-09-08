const BASE_URL =
    "/api";


async function addDepartment() {

    const name =
        document
            .getElementById(
                "departmentName"
            )
            .value;


    const response =
        await fetch(
            `${BASE_URL}/departments`,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        {
                            name:
                                name
                        }
                    )

            }
        );


    const data =
        await response.json();


    showResult(
        data
    );

}


async function addStudent() {

    const name =
        document
            .getElementById(
                "studentName"
            )
            .value;


    const uid =
        document
            .getElementById(
                "studentUID"
            )
            .value;


    const age =
        Number(
            document
                .getElementById(
                    "studentAge"
                )
                .value
        );


    const departmentId =
        Number(
            document
                .getElementById(
                    "departmentId"
                )
                .value
        );


    const student =
        {

            name:
                name,

            uid:
                uid,

            age:
                age,

            department:
                {

                    id:
                        departmentId

                }

        };


    const response =
        await fetch(
            `${BASE_URL}/students`,
            {

                method:
                    "POST",

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


    const data =
        await response.json();


    showResult(
        data
    );

}


async function measureAPI(
    url
) {

    const start =
        performance.now();


    const response =
        await fetch(
            url
        );


    const data =
        await response.json();


    const end =
        performance.now();


    const time =
        (
            end -
            start
        ).toFixed(
            2
        );


    document
        .getElementById(
            "performance"
        )
        .textContent =
            `Response Time: ${time} ms`;


    showResult(
        data
    );

}


function testNormal() {

    measureAPI(
        `${BASE_URL}/students/normal`
    );

}


function testOptimized() {

    measureAPI(
        `${BASE_URL}/students/optimized`
    );

}


function testNative() {

    const id =
        prompt(
            "Enter Student ID"
        );


    if (
        id
    ) {

        measureAPI(
            `${BASE_URL}/students/native`
        );

    }

}


function testCache() {

    const id =
        prompt(
            "Enter Student ID"
        );


    if (
        id
    ) {

        measureAPI(
            `${BASE_URL}/students/cache/${id}`
        );

    }

}


function showResult(
    data
) {

    document
        .getElementById(
            "result"
        )
        .textContent =
            JSON.stringify(
                data,
                null,
                2
            );

}